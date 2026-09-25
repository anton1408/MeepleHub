'use server';

import type { BggSearchResult } from '@meeplehub/api/bgg';
import { bgg } from '@/shared/api/bgg';

export async function searchGames(query: string): Promise<BggSearchResult[]> {
  const q = query.trim();
  if (!q) return [];
  return bgg.search(q, { type: 'boardgame' });
}
