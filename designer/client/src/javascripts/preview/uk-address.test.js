import { UkAddressQuestion } from '@defra/forms-model'

import {
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewHTML
} from '~/src/javascripts/preview/__stubs__/question.js'
import { SetupPreview } from '~/src/javascripts/setup-preview.js'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('address', () => {
  describe('Address', () => {
    it('should create class', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
      const res = SetupPreview.UkAddressField()
      expect(res).toBeInstanceOf(UkAddressQuestion)
      expect(res).toBeDefined()
      expect(res.renderInput).toEqual({
        id: 'addressField',
        name: 'addressField',
        classes: '',
        fieldset: {
          legend: {
            classes: 'govuk-fieldset__legend--l',
            isPageHeading: true,
            text: 'Which quest would you like to pick?'
          }
        },
        hint: {
          text: 'Choose one adventure that best suits you.',
          classes: ''
        },
        usePostcodeLookup: false
      })
      expect(res.titleText).toBe('Which quest would you like to pick?')
      expect(res.question).toBe('Which quest would you like to pick?')
      expect(res.hintText).toBe('Choose one adventure that best suits you.')
      expect(res.optional).toBeFalsy()
      expect(res.highlight).toBeNull()
    })
  })
})
