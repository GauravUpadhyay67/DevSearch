# DevSearch — Enterprise-Grade Implementation Roadmap

## What You're Building

DevSearch is a **developer productivity hub** — a place to store notes, code snippets, and bookmarks with powerful OpenSearch-backed full-text search. Think of it as a personal "second brain" for developers, built with enterprise patterns.

---

## Tech Stack & Justification

| Layer | Technology | Why |
|---|---|---|
| Frontend | **Next.js 15 (App Router)** | SSR, RSC, file-based routing, industry standard |
| Backend API | **NestJS** | Enterprise Node.js framework, modular architecture, built-in DI |
| Database | **PostgreSQL** | Relational, robust, great with TypeORM/Prisma |
| ORM | **Prisma** | Type-safe, great DX, migration system, works well with NestJS |
| Search Engine | **OpenSearch 2.x** | Full-text search, fuzzy matching, autocomplete, highlighting |
| Cache | **Redis** | Session caching, search result caching, rate limiting |
| Background Jobs | **BullMQ** (Redis-backed) | Queue-based indexing jobs when content changes |
| Auth | **JWT + Passport.js** | Access/Refresh token pattern, role-based guards |
| File Storage | **Local disk → S3-compatible (MinIO)** | Start local, upgrade to MinIO in Docker |
| API Docs | **Swagger (via @nestjs/swagger)** | Auto-generated REST API documentation |
| Containerization | **Docker + Docker Compose** | Run everything locally with one command |
| Testing | **Jest + Supertest (API), Playwright (E2E)** | Industry standard testing stack |

---

## Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     NEXT.JS FRONTEND                        │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐   │
│  │Dashboard│  │Notes/Edit│  │ Snippets │  │ Bookmarks  │   │
│  └────┬────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘   │
│       └─────────────┴────────────┴───────────────┘          │
│                         │ HTTP (REST)                       │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                    NESTJS BACKEND                            │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌────────┐  ┌───────────┐   │
│  │ Auth │  │Notes │  │Snips │  │Bookmarks│  │  Search   │   │
│  │Module│  │Module│  │Module│  │ Module  │  │  Module   │   │
│  └──┬───┘  └──┬───┘  └──┬───┘  └───┬────┘  └─────┬─────┘   │
│     │         │         │          │              │          │
│  ┌──┴─────────┴─────────┴──────────┴──┐    ┌─────┴───────┐  │
│  │         Prisma ORM                 │    │  OpenSearch  │  │
│  │         (PostgreSQL)               │    │   Client     │  │
│  └────────────────────────────────────┘    └─────────────┘  │
│                                                              │
│  ┌────────────┐  ┌────────────┐                              │
│  │   Redis    │  │  BullMQ    │                              │
│  │  (Cache)   │  │  (Queues)  │                              │
│  └────────────┘  └────────────┘                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Monorepo Structure

> [!IMPORTANT]
> Use a **monorepo with separate `apps/` and shared `packages/`**. This is the enterprise standard for full-stack projects. We'll use **npm workspaces** (no Turborepo needed for this scale).

