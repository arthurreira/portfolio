import type { ProjectCardProps } from './projectCardProps'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@arthurreira/ui/components/card"
import { Badge } from "@arthurreira/ui/components/badge"
import Image from "next/image"
import Link from 'next/link'

export function ProjectCard({ title, description, status, techStack, url, githubRepo, slug, coverImage }: ProjectCardProps) {
  return (
    <Card className="w-full h-full flex flex-col hover:shadow-lg transition-shadow duration-300 p-0 ">
      <Link href={`/projects/${slug}`} className="flex flex-col flex-1 ">
        {coverImage?.src
          ? <div className="w-full h-40 relative overflow-hidden ">
            <Image src={coverImage.src} alt={title} fill className="object-cover" />
          </div>
          : <div className="w-full h-40 border bg-linear-to-r from-sidebar-primary via-primary to-muted-foreground " />

        }
        <CardHeader className="p-4">
          <div className="flex items-center">
            <CardTitle className="text-base">{title}</CardTitle>

            <Badge  className="ml-auto">
              {status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <CardDescription>
            {description}
          </CardDescription>
          <div className="mt-auto flex flex-wrap gap-2 py-2">
            {techStack?.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="default" >{tech}</Badge>
            ))}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-6 flex gap-4 border-t">
        {url && <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Project</a>}
        {githubRepo && <a href={githubRepo} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub Repo</a>}
      </CardFooter>
    </Card>
  )
}