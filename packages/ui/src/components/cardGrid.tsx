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

export function CardGrid({ cards, linkLabel = "View" }: { cards: CardItem[], linkLabel?: string }) {
  const [openCard, setOpenCard] = useState<CardItem | null>(null);


  return (
    <>
      <div className=" grid grid-cols-2  lg:grid-cols-4 gap-2  grid-flow-dense auto-rows-[minmax(100px,auto)]
">
        {cards.map((card, index) => (
          <MotionCard
            key={card.id}
            layoutId={`card-${card.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            layout
            onClick={() => setOpenCard(card)}
            
            className={cn(
              "cursor-pointer overflow-hidden rounded-br-3xl shadow-md bg-muted",
              
              cardSizes[card.size].cols, cardSizes[card.size].rows
            )}
             style={card.image ? { backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${card.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}

          >
            <CardHeader className="flex  ">
              <div className="flex flex-row justify-between relative w-full items-center">
                <CardTitle className="text-card-foreground font-extrabold">
                  <motion.span layoutId={`title-${card.id}`}>
                    {card.title}
                  </motion.span>
                </CardTitle>
               
              </div>
            </CardHeader>
            <CardContent className="">
              <CardDescription className="line-clamp-3 text-card-foreground/80">
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
              className="fixed inset-0  backdrop-blur-sm z-40"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50" onClick={() => setOpenCard(null)}>
              <MotionCard
                layoutId={`card-${openCard.id}`}
                onClick={(e) => e.stopPropagation()}

                className={cn(
                  "cursor-pointer overflow-hidden rounded-br-3xl border shadow-lg w-full max-w-lg bg-muted",
                  
                )}
                
                style={openCard.image ? { backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${openCard.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                
              >
                <CardHeader className="h-[60px]">
                  <div className="flex flex-row justify-between relative w-full items-center">
                 <CardTitle className="text-card-foreground font-extrabold font-heading">
                      <motion.span >
                        {openCard.title}
                      </motion.span>
                    </CardTitle>

                     {openCard.url && (
                          <a href={openCard.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-card-foreground/70 hover:text-card-foreground hover:underline text-sm transition-colors"
                        >
                          {linkLabel}
                        </a>
                      )}
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  {openCard.description && (
                    <CardDescription className="line-clamp-3 text-card-foreground/80 font-mono">
                      {openCard.description}
                    </CardDescription>
                  )}
                </CardContent>
              </MotionCard>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}