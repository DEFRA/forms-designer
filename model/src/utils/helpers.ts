import slug from 'slug'

/**
 * Replace whitespace, en-dashes and em-dashes with spaces
 * before running through the slug package
 */
export function slugify(input = '', options?: slug.Options) {
  const string = input.trimStart().replace(/[\s–—]/g, ' ')

  return slug(string, {
    fallback: false,
    lower: true,
    trim: true,
    ...options
  })
}

/**
 * Safely extracts error message from unknown error types
 * @param {unknown} error - The error to extract message from
 * @returns {string} The error message
 */
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