```
devsearch/
├── apps/
│   ├── web/                          # Next.js 15 frontend
│   │   ├── src/
│   │   │   ├── app/                  # App Router pages
│   │   │   │   ├── (auth)/           # Route group: login, signup
│   │   │   │   ├── (dashboard)/      # Route group: main app
│   │   │   │   │   ├── notes/
│   │   │   │   │   ├── snippets/
│   │   │   │   │   ├── bookmarks/
│   │   │   │   │   ├── search/
│   │   │   │   │   └── page.tsx      # Dashboard home
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx          # Landing page
│   │   │   ├── components/
│   │   │   │   ├── ui/               # Reusable primitives (Button, Input, Modal)
│   │   │   │   ├── layout/           # Header, Sidebar, Footer
│   │   │   │   ├── notes/            # Note-specific components
│   │   │   │   ├── snippets/         # Snippet-specific components
│   │   │   │   ├── bookmarks/        # Bookmark-specific components
│   │   │   │   ├── search/           # Search bar, filters, results
│   │   │   │   └── editor/           # Markdown editor components
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   ├── lib/                  # Utilities, API client, constants
│   │   │   ├── stores/               # Zustand stores (client state)
│   │   │   └── types/                # Frontend-specific types
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts        # (optional, or use vanilla CSS)
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                          # NestJS backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── auth.module.ts
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── strategies/        # JWT, Local strategies
│       │   │   │   ├── guards/            # Auth, Roles guards
│       │   │   │   └── dto/               # LoginDto, RegisterDto
│       │   │   ├── users/
│       │   │   │   ├── users.module.ts
│       │   │   │   ├── users.controller.ts
│       │   │   │   ├── users.service.ts
│       │   │   │   └── dto/
│       │   │   ├── notes/
│       │   │   │   ├── notes.module.ts
│       │   │   │   ├── notes.controller.ts
│       │   │   │   ├── notes.service.ts
│       │   │   │   └── dto/
│       │   │   ├── snippets/
│       │   │   │   ├── snippets.module.ts
│       │   │   │   ├── snippets.controller.ts
│       │   │   │   ├── snippets.service.ts
│       │   │   │   └── dto/
│       │   │   ├── bookmarks/
│       │   │   │   ├── bookmarks.module.ts
│       │   │   │   ├── bookmarks.controller.ts
│       │   │   │   ├── bookmarks.service.ts
│       │   │   │   └── dto/
│       │   │   ├── tags/
│       │   │   │   ├── tags.module.ts
│       │   │   │   ├── tags.controller.ts
│       │   │   │   └── tags.service.ts
│       │   │   ├── folders/
│       │   │   │   ├── folders.module.ts
│       │   │   │   ├── folders.controller.ts
│       │   │   │   └── folders.service.ts
│       │   │   ├── search/
│       │   │   │   ├── search.module.ts
│       │   │   │   ├── search.controller.ts
│       │   │   │   ├── search.service.ts
│       │   │   │   └── dto/
│       │   │   ├── favorites/
│       │   │   │   ├── favorites.module.ts
│       │   │   │   ├── favorites.controller.ts
│       │   │   │   └── favorites.service.ts
│       │   │   └── files/
│       │   │       ├── files.module.ts
│       │   │       ├── files.controller.ts
│       │   │       └── files.service.ts
│       │   ├── common/
│       │   │   ├── decorators/        # @CurrentUser, @Roles, @Public
│       │   │   ├── filters/           # HttpExceptionFilter, AllExceptionsFilter
│       │   │   ├── guards/            # JwtAuthGuard, RolesGuard
│       │   │   ├── interceptors/      # TransformInterceptor, LoggingInterceptor
│       │   │   ├── pipes/             # ValidationPipe configs
│       │   │   └── middleware/         # LoggerMiddleware, CorsMiddleware
│       │   ├── config/
│       │   │   ├── database.config.ts
│       │   │   ├── redis.config.ts
│       │   │   ├── opensearch.config.ts
│       │   │   ├── jwt.config.ts
│       │   │   └── app.config.ts
│       │   ├── prisma/
│       │   │   ├── prisma.module.ts
│       │   │   ├── prisma.service.ts
│       │   │   └── schema.prisma
│       │   ├── opensearch/
│       │   │   ├── opensearch.module.ts
│       │   │   ├── opensearch.service.ts
│       │   │   └── indices/           # Index mappings for notes, snippets, bookmarks
│       │   ├── redis/
│       │   │   ├── redis.module.ts
│       │   │   └── redis.service.ts
│       │   ├── queue/
│       │   │   ├── queue.module.ts
│       │   │   ├── processors/        # IndexingProcessor, etc.
│       │   │   └── jobs/              # Job definitions
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── test/
│       │   ├── unit/
│       │   └── e2e/
│       ├── nest-cli.json
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   └── shared/                        # Shared types, constants, validators
│       ├── src/
│       │   ├── types/                 # Shared TypeScript interfaces
│       │   ├── constants/             # Shared constants
│       │   └── validators/            # Shared validation schemas (Zod)
│       ├── tsconfig.json
│       └── package.json
│
├── docker/
│   ├── docker-compose.yml             # Full stack orchestration
│   ├── docker-compose.dev.yml         # Dev overrides (hot reload, volumes)
│   ├── api.Dockerfile
│   ├── web.Dockerfile
│   └── opensearch/
│       └── opensearch.yml             # Custom OpenSearch config
│
├── docs/
│   ├── API.md                         # API documentation notes
│   ├── ARCHITECTURE.md                # Architecture decisions
│   ├── DATABASE.md                    # DB schema & ERD
│   └── SEARCH.md                      # OpenSearch index design
│
├── .github/
│   └── workflows/                     # CI/CD pipelines (future)
│
├── .env.example
├── .gitignore
├── package.json                       # Root workspace config
├── tsconfig.base.json                 # Shared TS config
└── README.md
```

---

## Database Schema (PostgreSQL + Prisma)

