'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { UiAutocomplete } from '@meeplehub/ui-kit/ui/UiAutocomplete';
import type { BggSearchResult } from '@meeplehub/bgg-client/bgg';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import { searchGames } from '../api/searchGames';

type GameSearchProps = {
  className?: string;
};

export function GameSearch({ className }: GameSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 250);
  const trimmedDebouncedQuery = debouncedQuery.trim();

  const { data: results = [], isFetching } = useQuery({
    queryKey: ['games', 'search', trimmedDebouncedQuery],
    queryFn: () => searchGames(trimmedDebouncedQuery),
    enabled: trimmedDebouncedQuery.length > 0,
    staleTime: 24 * 60 * 60 * 1000, // fresh for 1 day (cache)
  });

  return (
    <UiAutocomplete<BggSearchResult>
      className={className}
      value={query}
      onValueChange={setQuery}
      items={results}
      loading={isFetching}
      getKey={(game) => game.id}
      getLabel={(game) => game.name}
      onSelect={(game) => router.push(`/game/${game.id}`)}
      placeholder="Search games..."
    />
  );
}
