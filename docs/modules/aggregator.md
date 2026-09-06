# Aggregator Module

> **Living document.** Read this before editing `aggregator/`. Update it in the same
> change.

**Source:** `aggregator/` (18 pages) · **Nav tab:** Smart Contracts (`docs.json:142`),
group `docs.json:186` · **Last verified:** 2026-09-06

## Purpose

The reference section for the Soroswap Aggregator: the contract that splits one trade
across several Soroban AMMs, the adapter trait each protocol implements, and the
operational model around the admin. Like `amm/`, it restates on-chain behavior, so it goes
stale when the contracts move.

## Product repos it describes

- **`soroswap/aggregator`**, the only product repo this section covers.
  - Section root and contracts index point at the repo (`aggregator/index.mdx:23`,
    `aggregator/technical-reference/contracts/index.mdx:24`).
  - Per-contract pages point at specific source trees: `contracts/aggregator`
    (`aggregator/technical-reference/contracts/soroswap-aggregator.mdx:11`),
    `contracts/adapters/interface`
    (`aggregator/technical-reference/contracts/adapter-trait.mdx:7`),
    `contracts/adapters/soroswap`
    (`aggregator/technical-reference/contracts/soroswap-adapter.mdx:11`), and the adapter
    set as a whole (`aggregator/technical-reference/contracts/soroswap-adapter.mdx:38`).
  - Deployment and admin behavior (`aggregator/technical-reference/operation.mdx:8`).
  - Audit by Runtime Verification, PDF in that repo (`aggregator/audits.mdx:8`,
    `aggregator/audits.mdx:10`, `aggregator/technical-reference/how-it-works.mdx:55`).
- **Third-party AMMs it routes through**, documented but not owned here: Phoenix
  (`aggregator/supported-amms.mdx:10`,
  `aggregator/technical-reference/other-amms/phoenix.mdx`) and Aquarius
  (`aggregator/supported-amms.mdx:12`).

## Structure

| Path | Purpose |
|---|---|
| `index.mdx` | Section root, card grid. |
| `supported-amms.mdx` | Which protocols the aggregator routes through. |
| `audits.mdx` | Runtime Verification audit. |
| `disclaimer.mdx` | Legal disclaimer, last page in the group. |
| `technical-reference/index.mdx` | Entry to the reference subtree (`docs.json:192`). |
| `technical-reference/how-it-works.mdx` | `DexDistribution` and route splitting. |
| `technical-reference/design.mdx`, `technical-overview.mdx` | Architecture. |
| `technical-reference/operation.mdx` | Admin, initialization, day-to-day operation. |
| `technical-reference/contracts/` | Aggregator contract, adapter trait, Soroswap adapter (`docs.json:200`). |
| `technical-reference/cross-contract-integration.mdx` | Calling the aggregator from another contract. |
| `technical-reference/inspirations/1inch.mdx` | Prior art (`docs.json:210`). |
| `technical-reference/other-amms/phoenix.mdx` | Notes on Phoenix (`docs.json:217`). |

## Gotchas and invariants

- **`supported-amms.mdx` contradicts the rest of the site, in two ways.** It marks
  Aquarius "Coming Soon" (`aggregator/supported-amms.mdx:12`), while the repo-root landing
  page (`/index.mdx:25`) and `api/index.mdx:19` both list Aqua as a live source of quotes
  and `Aqua = 2` sits in the shipped protocol enum
  (`aggregator/technical-reference/contracts/soroswap-aggregator.mdx:66`). It also omits
  **Comet** entirely, though `Comet = 3` is in that same enum
  (`aggregator/technical-reference/contracts/soroswap-aggregator.mdx:67`) and four
  reference pages document a Comet adapter
  (`aggregator/technical-reference/contracts/index.mdx:21`,
  `aggregator/technical-reference/technical-overview.mdx:84`,
  `aggregator/technical-reference/contracts/adapter-trait.mdx:8`,
  `aggregator/technical-reference/contracts/soroswap-adapter.mdx:37`). Check the deployed
  adapter set in `soroswap/aggregator` before trusting any of them, and fix the whole set,
  not just the page you are on.
- Adding a protocol means an adapter in `soroswap/aggregator` plus, here, a row in
  `supported-amms.mdx` and usually a page under `technical-reference/other-amms/`.
- `inspirations/1inch.mdx` is background reading on someone else's design, not a
  description of what Soroswap ships.
- Contract addresses are not listed in this section. Keep it that way, and let
  `amm/technical-reference/deployed-addresses.mdx` stay the single address page.

## Testing

No tests in this repo. Correctness is checked by reading `soroswap/aggregator`, and
structurally by `npx mint@latest broken-links`.
