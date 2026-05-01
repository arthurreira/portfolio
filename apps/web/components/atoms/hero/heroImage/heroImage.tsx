import Image from "next/image"
import { cn } from "@arthurreira/ui/lib/utils"
import { HeroImageProps } from "./heroImageProps"

export function HeroImage({ src, alt, className }: HeroImageProps & { className?: string }) {
  return (
    <div data-slot="hero-image" className={cn("max-w-fit relative", className)}>
      <Image
        src={src}
        width={1240}
        height={1376}
        alt={alt}
        className="max-w-fit h-48 sm:h-64 md:h-80 lg:h-96 object-contain"
      />
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
    </div>
  )
}
