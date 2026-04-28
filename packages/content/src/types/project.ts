export const PROJECT_STATUSES = ['done', 'ongoing', 'someday', 'fun', 'learning', 'school'] as const
export type ProjectStatus = typeof PROJECT_STATUSES[number]