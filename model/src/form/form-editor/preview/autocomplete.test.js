import {
  QuestionPreviewElements,
  QuestionRendererStub,
  listElementsStub
} from '~/src/form/form-editor/__stubs__/preview.js'
import { AutocompleteQuestion } from '~/src/form/form-editor/preview/autocomplete.js'

describe('AutoCompleteQuestion', () => {
  it('should create class', () => {
    const { baseElements } = listElementsStub
    const elements = /** @type {ListElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    const renderer = new QuestionRendererStub(jest.fn())
    const autoCompleteQuestion = new AutocompleteQuestion(elements, renderer)
    expect(autoCompleteQuestion.renderInput).toEqual({
      id: 'autoCompleteField',
      name: 'autoCompleteField',
      label: {
        classes: 'govuk-label--l',
        text: 'Which quest would you like to pick?'
      },
      hint: {
        classes: '',
        text: 'Choose one adventure that best suits you.'
      },
      items: [
        {
          text: 'Treasure Hunting',
          value: 'Treasure Hunting'
        },
        {
          text: 'Rescuing the princess',
          value: 'Rescuing the princess'
        },
        {
          text: 'Saving a city',
          value: 'Saving a city'
        },
        {
          text: 'Defeating the baron',
          value: 'Defeating the baron'
        }
      ],
      attributes: { 'data-module': 'govuk-accessible-autocomplete' }
    })
  })
})

/**
 * @import { QuestionElements, ListElements } from "~/src/form/form-editor/preview/types.js";
 */
