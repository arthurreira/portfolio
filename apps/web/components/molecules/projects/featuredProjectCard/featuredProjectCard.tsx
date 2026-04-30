import type { FeaturedProjectCardProps } from './featuredProjectCardProps'
import { Card } from "@arthurreira/ui/components/card"
import { Badge } from "@arthurreira/ui/components/badge"
import Image from "next/image"
import Link from 'next/link'

export function FeaturedProjectCard({ title, description, status, techStack, url, githubRepo, coverImage, highlight, slug }: FeaturedProjectCardProps) {
  return (
    <Card className="w-full h-full flex flex-col overflow-hidden p-0 ">
  <Link href={`/projects/${slug}`} className="flex flex-col flex-1 ">
    {coverImage?.src && (
      <div className="w-full h-full relative overflow-hidden">
  <Image src={coverImage.src} alt={title} fill className="object-cover object-top" />
</div>
    )}
        <div className="p-6 flex flex-col flex-1 gap-3 justify-end">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Badge variant="default">{status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          {highlight && <p className="text-sm text-primary">↗ {highlight}</p>}
          <div className="flex flex-wrap gap-2 mt-auto">
            {techStack?.map((tech) => (
              <Badge key={tech} variant="default" >{tech}</Badge>
            ))}
          </div>
        </div>

      </Link>
      <div className="px-6 py-4 border-t flex gap-4">
        {url && <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">View Project</a>}
        {githubRepo && <a href={githubRepo} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline">GitHub</a>}
      </div>
    </Card>
  )
}