```prisma
// ============ USERS ============
model User {
  id            String     @id @default(uuid())
  email         String     @unique
  username      String     @unique
  passwordHash  String     @map("password_hash")
  displayName   String?    @map("display_name")
  avatarUrl     String?    @map("avatar_url")
  role          Role       @default(USER)
  isActive      Boolean    @default(true) @map("is_active")
  lastLoginAt   DateTime?  @map("last_login_at")
  createdAt     DateTime   @default(now()) @map("created_at")
  updatedAt     DateTime   @updatedAt @map("updated_at")

  notes         Note[]
  snippets      Snippet[]
  bookmarks     Bookmark[]
  folders       Folder[]
  tags          Tag[]
  favorites     Favorite[]
  searchHistory SearchHistory[]
  refreshTokens RefreshToken[]

  @@map("users")
}

enum Role {
  USER
  ADMIN
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String   @map("user_id")
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}

// ============ NOTES ============
model Note {
  id          String   @id @default(uuid())
  title       String
  content     String   @db.Text      // Markdown content
  excerpt     String?                 // Auto-generated plain-text preview
  isPublic    Boolean  @default(false) @map("is_public")
  userId      String   @map("user_id")
  folderId    String?  @map("folder_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  folder      Folder?     @relation(fields: [folderId], references: [id], onDelete: SetNull)
  tags        TagsOnItems[]
  attachments Attachment[]
  favorites   Favorite[]

  @@index([userId])
  @@index([folderId])
  @@map("notes")
}

// ============ SNIPPETS ============
model Snippet {
  id          String   @id @default(uuid())
  title       String
  description String?
  code        String   @db.Text
  language    String                  // "javascript", "python", etc.
  isPublic    Boolean  @default(false) @map("is_public")
  userId      String   @map("user_id")
  folderId    String?  @map("folder_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  folder      Folder?     @relation(fields: [folderId], references: [id], onDelete: SetNull)
  tags        TagsOnItems[]
  favorites   Favorite[]

  @@index([userId])
  @@index([language])
  @@map("snippets")
}

// ============ BOOKMARKS ============
model Bookmark {
  id          String       @id @default(uuid())
  title       String
  url         String
  description String?
  type        BookmarkType @default(ARTICLE)
  siteName    String?      @map("site_name")     // "GitHub", "StackOverflow"
  faviconUrl  String?      @map("favicon_url")
  userId      String       @map("user_id")
  folderId    String?      @map("folder_id")
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  folder      Folder?     @relation(fields: [folderId], references: [id], onDelete: SetNull)
  tags        TagsOnItems[]
  favorites   Favorite[]

  @@index([userId])
  @@index([type])
  @@map("bookmarks")
}

enum BookmarkType {
  ARTICLE
  DOCUMENTATION
  GITHUB_REPO
  VIDEO
  STACKOVERFLOW
  OTHER
}

// ============ ORGANIZATION ============
model Folder {
  id        String   @id @default(uuid())
  name      String
  icon      String?                  // Emoji or icon name
  parentId  String?  @map("parent_id")
  userId    String   @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent    Folder?   @relation("FolderTree", fields: [parentId], references: [id], onDelete: SetNull)
  children  Folder[]  @relation("FolderTree")
  notes     Note[]
  snippets  Snippet[]
  bookmarks Bookmark[]

  @@unique([name, parentId, userId])
  @@map("folders")
}

model Tag {
  id        String   @id @default(uuid())
  name      String
  color     String?                  // Hex color for UI
  userId    String   @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")

  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     TagsOnItems[]

  @@unique([name, userId])
  @@map("tags")
}

// Polymorphic join table for tags
model TagsOnItems {
  id         String   @id @default(uuid())
  tagId      String   @map("tag_id")
  noteId     String?  @map("note_id")
  snippetId  String?  @map("snippet_id")
  bookmarkId String?  @map("bookmark_id")
  assignedAt DateTime @default(now()) @map("assigned_at")

  tag      Tag       @relation(fields: [tagId], references: [id], onDelete: Cascade)
  note     Note?     @relation(fields: [noteId], references: [id], onDelete: Cascade)
  snippet  Snippet?  @relation(fields: [snippetId], references: [id], onDelete: Cascade)
  bookmark Bookmark? @relation(fields: [bookmarkId], references: [id], onDelete: Cascade)

  @@map("tags_on_items")
}

// ============ FAVORITES ============
model Favorite {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  noteId     String?  @map("note_id")
  snippetId  String?  @map("snippet_id")
  bookmarkId String?  @map("bookmark_id")
  createdAt  DateTime @default(now()) @map("created_at")

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  note     Note?     @relation(fields: [noteId], references: [id], onDelete: Cascade)
  snippet  Snippet?  @relation(fields: [snippetId], references: [id], onDelete: Cascade)
  bookmark Bookmark? @relation(fields: [bookmarkId], references: [id], onDelete: Cascade)

  @@unique([userId, noteId])
  @@unique([userId, snippetId])
  @@unique([userId, bookmarkId])
  @@map("favorites")
}

// ============ ATTACHMENTS ============
model Attachment {
  id           String   @id @default(uuid())
  filename     String
  originalName String   @map("original_name")
  mimeType     String   @map("mime_type")
  size         Int                    // bytes
  storagePath  String   @map("storage_path")
  noteId       String   @map("note_id")
  createdAt    DateTime @default(now()) @map("created_at")

  note Note @relation(fields: [noteId], references: [id], onDelete: Cascade)

  @@map("attachments")
}

// ============ SEARCH ============
model SearchHistory {
  id        String   @id @default(uuid())
  query     String
  filters   Json?                    // Stored filter config
  userId    String   @map("user_id")
  isSaved   Boolean  @default(false) @map("is_saved")  // "Saved search"
  searchedAt DateTime @default(now()) @map("searched_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, searchedAt])
  @@map("search_history")
}
```

