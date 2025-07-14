import {
  QuestionPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { YesNoQuestion } from '~/src/form/form-editor/preview/yes-no.js'

describe('YesNoQuestion', () => {
  it('should create class', () => {
    const elements = /** @type {QuestionElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    const renderer = new QuestionRendererStub(jest.fn())
    const dateInput = new YesNoQuestion(elements, renderer)
    expect(dateInput.renderInput).toEqual({
      id: 'yesNo',
      name: 'yesNo',
      type: 'boolean',
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
      },
      items: [
        {
          id: 'yesNo-yes',
          label: {
            classes: '',
            text: 'Yes'
          },
          text: 'Yes',
          value: true
        },
        {
          id: 'yesNo-no',
          label: {
            classes: '',
            text: 'No'
          },
          text: 'No',
          value: false
        }
      ]
    })
  })
})

/**
 * @import {QuestionElements} from "~/src/form/form-editor/preview/types.js";
 */
