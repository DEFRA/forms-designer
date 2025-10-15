import {
  AutocompletePreviewElements,
  QuestionRendererStub,
  listElementsStub
} from '~/src/form/form-editor/__stubs__/preview.js'
import { AutocompleteQuestion } from '~/src/form/form-editor/preview/autocomplete.js'

describe('AutoCompleteQuestion', () => {
  it('should create class', () => {
    const { baseElements } = listElementsStub
    const { items: _removedItems, ...baseElementsWithoutItems } = baseElements
    const elements = new AutocompletePreviewElements({
      autocompleteOptions:
        'Treasure Hunting\nRescuing the princess\nSaving a city\nDefeating the baron',
      ...baseElementsWithoutItems,
      items: []
    })

    expect(elements.autocompleteOptions).toBe(
      'Treasure Hunting\nRescuing the princess\nSaving a city\nDefeating the baron'
    )
    const renderer = new QuestionRendererStub(jest.fn())
    const autoCompleteQuestion = new AutocompleteQuestion(elements, renderer)
    expect(autoCompleteQuestion.renderInput).toEqual({
      id: 'autoCompleteField',
      name: 'autoCompleteField',
      label: {
        classes: 'govuk-label--l',
        isPageHeading: true,
        text: 'Which quest would you like to pick?'
      },
      hint: {
        classes: '',
        text: 'Choose one adventure that best suits you.'
      },
      items: [
        { id: '', text: '', value: '' },
        {
          id: 'Treasure Hunting',
          text: 'Treasure Hunting',
          value: 'Treasure Hunting'
        },
        {
          id: 'Rescuing the princess',
          text: 'Rescuing the princess',
          value: 'Rescuing the princess'
        },
        {
          id: 'Saving a city',
          text: 'Saving a city',
          value: 'Saving a city'
        },
        {
          id: 'Defeating the baron',
          text: 'Defeating the baron',
          value: 'Defeating the baron'
        }
      ],
      attributes: { 'data-module': 'govuk-accessible-autocomplete' }
    })
  })

  it('should safely handle invalid options', () => {
    const { baseElements } = listElementsStub
    const { items: _removedItems, ...baseElementsWithoutItems } = baseElements
    const validAutocompleteOptions =
      'Treasure Hunting\nRescuing the princess\nSaving a city\nDefeating the baron'
    const elements = new AutocompletePreviewElements({
      autocompleteOptions: validAutocompleteOptions,
      ...baseElementsWithoutItems,
      items: []
    })

    expect(elements.autocompleteOptions).toBe(
      'Treasure Hunting\nRescuing the princess\nSaving a city\nDefeating the baron'
    )
    const renderer = new QuestionRendererStub(jest.fn())
    const autoCompleteQuestion = new AutocompleteQuestion(elements, renderer)

    const invalidAutocompleteOptions = 'a:::::::b:::::c'
    autoCompleteQuestion.setAutocompleteList(invalidAutocompleteOptions)
    expect(autoCompleteQuestion.renderInput).toEqual({
      id: 'autoCompleteField',
      name: 'autoCompleteField',
      label: {
        classes: 'govuk-label--l',
        isPageHeading: true,
        text: 'Which quest would you like to pick?'
      },
      hint: {
        classes: '',
        text: 'Choose one adventure that best suits you.'
      },
      items: [
        { id: '', text: '', value: '' },
        {
          id: 'Treasure Hunting',
          text: 'Treasure Hunting',
          value: 'Treasure Hunting'
        },
        {
          id: 'Rescuing the princess',
          text: 'Rescuing the princess',
          value: 'Rescuing the princess'
        },
        {
          id: 'Saving a city',
          text: 'Saving a city',
          value: 'Saving a city'
        },
        {
          id: 'Defeating the baron',
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
