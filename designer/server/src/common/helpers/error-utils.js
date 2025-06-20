/**
 * Safely extracts error message from unknown error types
 * @param {unknown} error - The error to extract message from
 * @returns {string} The error message
 */
export function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}
