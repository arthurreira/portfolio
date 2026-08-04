/**
 * How strongly a skill is claimed.
 *
 * The tier is load-bearing, not decoration: fed a flat list, a model will
 * present everything as equal expertise, which is how someone ends up
 * defending Blender in an interview.
 */
export const SKILL_LEVELS = ['core', 'working', 'exploring'] as const
export type SkillLevel = typeof SKILL_LEVELS[number]

export const SKILL_CATEGORIES = [
  'language',
  'frontend',
  'backend',
  'data',
  'cloud',
  'devops',
  'tooling',
  'testing',
  'ai',
  'embedded',
  'design',
] as const
export type SkillCategory = typeof SKILL_CATEGORIES[number]

export const CERTIFICATION_STATUSES = ['certified', 'in-progress'] as const
export type CertificationStatus = typeof CERTIFICATION_STATUSES[number]
