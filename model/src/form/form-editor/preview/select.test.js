import {
  QuestionPreviewElements,
  QuestionRendererStub,
  listElementsStub
} from '~/src/form/form-editor/__stubs__/preview.js'
import { SelectQuestion } from '~/src/form/form-editor/preview/select.js'

describe('SelectQuestion', () => {
  it('should create class with items', () => {
    const { baseElements, list1Id, list2Id, list3Id, list4Id } =
      listElementsStub
    const elements = /** @type {ListElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    const renderer = new QuestionRendererStub(jest.fn())
    const select = new SelectQuestion(elements, renderer)
    expect(select.renderInput).toEqual({
      id: 'selectInput',
      name: 'selectInput',
      label: {
        text: 'Which quest would you like to pick?',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      hint: {
        text: 'Choose one adventure that best suits you.',
        classes: ''
      },
      classes: '',
      items: [
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

  it('should create class with items and highlight', () => {
    const { baseElements, list1Id, list2Id, list3Id, list4Id } =
      listElementsStub
    const elements = /** @type {ListElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    const renderer = new QuestionRendererStub(jest.fn())
    const select = new SelectQuestion(elements, renderer)
    select.highlightContent()
    expect(select.renderInput).toEqual({
      id: 'selectInput',
      name: 'selectInput',
      label: {
        text: 'Which quest would you like to pick?',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      hint: {
        text: 'Choose one adventure that best suits you.',
        classes: ''
      },
      classes: 'highlight',
      items: [
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

  it('should hide select element if no items', () => {
    const elements = /** @type {ListElements} */ (
      new QuestionPreviewElements({
        question: 'My select list',
        hintText: '',
        items: [],
        optional: false,
        shortDesc: 'list',
        content: ''
      })
    )
    const renderer = new QuestionRendererStub(jest.fn())
    const select = new SelectQuestion(elements, renderer)
    expect(select.renderInput).toEqual({
      id: 'selectInput',
      name: 'selectInput',
      label: {
        text: 'My select list',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      hint: {
        text: '',
        classes: ''
      },
      classes: 'govuk-visually-hidden',
      items: [],
      formGroup: {
        afterInput: {
          html: '<div class="govuk-inset-text">No items added yet.</div>'
        }
      }
    })
  })
})

/**
 * @import { ListElements } from "~/src/form/form-editor/preview/types.js";
 */
