import { useEffect, useState } from 'react';

export function useDebouncedValue<TValue>(value: TValue, delayMs: number): TValue {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
