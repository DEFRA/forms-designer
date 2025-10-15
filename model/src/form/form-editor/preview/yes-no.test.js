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
    const yesNo = new YesNoQuestion(elements, renderer)
    expect(yesNo.renderInput).toEqual({
      id: 'yesNo',
      name: 'yesNo',
      type: 'boolean',
      classes: 'govuk-radios--inline',
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

  it('should create class with highlight', () => {
    const elements = /** @type {QuestionElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    const renderer = new QuestionRendererStub(jest.fn())
    const yesNo = new YesNoQuestion(elements, renderer)
    yesNo.highlightContent()
    expect(yesNo.renderInput).toEqual({
      id: 'yesNo',
      name: 'yesNo',
      type: 'boolean',
      classes: 'govuk-radios--inline highlight',
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
