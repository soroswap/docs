# Getting Started Module

> **Living document.** Read this before editing `getting-started/`. Update it in the same
> change.

**Source:** `getting-started/` (9 pages) · **Nav group:** `docs.json:43` ·
**Last verified:** 2026-09-06

## Purpose

The first-use path for a person who has never touched Soroswap: pick a wallet, make a
swap, provide liquidity, understand which tokens exist. It describes the **app UI**, not
contracts and not the API. It is the shallow end of the same material `tutorials/` covers
in screenshot depth.

## Product repo it describes

- **`soroswap/frontend`**, the app at `app.soroswap.finance`. Every page here describes
  app behavior. The section index sends the reader straight there
  (`getting-started/index.mdx:9`), as do `getting-started/provide-liquidity.mdx` and
  `getting-started/bridging-tokens.mdx`. A UI change in that repo can invalidate any page
  in this section.
- **`soroswap/token-list`**, the canonical verified-token list
  (`getting-started/soroswap-tokens.mdx:8`, `getting-started/soroswap-tokens.mdx:12`).
  Adding or removing a token there makes the table on that page stale.

## Structure

| File | Purpose |
|---|---|
| `index.mdx` | What you need before starting, and links into the rest. |
| `wallet-setup.mdx` | Choosing and connecting a Stellar/Soroban wallet. |
| `how-to-swap.mdx` | The swap flow in the app. |
| `provide-liquidity.mdx` | Depositing into a pool from the app. |
| `how-the-aggregator-works.mdx` | Plain-language version of the aggregator. |
| `soroswap-tokens.mdx` | The verified token list, as a snapshot table. |
| `adding-tokens-to-your-wallet.mdx` | Getting a token to show up in the wallet. |
| `liquidity-management.mdx` | Managing an existing position. |
| `bridging-tokens.mdx` | Bringing assets in from another chain. |

## Gotchas and invariants

- The token table in `soroswap-tokens.mdx` is a **snapshot**, and is labelled as one in an
  `<Info>` callout at `getting-started/soroswap-tokens.mdx:10`. Do not add rows to it. If
  it is wrong, fix the link to `soroswap/token-list` rather than the table.
- This section overlaps `tutorials/` on purpose: Getting Started is the short version,
  Tutorials is the screenshot version. Fixing a workflow here usually means fixing the
  matching tutorial too.
- Contract addresses do not belong here. They live in
  `amm/technical-reference/deployed-addresses.mdx`.

## Testing

No tests. Verified by reading the app, and by `npx mint@latest broken-links`.
