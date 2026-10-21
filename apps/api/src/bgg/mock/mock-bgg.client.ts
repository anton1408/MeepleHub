// Duplicated from packages/bgg-client until apps/web migrates to the API; then the package will be removed.

import type { BggClient, BggGame, BggSearchOptions, BggSearchResult } from '../types.js';
import { MOCK_GAMES } from './mock-data.js';

export type MockBggClientConfig = {
  latencyMs?: number;
  games?: Record<string, BggGame>;
};

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

export function createMockBggClient(config?: MockBggClientConfig): BggClient {
  return new MockBggClient(config);
}
