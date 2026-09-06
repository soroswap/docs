# CLAUDE.md

## Entry summary

Public product documentation for Soroswap Finance: the AMM, the Aggregator and the swap API.
No application code lives here, only 93 MDX pages, one static HTML demo and shared assets.
The site is built by **Mintlify** (`docs.json:2`, theme `mint` at `docs.json:3`). Navigation is
three tabs plus 236 redirects, all in `docs.json`. `CLAUDE.md` and `docs/` are excluded from the
build via `.mintignore`. No `package.json` and no CI workflow are committed, so the publish
trigger and the public domain are configured outside this repo: _TBD, unverified_.
It documents `soroswap/core`, `soroswap/aggregator`, the Soroswap API service, `soroswap/sdk`
and `soroswap/token-list`. See "Cross-repo dependencies" below.

## Serving locally to see a change

```bash
npx mint@latest dev --port 3333
```

Hot reload picks up edits. One check before committing:

```bash
npx mint@latest broken-links
```

That command also parses every page, so an MDX syntax error surfaces there even if the link check
itself passes. A page that fails to parse is reported by file and position.

## MDX rules that differ from plain Markdown

Every page is parsed as MDX. Things that silently worked in GitBook break the build here:

- HTML comments are `{/* ... */}`, never `<!-- ... -->`.
- Void tags self-close: `<br />`, `<img ... />`, `<hr />`.
- A literal `<` or `{` in prose starts JSX. Keep placeholders like `<API_KEY>` and expressions like
  `a <-> b` inside backticks or code fences.
- Image paths are root-relative (`/images/foo.png`). Relative paths do not resolve.
- Callouts are components: `<Info>`, `<Warning>`, `<Danger>`, `<Check>`, `<Tip>`, `<Note>`.
- Cards are `<Card>` inside `<Columns cols={n}>`.
- LaTeX works natively: `$...$` inline, `$$...$$` blocks.
- No GitBook syntax survives: no `{% hint %}`, no `{% embed %}`, no `<figure>`. Use `<Info>`, a raw
  `<iframe>` and `<Frame>` respectively.

## Structure

- `docs.json` is the navigation, organised as three tabs: Documentation, API, Smart Contracts.
  A page not listed there and not `hidden: true` is unreachable; a listed page with no file fails
  the build. Section index pages are named `index.mdx` and referenced as a group's `root`.
  Mintlify serves `foo/index.mdx` at both `/foo` and `/foo/index`; link to `/foo`.
- Page titles live in the `title` frontmatter, not in an H1. The body starts at the first `##`.
- Emoji go in `icon`, not in `title`.
- No page currently carries `hidden: true`. Nav and filesystem agree exactly: 93 MDX files, 93
  nav entries, no orphans and no dangling entries. Keep them in sync.
- Images live in `/images`, kebab-case. Newer ones are grouped by section
  (`/images/tutorials/adding-liquidity/balances.png`); 48 older files still sit flat at the top
  level. The navbar logo is in `/logo`, the favicon at `/favicon.png`.

## Conventions

- No em-dashes in prose. Commas, colons, periods.
- `description` frontmatter is a real one-line description of the page. It feeds SEO, link previews
  and the auto-generated `llms.txt`. Never a reading time, never "This page...".
- Every page has one. Adding a page without one is a regression.
- Contract addresses must match `amm/technical-reference/deployed-addresses.mdx`, which itself
  defers to `soroswap/core`'s `public/mainnet.contracts.json`.
- Commit messages are a sentence saying what changed and why.

## Redirects

`docs.json` carries 236 redirects covering every GitBook-era URL, including the older short forms
GitBook used to serve (`/01-concepts/...`, `/05-tutorial/...`, `/01-protocol-overview/...`). If you
move or rename a page, add its old route to that list. Two redirect sources are deliberately absent
because they would shadow live pages: `/amm` and `/aggregator` are the AMM and Aggregator sections,
not the concept pages of the same name.

## Numbers and lists that move

Anything mirroring an external system goes stale the day it is written. Link out instead of
copying:

- Token list: <https://github.com/soroswap/token-list>
- Contract addresses: `public/mainnet.contracts.json` in <https://github.com/soroswap/core>
- Volume, TVL and pool stats: <https://dune.com/paltalabs/soroswap>
- API reference: <https://api.soroswap.finance/docs>

The token table on `getting-started/soroswap-tokens.mdx` is a snapshot and is labelled as one. Do
not add rows to it; fix the link instead.

## Cross-repo dependencies

These docs describe behavior that lives in other repos. A change there is a docs change here.
Section owners are in `docs/modules/`.

| Product repo | Docs section | What it describes | Evidence |
|---|---|---|---|
| `soroswap/core` | `amm/`, `tutorials/` | AMM contracts, addresses, error codes, deploy tooling, Testnet setup script | `amm/index.mdx:26`, `amm/technical-reference/contracts/soroswap-pair.mdx:8`, `amm/technical-reference/deployed-addresses.mdx:20`, `tutorials/stellar-classic-assets/importing-testnet-tokens.mdx:31` |
| `soroswap/aggregator` | `aggregator/`, `amm/`, `concepts/` | Aggregator contract, adapter trait, the adapter that calls the AMM, audit | `aggregator/index.mdx:23`, `aggregator/technical-reference/contracts/adapter-trait.mdx:7`, `amm/technical-reference/smart-contract-integration.mdx:12`, `concepts/aggregator.mdx:10` |
| Soroswap API service | `api/`, `amm/`, `tutorials/` | Keys, `POST /quote`, `POST /quote/build`, gasless trustline, router lookup, Testnet faucet | `api/index.mdx:38`, `api/gasless-trustline.mdx:91`, `api/gasless-trustline.mdx:160`, `amm/technical-reference/smart-contract-integration.mdx:71`, `tutorials/stellar-classic-assets/testing.mdx:16` |
| `soroswap/sdk` (`@soroswap/sdk`) | `amm/` | The TypeScript client and its defaults | `amm/technical-reference/using-soroswap-with-typescript.mdx:7`, `amm/technical-reference/using-soroswap-with-typescript.mdx:190` |
| `soroswap/token-list` | `getting-started/`, `api/` | The canonical verified-token list | `getting-started/soroswap-tokens.mdx:12`, `api/optimal-route.mdx:84` |
| `soroswap/frontend` | `getting-started/`, `tutorials/`, `api/` | The app being walked through, and the reference API consumer | `getting-started/index.mdx:9`, `api/optimal-route.mdx:50` |
| `soroswap/backend` | `api/` | The routing implementation behind the API | `api/optimal-route.mdx:94` |

## Module Documentation Convention (MANDATORY)

Every documentation section has a living doc at `docs/modules/<section>.md`, indexed by the
router at `docs/modules/README.md`.

**Progressive disclosure, do not load all docs at once.** Before touching a section, open
`docs/modules/README.md`, find the ONE doc matching the pages you are changing, and read only
that. Never pull the whole `docs/modules/` folder into context.

1. **Before editing a section, read its `docs/modules/<section>.md`.** It holds the file map,
   the product repo that section tracks, and the gotchas.
2. **After editing, update that doc in the same change.** New pages, moved files, a new
   cross-repo dependency, a new gotcha. Bump "Last verified".
3. Claims must be verified against source and cite `path:line`. Never document something you
   have not confirmed exists.
4. **Adding a section?** Create its doc and add a router row in the same change. Keep `docs/`
   in `.mintignore` so these files never become public pages.
