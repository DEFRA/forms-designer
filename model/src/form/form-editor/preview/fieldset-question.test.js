import {
  QuestionPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'

describe('fieldset-question', () => {
  it('should create class', () => {
    const elements = /** @type {QuestionElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    class DummyFieldsetClass extends FieldsetQuestion {}
    const renderer = new QuestionRendererStub(jest.fn())
    const dateInput = new DummyFieldsetClass(elements, renderer)
    expect(dateInput.renderInput).toEqual({
      id: expect.stringContaining('inputField'),
      name: 'inputField',
      classes: '',
      fieldset: {
        legend: {
          classes: 'govuk-fieldset__legend--l',
          text: 'Which quest would you like to pick?'
        }
      },
      hint: {
        classes: '',
        text: 'Choose one adventure that best suits you.'
      }
    })
  })

  it('should create class as highlighted', () => {
    const elements = /** @type {QuestionElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    class DummyFieldsetClass extends FieldsetQuestion {}
    const renderer = new QuestionRendererStub(jest.fn())
    const dateInput = new DummyFieldsetClass(elements, renderer)
    dateInput.highlightContent()
    expect(dateInput.renderInput).toEqual({
      id: expect.stringContaining('inputField'),
      name: 'inputField',
      classes: 'highlight',
      fieldset: {
        legend: {
          classes: 'govuk-fieldset__legend--l',
          text: 'Which quest would you like to pick?'
        }
      },
      hint: {
        classes: '',
        text: 'Choose one adventure that best suits you.'
      }
    })
  })
})

/**
 * @import {QuestionElements} from "~/src/form/form-editor/preview/types.js";
 */
