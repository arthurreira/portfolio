export const PROJECT_STATUSES = ['done', 'ongoing', 'someday', 'fun', 'learning', 'school'] as const
export type ProjectStatus = typeof PROJECT_STATUSES[number]

export const PROJECT_ROLES = ['solo', 'lead', 'contributor', 'engineer'] as const
export type ProjectRole = typeof PROJECT_ROLES[number]