---

## OpenSearch Index Design

You'll create **3 indices** — one for each content type:

### `devsearch-notes` Index

```json
{
  "mappings": {
    "properties": {
      "id":        { "type": "keyword" },
      "userId":    { "type": "keyword" },
      "title":     {
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "suggest": { "type": "completion" },
          "keyword": { "type": "keyword" }
        }
      },
      "content":   {
        "type": "text",
        "analyzer": "standard"
      },
      "excerpt":   { "type": "text" },
      "tags":      { "type": "keyword" },
      "folderId":  { "type": "keyword" },
      "isPublic":  { "type": "boolean" },
      "createdAt": { "type": "date" },
      "updatedAt": { "type": "date" }
    }
  },
  "settings": {
    "analysis": {
      "analyzer": {
        "autocomplete_analyzer": {
          "type": "custom",
          "tokenizer": "autocomplete_tokenizer",
          "filter": ["lowercase"]
        }
      },
      "tokenizer": {
        "autocomplete_tokenizer": {
          "type": "edge_ngram",
          "min_gram": 2,
          "max_gram": 20,
          "token_chars": ["letter", "digit"]
        }
      }
    }
  }
}
```

### `devsearch-snippets` Index
Same pattern as notes but includes `code`, `language`, and `description` fields.

### `devsearch-bookmarks` Index
Same pattern but includes `url`, `type`, `siteName`, and `description` fields.

---

## Phase-by-Phase Build Order

> [!IMPORTANT]
> **Build in this exact order.** Each phase builds on the previous. Don't skip ahead — enterprise projects are built layer by layer.

---

### Phase 1 — Project Scaffolding & Infrastructure (Days 1–2)

**Goal:** Set up the monorepo, Docker services, and verify all infrastructure is running.

#### Steps:
1. **Initialize monorepo**
   - Create root `package.json` with npm workspaces
   - Create `tsconfig.base.json` with shared TypeScript config (strict mode, path aliases)

2. **Scaffold NestJS API**
   ```bash
   cd apps/
   npx -y @nestjs/cli new api --package-manager npm --skip-git
   ```
   - Configure `nest-cli.json`, add path aliases
   - Install core deps: `@nestjs/config`, `class-validator`, `class-transformer`

3. **Scaffold Next.js Frontend**
   ```bash
   cd apps/
   npx -y create-next-app@latest web --typescript --app --eslint --src-dir --no-tailwind --import-alias "@/*"
   ```

4. **Create shared package**
   - `packages/shared/` with shared types and constants

5. **Docker Compose setup**
   ```yaml
   services:
     postgres:
       image: postgres:16-alpine
       ports: ["5432:5432"]
       environment:
         POSTGRES_DB: devsearch
         POSTGRES_USER: devsearch
         POSTGRES_PASSWORD: devsearch_dev
       volumes:
         - postgres_data:/var/lib/postgresql/data

     redis:
       image: redis:7-alpine
       ports: ["6379:6379"]

     opensearch:
       image: opensearchproject/opensearch:2.11.0
       ports: ["9200:9200"]
       environment:
         - discovery.type=single-node
         - plugins.security.disabled=true
         - OPENSEARCH_INITIAL_ADMIN_PASSWORD=Admin@12345
       volumes:
         - opensearch_data:/usr/share/opensearch/data

     opensearch-dashboards:
       image: opensearchproject/opensearch-dashboards:2.11.0
       ports: ["5601:5601"]
       environment:
         - OPENSEARCH_HOSTS=["http://opensearch:9200"]
         - DISABLE_SECURITY_DASHBOARDS_PLUGIN=true
   ```

