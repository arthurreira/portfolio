"use client"

import { useState } from "react";
import { type CardItem } from "@arthurreira/ui/lib/cards"
import { PageHeader } from "@arthurreira/ui/components/pageHeader"
import golfBalls from "@/data/cards/golf-balls.json";
import teamMembers from "@/data/cards/team-members.json";
import features from "@/data/cards/features.json";
import blogPosts from "@/data/cards/blog-posts.json";
import comments from "@/data/cards/comments.json";
import likes from "@/data/cards/likes.json";
import music from "@/data/cards/music.json";
import anything from "@/data/cards/anything.json";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@arthurreira/ui/components/select";
import { SortableCardGrid } from "@/components/SortableCardGrid";
const categories = {
  "golf-balls": golfBalls.cards,
  "team-members": teamMembers.cards,
  "features": features.cards,
  "blog-posts": blogPosts.cards,
  "comments": comments.cards,
  "likes": likes.cards,
  "music": music.cards,
  "anything": anything.cards,
}

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(categories)[0]);


  const cards = categories[selectedCategory as keyof typeof categories] as CardItem[]


  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-4 py-2 ">

      <div className="flex flex-row gap-0 justify-between items-center">
        <PageHeader title="Sortable Cards" />
        <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              {Object.keys(categories).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

      </div>

      <SortableCardGrid cards={cards} />
    </div>
  )
}
