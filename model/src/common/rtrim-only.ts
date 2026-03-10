import { type CustomHelpers } from 'joi'

/**
 * Custom Joi validator to right trim but leave the left side with one or zero spaces
 * This is primarily for shortDescription so a user can enter a spcae at the beginning to
 * override the lowercase first letter e.g. ' CE mark' would still get lowercased as ' CE mark'
 */
export function rtrimOnly(value: string, helpers: CustomHelpers<string>) {
  if (!value || typeof value !== 'string') {
    return helpers.error('any.required')
  }

  const trimmed = value.trim()
  const hasSpaceAtTheStart = value.startsWith(' ')
  return hasSpaceAtTheStart ? ` ${trimmed}` : trimmed
}
