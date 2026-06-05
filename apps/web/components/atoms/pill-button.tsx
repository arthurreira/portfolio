import { Button } from "@arthurreira/ui"

interface PillButtonProps extends React.ComponentProps<typeof Button> {
  active?: boolean
}

// Thin wrapper over the shadcn Button using the `pill` variant + size.
// Active state is driven by aria-pressed (handled in buttonVariants).
export function PillButton({ active, ...props }: PillButtonProps) {
  return (
    <Button
      type="button"
      variant="pill"
      size="pill"
      aria-pressed={active}
      {...props}
    />
  )
}
