export const CONTACT_EMAIL = 'pradhuldev.1990@gmail.com'
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`
export const HONEYPOT_FIELD = '_gotcha'
export const MAX_NAME_LENGTH = 80
export const MAX_EMAIL_LENGTH = 254
export const MAX_MESSAGE_LENGTH = 2000
export const MAX_PROJECT_TYPE_LENGTH = 80
export const MAX_BUDGET_LENGTH = 40

export const PROJECT_TYPES = [
  'Web app',
  'Mobile app',
  'Android TV',
  'VS Code / Chrome extension',
  'Other',
] as const

export const BUDGET_RANGES = [
  'Not sure yet',
  'Under $2k',
  '$2k – $5k',
  '$5k – $15k',
  '$15k+',
] as const

export type ProjectType = (typeof PROJECT_TYPES)[number]
export type BudgetRange = (typeof BUDGET_RANGES)[number]
