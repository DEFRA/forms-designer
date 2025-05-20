const MIN_FILES_PLACEHOLDER = '[min file count]'
const MAX_FILES_PLACEHOLDER = '[max file count]'
const EXACT_FILES_PLACEHOLDER = '[exact file count]'

/**
 * Helper function to update a specific field error text
 * @param {Element} element - Error element to update
 * @param {string} currentFieldId - Current field ID
 * @param {string} targetFieldId - Field ID to match
 * @param {string[]} textPatterns - Text patterns to check
 * @param {RegExp} regex - Regex for replacement
 * @param {string} value - Value to insert
 * @param {string} defaultValue - Default value
 * @private
 */
export function updateFieldErrorText(
  element,
  currentFieldId,
  targetFieldId,
  textPatterns,
  regex,
  value,
  defaultValue
) {
  if (currentFieldId !== targetFieldId) return

  const text = element.textContent ?? ''
  const hasPattern = textPatterns.some((pattern) => text.includes(pattern))

  if (hasPattern) {
    element.innerHTML = element.innerHTML.replace(regex, value || defaultValue)
  }
}

/**
 * Force update all file upload limit text spans
 * @param {string} fieldId - The field ID that was changed
 * @param {string} value - The new value
 */
export function updateFileUploadErrorText(fieldId, value) {
  const fieldToClassMap = {
    minFiles: ['error-preview-min', 'error-preview-filesMin'],
    maxFiles: ['error-preview-max', 'error-preview-filesMax'],
    exactFiles: ['error-preview-length', 'error-preview-filesExact']
  }

  const classesToUpdate =
    fieldToClassMap[/** @type {keyof typeof fieldToClassMap} */ (fieldId)]

  classesToUpdate.forEach((className) => {
    const elements = document.querySelectorAll(`.${className}`)

    elements.forEach((element) => {
      let placeholder
      if (fieldId === 'minFiles') {
        placeholder = MIN_FILES_PLACEHOLDER
      } else if (fieldId === 'maxFiles') {
        placeholder = MAX_FILES_PLACEHOLDER
      } else {
        placeholder = EXACT_FILES_PLACEHOLDER
      }

      element.textContent = value || placeholder
    })
  })

  const allErrorElements = document.querySelectorAll('.govuk-error-message')

  allErrorElements.forEach((el) => {
    updateFieldErrorText(
      el,
      fieldId,
      'minFiles',
      ['upload ' + MIN_FILES_PLACEHOLDER + ' files', 'upload [unknown] files'],
      /\[min file count\]|\[unknown\]/g,
      value,
      MIN_FILES_PLACEHOLDER
    )

    updateFieldErrorText(
      el,
      fieldId,
      'maxFiles',
      ['only upload ' + MAX_FILES_PLACEHOLDER, 'only upload [unknown]'],
      /\[max file count\]|\[unknown\]/g,
      value,
      MAX_FILES_PLACEHOLDER
    )

    updateFieldErrorText(
      el,
      fieldId,
      'exactFiles',
      ['exactly ' + EXACT_FILES_PLACEHOLDER, 'exactly [unknown]'],
      /\[exact file count\]|\[unknown\]/g,
      value,
      EXACT_FILES_PLACEHOLDER
    )
  })
}
