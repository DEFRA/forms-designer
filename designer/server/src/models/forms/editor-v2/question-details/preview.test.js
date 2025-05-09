import {
  QuestionPreviewElements,
  getCheckedValue,
  getValueAsString
} from '~/src/models/forms/editor-v2/question-details/preview.js'

describe('preview', () => {
  const question = {
    name: 'question',
    id: 'question',
    label: {
      text: 'Question',
      classes: 'govuk-label--m'
    },
    value: 'Short answer'
  }
  const hintText = {
    name: 'hintText',
    id: 'hintText',
    label: {
      text: 'Hint text (optional)',
      classes: 'govuk-label--m'
    },
    rows: 3,
    value: ''
  }

  const questionOptional = {
    name: 'questionOptional',
    id: 'questionOptional',
    classes: 'govuk-checkboxes--small',
    items: [
      {
        value: 'true',
        text: 'Make this question optional',
        checked: true
      }
    ]
  }
  const shortDescription = {
    id: 'shortDescription',
    name: 'shortDescription',
    idPrefix: 'shortDescription',
    label: {
      text: 'Short description',
      classes: 'govuk-label--m'
    },
    hint: {
      text: "Enter a short description for this question like 'Licence period'. Short descriptions are used in error messages and on the check your answers page."
    },
    value: 'Short answer'
  }

  describe('getValueAsString', () => {
    it('should return value given question', () => {
      expect(getValueAsString(question)).toBe('Short answer')
    })
    it('should return empty string given questionOptional', () => {
      expect(getValueAsString(questionOptional)).toBe('')
    })
  })

  describe('getCheckedValue', () => {
    it('should return checked value given questionOptional', () => {
      expect(getCheckedValue(questionOptional)).toBe(true)
    })

    it('should return false given not questionOptional', () => {
      expect(getCheckedValue(shortDescription)).toBe(false)
    })
  })

  describe('QuestionPreviewElements', () => {
    /**
     * @type {GovukField[]}
     */
    const basePageFields = [
      question,
      hintText,
      questionOptional,
      shortDescription
    ]

    it('should create the correct preview elements', () => {
      const previewElements = new QuestionPreviewElements(basePageFields)
      expect(previewElements.values).toEqual({
        question: 'Short answer',
        hintText: '',
        optional: true,
        shortDesc: 'Short answer',
        items: []
      })
    })

    it('should get defaults', () => {
      const previewElements = new QuestionPreviewElements([])
      expect(previewElements.values).toEqual({
        question: '',
        hintText: '',
        optional: false,
        shortDesc: '',
        items: []
      })
    })

    it('should do nothing when setPreviewHTML is called', () => {
      const previewElements = new QuestionPreviewElements(basePageFields)
      Object.freeze(previewElements)
      const previewElements2 = structuredClone(previewElements)
      previewElements.setPreviewHTML('abc')
      expect(previewElements).toEqual(previewElements2)
    })
  })
})

/**
 * @import {GovukField} from '@defra/forms-model'
 */
