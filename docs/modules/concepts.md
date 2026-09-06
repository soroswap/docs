# Concepts Module

> **Living document.** Read this before editing `concepts/`. Update it in the same change.

**Source:** `concepts/` (13 pages) plus `concepts/advanced/` (5 pages) ·
**Nav group:** `docs.json:57`, advanced subgroup `docs.json:73` · **Last verified:** 2026-09-06

## Purpose

The vocabulary layer. It explains AMMs, liquidity pools, swaps, fees, slippage, routing,
trustlines, SDEX, oracles and flash swaps so the rest of the site can assume them. It is
mostly protocol theory, so it is the section least coupled to any Soroswap release.

## Product repos it describes

- **`soroswap/aggregator`**, indirectly. `concepts/aggregator.mdx:10` links the aggregator
  concept to the audit PDF in that repo. If aggregator routing behavior changes, this page
  is the conceptual page to re-check.
- Otherwise this section describes general DeFi and Stellar primitives, not a Soroswap
  repo. That is why it ages slowly.

## Structure

| File | Purpose |
|---|---|
| `index.mdx` | Card grid routing to each concept. |
| `amm.mdx`, `liquidity-pools.mdx`, `swap.mdx` | The core AMM triple. |
| `fees.mdx`, `slippage.mdx` | Trade economics. |
| `router.mdx`, `aggregator.mdx` | Routing, single-protocol and multi-protocol. |
| `sdex.mdx`, `trustlines.mdx`, `bridge.mdx` | Stellar-specific primitives. |
| `oracles.mdx`, `flash-swaps.mdx` | Advanced AMM mechanics. |
| `advanced/pricing.mdx`, `advanced/understanding-returns.mdx`, `advanced/security.mdx`, `advanced/research.mdx` | Deeper math, risk and reading list. |

## Gotchas and invariants

- `concepts/oracles.mdx` and `concepts/flash-swaps.mdx` are inherited Uniswap V2 material.
  They still talk about Uniswap and ERC20 tokens rather than Soroban and SAC tokens. Treat
  their claims as describing Uniswap V2, not as statements about deployed Soroswap
  behavior, until someone rewrites them.
- Concept pages should stay implementation-free. Addresses, function signatures and error
  codes belong in `amm/` and `aggregator/`.
- Cross-links from other sections point here for definitions, for example
  `api/gasless-trustline.mdx:12` sends readers to `/concepts/trustlines`. Renaming a
  concept page means adding a redirect at `docs.json:275`.

## Testing

No tests. Verified by `npx mint@latest broken-links`.
