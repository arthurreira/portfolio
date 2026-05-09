"use client"
import { DragDropProvider } from '@dnd-kit/react';
import { useState } from "react";
import { CardItem } from "@arthurreira/ui/lib/cards";
import { Card } from "@arthurreira/ui/components/card";
import { useSortable } from '@dnd-kit/react/sortable'
import { move } from "@dnd-kit/helpers"

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
        <Card key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden" ref={sortable.ref}>
            <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-gray-600 mt-2">{card.description}</p>
            </div>
        </Card>
    )
}