6. **Create `.env.example`** with all config variables
7. **Verify**: `docker compose up -d` → all services running → connect to each

✅ **Checkpoint:** You can run `docker compose up`, connect to PostgreSQL, ping Redis, and hit OpenSearch at `http://localhost:9200`.

---

### Phase 2 — Database & Prisma Setup (Days 2–3)

**Goal:** Schema, migrations, and seed data.

#### Steps:
1. Install Prisma in `apps/api`: `npm install prisma @prisma/client`
2. `npx prisma init` — configure datasource to PostgreSQL
3. Write the full schema (from the schema above)
4. Run `npx prisma migrate dev --name init`
5. Create `prisma/seed.ts` — seed a test user and sample data
6. Create `PrismaModule` and `PrismaService` (NestJS global module)
   - Implement `onModuleInit` for connection, `onModuleDestroy` for cleanup
   - Use `enableShutdownHooks()`

✅ **Checkpoint:** `npx prisma studio` opens and shows all tables with seed data.

---

### Phase 3 — Authentication System (Days 3–5)

**Goal:** Full JWT auth with access/refresh tokens, guards, and decorators.

#### Steps:
1. **Install deps:** `@nestjs/passport`, `@nestjs/jwt`, `passport-jwt`, `passport-local`, `bcrypt`
2. **Create `AuthModule`:**
   - `AuthService` — register, login, refresh, logout
   - `AuthController` — POST `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`
   - Hash passwords with bcrypt (12 rounds)
   - Generate access token (15min) + refresh token (7 days)
   - Store refresh tokens in DB (enables revocation)
3. **Create strategies:**
   - `LocalStrategy` — validates email/password
   - `JwtStrategy` — validates JWT from Authorization header
4. **Create guards:**
   - `JwtAuthGuard` — global guard, protects all routes by default
   - `RolesGuard` — checks `@Roles('ADMIN')` decorator
5. **Create decorators:**
   - `@CurrentUser()` — extracts user from request
   - `@Public()` — marks routes that skip auth
   - `@Roles()` — specifies required roles
6. **Create DTOs** with `class-validator`:
   - `RegisterDto`, `LoginDto`, `RefreshTokenDto`
7. **Create `UsersModule`:**
   - `UsersService` — findByEmail, findById, create, update
   - `UsersController` — GET `/users/me`, PATCH `/users/me`

#### Enterprise Patterns to Apply:
- Use `@nestjs/config` with `ConfigService` — NO hardcoded values
- Use `ValidationPipe` globally with `whitelist: true, forbidNonWhitelisted: true`
- Use `class-transformer` `@Exclude()` on passwordHash in response
- Return consistent response shape: `{ data, message, statusCode }`

✅ **Checkpoint:** Can register, login, get access token, access protected route, refresh token, logout.

---

### Phase 4 — Core CRUD Modules (Days 5–9)

**Goal:** Notes, Snippets, Bookmarks, Folders, Tags — full CRUD with validation.

#### Build each module following this pattern:

```
For each module (Notes → Snippets → Bookmarks → Folders → Tags):
  1. Create DTOs (CreateDto, UpdateDto, QueryDto with pagination)
  2. Create Service (CRUD operations via Prisma, scoped to userId)
  3. Create Controller (RESTful endpoints with Swagger decorators)
  4. Register in module, import into AppModule
  5. Write unit tests for the service
```

#### API Endpoints to implement:

**Notes:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notes` | Create note |
| GET | `/notes` | List notes (paginated, filterable) |
| GET | `/notes/:id` | Get single note |
| PATCH | `/notes/:id` | Update note |
| DELETE | `/notes/:id` | Delete note |
| POST | `/notes/:id/tags` | Add tags to note |
| DELETE | `/notes/:id/tags/:tagId` | Remove tag |

**Same pattern for Snippets and Bookmarks.**

**Folders:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/folders` | Create folder |
| GET | `/folders` | List folders (tree structure) |
| PATCH | `/folders/:id` | Update folder |
| DELETE | `/folders/:id` | Delete folder |
| PATCH | `/folders/:id/move` | Move folder |

