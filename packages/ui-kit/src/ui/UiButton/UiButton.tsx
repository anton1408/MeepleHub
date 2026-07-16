import { type ComponentProps } from "react"
import { Slot } from "radix-ui"
import { type VariantProps } from "class-variance-authority"
import { cn } from "../../temp/utils"
import { UiButtonStyle } from "./UiButton.style"

type UiButtonProps = ComponentProps<"button"> &
 VariantProps<typeof UiButtonStyle> & {
  asChild?: boolean
}

export function UiButton({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: UiButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
   <Comp
    data-slot="button"
    data-variant={variant}
    data-size={size}
    className={cn(UiButtonStyle({ variant, size, className }))}
    {...props}
   />
  )
}