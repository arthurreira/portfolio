"use client";
import { useState } from "react";
import type { CardItem } from "../lib/cards";
import { motion, AnimatePresence } from "motion/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@arthurreira/ui/components/card";
import { Avatar, AvatarImage, AvatarFallback } from "@arthurreira/ui/components/avatar"
import { cn } from "@arthurreira/ui/lib/utils"

import { cardStyles } from "../lib/cards"
const MotionCard = motion.create(Card);

export function CardGrid({ cards }: { cards: CardItem[] }) {
  const [openCard, setOpenCard] = useState<CardItem | null>(null);

  return (
    <>
      <div className=" sm:p-6 lg:p-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2 ">
        {cards.map((card) => (
          <MotionCard
            key={card.id}
            layoutId={`card-${card.id}`}
            onClick={() => setOpenCard(card)}
            className={cn(
              "cursor-pointer overflow-hidden rounded-br-3xl border shadow transition-all",
              
              cardStyles[card.color]
            )}
          >
            <CardHeader className="flex  max-h-[100px] p-3">
              <div className="flex flex-row justify-between relative w-full items-center">
                <CardTitle className=" font-heading">
                  <motion.span layoutId={`title-${card.id}`}>
                    {card.title}
                  </motion.span>
                </CardTitle>
                <motion.div layoutId={`avatar-${card.id}`}>
                  <Avatar className="w-6 h-6 shadow-md">
                    <AvatarImage src={card.image} />
                    <AvatarFallback>{card.title?.[0]}</AvatarFallback>
                  </Avatar>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent className="">
              <CardDescription className="text-primary-foreground">
                {card.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              footer
            </CardFooter>
          </MotionCard>
        ))}
      </div>
      <AnimatePresence>
        {openCard && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenCard(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <MotionCard
              layoutId={`card-${openCard.id}`}
               className={cn(
                "fixed left-1/2 top-1/2 z-50 h-[400px] w-[600px]",
                "-translate-x-1/2 -translate-y-1/2",
                "overflow-hidden rounded-br-4xl border p-0 shadow-2xl",
                cardStyles[openCard.color]
              )}
            >
              <CardHeader className="flex items-center h-[60px]    ">
                <div className="flex flex-row justify-between relative w-full items-center">
                  <CardTitle className="">
                    <motion.span layoutId={`title-${openCard.id}`}>
                      {openCard.title}
                    </motion.span>
                  </CardTitle>
                  <motion.div layoutId={`avatar-${openCard.id}`}>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={openCard.image} />
                      <AvatarFallback>
                        {openCard.title?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent className="">
                <CardDescription>
                  {openCard.description && <CardDescription>{openCard.description}</CardDescription>}
                </CardDescription>
              </CardContent>
              <CardFooter className="h-[40px] ">
                footer
              </CardFooter>
            </MotionCard>
          </>
        )}
      </AnimatePresence>
    </>
  );
}