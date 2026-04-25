import { HeroTextProps } from "./heroTextProps"

export default function HeroText({
  heading,
  subtitle,
  descriptionFirst,
  descriptionSecond,
}: HeroTextProps) {
  return (
    <>
      <div className="mx-auto text-right lg:text-left max-w-3xl lg:max-w-none">
        <h1 className="relative font-semibold max-w-max pb-2 font-display text-3xl sm:text-4xl md:text-5xl text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-lg after:bg-foreground after:w-4">
          {heading}
        </h1>
      </div>

      <p className="font-display font-semibold text-2xl md:text-3xl text-foreground">
        {subtitle}
      </p>

      <div className="text-muted-foreground space-y-3 max-w-2xl lg:max-w-none">
        <p>{descriptionFirst}</p>
        <p>{descriptionSecond}</p>
      </div>
    </>
  )
}
