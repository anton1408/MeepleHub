# Roadmap

## Phase 1 - Foundation

- [x] Initialize monorepo
- [x] Configure Turborepo
- [x] Configure ESLint
- [x] Configure Prettier
- [x] Create Next.js web app
- [x] Create UI package scaffold
- [ ] Replace starter UI components with product primitives
- [x] Set up Storybook for the UI kit
- [x] Set up CI (GitHub Actions)

## Phase 2 - Web UI

- [ ] App shell
- [x] Header
- [ ] Sidebar
- [ ] Navigation
- [x] UiButton
- [x] UiCard
- [ ] Dialog
- [ ] Table

## Phase 3 - Public Area

- [ ] Home
- [x] Search (header autocomplete via UiAutocomplete + BGG client; routing to Game Details wired)
- [ ] Game Details
- [ ] Trending Games
- [ ] Top Rated Games

## Phase 4 - Personal Area

- [ ] Dashboard
- [ ] Collection
- [ ] Plays
- [ ] Players
- [ ] Statistics
- [ ] Wishlist

## Phase 5 - Data

- [ ] Define API boundaries
- [x] Set up TanStack Query
- [x] Define the BGG client abstraction (mock and real implementations)
- [x] Implement the mock BGG client (used first)
- [x] BGG integration (real client) — XML API2 parsing + bearer-token auth, switchable via `BGG_USE_MOCK`
- [ ] Collection import
- [ ] Play sync
- [ ] Replace mock data with real data loading

> **BGG API (integrated):** the real BGG XML API2 client is wired in and working.
> Every request sends `User-Agent: MeepleHub/1.0` (matching the registered app) and,
> when configured, an `Authorization: Bearer <token>` header. The token lives in
> `BGG_API_TOKEN` (server-only, git-ignored). The client is switchable: set
> `BGG_USE_MOCK=1` to run on fixtures instead of the live API.
>
> See [bgg-integration.md](./bgg-integration.md) for the full integration, auth, and
> security notes.

## Phase 6 - Mobile

- [ ] Define shared domain and API packages
- [ ] Decide React Native / Expo setup
- [ ] Keep mobile UI separate from web UI
