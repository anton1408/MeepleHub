import type { BggClient, BggGame, BggSearchOptions, BggSearchResult } from './types';
import { XMLParser } from 'fast-xml-parser';

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
  /** Bearer token for the BGG API; sent as `Authorization: Bearer <token>`. Server-side only. */
  apiToken?: string;
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

    const results: BggSearchResult[] = items.map((item: any) => ({
      id: String(item.id),
      name: item.name?.[0]?.value ?? '',
      yearPublished: toNum(item.yearpublished?.value),
    }));

    const seen = new Set<string>();

    return results.filter((r) => (seen.has(r.id) ? false : seen.add(r.id)));
  }

  async getGame(id: string): Promise<BggGame | null> {
    const res = await this.request(`/thing?id=${encodeURIComponent(id)}&stats=1`);
    console.log('res', res);
    if (!res.ok) throw new Error(`BGG getGame failed: ${res.status}`);

    const xml = await res.text();
    const parsed = parser.parse(xml);

    const item = parsed.items?.item?.[0];
    if (!item) return null;

    // кілька <name>; беремо той, де type="primary"
    const names = item.name ?? [];
    const primary = names.find((n: any) => n.type === 'primary') ?? names[0];

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

  /** Issue a request to the API with the required `User-Agent` header. */
  protected request(path: string): Promise<Response> {
    const headers: Record<string, string> = { 'User-Agent': this.userAgent };

    if (this.apiToken) headers.Authorization = `Bearer ${this.apiToken}`;

    return this.fetchFn(`${this.baseUrl}${path}`, { headers });
  }
}

/** Create a real BGG client. */
export function createBggClient(config?: BggClientConfig): BggClient {
  return new BggHttpClient(config);
}
