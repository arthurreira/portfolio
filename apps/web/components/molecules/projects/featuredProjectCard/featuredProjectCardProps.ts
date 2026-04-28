import type { Project } from '@arthurreira/content'


export type FeaturedProjectCardProps = Pick<Project, 
  'title' | 
  'description' | 
  'status' | 
  'techStack' | 
  'url' | 
  'githubRepo' |
  'slug' |
  'coverImage' |
  'highlight' |
  'featured'
>