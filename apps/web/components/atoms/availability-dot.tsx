import { cn } from "@arthurreira/ui"

interface AvailabilityDotProps {
  label?: string
  className?: string
}

export function AvailabilityDot({
  label = "Currently Available",
  className,
}: AvailabilityDotProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="size-2 rounded-full bg-primary animate-pulse shrink-0" />
      <span className="font-ui text-sm text-foreground">{label}</span>
    </div>
  )
}
