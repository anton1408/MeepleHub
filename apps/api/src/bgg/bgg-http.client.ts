// Duplicated from packages/bgg-client until apps/web migrates to the API; then the package will be removed.

import { XMLParser } from 'fast-xml-parser';
import type { BggClient, BggGame, BggSearchOptions, BggSearchResult } from './types.js';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  isArray: (name) => name === 'item' || name === 'name',
});

function toNum(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

export type BggClientConfig = {
  /** Bearer token for the BGG API; sent as `Authorization: Bearer <token>`. */
  apiToken?: string;
  /** Base URL of the BGG XML API2. */
  baseUrl?: string;
  /** User-Agent sent with every request. */
  userAgent?: string;
  /** Fetch implementation, injectable for testing. Defaults to global `fetch`. */
  fetch?: typeof fetch;
};

const DEFAULT_BASE_URL = 'https://boardgamegeek.com/xmlapi2';
const DEFAULT_USER_AGENT = 'MeepleHub/1.0';

export class BggHttpClient implements BggClient {
  private readonly apiToken?: string;
  private readonly baseUrl: string;
  private readonly userAgent: string;
  private readonly fetchFn: typeof fetch;

  constructor(config: BggClientConfig = {}) {
    this.apiToken = config.apiToken;
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.userAgent = config.userAgent ?? DEFAULT_USER_AGENT;
    this.fetchFn = config.fetch ?? fetch;
  }

  async search(query: string, options?: BggSearchOptions): Promise<BggSearchResult[]> {
    const params = new URLSearchParams({ query });
    if (options?.type) params.set('type', options.type);

    const res = await this.request(`/search?${params.toString()}`);
    if (!res.ok) throw new Error(`BGG search failed: ${res.status}`);

    const xml = await res.text();
    const parsed = parser.parse(xml);
    const items = parsed.items?.item ?? [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: type the raw BGG XML API2 response (see roadmap, Phase 5)
    const results: BggSearchResult[] = items.map((item: any) => ({
      id: String(item.id),
      name: item.name?.[0]?.value ?? '',
      yearPublished: toNum(item.yearpublished?.value),
    }));

    const seen = new Set<string>();
    return results.filter((result) => (seen.has(result.id) ? false : seen.add(result.id)));
  }

  async getGame(id: string): Promise<BggGame | null> {
    const res = await this.request(`/thing?id=${encodeURIComponent(id)}&stats=1`);
    if (!res.ok) throw new Error(`BGG getGame failed: ${res.status}`);

    const xml = await res.text();
    const parsed = parser.parse(xml);
    const item = parsed.items?.item?.[0];
    if (!item) return null;

    const names = item.name ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: type the raw BGG XML API2 response (see roadmap, Phase 5)
    const primary = names.find((name: any) => name.type === 'primary') ?? names[0];

    return {
      id: String(item.id),
      name: primary?.value ?? '',
      description: item.description || undefined,
      yearPublished: toNum(item.yearpublished?.value),
      image: item.image || undefined,
      thumbnail: item.thumbnail || undefined,
      minPlayers: toNum(item.minplayers?.value),
      maxPlayers: toNum(item.maxplayers?.value),
      playingTime: toNum(item.playingtime?.value),
      averageRating: toNum(item.statistics?.ratings?.average?.value),
    };
  }

  /** Sends a request with the configured User-Agent and optional bearer token. */
  protected request(path: string): Promise<Response> {
    const headers: Record<string, string> = { 'User-Agent': this.userAgent };

    if (this.apiToken) headers.Authorization = `Bearer ${this.apiToken}`;

    return this.fetchFn(`${this.baseUrl}${path}`, { headers });
  }
}

export function createBggClient(config?: BggClientConfig): BggClient {
  return new BggHttpClient(config);
}
