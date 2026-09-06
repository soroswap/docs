# Site Shell Module

> **Living document.** Read this before changing navigation, redirects, theme, landing
> pages or shared assets. Update it in the same change.

**Source:** `docs.json`, `.mintignore`, `index.mdx`, `what-is-soroswap.mdx`, `images/`, `logo/`,
`favicon.png`
· **Last verified:** 2026-09-06

## Purpose

Everything that is not page prose: the Mintlify configuration, the two landing pages, and
the shared media. Blast radius is the whole site. A bad edit to `docs.json` can drop a
page from the navigation, break the build, or silently shadow a live route with a
redirect.

## Structure

| File | Purpose |
|---|---|
| `docs.json` | Theme, colors, logo, navbar, three navigation tabs, and 236 redirects. |
| `index.mdx` | Landing page. Three cards pointing at AMM, Aggregator and API (`index.mdx:14`, `index.mdx:17`, `index.mdx:20`). |
| `what-is-soroswap.mdx` | Prose overview of the same three products (`what-is-soroswap.mdx:12`). |
| `images/` | Page images. Some are grouped by section, 48 files sit flat at the top level. |
| `logo/light.svg`, `logo/dark.svg` | Navbar logo, wired at `docs.json:12`. |
| `favicon.png` | Wired at `docs.json:11`. |
| `.mintignore` | Files the Mintlify build skips: `CLAUDE.md` (`.mintignore:1`), `node_modules/`, `docs/`. |

## Public surface

The navigation is three tabs, all inside `docs.json`.

| Tab | Line | Groups |
|---|---|---|
| Documentation | `docs.json:33` | Welcome, Getting Started, Concepts, Tutorials, Resources |
| API | `docs.json:127` | Soroswap API (`docs.json:130`) |
| Smart Contracts | `docs.json:142` | Soroswap AMM (`docs.json:145`), Soroswap Aggregator (`docs.json:186`) |

Nested groups: Advanced Topics (`docs.json:73`), Stellar Classic Assets (`docs.json:95`),
Partnerships (`docs.json:115`), AMM Technical Reference (`docs.json:153`) with Contracts
(`docs.json:157`) and Soroswap vs UniswapV2 (`docs.json:172`), Aggregator Technical
Reference (`docs.json:192`) with Contracts (`docs.json:200`), Inspirations
(`docs.json:210`) and Other AMMs in Soroban (`docs.json:217`).

## Dependencies

- Mintlify, via the schema at `docs.json:2` and the `mint` theme at `docs.json:3`.
- The app, linked as the navbar's primary button (`docs.json:26`).
- Discord, as the navbar Support link (`docs.json:20`) and the footer social.
- No product repo is described here directly. The landing pages only route to the
  three product sections.

## Gotchas and invariants

- Navigation and filesystem are currently in exact agreement: 93 MDX files, 93 nav
  entries, no orphans and no dangling nav entries. Keep it that way. Adding a page
  without adding it to `docs.json` makes it unreachable from the nav.
- Section index pages are `index.mdx` and are referenced as a group `root`, never as a
  regular page.
- Redirects start at `docs.json:275`. `/amm` and `/aggregator` are deliberately not
  redirect sources, because they are live section roots.
- `api/beginner-example.html` is a raw HTML file, not MDX. It is not a nav entry. It is
  linked as `/api/beginner-example.html` from `api/quickstart.mdx:12`.
- The image folder is only partly organised. `images/api/`, `images/concepts/` and
  `images/tutorials/` exist, but 48 files still sit at `images/` top level with
  machine-generated `captura-de-pantalla-*` names. New images go in a section folder.

## Testing

No test suite. The build itself is the check: `npx mint@latest broken-links` parses every
page and reports MDX syntax errors by file and position.
