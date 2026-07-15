# DevSearch

> **Developer Productivity Hub** — A full-stack application for managing notes, code snippets, and bookmarks with enterprise-grade search.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) |
| Backend | NestJS |
| Database | PostgreSQL + Prisma ORM |
| Search | OpenSearch 2.x |
| Cache | Redis |
| Queue | BullMQ |
| Auth | JWT (Access + Refresh tokens) |
| Containerization | Docker Compose |

## Project Structure

```
devsearch/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # Next.js frontend
├── packages/
│   └── shared/       # Shared types, constants, validators
├── docker/           # Docker Compose & configs
└── docs/             # Architecture & API documentation
```

## Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- **Docker Desktop** (for PostgreSQL, Redis, OpenSearch)

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd devsearch
npm install
```

### 2. Start Infrastructure

```bash
cd docker
docker compose up -d
```

This starts:
- **PostgreSQL** on `localhost:5432`
- **Redis** on `localhost:6379`
- **OpenSearch** on `localhost:9200`
- **OpenSearch Dashboards** on `localhost:5601`

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values (defaults work for local dev)
```

### 4. Run Database Migrations

```bash
npm run dev:api   # Starts NestJS in dev mode
```

### 5. Start Development

```bash
# Terminal 1 — API
npm run dev:api

# Terminal 2 — Frontend
npm run dev:web
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE.md)
- [Search Design](docs/SEARCH.md)
- [API Documentation](docs/API.md)
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)

## License

MIT
