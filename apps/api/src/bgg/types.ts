// Duplicated from packages/bgg-client until apps/web migrates to the API; then the package will be removed.

/** A single entry in a BGG search result. */
export type BggSearchResult = {
  id: string;
  name: string;
  yearPublished?: number;
};

/** A fully hydrated board game returned by BGG. */
export type BggGame = {
  id: string;
  name: string;
  description?: string;
  yearPublished?: number;
  image?: string;
  thumbnail?: string;
  minPlayers?: number;
  maxPlayers?: number;
  /** Playing time in minutes. */
  playingTime?: number;
  /** Average rating out of 10, when available. */
  averageRating?: number;
};

/** Options accepted by BggClient.search. */
export type BggSearchOptions = {
  /** Restrict results to a BGG item type, e.g. `boardgame`. */
  type?: 'boardgame' | 'boardgameexpansion';
};

/** Abstraction shared by the HTTP and mock BGG clients. */
export type BggClient = {
  search(query: string, options?: BggSearchOptions): Promise<BggSearchResult[]>;
  /** Resolves to `null` when BGG has no game with this id. */
  getGame(id: string): Promise<BggGame | null>;
};
