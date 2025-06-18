import {
  QuestionPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { EmailAddressQuestion } from '~/src/form/form-editor/preview/email-address.js'

describe('email', () => {
  const renderer = new QuestionRendererStub(jest.fn())
  describe('Email', () => {
    it('should create class', () => {
      const elements = new QuestionPreviewElements(baseElements)
      const res = new EmailAddressQuestion(elements, renderer)

      expect(res).toBeDefined()
      expect(res.renderInput).toEqual({
        id: 'emailAddressField',
        name: 'emailAddressField',
        classes: '',
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