**Tags:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tags` | Create tag |
| GET | `/tags` | List user's tags |
| PATCH | `/tags/:id` | Update tag |
| DELETE | `/tags/:id` | Delete tag |

**Favorites:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/favorites` | Toggle favorite |
| GET | `/favorites` | List favorites |

#### Enterprise Patterns:
- **Pagination:** Implement cursor-based or offset pagination as a reusable pattern
- **Filtering:** Accept query params like `?tag=react&language=typescript&sort=createdAt:desc`
- **Ownership guard:** Every query must be scoped to `userId` — never expose other users' data
- **Soft delete (optional):** Add `deletedAt` field for recoverability
- **Swagger:** Decorate every endpoint with `@ApiTags`, `@ApiOperation`, `@ApiResponse`

✅ **Checkpoint:** All CRUD APIs work via Swagger UI at `http://localhost:3001/api`. Can create notes, snippets, bookmarks, organize in folders, add tags.

---

### Phase 5 — OpenSearch Integration (Days 9–12)

**Goal:** Full-text search with fuzzy matching, autocomplete, highlighting, and filters.

#### Steps:

1. **Install:** `@opensearch-project/opensearch`
2. **Create `OpenSearchModule`:**
   - `OpenSearchService` — connection, index management, CRUD operations
   - Create indices on app startup (idempotent — check if exists first)
   - Store index mappings in `src/opensearch/indices/` as JSON files

3. **Implement search features:**

   **a) Full-text search:**
   ```typescript
   // Multi-match across title, content, description, code
   {
     query: {
       bool: {
         must: [
           { multi_match: { query: searchTerm, fields: ["title^3", "content", "description", "code"] } }
         ],
         filter: [
           { term: { userId: currentUserId } }
         ]
       }
     }
   }
   ```

   **b) Fuzzy search:**
   ```typescript
   { multi_match: { query: searchTerm, fields: [...], fuzziness: "AUTO" } }
   ```

   **c) Autocomplete:**
   ```typescript
   { suggest: { title_suggest: { prefix: partialQuery, completion: { field: "title.suggest", fuzzy: { fuzziness: "AUTO" } } } } }
   ```

   **d) Highlighting:**
   ```typescript
   { highlight: { fields: { title: {}, content: {}, code: {} }, pre_tags: ["<mark>"], post_tags: ["</mark>"] } }
   ```

   **e) Filters:**
   - By content type (note/snippet/bookmark)
   - By tags
   - By language (snippets)
   - By date range
   - By folder

4. **Search API endpoints:**
   | Method | Endpoint | Description |
   |--------|----------|-------------|
   | GET | `/search` | Full search with filters |
   | GET | `/search/suggest` | Autocomplete suggestions |

✅ **Checkpoint:** Can search across all content types, see highlighted results, get autocomplete suggestions, use filters.

---

### Phase 6 — Background Indexing with BullMQ (Days 12–14)

**Goal:** Automatically sync PostgreSQL data to OpenSearch via job queues.

#### Steps:
1. **Install:** `@nestjs/bullmq`, `bullmq`
2. **Create `QueueModule`:**
   - Register `indexing` queue
3. **Create `IndexingProcessor`:**
   - Handles jobs: `index-note`, `index-snippet`, `index-bookmark`, `remove-document`
   - Each job indexes/updates/removes document in OpenSearch
4. **Emit jobs from services:**
   - In `NotesService.create()` → dispatch `index-note` job
   - In `NotesService.update()` → dispatch `index-note` job (re-index)
   - In `NotesService.delete()` → dispatch `remove-document` job
   - Same for Snippets and Bookmarks
5. **Create bulk re-index command:**
   - NestJS CLI command to re-index all data (useful for initial migration or recovery)
6. **Add job retry logic** — 3 retries with exponential backoff
7. **Optional:** Add a Bull Dashboard for monitoring at `/admin/queues`

#### Enterprise Pattern:
```typescript
// In NotesService
async create(dto: CreateNoteDto, userId: string) {
  const note = await this.prisma.note.create({ ... });

  // Dispatch async indexing job — don't block the response
  await this.indexingQueue.add('index-note', {
    id: note.id,
    type: 'note',
    action: 'upsert',
  }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  });

  return note;
}
```

✅ **Checkpoint:** Create a note → job appears in queue → document indexed in OpenSearch → searchable within seconds.

---

### Phase 7 — Redis Caching (Days 14–15)

**Goal:** Cache frequently accessed data for performance.

