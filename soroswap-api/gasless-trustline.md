# ⚡ Gasless Trustline

The **Gasless Trustline** feature lets your users receive a brand-new asset **without ever needing to understand, fund, or manually pay for a Stellar trustline**. It is one of the most powerful onboarding tools in the Soroswap API, and it is designed to remove the single biggest friction point that new users hit on Stellar.

> **TL;DR** — A sponsor account fronts the ~0.5 XLM reserve needed to open the user's trustline, and the user repays it *inside the same swap* using the assets they are already trading. The user does **not** need to hold XLM beforehand, and never has to think about trustlines at all.

{% hint style="info" %}
New to trustlines? Read the [Trustlines concept page](../additional-resources/01-concepts/trustlines.md) first. In short: on Stellar, an account must open a **trustline** — and lock up a small XLM base reserve — before it can hold any non-native asset.
{% endhint %}

## The problem it solves

On Stellar, before an account can receive a token (say USDC), it must:

1. **Understand** what a trustline is.
2. **Own XLM** to pay the base reserve (~0.5 XLM per trustline) plus the transaction fee.
3. **Submit a separate `changeTrust` transaction** *before* the swap.

For a brand-new user who only holds, for example, some bridged USDC and no XLM, this is a dead end: they can't open the trustline needed to receive the very asset they want, because they have no XLM to pay for it. This "empty wallet" problem is a classic onboarding cliff.

**Gasless Trustline removes all three barriers.** The user just swaps. The trustline is created, funded, and repaid automatically as part of the transaction they were going to sign anyway.

## Benefits

| Benefit | Why it matters |
|---------|----------------|
| 🚀 **Zero-XLM onboarding** | Users can acquire their first non-native asset even with **no XLM** in their wallet. |
| 🧠 **No trustline knowledge required** | The concept is fully abstracted away — your UI never has to explain "base reserves" or "changeTrust". |
| 🔗 **One signature, one flow** | The trustline creation and the swap are bundled into a single transaction — no separate pre-step, no second round-trip. |
| 💸 **User self-repays** | The sponsor is reimbursed from the swap's proceeds, so sponsoring is (near) cost-neutral — you're lending, not gifting. |
| 👀 **Transparent costs** | The quote returns the trustline cost in **both** the input and output asset, so you can show the user exactly what it costs (or hide it entirely). |
| 🛡 **Sponsor stays in control** | The sponsor's XLM only covers the *reserve* via `beginSponsoringFutureReserves` / `endSponsoringFutureReserves`; it is repaid within the same atomic transaction. |
| ⚛️ **Atomic & safe** | Everything happens in one transaction. If any part fails, the whole thing reverts — the sponsor is never left out of pocket. |

## How it works

Gasless Trustline runs on the **Stellar Classic DEX (SDEX)** using path payments, and applies **only to the first swap for a given user** (i.e., when that user does not yet have a trustline for the output asset).

### The role of the sponsor

