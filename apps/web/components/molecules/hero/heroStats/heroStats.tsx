"use client"
import { useEffect, useState } from "react";
import { HeroStatsProps } from "./heroStatsProps";
import { HeroStat } from "@/components/atoms/hero";

export default function HeroStats({ stats }: HeroStatsProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useEffect(() => {
        const cycle = () => {
            const delay = Math.random() * 3000 + 1000;
            setTimeout(() => {
                const next = Math.floor(Math.random() * stats.length);
                setActiveIndex(next);
                setTimeout(() => {
                    setActiveIndex(null);
                    cycle();
                }, 2500);
            }, delay);
        };
        cycle();
    }, []);

    return (
        <div className="grid grid-cols-3 w-fit  gap-2 ">
            {stats.map((stat, index) => (
                <HeroStat key={index} {...stat} visible={activeIndex === index} />
            ))}
        </div>
    );
}