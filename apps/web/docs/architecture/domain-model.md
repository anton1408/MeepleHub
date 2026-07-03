# Domain Model

## Game

Represents a board game, usually sourced from BGG.

Properties:

- `id`
- `bggId`
- `name`
- `yearPublished`
- `thumbnail`
- `image`
- `minPlayers`
- `maxPlayers`
- `playTime`
- `complexity`
- `mechanics`
- `categories`

Relationships:

- Has many `Play` records.
- Can appear in many user collections.

## CollectionItem

Represents a user's relationship with a game.

Properties:

- `id`
- `gameId`
- `status`
- `owned`
- `wishlist`
- `favorite`
- `rating`
- `purchaseDate`

Relationships:

- Belongs to one `Game`.
- Belongs to one user account when authentication exists.

## Play

Represents one game session.

Properties:

- `id`
- `gameId`
- `playedAt`
- `duration`
- `location`
- `notes`

Relationships:

- Belongs to one `Game`.
- Has many `PlayParticipant` records.

## PlayParticipant

Represents one player's result in a play session.

Properties:

- `id`
- `playId`
- `playerId`
- `score`
- `position`
- `isWinner`
- `color`
- `faction`

Relationships:

- Belongs to one `Play`.
- Belongs to one `Player`.

## Player

Represents a participant in local play history.

Properties:

- `id`
- `name`
- `avatar`

Relationships:

- Participates in many plays through `PlayParticipant`.

## Statistics

Statistics are generated from plays, participants, and collection items.

Examples:

- Total plays
- Total play time
- Most played games
- Win rate
- Average duration
- Favorite player
- Most active month
