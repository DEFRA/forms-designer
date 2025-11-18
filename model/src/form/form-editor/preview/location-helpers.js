import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'

/**
 * Creates the standard location field model with common properties
 * @param {QuestionBaseModel} baseModel - The base model from super._renderInput()
 * @param {LocationElements} htmlElements - The HTML elements containing values
 * @param {string | null} highlight - The currently highlighted element
 * @param {string} instructionText - The instruction text to display
 * @param {string} titleText - The title text including optional suffix
 * @returns {LocationFieldModel}
 */
export function createLocationFieldModel(
  baseModel,
  htmlElements,
  highlight,
  instructionText,
  titleText
) {
  return {
    ...baseModel,
    userClasses: htmlElements.values.userClasses,
    fieldset: {
      legend: {
        text: titleText,
        classes: highlight === 'question' ? HIGHLIGHT_CLASS : ''
      }
    },
    instructionText,
    details: {
      classes: highlight === 'instructionText' ? HIGHLIGHT_CLASS : ''
    }
  }
}

/**
 * Creates field classes with highlight if needed
 * @param {string} fieldName - The name of the field
 * @param {string | null} highlight - The currently highlighted element
 * @returns {{classes: string}}
 */
export function createFieldClasses(fieldName, highlight) {
  return {
    classes: highlight === fieldName ? HIGHLIGHT_CLASS : ''
  }
}

/**
 * @import { LocationElements, QuestionBaseModel, LocationFieldModel } from '~/src/form/form-editor/preview/types.js'
 */
