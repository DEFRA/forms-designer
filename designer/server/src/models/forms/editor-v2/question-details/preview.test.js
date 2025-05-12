import { ComponentType } from '@defra/forms-model'

import {
  QuestionPreviewElements,
  getCheckedValue,
  getPreviewModel,
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

  describe('getPreviewModel', () => {
    /**
     * @type {GovukField[]}
     */
    const basePageFields = [
      question,
      hintText,
      questionOptional,
      shortDescription
    ]

    it('should get ShortAnswer', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        ComponentType.TextField
      )
      const expectedBaseModel = /** @type {QuestionBaseModel} */ ({
        hint: {
          classes: '',
          text: ''
        },
        id: 'inputField',
        label: {
          classes: 'govuk-label--l',
          text: 'Short answer (optional)'
        },
        name: 'inputField'
      })
      expect(previewModel).toEqual(expectedBaseModel)
    })

    it('should get Question', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        // @ts-expect-error - unknown component type
        'unknown'
      )
      const expectedBaseModel = /** @type {QuestionBaseModel} */ ({
        hint: {
          classes: '',
          text: ''
        },
        id: 'inputField',
        label: {
          classes: 'govuk-label--l',
          text: 'Short answer (optional)'
        },
        name: 'inputField'
      })
      expect(previewModel).toEqual(expectedBaseModel)
    })

    it('should get DateInput', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        ComponentType.DatePartsField
      )
      const expectedBaseModel = /** @type {QuestionBaseModel} */ ({
        fieldset: {
          legend: {
            classes: 'govuk-fieldset__legend--l',
            text: 'Short answer (optional)'
          }
        },
        hint: {
          classes: '',
          text: ''
        },
        id: 'dateInput',
        name: 'dateInputField'
      })
      expect(previewModel).toEqual(expectedBaseModel)
    })

    it('should get EmailAddress', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        ComponentType.EmailAddressField
      )
      const expectedBaseModel = /** @type {QuestionBaseModel} */ ({
        hint: {
          classes: '',
          text: ''
        },
        id: 'emailAddressField',
        label: {
          classes: 'govuk-label--l',
          text: 'Short answer (optional)'
        },
        name: 'emailAddressField'
      })
      expect(previewModel).toEqual(expectedBaseModel)
    })

    it('should get UkAddress', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        ComponentType.UkAddressField
      )
      const expectedBaseModel = /** @type {QuestionBaseModel} */ ({
        hint: {
          classes: '',
          text: ''
        },
        id: 'addressField',
        label: {
          classes: 'govuk-label--l',
          text: 'Short answer (optional)'
        },
        name: 'addressField'
      })
      expect(previewModel).toEqual(expectedBaseModel)
    })

    it('should get PhoneNumber', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        ComponentType.TelephoneNumberField
      )
      const expectedBaseModel = /** @type {QuestionBaseModel} */ ({
        hint: {
          classes: '',
          text: ''
        },
        id: 'phoneNumberField',
        label: {
          classes: 'govuk-label--l',
          text: 'Short answer (optional)'
        },
        name: 'phoneNumberField'
      })
      expect(previewModel).toEqual(expectedBaseModel)
    })

    it('should get RadioSortable', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        ComponentType.RadiosField
      )
      const expectedBaseModel = /** @type {QuestionBaseModel} */ ({
        fieldset: {
          legend: {
            classes: 'govuk-fieldset__legend--l',
            text: 'Short answer (optional)'
          }
        },
        formGroup: {
          afterInputs: {
            html: '<div class="govuk-inset-text">No items added yet.</div>'
          }
        },
        hint: {
          classes: '',
          text: ''
        },
        id: 'listInput',
        items: [],
        name: 'listInputField'
      })
      expect(previewModel).toEqual(expectedBaseModel)
    })
  })
})

/**
 * @import { GovukField, QuestionBaseModel } from '@defra/forms-model'
 */