A **sponsor** is a wallet you control (your app's account) that temporarily covers the XLM base reserve required to open the user's trustline. Two Stellar primitives make this safe and atomic:

- `beginSponsoringFutureReserves` — the sponsor starts paying reserves on behalf of the user.
- `endSponsoringFutureReserves` — the sponsorship window closes.

Between those two operations, the transaction opens the trustline, performs the swap, and **repays the sponsor's ~0.5 XLM** out of the assets being swapped — so the sponsor is made whole within the same transaction.

### The operations, step by step

When gasless trustline is enabled, `/quote/build` assembles a single SDEX transaction (built on the **sponsor's** account as source) containing all of the operations below. For an **EXACT_IN** swap:

1. **`beginSponsoringFutureReserves`** — sponsor starts sponsoring the user's future reserves.
2. **`changeTrust`** — the user opens the trustline for the output asset (reserve paid by the sponsor).
3. *(optional)* **Platform-fee payments** — if `feeBps` / `referralId` are set.
4. **`pathPaymentStrictSend`** — the user performs the actual swap (`assetIn` → `assetOut`).
5. **`pathPaymentStrictReceive`** — the user buys **0.5 XLM** using the output asset and sends it to the sponsor, **repaying** the reserve.
6. **`endSponsoringFutureReserves`** — the sponsorship window closes.

The **EXACT_OUT** flow is analogous but reorders the steps: the user first buys the 0.5 XLM for the sponsor (via a `pathPaymentStrictReceive`, or a plain `payment` when the input asset *is* XLM), then opens the trustline, then performs the main swap.

```
┌──────────────────────── ONE ATOMIC TRANSACTION ────────────────────────┐
│                                                                         │
│  beginSponsoringFutureReserves   (sponsor covers the reserve)           │
│        └─ changeTrust            (user opens trustline for assetOut)     │
│        └─ pathPayment            (the actual swap: assetIn → assetOut)   │
│        └─ pathPayment            (user buys 0.5 XLM → repays sponsor)    │
│  endSponsoringFutureReserves     (sponsorship closes)                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
        Signed by BOTH the user AND the sponsor.
```

{% hint style="warning" %}
Because the transaction touches both the user's account (trustline + swap) and the sponsor's account (reserve), the resulting XDR **must be signed by both the user and the sponsor**.
{% endhint %}

## Using it in the API

Gasless Trustline touches two endpoints: `/quote` and `/quote/build`.

### Step 1 — Request a gasless quote

Add `gaslessTrustline: "create"` to your `/quote` request body.

```bash
POST https://api.soroswap.finance/quote?network=mainnet
Authorization: Bearer sk_your_api_key
Content-Type: application/json
```

```json
{
  "assetIn": "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
  "assetOut": "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
  "amount": "10000000",
  "tradeType": "EXACT_IN",
  "slippageBps": "50",
  "gaslessTrustline": "create"
}
```

{% hint style="danger" %}
Only set `gaslessTrustline: "create"` when you are **sure the user does not already have a trustline** for the output asset, **and** you have a funded sponsor account. If the user already trusts the asset, use a regular quote instead.
{% endhint %}

The response is a **Gasless Trustline Swap Quote**. It always routes through `"platform": "sdex"` and includes two extra objects:

```json
{
  "assetIn": "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
  "assetOut": "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
  "amountIn": "10000000",
  "amountOut": "8567253",
  "otherAmountThreshold": "8467253",
  "tradeType": "EXACT_IN",
  "priceImpactPct": "0.50",
  "platform": "sdex",
  "gaslessTrustline": "create",
  "rawTrade": {
    "source_amount": "10000000",
    "destination_amount": "9067253",
    "min_destination_amount": "9000000",
    "trustlineOperation": {
      "source_amount": "0.5000000",
      "max_source_amount": "0.5100000",
      "destination_asset_type": "native",
      "destination_amount": "0.5000000",
      "path": []
    },
    "netAmount": "8567253",
    "otherNetAmountThreshold": "8467253"
  },
  "trustlineInfo": {
    "trustlineCostAssetIn": "0.5000000",
    "trustlineCostAssetOut": "0.5000000"
  }
}
```

Key fields:

| Field | Meaning |
|-------|---------|
| `gaslessTrustline` | Confirms this is a gasless trustline quote (`"create"`). |
| `amountOut` / `netAmount` | What the user **actually receives after** the trustline cost is repaid. |
| `trustlineInfo.trustlineCostAssetIn` | The trustline cost expressed in the **input** asset — display it to the user if you like. |
| `trustlineInfo.trustlineCostAssetOut` | The same cost expressed in the **output** asset. |
| `rawTrade.trustlineOperation` | The path-payment details used to buy the 0.5 XLM and repay the sponsor. |

### Step 2 — Build the transaction

Pass the quote to `/quote/build` along with the user (`from`) and the **`sponsor`** account.

```bash
POST https://api.soroswap.finance/quote/build?network=mainnet
```

```json
{
  "quote": { /* the gasless quote from Step 1 */ },
  "from": "GBQJ4HBCQHJQKSKNT3JRKC5VKA3QJUXBVFWIVSMHKPQSJ7XP2IXTCAAK",
  "to": "GBQJ4HBCQHJQKSKNT3JRKC5VKA3QJUXBVFWIVSMHKPQSJ7XP2IXTCAAK",
  "sponsor": "GDFRQKZH2F6QPZDW7YNWCV3H6FGUQZ3XAJS7XEZQVYZSQYB4SVPQXVYB"
}
```

The response contains the unsigned XDR:

```json
{ "xdr": "AAAAAgAAAAB8shYDi1JO9x2/3jMeVzK2IGtrsFVWLCL4uHRJf+YPyAAA..." }
```

{% hint style="info" %}
**Requirements & limits**
- `sponsor` is **required** when `gaslessTrustline` is set — the build fails without it.
- The `from` and `to` addresses must currently be **the same** (a different recipient is not yet supported for gasless trustlines).
- Gasless trustline works **only on the Stellar Classic DEX (SDEX)** and applies **only to the user's first swap** for that asset.
{% endhint %}

### Step 3 — Sign with **both** wallets, then send

Because the transaction spans the user and the sponsor, collect **both signatures** before submitting:

1. The **user** signs the XDR (opens the trustline, performs the swap, repays the sponsor).
2. The **sponsor** signs the XDR (authorizes covering the reserve).
3. Submit the fully-signed XDR to `POST /send` (or through your own Soroban RPC / Horizon).

```json
POST /send?network=mainnet
{ "xdr": "AAAAAgAAAABiSu3MsKtQvDuQO5i2b..." }
```

## End-to-end example (JavaScript)

```javascript
const BASE = 'https://api.soroswap.finance';
const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

// 1. Gasless quote — user has no trustline for assetOut yet
const quote = await fetch(`${BASE}/quote?network=mainnet`, {
  method: 'POST', headers,
  body: JSON.stringify({
    assetIn:  ASSET_IN,
    assetOut: ASSET_OUT,
    amount:   '10000000',
    tradeType: 'EXACT_IN',
    slippageBps: '50',
    gaslessTrustline: 'create',
  }),
}).then(r => r.json());

// Optional: show the user what the trustline costs
console.log('Trustline cost (in assetOut):', quote.trustlineInfo.trustlineCostAssetOut);
console.log('You will receive:', quote.amountOut);

// 2. Build — include the sponsor account
const { xdr } = await fetch(`${BASE}/quote/build?network=mainnet`, {
  method: 'POST', headers,
  body: JSON.stringify({
    quote,
    from: USER_ADDRESS,
    to:   USER_ADDRESS,
    sponsor: SPONSOR_ADDRESS,
  }),
}).then(r => r.json());

// 3. Sign with BOTH the user and the sponsor
const userSignedXdr    = await signWithUserWallet(xdr);
const fullySignedXdr   = await signWithSponsorWallet(userSignedXdr);

// 4. Send
const result = await fetch(`${BASE}/send?network=mainnet`, {
  method: 'POST', headers,
  body: JSON.stringify({ xdr: fullySignedXdr }),
}).then(r => r.json());

console.log('Done! tx hash:', result.hash);
```

## When to use it

✅ **Use gasless trustline when:**
- The user is acquiring an asset **for the first time** (no existing trustline).
- You want the smoothest possible onboarding, especially for users with **no XLM**.
- You operate a **funded sponsor account** to front the reserve.

❌ **Don't use it when:**
- The user **already has** a trustline for the output asset (use a regular quote — it will be cheaper and can route across all protocols, not just SDEX).
- You need to send the output to a **different recipient** than the swapper (`from` ≠ `to` is not yet supported).
- You want routing across Soroswap / Phoenix / Aqua — gasless trustline is **SDEX-only**.

## Related

- [Trustlines — concept](../additional-resources/01-concepts/trustlines.md)
- [Quick Start Guide](quickstart.md)
- [Beginner Tutorial](beginner-guide.md)
- [Optimal Route](07-optimal-route/README.md)
- [Full API reference](https://api.soroswap.finance/docs)
