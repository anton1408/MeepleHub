import { type ComponentProps } from 'react';
import { Slot } from 'radix-ui';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../temp/utils';
import { UiInputStyle } from './UiInput.style';

type UiInputProps = ComponentProps<'input'> &
  VariantProps<typeof UiInputStyle> & {
    asChild?: boolean;
  };

export function UiInput({
  className,
  type,
  'border-radius': borderRadius = 'default',
  asChild = false,
  ...props
}: UiInputProps) {
  const Comp = asChild ? Slot.Root : 'input';

  return (
    <Comp
      type={type}
      data-slot="input"
      data-border-radius={borderRadius}
      className={cn(UiInputStyle({ 'border-radius': borderRadius, className }))}
      {...props}
    />
  );
}
