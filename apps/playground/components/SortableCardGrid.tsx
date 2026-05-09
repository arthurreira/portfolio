"use client"
import { DragDropProvider } from '@dnd-kit/react';
import { useState } from "react";
import { CardItem } from "@arthurreira/ui/lib/cards";
import { useSortable } from '@dnd-kit/react/sortable'
import { move } from "@dnd-kit/helpers"
import { motion} from "motion/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@arthurreira/ui/components/card";
import { cn } from "@arthurreira/ui/lib/utils"
import { cardSizes } from "@arthurreira/ui/lib/cards"

import { Badge } from "@arthurreira/ui/components/badge";
const MotionCard = motion.create(Card);
export function SortableCardGrid({ cards: initialCards }: { cards: CardItem[] }) {
    const [cards, setCards] = useState(initialCards)
    return (

        <DragDropProvider onDragEnd={(event) => {
            const { source, target } = event.operation
           if (!source || !target) return
            setCards(move(cards, event) as CardItem[])

        }}>
       <div className=" grid grid-cols-2  lg:grid-cols-4 gap-2  grid-flow-dense auto-rows-[minmax(100px,auto)]">
                {cards.map((card, index) => (
                    <SortableCard key={card.id} card={card} index={index} />
                ))}
            </div>

        </DragDropProvider>

    )
}


export function SortableCard({ card, index }: { card: CardItem, index: number }) {


    const sortable = useSortable({ id: card.id, index })


    return (
       
         <MotionCard
            key={card.id}
            layoutId={`card-${card.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            layout
            ref={sortable.ref}
            
            className={cn(
              "cursor-pointer overflow-hidden rounded-br-3xl shadow-md bg-muted backdrop-opacity-65",
              card.image ? "text-white" : "text-card-foreground",

              cardSizes[card.size].cols, cardSizes[card.size].rows,

            )}
            style={card.image ? { backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(${card.image})`, backgroundSize: "cover", backgroundPosition: "center" } : { color: "var(--card-foreground)" }}



          >
            <CardHeader className="flex  ">
              <div className="flex flex-row justify-between relative w-full items-center">
                <CardTitle className="font-extrabold"  >
                  <motion.span layoutId={`title-${card.id}`}>
                    {card.title}
                  </motion.span>
                </CardTitle>

              </div>
            </CardHeader>
            <CardContent className="">
              <CardDescription className="text-inherit opacity-80">
                {card.description}
              </CardDescription>
            </CardContent>
            {(card.size === "tall" || card.size === "large") && card.tags && (
              <CardFooter className="flex border-0">

                {card.tags && (
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((tag, idx) => (
                      <Badge
                        variant="default"
                        key={idx}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardFooter>
            )}


          </MotionCard>
    )
}

