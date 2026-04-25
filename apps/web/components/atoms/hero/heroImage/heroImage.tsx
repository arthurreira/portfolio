import Image from "next/image"
import { HeroImageProps } from "./heroImageProps"

export default function HeroImage({ src, alt }: HeroImageProps) {
  return (
    <div className="max-w-fit relative">
      <Image
        src={src}
        width={1240}
        height={1376}
        alt={alt}
        className="w-auto h-48 sm:h-64 md:h-80 lg:h-96 object-contain"
      />
    </div>
  )
}
