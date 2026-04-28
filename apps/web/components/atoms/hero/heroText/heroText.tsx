import { HeroTextProps } from "./heroTextProps"

export default function HeroText({
  heading,
  subtitle,
  descriptionFirst,
  descriptionSecond,
}: HeroTextProps) {
  return (
      <div className="space-y-4">

            <h1 className="relative font-semibold max-w-max justify-center pb-2 font-display text-3xl sm:text-4xl md:text-5xl text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-lg after:bg-foreground after:w-4">
                {heading}
            </h1>
            <p className="font-display font-semibold  text-foreground">
                {subtitle}
            </p>
            <div className="text-muted-foreground space-y-3">
                <p>{descriptionFirst}</p>
                <p>{descriptionSecond}</p>
            </div>

    </div>
  )
}
