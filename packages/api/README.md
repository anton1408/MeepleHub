# @meeplehub/api

Data-access layer for MeepleHub. It exposes a **BoardGameGeek (BGG) client abstraction** with two interchangeable implementations behind a single `BggClient` interface:

- **Mock client** (`MockBggClient`) — in-memory, backed by static fixtures. Used first during development so the app can be built without a live BGG integration.
- **Real client** (`BggHttpClient`) — talks to the [BGG XML API2](https://boardgamegeek.com/wiki/page/BGG_XML_API2). Scaffolded but not fully implemented yet (see the roadmap); it already sends the required `User-Agent` header.

Call sites depend only on the `BggClient` interface, so the real client can be swapped in without changing consumers.

## Data — BGG ranks dump

Some seed/mock data comes from BoardGameGeek's daily **board game ranks** data dump. This file is **not committed** to the repository — it is large (~11 MB, ~180k rows) and updated daily — so each developer downloads it locally.

**1. Download the dump.** Grab `boardgames_ranks.csv` from BGG (you must be logged into a BGG account):

<https://boardgamegeek.com/data_dumps/bg_ranks>

**2. Place it here:**

```
packages/api/data/boardgames_ranks.csv
```

The `data/` directory is kept in the tree via `.gitkeep`, and `*.csv` inside it is gitignored — so the dump will never be accidentally committed.

The CSV columns are:

```
id, name, yearpublished, rank, bayesaverage, average, usersrated, is_expansion,
abstracts_rank, cgs_rank, childrensgames_rank, familygames_rank, partygames_rank,
strategygames_rank, thematic_rank, wargames_rank
```

## Scripts

- `pnpm lint`: Run code style linting.
- `pnpm check-types`: Run TypeScript type checking.

## Structure

- `src/bgg/types.ts`: Domain types and the `BggClient` interface.
- `src/bgg/client.ts`: Real BGG XML API2 client (`BggHttpClient`).
- `src/bgg/mock/`: Mock client (`MockBggClient`) and its fixtures.
- `src/bgg/index.ts` / `src/index.ts`: Package entry points.
- `data/`: Local, gitignored location for the BGG ranks dump (see above).
