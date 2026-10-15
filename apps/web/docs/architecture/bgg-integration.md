# BGG Integration

> How MeepleHub talks to BoardGameGeek. Describes the client abstraction, the
> mock/real switch, authentication, and the security model for the API token.

## Overview

All board game data comes from the **BGG XML API2** (`https://boardgamegeek.com/xmlapi2`).
The app never depends on BGG's wire format directly — it talks to a small client
abstraction (`BggClient`) that returns MeepleHub's own domain types
(`BggSearchResult`, `BggGame`). Two implementations fulfil that contract:

| Implementation  | Factory               | Source                                  | Use                                    |
| --------------- | --------------------- | --------------------------------------- | -------------------------------------- |
| Mock            | `createMockBggClient` | `packages/bgg-client/src/bgg/mock/`     | Local dev / offline / tests (fixtures) |
| Real (XML API2) | `createBggClient`     | `packages/bgg-client/src/bgg/client.ts` | Live data from BoardGameGeek           |

Because both satisfy the same `BggClient` interface, call sites never change when
switching between them.

## Wiring

The single composition point is `apps/web/src/shared/api/bgg.ts`. It is marked
`import 'server-only'`, so the module (and the API token it reads) can never be
imported into a client component — the build fails if it is.

```ts
import 'server-only';
import { createMockBggClient, createBggClient, type BggClient } from '@meeplehub/bgg-client/bgg';

const useMock = process.env.BGG_USE_MOCK === '1';

export const bgg: BggClient = useMock
  ? createMockBggClient({ latencyMs: 200 })
  : createBggClient({
      userAgent: 'MeepleHub/1.0',
      apiToken: process.env.BGG_API_TOKEN,
    });
```

Consumers (e.g. the `searchGames` server action, the `/game/[id]` RSC) import
`bgg` and call `bgg.search()` / `bgg.getGame()` without knowing which backend is
active.

## Real client

`BggHttpClient` (`packages/bgg-client/src/bgg/client.ts`) fetches XML and parses it with
[`fast-xml-parser`](https://github.com/NaturalIntelligence/fast-xml-parser) into
the domain types.

- **Endpoints:** `GET /search?query=…&type=boardgame`, `GET /thing?id=…&stats=1`.
- **Parsing notes** (BGG XML quirks handled in the mapper):
  - Most values live in attributes (`<yearpublished value="1995"/>`), not text nodes.
  - `<item>` and `<name>` are forced to arrays (`isArray`) to avoid the
    "single element becomes an object" trap.
  - The primary title is the `<name type="primary">` entry.
  - Numbers are coerced manually (`id` deliberately stays a string).
  - Search results are de-duplicated by id.
- `getGame` returns `null` when BGG reports no item, which drives the `/game/[id]`
  `notFound()` → `not-found.tsx` path.

## Authentication

Requests are sent with two headers:

- `User-Agent: MeepleHub/1.0` — must match the application name registered with BGG.
- `Authorization: Bearer <token>` — added only when `apiToken` is set.

The token comes from the `BGG_API_TOKEN` env var, created in the BGG application
settings. It is **server-side only**:

- Stored in `apps/web/.env.local` (git-ignored; never committed).
- **No `NEXT_PUBLIC_` prefix** — that prefix would inline the value into the client
  bundle and expose it in the browser. Without it the var stays on the server.
- Read only inside the `server-only` module above.
- Never logged. Error messages carry the HTTP status only (e.g.
  `BGG search failed: 401`), never the token or headers.

For deployment, set `BGG_API_TOKEN` in the hosting provider's environment settings,
not in the repository.

## Configuration reference

Environment variables (documented in `apps/web/.env.example`):

| Variable        | Values              | Effect                                                    |
| --------------- | ------------------- | --------------------------------------------------------- |
| `BGG_USE_MOCK`  | `1` / anything else | `1` → mock client; otherwise → real client.               |
| `BGG_API_TOKEN` | string / empty      | Bearer token for the real client. Empty → no auth header. |

> Env vars are read at server start — restart `next dev` after changing `.env.local`.

## Troubleshooting

- **`BGG search failed: 401` (app shows 500):** the real client surfaced an upstream 401. Check the token in `.env.local`; if every request is rejected regardless of
  token/User-Agent, the BGG API is likely blocking the current network/IP
  (anti-bot / geo) — verify with `curl -A "MeepleHub/1.0" -H "Authorization: Bearer <token>" "https://boardgamegeek.com/xmlapi2/search?query=catan"`,
  try another network/VPN, or fall back to the mock with `BGG_USE_MOCK=1`.
- **Need offline/stable data:** set `BGG_USE_MOCK=1` to run entirely on fixtures.
