import { cva } from 'class-variance-authority';

export const UiAutocompleteListStyle = cva(
  'bg-popover text-popover-foreground absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-lg border p-1 shadow-md',
);

export const UiAutocompleteOptionStyle = cva(
  'flex cursor-pointer items-center rounded-md px-2.5 py-1.5 text-sm outline-none',
  {
    variants: {
      active: { true: 'bg-accent text-accent-foreground', false: '' },
    },
    defaultVariants: { active: false },
  },
);
