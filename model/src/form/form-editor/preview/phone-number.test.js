import {
  QuestionPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { PhoneNumberQuestion } from '~/src/form/form-editor/preview/phone-number.js'

describe('phone number', () => {
  const renderer = new QuestionRendererStub(jest.fn())
  const questionElements = new QuestionPreviewElements(baseElements)
  describe('PhoneNumber', () => {
    it('should create class', () => {
      const res = new PhoneNumberQuestion(questionElements, renderer)
      expect(res).toBeDefined()
      expect(res.renderInput).toEqual({
        id: 'phoneNumberField',
        name: 'phoneNumberField',
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
