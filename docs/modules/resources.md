# Resources Module

> **Living document.** Read this before editing `resources/`. Update it in the same
> change.

**Source:** `resources/` (7 pages, including `resources/partnerships/`) ·
**Nav group:** `docs.json:108`, subgroup `docs.json:115` · **Last verified:** 2026-09-06

## Purpose

Everything that is about the project rather than the product: support channels, FAQ, the
team, external links, and partnership write-ups. Lowest technical coupling of any section,
highest coupling to off-repo facts like Discord invites and social handles.

## Product repos it describes

- None directly. `resources/additional-resources.mdx:10` points at the
  `github.com/soroswap` organisation as a whole, and
  `resources/general-faq.mdx:13` repeats the same link alongside the website and Twitter.
- `resources/partnerships/business-partnerships.mdx:17` routes API-shaped requests into
  the `/api` section rather than answering them here.
- `resources/partnerships/mercury-subquery.mdx` documents work with the Mercury and
  SubQuery indexers, which are third-party services, not Soroswap repos.

## Structure

| File | Purpose |
|---|---|
| `index.mdx` | Support center, community links. |
| `about-us.mdx` | The team behind Soroswap. |
| `general-faq.mdx` | Frequently asked questions. |
| `additional-resources.mdx` | Outbound link list. |
| `partnerships/index.mdx` | Entry to the partnership subgroup. |
| `partnerships/mercury-subquery.mdx` | Indexer collaboration write-up and setup steps. |
| `partnerships/business-partnerships.mdx` | How to start a commercial conversation. |

## Gotchas and invariants

- Discord invites, social handles and support links also live in `docs.json` (navbar at
  `docs.json:20`, footer socials). Change one and check the other, or the site contradicts
  itself.
- Partnership pages describe third-party tooling. Their instructions can go stale without
  anything in the Soroswap codebase changing.

## Testing

No tests. Verified by `npx mint@latest broken-links`.
