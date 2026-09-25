import type { BggClient, BggGame, BggSearchOptions, BggSearchResult } from './types';

/**
 * Configuration for the real BGG client.
 *
 * NOTE: The BGG XML API2 requires registering an application with BoardGameGeek,
 * and every request must send a `User-Agent` header matching the registered
 * client name. This is still being evaluated (see the roadmap), so the real
 * client is scaffolded but not yet wired into the app — the mock client is used
 * first.
 */
export type BggClientConfig = {
  /** Base URL of the BGG XML API2. */
  baseUrl?: string;
  /** User-Agent sent with every request; must match the name registered with BGG. */
  userAgent?: string;
  /** Fetch implementation, injectable for testing. Defaults to the global `fetch`. */
  fetch?: typeof fetch;
};

const DEFAULT_BASE_URL = 'https://boardgamegeek.com/xmlapi2';
const DEFAULT_USER_AGENT = 'MeepleHub/1.0';

/**
 * Real BGG client backed by the XML API2.
 *
 * The XML parsing and endpoint wiring are intentionally left unimplemented until
 * the BGG application registration is approved. See {@link BggClientConfig}.
 */
export class BggHttpClient implements BggClient {
  private readonly baseUrl: string;
  private readonly userAgent: string;
  private readonly fetchFn: typeof fetch;

  constructor(config: BggClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.userAgent = config.userAgent ?? DEFAULT_USER_AGENT;
    this.fetchFn = config.fetch ?? fetch;
  }

  async search(query: string, options?: BggSearchOptions): Promise<BggSearchResult[]> {
    const params = new URLSearchParams({ query });
    if (options?.type) params.set('type', options.type);
    await this.request(`/search?${params.toString()}`);
    throw new Error('BggHttpClient.search XML parsing is not implemented yet — use the mock client.');
  }

  async getGame(id: string): Promise<BggGame | null> {
    await this.request(`/thing?id=${encodeURIComponent(id)}&stats=1`);
    throw new Error('BggHttpClient.getGame XML parsing is not implemented yet — use the mock client.');
  }

  /** Issue a request to the API with the required `User-Agent` header. */
  protected request(path: string): Promise<Response> {
    return this.fetchFn(`${this.baseUrl}${path}`, {
      headers: { 'User-Agent': this.userAgent },
    });
  }
}

/** Create a real BGG client. */
export function createBggClient(config?: BggClientConfig): BggClient {
  return new BggHttpClient(config);
}
