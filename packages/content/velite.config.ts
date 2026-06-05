import { defineConfig, s } from 'velite'
import { PROJECT_STATUSES, PROJECT_ROLES } from './src/types/project'
// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.

export default defineConfig({
  root: '.',
  output: {
    data: '.velite',
    assets: '../../apps/web/public/static',
    base: '/static/',
  },
  collections: {
    projects: {
      name: 'Project', // collection type name
      pattern: 'projects/**/*.mdx', // content files glob pattern
      schema: 
      s.object({
          title: s.string().max(99), // Zod primitive type
          description: s.string().max(300), // Zod primitive type
          slug: s.path().transform(path => path.split('/')[1]), // auto generate slug from file path
          createdAt: s.isodate(), // input Date-like string, output ISO Date string.
          coverImage: s.image().optional(), // local image relative to the mdx file, processed by velite
          content: s.mdx(), // transform markdown to html
          featured: s.boolean().default(false), // boolean with default value
          url: s.string().url().optional(), // validate URL format, optional field
          techStack: s.array(s.string()).optional(), // array of strings, optional field
          githubRepo: s.string().optional(), // validate URL format, optional field
          locale: s.path().transform(path => path.split('/')[2]), // enum with default value
          status: s.enum(PROJECT_STATUSES).default('done'), // enum with default value
          role: s.enum(PROJECT_ROLES).optional(),           // your role: solo | lead | contributor | engineer
          highlight: s.string().optional(), // optional string field for project highlight or key takeaway

        })
        // more additional fields (computed fields)
        .transform(data => ({ ...data, permalink: `/project/${data.slug}` }))
    },
    about: {
      name: 'About', // collection type name
      pattern: 'about/*.mdx', // content files glob pattern
      schema: s.object({
        locale: s.path().transform(path => path.split('/')[1]),
        content: s.mdx(),
      })
    },

  }
})