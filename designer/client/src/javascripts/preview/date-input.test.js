import {
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewHTML
} from '~/src/javascripts/preview/__stubs__/question'
import { SetupPreview } from '~/src/javascripts/setup-preview.js'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('date-input', () => {
  it('should create class', () => {
    document.body.innerHTML =
      questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
    const res = SetupPreview.DatePartsField()
    expect(res.renderInput).toEqual({
      id: 'dateInput',
      name: 'dateInput',
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
      }
    })
  })
})
