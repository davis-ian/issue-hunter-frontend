# Frontend API Layer

This frontend uses a minimal three-layer API design:

1. HTTP client (`src/api/client.ts`)
2. Endpoint modules (`src/api/issues.ts`, `src/api/searches.ts`)
3. Composables (`src/composables/useIssues.ts`, `src/composables/useSearches.ts`)

## Why this structure

- Keeps components focused on rendering and interaction.
- Centralizes network behavior and error handling in one place.
- Adds extensibility for future endpoints without introducing heavy dependencies.

## Layer responsibilities

### 1) HTTP client

`request<T>()` in `src/api/client.ts` handles:

- Base URL (`VITE_API_BASE_URL` or same-origin proxy)
- Query parameter serialization
- JSON request body serialization
- JSON/text response parsing
- Error normalization into `ApiError` (including ASP.NET validation errors)

### 2) Endpoint modules (SDK)

Each module wraps one API surface with typed functions.

- `src/api/issues.ts`
  - `listIssues({ pageNumber, pageSize, search })`
- `src/api/searches.ts`
  - `listSearches()`
  - `getSearchById(id)`
  - `createSearch(payload)`
  - `updateSearch(id, payload)`

### 3) Composables

Composables expose UI-ready state:

- `src/composables/useApiState.ts`
  - shared `data`, `loading`, `error`, `run()` helper
- `src/composables/useIssues.ts`
  - paging/search state + fetch helpers
- `src/composables/useSearches.ts`
  - list/saving state + create/update orchestration
  - normalized validation errors for form fields

## Usage pattern in views

- Use composables from views (`IssuesView.vue`, `SearchesView.vue`)
- Do not call `fetch` directly in components
- Keep endpoint knowledge inside `src/api/*`

## Extending the API layer

For a new endpoint:

1. Add a typed function in `src/api/<area>.ts`.
2. If UI state is needed, add/update a composable.
3. Keep error parsing in `src/api/client.ts` (single source of truth).

This keeps growth predictable while preserving a lightweight dependency footprint.
