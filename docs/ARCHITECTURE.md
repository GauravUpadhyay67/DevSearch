# DevSearch — Architecture

## Overview

DevSearch is a monorepo-based full-stack application following a modular architecture.

## Architecture Decisions

### Monorepo with npm Workspaces
We use npm workspaces (not Turborepo or Lerna) to keep complexity low while still sharing code between the API and frontend via the `@devsearch/shared` package.

### NestJS Module Pattern
Each feature (notes, snippets, bookmarks, search) is encapsulated in its own NestJS module with:
- `*.module.ts` — Module definition with imports/exports
- `*.controller.ts` — HTTP route handlers
- `*.service.ts` — Business logic
- `dto/` — Data Transfer Objects for request validation

### Data Flow

```
User Action → Next.js → REST API → NestJS Controller → Service → Prisma → PostgreSQL
                                                            ↓
                                                        BullMQ Job
                                                            ↓
                                                    OpenSearch Index
```

### Search Architecture
- PostgreSQL is the **source of truth** for all data
- OpenSearch is a **read-optimized search index** that mirrors PostgreSQL data
- BullMQ jobs keep OpenSearch in sync when data changes in PostgreSQL
- Redis caches frequent queries to reduce load on both PostgreSQL and OpenSearch

## Technology Choices

| Decision | Choice | Rationale |
|----------|--------|-----------|
| ORM | Prisma | Type-safe queries, migration system, great DX |
| State Management | Zustand | Lightweight, no boilerplate, works well with Next.js |
| Search Engine | OpenSearch | Full-text search, fuzzy matching, autocomplete, free & open source |
| Job Queue | BullMQ | Redis-backed, reliable, built-in retry/backoff |
| Auth | JWT + Passport | Industry standard, stateless, works with NestJS guards |