#### Steps:
1. **Install:** `@nestjs/cache-manager`, `cache-manager-redis-yet`
2. **Create `RedisModule`** with `CacheModule.register()`
3. **Apply caching to:**
   - `GET /notes/:id` — cache individual notes (TTL: 5 min)
   - `GET /tags` — cache user's tag list (TTL: 10 min)
   - `GET /folders` — cache folder tree (TTL: 10 min)
   - `GET /search/suggest` — cache autocomplete results (TTL: 2 min)
   - `GET /users/me` — cache user profile (TTL: 15 min)
4. **Cache invalidation:**
   - On note update/delete → invalidate note cache
   - On tag change → invalidate tag cache
   - Use `@CacheKey()` and `@CacheTTL()` decorators
5. **Use `CacheInterceptor`** for automatic GET caching on specific controllers

✅ **Checkpoint:** Second request to same endpoint returns in <5ms (from cache). Cache invalidates on update.

---

### Phase 8 — File Attachments (Days 15–16)

**Goal:** Upload images/PDFs/documents and attach to notes.

#### Steps:
1. **Install:** `@nestjs/platform-express`, `multer`
2. **Configure Multer** with file size limits (10MB), allowed MIME types
3. **Create `FilesModule`:**
   - Upload endpoint: `POST /files/upload`
   - Download endpoint: `GET /files/:id`
   - Delete endpoint: `DELETE /files/:id`
4. **Storage strategy:**
   - Dev: Local filesystem (`./uploads/`)
   - Docker: MinIO container (S3-compatible)
   - Abstract behind `StorageService` interface
5. **Attach files to notes:**
   - `POST /notes/:id/attachments` — attach uploaded file
   - `GET /notes/:id/attachments` — list attachments
6. **Security:** Validate file types, scan filenames, serve via signed URLs

✅ **Checkpoint:** Can upload a file, attach to a note, download it back.

---

### Phase 9 — Swagger & API Documentation (Day 16)

**Goal:** Professional API documentation.

#### Steps:
1. **Install:** `@nestjs/swagger`
2. **Configure in `main.ts`:**
   ```typescript
   const config = new DocumentBuilder()
     .setTitle('DevSearch API')
     .setDescription('Developer productivity hub API')
     .setVersion('1.0')
     .addBearerAuth()
     .build();
   ```
3. **Add decorators to every controller:**
   - `@ApiTags('Notes')`, `@ApiOperation()`, `@ApiResponse()`, `@ApiBearerAuth()`
4. **Add decorators to every DTO:**
   - `@ApiProperty()` with description, example, required
5. **Group endpoints logically** in Swagger UI

✅ **Checkpoint:** Swagger UI at `/api` is comprehensive, all endpoints documented with examples.

---

### Phase 10 — Next.js Frontend (Days 17–25)

**Goal:** Beautiful, responsive UI.

#### Sub-phases:

**10a. Foundation (Days 17–18)**
- Set up design system: CSS variables, typography, color palette
- Create reusable UI components: Button, Input, Modal, Card, Badge, Toast
- Set up API client (fetch wrapper with auth token injection)
- Set up Zustand for client state (auth, sidebar, theme)
- Set up auth context, protected routes middleware

**10b. Auth Pages (Day 19)**
- Login page with form validation
- Register page
- Token refresh logic in API client (interceptor pattern)
- Redirect to dashboard on login

**10c. Dashboard (Days 19–20)**
- Overview page: recent items, favorites, quick search
- Sidebar with folder tree navigation
- Stats cards (note count, snippet count, bookmark count)

**10d. Notes Module (Days 20–22)**
- Notes list view with filters
- Markdown editor (use `@uiw/react-md-editor` or `react-markdown` + `react-codemirror`)
- Note detail/preview page
- Create/Edit note form

**10e. Snippets Module (Days 22–23)**
- Snippets list with language badges
- Code editor with syntax highlighting (`react-codemirror` or `Monaco Editor`)
- Copy-to-clipboard button
- Create/Edit snippet form

**10f. Bookmarks Module (Day 23)**
- Bookmark list with favicons and type badges
- Quick-add bookmark form (paste URL → auto-fetch title)
- Bookmark detail view

**10g. Search Experience (Days 24–25)**
- Global search bar in header (Cmd+K shortcut)
- Search results page with highlighted matches
- Autocomplete dropdown
- Filter sidebar (type, tags, language, date)
- Recent searches and saved searches

**10h. Polish (Day 25)**
- Dark/Light theme toggle
- Loading skeletons
- Error boundaries
- Empty states
- Responsive mobile layout
- Toast notifications

---

### Phase 11 — Search History & Saved Searches (Day 25–26)

**Goal:** Track and save user searches.

