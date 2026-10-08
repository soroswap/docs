# Aggregator Module

> **Living document.** Read this before editing `aggregator/`. Update it in the same
> change.

**Source:** `aggregator/` (19 pages) · **Nav tab:** Smart Contracts (`docs.json:142`),
group `docs.json:186` · **Last verified:** 2026-10-08

## Purpose

The reference section for the Soroswap Aggregator: the contract that splits one trade
across several Soroban AMMs, the adapter trait each protocol implements, and the
operational model around the admin. Like `amm/`, it restates on-chain behavior, so it goes
stale when the contracts move.

## Product repos it describes

- **`soroswap/aggregator-v3`** (private repo), the contract the API uses since 2026-09-24:
  `CARVQXFP4JF5ELLXUMQ6DALR346YVGBMQOHB4ENA7SSVXAYABXLBDDC4`. Documented in
  `aggregator/technical-reference/contracts/aggregator-v3.mdx` and
  `aggregator/technical-reference/cross-contract-integration.mdx`. The source is private and
  unaudited, so public pages never link to it or claim an audit; integrators get the
  interface with `stellar contract fetch`. Signatures, error codes and the `swap` event were
  copied from `aggregator-v3/contracts/aggregator/src/{lib,errors,events}.rs` and
  `contracts/common/src/lib.rs` on 2026-10-08.

- **`soroswap/aggregator`**, the deprecated pre-v3 aggregator (`CAYP3U…`). Every page about
  it carries a `<Warning>` banner pointing at v3.
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
| `technical-reference/contracts/aggregator-v3.mdx` | **Aggregator v3** reference: entrypoints, types, fees, auth, errors, events. |
| `technical-reference/contracts/` (others) | Deprecated: aggregator contract, adapter trait, Soroswap adapter. |
| `technical-reference/cross-contract-integration.mdx` | Calling v3 from another contract, with the mainnet example verified on 2026-10-08. |
| `technical-reference/inspirations/1inch.mdx` | Prior art (`docs.json:210`). |
| `technical-reference/other-amms/phoenix.mdx` | Notes on Phoenix (`docs.json:217`). |

## Gotchas and invariants

- **The mainnet examples are real transactions.** `cross-contract-integration.mdx` cites a
  contract-as-user swap (`95ad3662…`) and an account round trip (`2e90c3d9…`, `83b710e9…`),
  run on mainnet on 2026-10-08 from exactly the snippets on the page. If you change a snippet,
  run it again on mainnet before publishing.
- **`supported-amms.mdx` has two columns on purpose**: what the v3 contract can execute and
  what the API routes today (`AGGREGATOR_PROTOCOLS` in `api/src/helpers/constants.ts`).
  Phoenix is in the first and not the second.
- Adding a venue means a v3 contract upgrade plus an API encoder, then, here, a row in
  `supported-amms.mdx`, a `Hop` variant in `aggregator-v3.mdx` and a case in the converter
  in `api/execute-quotes-onchain.mdx`.
- `inspirations/1inch.mdx` is background reading on someone else's design, not a
  description of what Soroswap ships.
- The aggregator addresses are listed in `amm/technical-reference/deployed-addresses.mdx`
  and repeated in the v3 pages, where an integrator needs them inline. Change all of them
  together.

## Testing

No tests in this repo. Correctness is checked by reading `soroswap/aggregator`, and
structurally by `npx mint@latest broken-links`.
