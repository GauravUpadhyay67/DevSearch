// ============================================================
// Shared Constants
// Used across both API (NestJS) and Frontend (Next.js)
// ============================================================

/** Pagination defaults */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/** Supported programming languages for code snippets */
export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'cpp',
  'go',
  'rust',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'dart',
  'sql',
  'html',
  'css',
  'scss',
  'json',
  'yaml',
  'xml',
  'markdown',
  'bash',
  'powershell',
  'dockerfile',
  'graphql',
  'prisma',
  'other',
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** File upload constraints */
export const FILE_UPLOAD = {
  MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

/** Search constants */
export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 200,
  MAX_SUGGESTIONS: 8,
  DEFAULT_RESULTS_SIZE: 20,
  HISTORY_LIMIT: 50,
} as const;

/** OpenSearch index names */
export const OPENSEARCH_INDICES = {
  NOTES: 'devsearch-notes',
  SNIPPETS: 'devsearch-snippets',
  BOOKMARKS: 'devsearch-bookmarks',
} as const;

/** Redis cache key prefixes and TTLs (seconds) */
export const CACHE = {
  PREFIXES: {
    USER: 'user:',
    NOTE: 'note:',
    TAGS: 'tags:',
    FOLDERS: 'folders:',
    SEARCH_SUGGEST: 'suggest:',
  },
  TTL: {
    USER_PROFILE: 900,      // 15 minutes
    NOTE_DETAIL: 300,        // 5 minutes
    TAG_LIST: 600,           // 10 minutes
    FOLDER_TREE: 600,        // 10 minutes
    SEARCH_SUGGEST: 120,     // 2 minutes
  },
} as const;

/** BullMQ queue names */
export const QUEUES = {
  INDEXING: 'indexing',
} as const;
