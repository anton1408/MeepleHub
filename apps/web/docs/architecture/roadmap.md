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
- [~] Search (header autocomplete via UiAutocomplete + mock BGG; routing to Game Details wired)
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
- [ ] Set up TanStack Query
- [x] Define the BGG client abstraction (mock and real implementations)
- [x] Implement the mock BGG client (used first)
- [ ] BGG integration (real client)
- [ ] Collection import
- [ ] Play sync
- [ ] Replace mock data with real data loading

> **BGG API (approved):** using the BGG XML API2 requires registering an
> application with BoardGameGeek. Registration is approved; the app still runs on
> the mock client for now, with the real client to be wired in next.
>
> **Reminder:** once integrated, every request must send a `User-Agent` header that matches
> the client name registered with BGG:
>
> ```ts
> fetch(url, { headers: { 'User-Agent': 'MeepleHub/1.0' } });
> ```

## Phase 6 - Mobile

- [ ] Define shared domain and API packages
- [ ] Decide React Native / Expo setup
- [ ] Keep mobile UI separate from web UI
