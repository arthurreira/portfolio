import { HeroButtonProps, HeroCardProps, HeroImageProps, HeroStatProps, HeroTextProps } from "@/components/atoms"

export interface HeroProps {
	text: HeroTextProps
	buttons: HeroButtonProps[]
	stats: HeroStatProps[]
	image: HeroImageProps
	cards: HeroCardProps[]
}
