import {
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewHTML
} from '~/src/javascripts/preview/__stubs__/question.js'
import { Email } from '~/src/javascripts/preview/email.js'
import { setupPreview } from '~/src/javascripts/preview.js'

jest.mock('~/src/javascripts/preview/nunjucks.js')
jest.mock('~/src/views/components/ukaddressfield.njk', () => '')
jest.mock('~/src/views/components/telephonenumberfield.njk', () => '')
jest.mock('~/src/views/components/emailaddressfield.njk', () => '')
jest.mock('~/src/views/components/inset.njk', () => '')
jest.mock('~/src/views/components/textfield.njk', () => '')
jest.mock('~/src/views/components/radios.njk', () => '')
jest.mock('~/src/views/components/date-input.njk', () => '')

describe('email', () => {
  describe('Email', () => {
    it('should create class', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
      const res = setupPreview('emailaddressfield')
      expect(res).toBeInstanceOf(Email)
      expect(res).toBeDefined()
      expect(res.renderInput).toEqual({
        id: 'emailAddressField',
        name: 'emailAddressField',
        label: {
          text: 'Which quest would you like to pick?',
          classes: 'govuk-label--l'
        },
        hint: {
          text: 'Choose one adventure that best suits you.',
          classes: ''
        }
      })
      expect(res.titleText).toBe('Which quest would you like to pick?')
      expect(res.question).toBe('Which quest would you like to pick?')
      expect(res.hintText).toBe('Choose one adventure that best suits you.')
      expect(res.optional).toBeFalsy()
      expect(res.highlight).toBeNull()
    })
  })
})
