/**
 * Domain types for the BoardGameGeek (BGG) integration.
 *
 * These are the shapes MeepleHub works with internally — deliberately decoupled
 * from the raw BGG XML API2 payloads, so the rest of the app never depends on
 * BGG's wire format. Both the real and the mock client return these types.
 */

/** A single entry in a search result list. */
export type BggSearchResult = {
  id: string;
  name: string;
  /** Publication year, when BGG reports one. */
  yearPublished?: number;
};

/** A fully hydrated board game. */
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

/** Options accepted by {@link BggClient.search}. */
export type BggSearchOptions = {
  /** Restrict results to a BGG item type, e.g. `boardgame`. */
  type?: 'boardgame' | 'boardgameexpansion';
};

/**
 * The BGG client abstraction.
 *
 * The app depends only on this interface. During early development it is backed
 * by the mock implementation; the real XML API2 client is swapped in later
 * without touching call sites.
 */
export type BggClient = {
  /** Search games by name. */
  search(query: string, options?: BggSearchOptions): Promise<BggSearchResult[]>;
  /** Fetch a single game by its BGG id. Resolves to `null` when not found. */
  getGame(id: string): Promise<BggGame | null>;
};
