/**
 * Safely gets a nested property value from changes data
 * @param {MessageData} data - The data object
 * @param {string} path - The nested path (e.g., 'changes.previous.title')
 * @returns {string | undefined}
 */
export function safeGet(data, path) {
  const parts = path.split('.')
  /** @type {unknown} */
  let current = data
  for (const part of parts) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== 'object'
    ) {
      return undefined
    }
    current = /** @type {Record<string, unknown>} */ (current)[part]
  }
  return typeof current === 'string' ? current : undefined
}

/**
 * Builds a field change description string with configurable verb
 * Returns undefined if old and new values are identical (no actual change)
 * @param {string} verb - The action verb ('Updated' or 'Changed')
 * @param {string} fieldName - The field label
 * @param {string | undefined} oldValue - Previous value
 * @param {string | undefined} newValue - New value
 * @returns {string | undefined}
 */
export function buildFieldChangeDescription(
  verb,
  fieldName,
  oldValue,
  newValue
) {
  if (oldValue && newValue && oldValue === newValue) {
    return undefined
  }
  if (oldValue && newValue) {
    return `${verb} ${fieldName} from '${oldValue}' to '${newValue}'.`
  }
  if (newValue) {
    return `Set ${fieldName} to '${newValue}'.`
  }
  return undefined
}

/**
 * @import { MessageData } from '@defra/forms-model'
 */
