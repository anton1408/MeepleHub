# Information Architecture

## Purpose

How the MeepleHub web app organizes its content, routes, and product areas.

## Areas

**Public** — help visitors discover games before connecting personal data.

**Personal** — a user's own collection, plays, players, and statistics.

Public discovery routes are kept separate from personal routes.

## Route Map

```txt
# Public
/                     Home
/games                Games catalog
/games/[gameId]       Game details

# Personal
/dashboard            Activity overview
/collection           Owned games
/plays                Play sessions
/plays/[playId]       Play details
/players              Players
/players/[playerId]   Player details
/statistics           Stats & charts
/wishlist             Wanted games
/settings             App settings
```

> Auth routes (`/login`, `/register`) are not yet defined — see Notes.

## Pages

Each page lists its purpose and the key sections/features it holds.

### Home (`/`)

Introduce the product, help discover games, and encourage sign-up.

- Hero
- Trending Games (Top 10)
- Top Rated Games (Top 10)
- Board Game Categories
- Featured Artist
- Featured Designer
- Call To Action

### Games (`/games`)

Browse and discover the full game catalog.

- Search
- Filters
- Sorting
- Categories

### Game Details (`/games/[gameId]`)

Complete information about a single game.

- General Information
- BGG Details
- Personal Statistics
- Play History
- Collection Status
- Actions: Add to Collection, Add to Wishlist, Log Play

### Dashboard (`/dashboard`)

Personal overview of user activity.

- Quick Actions
- Collection Summary
- Recent Plays
- Most Played Games
- Monthly Statistics

### Collection (`/collection`)

Manage owned games.

- Search, Filters, Sorting
- Favorite, Remove
- Import from BGG

### Plays (`/plays`)

Manage play sessions.

- Add, Edit, Delete Play
- Filter, Search

### Play Details (`/plays/[playId]`)

View a single play session.

- Game, Date, Location
- Players & Scores
- Winner, Duration

### Players (`/players`)

List of players the user tracks.

- Add, Edit Player
- Win Rate, Games Played, Favorite Games

### Player Details (`/players/[playerId]`)

Stats for a single player.

- Win Rate
- Play History
- Favorite Games

### Statistics (`/statistics`)

Visualize user activity.

- Overall, Games, Players
- Timeline, Charts

### Wishlist (`/wishlist`)

Manage games the user wants to buy.

### Settings (`/settings`)

Configure the application.

- BGG Import
- Theme, Language
- Profile

## Notes

- Keep route names domain-focused and stable.
- Prefer feature folders for product logic and `app/` folders for routing.
- Keep public discovery routes separate from personal dashboard routes.
- **TODO:** decide on auth flow and add `/login` / `/register` routes.
