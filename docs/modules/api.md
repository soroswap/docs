# API Module

> **Living document.** Read this before editing `api/`. Update it in the same change.

**Source:** `api/` (6 MDX pages plus `api/beginner-example.html`) ·
**Nav tab:** API (`docs.json:127`), group `docs.json:130` · **Last verified:** 2026-10-08

## Purpose

Integration guides for the hosted Soroswap swap API: get a key, quote a trade, build the
XDR, sign it, submit it. It is a guide layer only. The authoritative endpoint reference is
the live OpenAPI page at `https://api.soroswap.finance/docs`, linked from
`api/index.mdx:26`, `api/quickstart.mdx:14`, `api/beginner-guide.mdx:328` and
`api/gasless-trustline.mdx:266`.

## Product repos it describes

- **The Soroswap API service** (`api.soroswap.finance`). Every page here describes its
  behavior. Key surface referenced in this repo: registration and key issuance
  (`api/index.mdx:38`, `api/quickstart.mdx:25`, `api/beginner-guide.mdx:17`),
  `POST /quote?network=mainnet` (`api/gasless-trustline.mdx:91`) and
  `POST /quote/build?network=mainnet` (`api/gasless-trustline.mdx:160`). A change to any
  of those is a docs change here.
- **`soroswap/backend`**, cited as the routing implementation behind the API at
  `api/optimal-route.mdx:94`.
- **`soroswap/frontend`**, cited as the reference consumer at `api/optimal-route.mdx:50`.
- **`soroswap/token-list`**, the known-token list the router works from
  (`api/optimal-route.mdx:84`).

## Structure

| File | Purpose |
|---|---|
| `index.mdx` | What the API does, key features, how to get a key. |
| `quickstart.mdx` | Five-minute path for experienced developers. |
| `beginner-guide.mdx` | Long-form Freighter plus API tutorial with full code. |
| `gasless-trustline.mdx` | Sponsored trustline creation bundled into one SDEX swap. |
| `execute-quotes-onchain.mdx` | Turning a `/quote` into Aggregator v3 `routes` for integrators who build the transaction themselves. |
| `optimal-route.mdx` | Routing architecture, with Uniswap, PancakeSwap and 1inch background. |
| `beginner-example.html` | Runnable single-file demo, served as a static asset. |

## Gotchas and invariants

- Never document individual endpoints exhaustively here. That reference is generated from
  the live service. These pages exist to teach the flow, not to mirror the schema.
- `https://api.soroswap.finance` is production (`api/CLAUDE.md`, public base URL). `api/index.mdx`
  said staging until 2026-10-08 and was fixed.
- **`execute-quotes-onchain.mdx` mirrors the API's quote shape.** The field mapping
  (`amountIn`, `otherAmountThreshold`, `distribution[].share`, `distribution[].hops`) comes from
  `api/src/swap/soroban-sizing.ts` (`applyExactInSizing`) and `api/src/grapho/quote.mapper.ts`.
  The converter was simulated on mainnet on 2026-10-08 (Sushi, Aquarius constant-product and
  concentrated, mixed routes, splits). A change to those API files is a change to this page.
- `api/beginner-example.html` is not MDX and is not in the navigation. It is reachable
  only through the link at `api/quickstart.mdx:12`. If it moves, that link and the
  redirect list at `docs.json:275` both need attention.
- API keys appear as placeholders only. Keep real keys out of every page, including the
  HTML demo.
- `api/optimal-route.mdx` is largely competitor research, not a spec of what ships today.
  Read it as background.

## Testing

No tests. The HTML demo is the only runnable artifact and needs a real API key to work.
Verified by `npx mint@latest broken-links`.