1. Log every search query to `search_history` table
2. API: `GET /search/history` — recent searches
3. API: `POST /search/history/:id/save` — save a search
4. API: `GET /search/saved` — get saved searches
5. UI: Show recent searches in search dropdown, saved searches in sidebar

---

### Phase 12 — Testing (Days 26–28)

1. **Unit tests** — Services: auth, notes, search (Jest)
2. **Integration/E2E tests** — API endpoints (Supertest)
3. **Frontend E2E** — Critical flows with Playwright (login → create note → search → find it)

---

### Phase 13 — Docker Production Setup (Days 28–29)

1. Multi-stage Dockerfiles for API and Web (build → slim runtime)
2. `docker-compose.yml` for full stack
3. Health checks for all services
4. `.env.production` example
5. Update README with setup instructions

---

### Phase 14 — Documentation & README (Day 30)

1. Professional README with badges, screenshots, architecture diagram
2. `CONTRIBUTING.md`
3. `ARCHITECTURE.md` — document decisions
4. `DATABASE.md` — ERD diagram
5. `SEARCH.md` — OpenSearch design rationale

---

## Enterprise Standards Checklist

Apply these throughout, not as an afterthought:

### Code Quality
- [ ] TypeScript strict mode everywhere
- [ ] ESLint + Prettier configured (consistent formatting)
- [ ] No `any` types — define proper interfaces
- [ ] DTOs validated with `class-validator`
- [ ] All env vars accessed via `ConfigService`, never `process.env`

### Security
- [ ] Passwords hashed with bcrypt (12+ rounds)
- [ ] JWT access tokens short-lived (15 min)
- [ ] Refresh token rotation (new refresh token on each refresh)
- [ ] Rate limiting on auth endpoints (`@nestjs/throttler`)
- [ ] CORS properly configured
- [ ] Helmet middleware for security headers
- [ ] Input sanitization on all user inputs
- [ ] File upload validation (type, size)
- [ ] All DB queries scoped to `userId` — no cross-user data leaks

### API Design
- [ ] RESTful conventions (proper HTTP methods, status codes)
- [ ] Consistent response envelope: `{ data, message, statusCode, meta }`
- [ ] Pagination metadata: `{ total, page, limit, totalPages }`
- [ ] Proper error responses with error codes
- [ ] Swagger documentation on every endpoint

### Architecture
- [ ] NestJS module encapsulation — each feature is a self-contained module
- [ ] Dependency injection — no manual instantiation
- [ ] Configuration via `@nestjs/config` with validation (Joi or Zod)
- [ ] Global exception filter for consistent error handling
- [ ] Logging with structured logger (`@nestjs/common Logger` or Pino)
- [ ] Environment-based configuration (dev/staging/prod)

### Database
- [ ] Prisma migrations for every schema change
- [ ] Indexes on frequently queried columns
- [ ] Cascade deletes properly configured
- [ ] Seed data for development

### Git
- [ ] Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- [ ] Feature branches → PRs to `main`
- [ ] `.gitignore` includes node_modules, .env, dist, uploads
- [ ] No secrets committed (use `.env`)

---

## Open Questions

> [!IMPORTANT]
> **CSS Framework:** Do you want to use **Tailwind CSS** for the frontend, or vanilla CSS / CSS Modules? Tailwind will speed up UI development significantly.

> [!IMPORTANT]
> **Markdown Editor:** Preference between a lightweight editor (`react-md-editor`) vs. a full-featured one (`Tiptap` with markdown extensions)? Tiptap is more enterprise-grade but more complex.

> [!IMPORTANT]
> **Do you already have Docker Desktop installed on your Windows machine?** You'll need it from Day 1 for PostgreSQL, Redis, and OpenSearch.

> [!IMPORTANT]
> **Timeline:** The plan is scoped for ~30 days of focused work. Are you building this alongside your job, or is this a dedicated learning sprint? This affects how I size the phases.

---

## Resume Highlight Preview

When complete, your resume entry could read:

> **DevSearch** — *Developer Productivity Hub*
> Full-stack application for managing developer notes, code snippets, and bookmarks with enterprise-grade search.
> - Built with **Next.js 15**, **NestJS**, **PostgreSQL**, **Redis**, **OpenSearch**, and **Docker**
> - Implemented full-text search with fuzzy matching, autocomplete, and highlighted results using **OpenSearch**
> - Background indexing pipeline using **BullMQ** for real-time search updates
> - JWT authentication with access/refresh token rotation and role-based access control
> - Redis caching layer reducing API response times by 90%+ on cached routes
> - Dockerized full stack with Docker Compose for single-command deployment
