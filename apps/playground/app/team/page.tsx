import { CardGrid } from "@/components/CardGrid"
import type { CardItem } from "@/lib/cards"

export default function Page() {
  const cards: CardItem[] = [
    {
      id: "1",
      title: "Emma Wilson",
      color: "primary",
      description:
        "Frontend Engineer focused on React, animations, and accessible UI systems.",
      image: "https://avatar.vercel.sh/emma",
    },
    {
      id: "2",
      title: "Liam Carter",
      color: "secondary",
      description:
        "Backend Developer building scalable APIs and cloud infrastructure.",
      image: "https://avatar.vercel.sh/liam",
    },
    {
      id: "3",
      title: "Sophia Martinez",
      color: "primary",
      description:
        "Product Designer crafting intuitive user experiences and design systems.",
      image: "https://avatar.vercel.sh/sophia",
    },
    {
      id: "4",
      title: "Noah Thompson",
      color: "secondary",
      description:
        "DevOps Engineer automating deployments and monitoring production systems.",
      image: "https://avatar.vercel.sh/noah",
    },
    {
      id: "5",
      title: "Olivia Brown",
      color: "primary",
      description:
        "Mobile Developer creating polished cross-platform applications.",
      image: "https://avatar.vercel.sh/olivia",
    },
    {
      id: "6",
      title: "James Anderson",
      color: "secondary",
      description:
        "AI Engineer specializing in LLM integrations and intelligent workflows.",
      image: "https://avatar.vercel.sh/james",
    },
    {
      id: "7",
      title: "Ava Taylor",
      color: "primary",
      description:
        "UX Researcher studying user behavior and improving product usability.",
      image: "https://avatar.vercel.sh/ava",
    },
    {
      id: "8",
      title: "William Harris",
      color: "secondary",
      description:
        "Security Engineer focused on authentication and infrastructure hardening.",
      image: "https://avatar.vercel.sh/william",
    },
    {
      id: "9",
      title: "Mia Robinson",
      color: "primary",
      description:
        "Marketing Lead connecting products with developer communities.",
      image: "https://avatar.vercel.sh/mia",
    },
    {
      id: "10",
      title: "Benjamin Lewis",
      color: "secondary",
      description:
        "Data Engineer managing pipelines, analytics, and reporting systems.",
      image: "https://avatar.vercel.sh/benjamin",
    },
  ]

  return (
    <div className="">
      <CardGrid cards={cards} />
    </div>
  )
}
