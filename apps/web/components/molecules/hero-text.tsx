import { cn } from "@arthurreira/ui"

interface HeroTextProps {
  greeting: string
  firstName: string
  lastName: string
  subtitle: string
  className?: string
}

export function HeroText({
  greeting,
  firstName,
  lastName,
  subtitle,
  className,
}: HeroTextProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:gap-6", className)}>
      {/* h1 gets font-black leading-[0.92] tracking-[-0.045em] from @layer base */}
      <h1 className="text-[clamp(3rem,11.5vw,11.5rem)]">
        <span className="block text-foreground">{greeting}</span>
        <span className="block text-foreground">{firstName}</span>
        <span className="block text-primary">{lastName}</span>
      </h1>

      <p className="font-ui text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}
