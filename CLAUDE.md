# CLAUDE.md

Public product documentation for Soroswap Finance: the AMM, the Aggregator and the swap API.

The site is built by **Mintlify**. Pages are MDX, navigation lives in `docs.json`, and `CLAUDE.md`
is excluded from the build via `.mintignore`.

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
- Pages carrying `hidden: true` build but stay out of the nav and search. They are the unwritten
  stubs inherited from GitBook, each marked with a warning in the body. Write the page, drop the
  flag, add it to `docs.json`.
- Images live in `/images`, kebab-case, grouped by section (`/images/tutorials/doing-swap/...`).
  The navbar logo is in `/logo`, the favicon at `/favicon.png`.

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
