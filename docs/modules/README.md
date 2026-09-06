# Module Documentation Index

Living docs, one per documentation area. **Read the relevant doc before editing pages in
that area; update it in the same change.** See "Module Documentation Convention" in
`CLAUDE.md` for the workflow.

This repo has no application code. A "module" here is a top-level section of the
published site, matching one navigation group in `docs.json`. Each doc records what the
section documents, which product repo's behavior it mirrors, and where its files live.

| Doc | Section files | Nav group | One-liner |
|---|---|---|---|
| [site-shell.md](site-shell.md) | `docs.json`, `index.mdx`, `what-is-soroswap.mdx`, `images/`, `logo/` | Welcome (`docs.json:36`) | Navigation, redirects, theme, landing pages and shared assets. |
| [getting-started.md](getting-started.md) | `getting-started/` | Getting Started (`docs.json:43`) | First-use guide to the Soroswap app: wallet, swap, liquidity, tokens. |
| [concepts.md](concepts.md) | `concepts/` | Concepts (`docs.json:57`) | Protocol-agnostic DeFi theory: AMMs, pools, fees, slippage, routing. |
| [tutorials.md](tutorials.md) | `tutorials/` | Tutorials (`docs.json:85`) | Screenshot walkthroughs of the app, mostly on Testnet. |
| [resources.md](resources.md) | `resources/` | Resources (`docs.json:108`) | Support, FAQ, about the team, partnerships. |
| [api.md](api.md) | `api/` | Soroswap API (`docs.json:130`) | Integration guides for the hosted swap API and its quote/build flow. |
| [amm.md](amm.md) | `amm/` | Soroswap AMM (`docs.json:145`) | The constant-product AMM contracts, addresses, error codes, SDK usage. |
| [aggregator.md](aggregator.md) | `aggregator/` | Soroswap Aggregator (`docs.json:186`) | The multi-DEX routing contracts and their adapter model. |

## Product repos these sections track

A change in the product repo means the matching section needs re-checking. Full evidence
is in each module doc and in the "Cross-repo dependencies" section of `CLAUDE.md`.

| Product repo | Sections that describe it |
|---|---|
| `soroswap/core` | [amm.md](amm.md), [tutorials.md](tutorials.md) |
| `soroswap/aggregator` | [aggregator.md](aggregator.md), [amm.md](amm.md), [concepts.md](concepts.md) |
| Soroswap API service | [api.md](api.md), [amm.md](amm.md), [tutorials.md](tutorials.md) |
| `soroswap/sdk` (`@soroswap/sdk`) | [amm.md](amm.md) |
| `soroswap/token-list` | [getting-started.md](getting-started.md), [api.md](api.md) |
| `soroswap/frontend` (app.soroswap.finance) | [getting-started.md](getting-started.md), [tutorials.md](tutorials.md) |
| `soroswap/backend` | [api.md](api.md) |
