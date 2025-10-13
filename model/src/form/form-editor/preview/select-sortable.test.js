import {
  QuestionPreviewElements,
  QuestionRendererStub,
  listElementsStub
} from '~/src/form/form-editor/__stubs__/preview.js'
import { SelectSortableQuestion } from '~/src/form/form-editor/preview/select-sortable.js'

describe('SelectSortableQuestion', () => {
  it('should create class with items', () => {
    const { baseElements, list1Id, list2Id, list3Id, list4Id } =
      listElementsStub
    const elements = /** @type {ListElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    const renderer = new QuestionRendererStub(jest.fn())
    const select = new SelectSortableQuestion(elements, renderer)
    expect(select.renderInput).toEqual({
      id: expect.stringContaining('inputField'),
      name: expect.stringContaining('inputField'),
      label: {
        text: 'Which quest would you like to pick?',
        classes: 'govuk-label--l'
      },
      hint: {
        text: 'Choose one adventure that best suits you.',
        classes: ''
      },
      classes: '',
      items: [
        {
          id: '',
          text: ' ',
          value: ''
        },
        {
          label: { text: 'Treasure Hunting', classes: '' },
          text: 'Treasure Hunting',
          value: 'Treasure Hunting',
          id: list1Id,
          hint: undefined
        },
        {
          label: { text: 'Rescuing the princess', classes: '' },
          text: 'Rescuing the princess',
          value: 'Rescuing the princess',
          id: list2Id,
          hint: undefined
        },
        {
          label: { text: 'Saving a city', classes: '' },
          text: 'Saving a city',
          value: 'Saving a city',
          id: list3Id,
          hint: undefined
        },
        {
          label: { text: 'Defeating the baron', classes: '' },
          text: 'Defeating the baron',
          value: 'Defeating the baron',
          id: list4Id,
          hint: undefined
        }
      ]
    })
  })

  it('should create class with no items and placeholder', () => {
    const { baseElements } = listElementsStub
    const baseElementsWithNoItems = structuredClone(baseElements)
    baseElementsWithNoItems.items = []
    const elements = /** @type {ListElements} */ (
      new QuestionPreviewElements(baseElementsWithNoItems)
    )
    const renderer = new QuestionRendererStub(jest.fn())
    const select = new SelectSortableQuestion(elements, renderer)
    expect(select.renderInput).toEqual({
      id: expect.stringContaining('inputField'),
      name: expect.stringContaining('inputField'),
      label: {
        text: 'Which quest would you like to pick?',
        classes: 'govuk-label--l'
      },
      hint: {
        text: 'Choose one adventure that best suits you.',
        classes: ''
      },
      classes: 'govuk-visually-hidden',
      formGroup: {
        afterInput: {
          html: '<div class="govuk-inset-text">No items added yet.</div>'
        }
      },
      items: []
    })
  })
})

/**
 * @import { ListElements } from "~/src/form/form-editor/preview/types.js";
 */
