# IssueHunter Frontend

Vue 3 + Vite frontend for browsing ingested GitHub issues and managing search profiles.

## Stack

- Vue 3 + Vue Router + TypeScript
- Tailwind CSS (tokenized theme)
- shadcn-vue style primitives (`Button`, `Input`, `Badge`, `Card`)

## Local Setup

```sh
npm install
```

### Start frontend

```sh
npm run dev
```

By default, `/api/*` requests are proxied to `http://localhost:5015` (see `vite.config.ts`).

### Optional API base URL override

Create a local env file:

```sh
VITE_API_BASE_URL=http://localhost:5015
```

When set, the app sends requests directly to that host instead of relying on the Vite dev proxy.

## Useful scripts

```sh
npm run lint
npm run build
```

## Current UI surface

- `/issues`: paginated issue explorer with quick filtering
- `/searches`: search profile list + create/edit dialog

## API assumptions

- `GET /api/issues` returns `{ total, results }`
- Search profile APIs: `GET /api/searches`, `POST /api/searches`, `PUT /api/searches/{id}`
- No delete endpoint yet; UI currently supports create + update only

## API architecture

- `src/api/client.ts`: shared HTTP request + normalized API errors
- `src/api/issues.ts` and `src/api/searches.ts`: endpoint-level SDK functions
- `src/composables/useIssues.ts` and `src/composables/useSearches.ts`: view-facing data/state hooks

For details, see `docs/frontend-api.md`.
