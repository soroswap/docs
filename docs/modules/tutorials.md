# Tutorials Module

> **Living document.** Read this before editing `tutorials/`. Update it in the same change.

**Source:** `tutorials/` (13 pages, including `tutorials/stellar-classic-assets/`) ·
**Nav group:** `docs.json:85`, subgroup `docs.json:95` · **Last verified:** 2026-09-06

## Purpose

Screenshot walkthroughs of the Soroswap app, in the order most people need them: get
funded on Testnet, install Freighter, learn the UI, add liquidity, swap, remove
liquidity. The Stellar Classic Assets subgroup covers wrapping a classic asset into a
Soroban token and trading it.

## Product repos it describes

- **`soroswap/frontend`**, the app at `app.soroswap.finance`. This is the most
  screenshot-heavy section, so it is the first to rot when the UI changes. Linked from
  `tutorials/doing-swap.mdx`, `tutorials/adding-liquidity.mdx` and
  `tutorials/conclusions.mdx`.
- **`soroswap/core`**, for the Testnet setup script
  `scripts/setup_stellar_classic_assets.sh`, linked at
  `tutorials/stellar-classic-assets/importing-testnet-tokens.mdx:31`. Renaming or moving
  that script breaks the page.
- **Soroswap API service**, used as a Testnet token faucet:
  `https://api.soroswap.finance/api/random_tokens` at
  `tutorials/stellar-classic-assets/testing.mdx:16`.

## Structure

| File | Purpose |
|---|---|
| `index.mdx` | Card grid, ordered as the intended reading path. |
| `soroswap-testnet-overview.mdx` | What Testnet is for, and getting funded. |
| `installing-freighter.mdx` | Wallet install. |
| `soroswap-sections.mdx` | Tour of the app's screens. |
| `adding-liquidity.mdx`, `doing-swap.mdx`, `remove-liquidity.mdx` | The three core flows. |
| `stellar-classic-assets/index.mdx` | Entry to the classic-asset subgroup. |
| `stellar-classic-assets/wrapping.mdx`, `swapping.mdx`, `testing.mdx`, `importing-testnet-tokens.mdx` | Wrapping a classic asset and trading it on Testnet. |
| `conclusions.mdx` | Wrap-up and next steps. |

## Gotchas and invariants

- Images are the payload here. Organised pages keep them under `images/tutorials/<page>/`
  and reference them root-relative, for example
  `/images/tutorials/adding-liquidity/balances.png`
  (`tutorials/adding-liquidity.mdx:21`). A relative path does not resolve.
- Not every page is organised yet. `tutorials/doing-swap.mdx` still points at flat
  top-level files such as `/images/captura-de-pantalla-2024-09-18-a-las-18-21-42.png`
  (`tutorials/doing-swap.mdx:20`), and there is no `images/tutorials/doing-swap/` folder.
  New images should go in a per-page folder.
- Most of this section is Testnet, while `getting-started/` is Mainnet-first. Do not
  silently mix networks inside one walkthrough.
- Screenshots are undated. When the app UI changes, replace the images, do not just patch
  the prose around them.

## Testing

No tests. Verified by walking the app on Testnet, and by `npx mint@latest broken-links`.
