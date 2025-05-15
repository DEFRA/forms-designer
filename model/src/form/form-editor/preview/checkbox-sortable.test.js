import {
  QuestionPreviewElements,
  QuestionRendererStub,
  listElementsStub
} from '~/src/form/form-editor/__stubs__/preview.js'
import { CheckboxSortableQuestion } from '~/src/index.js'

describe('CheckboxSortableQuestion', () => {
  it('should create class', () => {
    const { baseElements, list1Id, list2Id, list3Id, list4Id } =
      listElementsStub
    const elements = /** @type {ListElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    const renderer = new QuestionRendererStub(jest.fn())
    const dateInput = new CheckboxSortableQuestion(elements, renderer)
    expect(dateInput.renderInput).toEqual({
      id: 'checkboxField',
      name: 'checkboxField',
      fieldset: {
        legend: {
          classes: 'govuk-fieldset__legend--l',
          text: 'Which quest would you like to pick?'
        }
      },
      hint: {
        classes: '',
        text: 'Choose one adventure that best suits you.'
      },
      items: [
        {
          label: { text: 'Treasure Hunting', classes: '' },
          text: 'Treasure Hunting',
          value: 'Treasure Hunting',
          id: list1Id
        },
        {
          label: { text: 'Rescuing the princess', classes: '' },
          text: 'Rescuing the princess',
          value: 'Rescuing the princess',
          id: list2Id
        },
        {
          label: { text: 'Saving a city', classes: '' },
          text: 'Saving a city',
          value: 'Saving a city',
          id: list3Id
        },
        {
          label: { text: 'Defeating the baron', classes: '' },
          text: 'Defeating the baron',
          value: 'Defeating the baron',
          id: list4Id
        }
      ]
    })
  })
})

/**
 * @import { QuestionElements, ListElements } from "~/src/form/form-editor/preview/types.js";
 */
