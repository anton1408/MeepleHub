'use client';

import { useId, useState, type KeyboardEvent } from 'react';
import { cn } from '../../temp/utils';
import { UiInput } from '../UiInput';
import { UiAutocompleteListStyle, UiAutocompleteOptionStyle } from './UiAutocomplete.style';

export type UiAutocompleteProps<TItem> = {
  value: string;
  onValueChange: (value: string) => void;
  items: TItem[];
  getKey: (item: TItem) => string;
  getLabel: (item: TItem) => string;
  onSelect: (item: TItem) => void;
  loading?: boolean;
  emptyText?: string;
  placeholder?: string;
  className?: string;
};

export function UiAutocomplete<TItem>({
  value,
  onValueChange,
  items,
  getKey,
  getLabel,
  onSelect,
  loading = false,
  emptyText = 'Нічого не знайдено',
  placeholder,
  className,
}: UiAutocompleteProps<TItem>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = useId(); // стабільний id для SSR (важливо в Next)

  const showList = open && value.trim().length > 0;

  function chooseItem(item: TItem) {
    onSelect(item);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!showList) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(items.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && items[activeIndex]) {
      e.preventDefault();
      chooseItem(items[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className={cn('relative', className)}>
      <UiInput
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onValueChange(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        onKeyDown={handleKeyDown}
      />

      {showList && (
        <ul id={listId} role="listbox" className={UiAutocompleteListStyle()}>
          {loading && <li className="text-muted-foreground px-2.5 py-1.5 text-sm">Завантаження…</li>}
          {!loading && items.length === 0 && (
            <li className="text-muted-foreground px-2.5 py-1.5 text-sm">{emptyText}</li>
          )}
          {!loading &&
            items.map((item, index) => (
              <li
                key={getKey(item)}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  chooseItem(item);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={UiAutocompleteOptionStyle({ active: index === activeIndex })}
              >
                {getLabel(item)}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
