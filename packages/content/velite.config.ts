import { defineConfig, s } from 'velite'
import { PROJECT_STATUSES, PROJECT_ROLES } from './src/types/project'
import {
  CERTIFICATION_STATUSES,
  LANGUAGE_LEVELS,
  SKILL_CATEGORIES,
  SKILL_LEVELS,
} from './src/types/profile'
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
    // Credentials and skills, kept out of `about` because they are structured
    // data and language-neutral: technology and certification names are proper
    // nouns, so translating them three ways would only invite drift.
    profile: {
      name: 'Profile',
      pattern: 'profile/*.yml',
      single: true,
      schema: s.object({
        education: s.array(
          s.object({
            school: s.string(),
            program: s.string(),
            note: s.string().optional(),
          })
        ),
        certifications: s.array(
          s.object({
            name: s.string(),
            code: s.string().optional(),
            issuer: s.string(),
            status: s.enum(CERTIFICATION_STATUSES),
            // Year passed. Optional because an in-progress one has not been
            // earned yet; the site sorts on it to show the most recent first,
            // which keeps "latest" true without a hardcoded year to update.
            earned: s.number().int().optional(),
          })
        ),
        skills: s.array(
          s.object({
            name: s.string(),
            category: s.enum(SKILL_CATEGORIES),
            level: s.enum(SKILL_LEVELS),
          })
        ),
        focus: s.array(s.string()),
        // The human questions visitors actually ask. Without these the chat
        // answers "not stated here, see the contact page" to things Arthur is
        // perfectly happy to answer, which reads as evasive rather than careful.
        personal: s.object({
          origin: s.object({
            city: s.string(),
            region: s.string(),
            country: s.string(),
            movedToFinland: s.number(),
            movedBecause: s.string().optional(),
          }),
          languages: s.array(
            s.object({
              name: s.string(),
              level: s.enum(LANGUAGE_LEVELS),
            })
          ),
          football: s
            .object({
              position: s.string(),
              league: s.string().optional(),
              note: s.string().optional(),
            })
            .optional(),
          favourites: s.array(
            s.object({ what: s.string(), answer: s.string() })
          ),
          funFacts: s.array(s.string()),
          // Narrative rather than facts — the questions where the answer is a
          // point of view, not a value. Written in English like the rest of the
          // file; the chat renders it in the visitor's language.
          story: s.object({
            whySoftware: s.string(),
            closestProject: s.string(),
            currentlyLearning: s.string(),
            workStyle: s.string(),
            lookingAhead: s.string(),
            finlandAndBrazil: s.string(),
          }),
        }),
        // Deliberately narrow. Only what Arthur has actually stated goes here;
        // everything else routes to the contact page rather than becoming a
        // status line that silently goes stale.
        availability: s.object({
          openTo: s.array(s.string()),
          routeElsewhereToContact: s.boolean(),
        }),
      }),
    },
    about: {
      name: 'About', // collection type name
      pattern: 'about/*.mdx', // content files glob pattern
      schema: s.object({
        locale: s.path().transform(path => path.split('/')[1]),
        content: s.mdx(),
        // Plain-text source. `content` is compiled MDX (a JS function), which is
        // unusable as LLM context — the chat Worker reads `raw` instead.
        raw: s.raw(),
      })
    },

  }
})