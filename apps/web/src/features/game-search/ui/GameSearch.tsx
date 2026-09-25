'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UiAutocomplete } from '@meeplehub/ui-kit/ui/UiAutocomplete';
import type { BggSearchResult } from '@meeplehub/api/bgg';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import { searchGames } from '../api/searchGames';

type GameSearchProps = {
  className?: string;
};

export function GameSearch({ className }: GameSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BggSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 250);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    searchGames(q)
      .then((items) => {
        if (!cancelled) setResults(items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <UiAutocomplete<BggSearchResult>
      className={className}
      value={query}
      onValueChange={setQuery}
      items={results}
      loading={loading}
      getKey={(game) => game.id}
      getLabel={(game) => game.name}
      onSelect={(game) => router.push(`/game/${game.id}`)}
      placeholder="Search games..."
    />
  );
}
