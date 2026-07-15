# DevSearch — API Documentation

## Base URL

```
http://localhost:3001
```

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require a Bearer token:

```
Authorization: Bearer <access_token>
```

## Response Format

Every API response follows this envelope:

```json
{
  "data": {},
  "message": "Success",
  "statusCode": 200
}
```

Paginated responses include metadata:

```json
{
  "data": [],
  "message": "Success",
  "statusCode": 200,
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

## Endpoints

Detailed API documentation is available via **Swagger UI** at:

```
http://localhost:3001/api
```

### Summary

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout` |
| Users | `GET /users/me`, `PATCH /users/me` |
| Notes | CRUD at `/notes`, plus `/notes/:id/tags`, `/notes/:id/attachments` |
| Snippets | CRUD at `/snippets` |
| Bookmarks | CRUD at `/bookmarks` |
| Folders | CRUD at `/folders`, `PATCH /folders/:id/move` |
| Tags | CRUD at `/tags` |
| Favorites | `POST /favorites`, `GET /favorites` |
| Search | `GET /search`, `GET /search/suggest` |
| Files | `POST /files/upload`, `GET /files/:id`, `DELETE /files/:id` |
