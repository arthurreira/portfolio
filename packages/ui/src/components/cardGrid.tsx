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
} from "@arthurreira/ui/components/card";
import { cn } from "@arthurreira/ui/lib/utils"

import { cardSizes } from "../lib/cards"
const MotionCard = motion.create(Card);

export function CardGrid({ cards }: { cards: CardItem[] }) {
  const [openCard, setOpenCard] = useState<CardItem | null>(null);

  return (
    <>
      <div className=" grid grid-cols-2  lg:grid-cols-4 gap-2  grid-flow-dense auto-rows-[100px]">
        {cards.map((card, index) => (
          <MotionCard
            key={card.id}
            layoutId={`card-${card.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            layout
            onClick={() => setOpenCard(card)}
            className={cn(
              "cursor-pointer overflow-hidden rounded-br-3xl shadow-md",

              cardSizes[card.size].cols, cardSizes[card.size].rows
            )}
            style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${card.image})`, backgroundSize: "cover", backgroundPosition: "center", }}

          >
            <CardHeader className="flex  ">
              <div className="flex flex-row justify-between relative w-full items-center">
                <CardTitle className="text-white  font-extrabold">
                  <motion.span layoutId={`title-${card.id}`}>
                    {card.title}
                  </motion.span>
                </CardTitle>
               
              </div>
            </CardHeader>
            <CardContent className="">
              <CardDescription className="line-clamp-3 text-white ">
                {card.description}
              </CardDescription>
            </CardContent>
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

              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50" onClick={() => setOpenCard(null)}>
              <MotionCard
                layoutId={`card-${openCard.id}`}
                className={cn(
                  "cursor-pointer overflow-hidden rounded-br-3xl border shadow-lg w-full max-w-lg"
                
                )}
                style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${openCard.image})`, backgroundSize: "cover", backgroundPosition: "center", }}
              >
                <CardHeader className="flex items-center h-[60px]    ">
                  <div className="flex flex-row justify-between relative w-full items-center">
                    <CardTitle className="text-accent font-extrabold font-heading">
                      <motion.span >
                        {openCard.title}
                      </motion.span>
                    </CardTitle>
                  
                  </div>
                </CardHeader>
                <CardContent className="">
                  <CardDescription className="line-clamp-3 text-accent font-mono">
                    {openCard.description && <CardDescription className="line-clamp-3 text-accent font-mono">{openCard.description}</CardDescription>}
                  </CardDescription>
                </CardContent>
              </MotionCard>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}