import {
  QuestionPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { DateInput } from '~/src/form/form-editor/preview/date-input.js'

describe('date-input', () => {
  it('should create class', () => {
    const elements = /** @type {QuestionElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    const renderer = new QuestionRendererStub(jest.fn())
    const dateInput = new DateInput(elements, renderer)
    expect(dateInput.renderInput).toEqual({
      id: 'dateInput',
      name: 'dateInputField',
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
