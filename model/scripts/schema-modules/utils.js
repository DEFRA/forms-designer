import fs from 'fs'

/**
 * Ensures a directory exists
 * @param {string} dir Directory path
 */
export function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * Formats a kebab-case string to Title Case
 * @param {string} str String to format
 * @returns {string} Formatted string
 */
export function toTitleCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Format camelCase or snake_case to Title Case
 * @param {string} str String to format
 * @returns {string} Formatted string
 */
export function formatPropertyName(str) {
  return (
    str
      // camelCase to space-separated
      .replace(/([A-Z])/g, ' $1')
      // snake_case to space-separated
      .replace(/_/g, ' ')
      // Capitalize first letter
      .replace(/^./, (first) => first.toUpperCase())
      .trim()
  )
}
