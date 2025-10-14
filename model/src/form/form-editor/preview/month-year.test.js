import {
  QuestionPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { MonthYearQuestion } from '~/src/form/form-editor/preview/month-year.js'

describe('month-year', () => {
  it('should create class', () => {
    const elements = /** @type {QuestionElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    const renderer = new QuestionRendererStub(jest.fn())
    const dateInput = new MonthYearQuestion(elements, renderer)
    expect(dateInput.renderInput).toEqual({
      id: 'monthYear',
      name: 'monthYear',
      classes: '',
      fieldset: {
        legend: {
          classes: 'govuk-fieldset__legend--l',
          isPageHeading: true,
          text: 'Which quest would you like to pick?'
        }
      },
      hint: {
        classes: '',
        text: 'Choose one adventure that best suits you.'
      },
      items: [
        {
          name: 'month',
          classes: 'govuk-input--width-2'
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4'
        }
      ]
    })
  })
})

/**
 * @import {QuestionElements} from "~/src/form/form-editor/preview/types.js";
 */
