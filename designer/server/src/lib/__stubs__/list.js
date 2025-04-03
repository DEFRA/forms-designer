/**
 * @param {Partial<FormEditorInputQuestion>} partialAutoCompletePayload
 * @returns {Partial<FormEditorInputQuestion>}
 */
export function buildAutoCompletePayload(partialAutoCompletePayload) {
  return {
    name: 'tzrHYW',
    question: 'What is your first language?',
    questionType: 'AutocompleteField',
    shortDescription: 'your first language',
    hintText: 'Hint Text',
    autoCompleteOptions: [
      { text: 'English', value: 'en-gb' },
      { text: 'German', value: 'de-De' }
    ],
    ...partialAutoCompletePayload
  }
}

/**
 * @import { FormEditorInputQuestion } from '@defra/forms-model'
 */
