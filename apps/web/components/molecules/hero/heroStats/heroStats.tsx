
import { HeroStatsProps } from "./heroStatsProps";
import HeroStat from "@/components/atoms/hero/heroStat";


export default function HeroStats({ stats }: HeroStatsProps) {
    return (
         <div className="grid grid-cols-3 w-full gap-2">
            {stats.map((stat, index) => (
                <HeroStat key={index} {...stat} />
            ))}
        </div>
    );
}