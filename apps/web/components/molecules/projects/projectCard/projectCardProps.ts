import type { Project } from '@arthurreira/content'


export type ProjectCardProps = Pick<Project, 
  'title' | 
  'description' | 
  'status' | 
  'techStack' | 
  'url' | 
  'githubRepo' |
  'slug' |
  'coverImage'

>