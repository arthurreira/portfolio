import { HeroButtonsProps } from "./heroButtonsProps"
import HeroButton from "@/components/atoms/hero/heroButton"


export default function HeroButtons({ buttons }: HeroButtonsProps) {
  return (
    <div className="flex justify-start gap-4">
      {buttons.map((button, index) => (
        <HeroButton key={index} {...button} />
      ))}
    </div>
  )
}