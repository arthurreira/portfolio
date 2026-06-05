import { Button } from "@arthurreira/ui"

interface PillButtonProps extends React.ComponentProps<typeof Button> {
  active?: boolean
}

// Thin wrapper over the shadcn Button.
// Active → variant="default" (solid primary), inactive → variant="pill" (transparent).
// aria-pressed kept for accessibility (screen readers announce toggle state).
export function PillButton({ active, ...props }: PillButtonProps) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "pill"}
      size="pill"
      aria-pressed={active}
      {...props}
    />
  )
}
