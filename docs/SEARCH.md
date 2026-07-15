# DevSearch — Search Design

## Overview

DevSearch uses **OpenSearch 2.x** for full-text search across notes, snippets, and bookmarks.

## Index Strategy

Three separate indices, one per content type:
- `devsearch-notes` — title, content (markdown), excerpt, tags
- `devsearch-snippets` — title, description, code, language, tags
- `devsearch-bookmarks` — title, url, description, type, siteName, tags

### Why Separate Indices?
- Each content type has different fields and relevance scoring
- Allows type-specific analyzers (e.g., code-aware analysis for snippets)
- Easier to manage and re-index independently

## Search Features

| Feature | OpenSearch Mechanism |
|---------|---------------------|
| Full-text search | `multi_match` query across relevant fields |
| Fuzzy search | `fuzziness: "AUTO"` on multi_match |
| Autocomplete | `completion` suggester with `edge_ngram` tokenizer |
| Highlighted results | `highlight` with `<mark>` tags |
| Filters | `bool.filter` with `term`, `terms`, `range` queries |
| Relevance boosting | Field boosting (`title^3`) to prioritize title matches |

## Sync Strategy

PostgreSQL → BullMQ Job → OpenSearch

- **Create/Update**: Service dispatches `upsert` job to BullMQ queue
- **Delete**: Service dispatches `delete` job
- **Bulk re-index**: CLI command for initial migration or recovery
- **Retry**: 3 attempts with exponential backoff (1s, 2s, 4s)
