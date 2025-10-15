import {
  QuestionPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { UkAddressQuestion } from '~/src/form/form-editor/preview/uk-address.js'

describe('address', () => {
  describe('Address', () => {
    it('should create class', () => {
      const elements = new QuestionPreviewElements(baseElements)
      const renderer = new QuestionRendererStub(jest.fn())
      const res = new UkAddressQuestion(elements, renderer)
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
