# AMM Module

> **Living document.** Read this before editing `amm/`. Update it in the same change.

**Source:** `amm/` (21 pages) · **Nav tab:** Smart Contracts (`docs.json:142`), group
`docs.json:145` · **Last verified:** 2026-09-06

## Purpose

The reference section for the Soroswap constant-product AMM: what the four contracts do,
where they are deployed, what errors they return, why they diverge from Uniswap V2, and
how to call them from Rust or TypeScript. This is the most tightly coupled section in the
repo. It restates on-chain behavior, so it is wrong the moment the contracts change.

## Product repos it describes

- **`soroswap/core`**, the AMM contracts. This is the primary dependency.
  - Section root points at the repo (`amm/index.mdx:26`,
    `amm/technical-reference/index.mdx:16`,
    `amm/technical-reference/contracts/index.mdx:10`).
  - Per-contract pages point at specific source trees: `contracts/pair`
    (`amm/technical-reference/contracts/soroswap-pair.mdx:8`), `contracts/factory/src`
    (`amm/technical-reference/contracts/soroswap-factory.mdx:8`), `contracts/router`
    (`amm/technical-reference/contracts/soroswap-router.mdx:8`), `contracts/library`
    (`amm/technical-reference/contracts/soroswap-library.mdx:10`).
  - Addresses defer to `public/mainnet.contracts.json`
    (`amm/technical-reference/deployed-addresses.mdx:20`) and
    `public/testnet.contracts.json`
    (`amm/technical-reference/deployed-addresses.mdx:24`).
  - Deploy tooling and its `git clone` step
    (`amm/technical-reference/deploy-yourself/index.mdx:7`,
    `amm/technical-reference/deploy-yourself/index.mdx:24`).
  - Audit PDF by OtterSec lives in that repo (`amm/audits.mdx:6`).
- **`soroswap/aggregator`**, for the adapter that calls the AMM:
  `contracts/adapters/soroswap/src/protocol_interface.rs`
  (`amm/technical-reference/smart-contract-integration.mdx:12`).
- **`soroswap/sdk`**, published as `@soroswap/sdk`
  (`amm/technical-reference/using-soroswap-with-typescript.mdx:7`,
  `amm/technical-reference/using-soroswap-with-typescript.mdx:190`). The whole TypeScript
  page mirrors that package's API, including its `baseUrl` default
  (`amm/technical-reference/using-soroswap-with-typescript.mdx:49`).
- **Soroswap API service**, used to resolve the router address at runtime
  (`amm/technical-reference/smart-contract-integration.mdx:71`,
  `amm/technical-reference/using-soroswap-with-typescript.mdx:173`).

## Structure

| Path | Purpose |
|---|---|
| `index.mdx` | Section root, card grid. |
| `how-it-works.mdx` | Constant-product formula and swap lifecycle. |
| `ecosystem-participants.mdx`, `glossary.mdx` | Roles and vocabulary. |
| `audits.mdx` | OtterSec audit. |
| `technical-reference/index.mdx` | Entry to the reference subtree (`docs.json:153`). |
| `technical-reference/contracts/` | One page per contract: pair, factory, router, library (`docs.json:157`). |
| `technical-reference/deployed-addresses.mdx` | Mainnet addresses, pointer to Testnet. |
| `technical-reference/error-codes.mdx` | The Rust error enums, pasted inline. |
| `technical-reference/design-decisions.mdx` | Why the design differs from the obvious port. |
| `technical-reference/smart-contract-integration.mdx` | Calling the AMM from another contract. |
| `technical-reference/using-soroswap-with-typescript.mdx` | Calling it through `@soroswap/sdk`. |
| `technical-reference/vs-uniswap-v2/` | Diffs against Uniswap V2, per contract (`docs.json:172`). |
| `technical-reference/deploy-yourself/index.mdx` | Deploying your own instance. |

## Gotchas and invariants

- **Addresses have one source of truth.** `deployed-addresses.mdx` is the only page that
  may list contract addresses, and it defers to `public/mainnet.contracts.json` in
  `soroswap/core`. Any address written anywhere else must match it.
- `error-codes.mdx` pastes the `SoroswapPairError` enum and its siblings as literal Rust
  (`amm/technical-reference/error-codes.mdx:16`). Those variants and their numeric codes
  are copied from `soroswap/core`. A new error variant upstream silently makes this page
  incomplete. Codes are banded: pair in the 100s, factory in the 200s, router in the 500s.
- The `vs-uniswap-v2/` pages are comparisons, not specifications. When the Soroswap
  contract changes, the comparison changes too, and it is easy to forget.
- Do not add address rows to `deployed-addresses.mdx` by hand from a block explorer. Take
  them from the JSON in `soroswap/core`.

## Testing

No tests in this repo. Correctness is checked by reading `soroswap/core`, and structurally
by `npx mint@latest broken-links`.
