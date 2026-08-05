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

/**
 * How well a language is actually spoken. Kept coarse on purpose — a scale with
 * more rungs invites the model to embellish where the difference is not real.
 */
export const LANGUAGE_LEVELS = ['native', 'fluent', 'conversational'] as const
export type LanguageLevel = typeof LANGUAGE_LEVELS[number]
