// ============================================================
// Shared TypeScript Types
// Used across both API (NestJS) and Frontend (Next.js)
// ============================================================

/** User roles for role-based access control */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

/** Bookmark content types */
export enum BookmarkType {
  ARTICLE = 'ARTICLE',
  DOCUMENTATION = 'DOCUMENTATION',
  GITHUB_REPO = 'GITHUB_REPO',
  VIDEO = 'VIDEO',
  STACKOVERFLOW = 'STACKOVERFLOW',
  OTHER = 'OTHER',
}

/** Content types for search filtering */
export enum ContentType {
  NOTE = 'NOTE',
  SNIPPET = 'SNIPPET',
  BOOKMARK = 'BOOKMARK',
}

// ---------- API Response Shapes ----------

/** Standard API response envelope — every API response follows this shape */
export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

/** Paginated response envelope */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

/** Pagination metadata */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------- Entity Shapes (API → Frontend) ----------

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
}

export interface NoteItem {
  id: string;
  title: string;
  excerpt: string | null;
  tags: TagItem[];
  folderId: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteDetail extends NoteItem {
  content: string;
  isPublic: boolean;
  attachments: AttachmentItem[];
}

export interface SnippetItem {
  id: string;
  title: string;
  description: string | null;
  language: string;
  tags: TagItem[];
  folderId: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SnippetDetail extends SnippetItem {
  code: string;
  isPublic: boolean;
}

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  description: string | null;
  type: BookmarkType;
  siteName: string | null;
  faviconUrl: string | null;
  tags: TagItem[];
  folderId: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TagItem {
  id: string;
  name: string;
  color: string | null;
}

export interface FolderItem {
  id: string;
  name: string;
  icon: string | null;
  parentId: string | null;
  children: FolderItem[];
}

export interface AttachmentItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

// ---------- Search Types ----------

export interface SearchResult {
  id: string;
  type: ContentType;
  title: string;
  highlight: Record<string, string[]>; // field → highlighted fragments
  score: number;
  createdAt: string;
}

export interface SearchSuggestion {
  text: string;
  type: ContentType;
}

export interface SearchFilters {
  type?: ContentType;
  tags?: string[];
  language?: string;
  folderId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ---------- Auth Types ----------

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}
