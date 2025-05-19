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
      const placeholder =
        fieldId === 'minFiles'
          ? '[min file count]'
          : fieldId === 'maxFiles'
            ? '[max file count]'
            : '[exact file count]'

      element.textContent = value || placeholder
    })
  })

  const allErrorElements = document.querySelectorAll('.govuk-error-message')

  allErrorElements.forEach((el) => {
    const text = el.textContent ?? ''

    if (
      fieldId === 'minFiles' &&
      (text.includes('upload [min file count] files') ||
        text.includes('upload [unknown] files'))
    ) {
      el.innerHTML = el.innerHTML.replace(
        /\[min file count\]|\[unknown\]/g,
        value || '[min file count]'
      )
    }

    if (
      fieldId === 'maxFiles' &&
      (text.includes('only upload [max file count]') ||
        text.includes('only upload [unknown]'))
    ) {
      el.innerHTML = el.innerHTML.replace(
        /\[max file count\]|\[unknown\]/g,
        value || '[max file count]'
      )
    }

    if (
      fieldId === 'exactFiles' &&
      (text.includes('exactly [exact file count]') ||
        text.includes('exactly [unknown]'))
    ) {
      el.innerHTML = el.innerHTML.replace(
        /\[exact file count\]|\[unknown\]/g,
        value || '[exact file count]'
      )
    }
  })
}

/**
 * @import { HTMLElementOrNull } from '@defra/forms-model'
 */
