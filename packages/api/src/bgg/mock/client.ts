import type { BggClient, BggGame, BggSearchOptions, BggSearchResult } from '../types';
import { MOCK_GAMES } from './data';

/** Options for the mock BGG client. */
export type MockBggClientConfig = {
  /** Artificial latency in milliseconds, to mimic network round-trips. Defaults to 0. */
  latencyMs?: number;
  /** Override the fixture games. Defaults to {@link MOCK_GAMES}. */
  games?: Record<string, BggGame>;
};

/**
 * In-memory BGG client backed by static fixtures.
 *
 * This is the implementation used first during development, before the real
 * BGG XML API2 client is available. It fulfils the same {@link BggClient}
 * contract so call sites never change when the real client is swapped in.
 */
export class MockBggClient implements BggClient {
  private readonly latencyMs: number;
  private readonly games: Record<string, BggGame>;

  constructor(config: MockBggClientConfig = {}) {
    this.latencyMs = config.latencyMs ?? 0;
    this.games = config.games ?? MOCK_GAMES;
  }

  async search(query: string, options?: BggSearchOptions): Promise<BggSearchResult[]> {
    await this.delay();
    const needle = query.trim().toLowerCase();
    if (!needle) return [];

    // The fixtures are all base games, so a request for expansions matches nothing.
    if (options?.type === 'boardgameexpansion') return [];

    return Object.values(this.games)
      .filter((game) => game.name.toLowerCase().includes(needle))
      .map((game) => ({
        id: game.id,
        name: game.name,
        yearPublished: game.yearPublished,
      }));
  }

  async getGame(id: string): Promise<BggGame | null> {
    await this.delay();
    return this.games[id] ?? null;
  }

  private delay(): Promise<void> {
    if (this.latencyMs <= 0) return Promise.resolve();
    return new Promise((resolve) => setTimeout(resolve, this.latencyMs));
  }
}

/** Create a mock BGG client. */
export function createMockBggClient(config?: MockBggClientConfig): BggClient {
  return new MockBggClient(config);
}
