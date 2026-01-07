import {
  AutocompleteQuestion,
  CheckboxSortableQuestion,
  ComponentType,
  DateInputQuestion,
  EastingNorthingQuestion,
  EmailAddressQuestion,
  HiddenQuestion,
  LatLongQuestion,
  ListQuestion,
  LongAnswerQuestion,
  MonthYearQuestion,
  NationalGridQuestion,
  NumberOnlyQuestion,
  OsGridRefQuestion,
  PhoneNumberQuestion,
  Question,
  RadioSortableQuestion,
  SelectSortableQuestion,
  ShortAnswerQuestion,
  SupportingEvidenceQuestion,
  UkAddressQuestion,
  UnsupportedQuestion,
  YesNoQuestion
} from '@defra/forms-model'

import {
  QuestionPreviewElements,
  getCheckedValue,
  getListFromState,
  getPreviewConstructor,
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

  const usePostcodeLookup = {
    name: 'usePostcodeLookup',
    id: 'usePostcodeLookup',
    classes: 'govuk-checkboxes--small',
    items: [
      {
        value: 'true',
        text: 'Use postcode lookup',
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

  const autocompleteOptions = {
    id: 'autoCompleteOptions',
    name: 'autoCompleteOptions',
    idPrefix: 'autoCompleteOptions',
    label: {
      text: 'Add each option on a new line',
      classes: 'govuk-label--s',
      isPageHeading: false
    },
    hint: {
      text: 'To optionally set an input value for each item, separate the option text and value with a colon (e.g English:en-gb)'
    },
    customTemplate: 'auto-complete-options',
    value: 'Hydrogen:1\r\n' + 'Helium:2\r\n' + 'Lithium:3\r\n'
  }

  const classes = {
    name: 'classes',
    id: 'classes',
    label: {
      text: 'Classes',
      classes: 'govuk-label--m'
    },
    value: 'specific-class'
  }

  const prefix = {
    name: 'prefix',
    id: 'prefix',
    label: {
      text: 'Prefix',
      classes: 'govuk-label--m'
    },
    value: 'pre'
  }

  const suffix = {
    name: 'suffix',
    id: 'suffix',
    label: {
      text: 'Suffix',
      classes: 'govuk-label--m'
    },
    value: 'suf'
  }

  const questionSessionState = {
    questionType: ComponentType.RadiosField,
    editRow: {},
    listItems: [
      {
        id: 'c0f36d53-7591-4a5b-93a3-22d492a80bd6',
        text: 'Hydrogen',
        value: '1'
      },
      {
        id: '6b2ee8a2-0d40-405b-93d9-c9e8ffa0d025',
        text: 'Helium',
        value: '2'
      },
      {
        id: 'cff0706e-6755-4c73-9d2a-64db754c7484',
        text: 'Lithium',
        value: '3'
      }
    ]
  }

  /**
   * @type {GovukField[]}
   */
  const basePageFields = [
    question,
    hintText,
    questionOptional,
    shortDescription,
    usePostcodeLookup,
    classes,
    prefix,
    suffix
  ]

  describe('getValueAsString', () => {
    it('should return value given question', () => {
      expect(getValueAsString(question)).toBe('Short answer')
    })
    it('should return empty string given questionOptional', () => {
      expect(getValueAsString(questionOptional)).toBe('')
    })
    it('should return value as string given _autocompleteOptions', () => {
      expect(getValueAsString(autocompleteOptions)).toBe(
        'Hydrogen:1\r\n' + 'Helium:2\r\n' + 'Lithium:3\r\n'
      )
    })
  })

  describe('getCheckedValue', () => {
    it('should return checked value given questionOptional', () => {
      expect(getCheckedValue(questionOptional)).toBe(true)
    })

    it('should return checked value given usePostcodeLookup', () => {
      expect(getCheckedValue(usePostcodeLookup)).toBe(true)
    })

    it('should return false given questionOptional is not checked', () => {
      expect(
        getCheckedValue({
          ...questionOptional,
          items: [
            {
              value: 'true',
              text: 'Make this question optional',
              checked: false
            }
          ]
        })
      ).toBe(false)
    })

    it('should return false given usePostcodeLookup is not checked', () => {
      expect(
        getCheckedValue({
          ...usePostcodeLookup,
          items: [
            {
              value: 'true',
              text: 'Use postcode lookup',
              checked: false
            }
          ]
        })
      ).toBe(false)
    })

    it('should return false given not questionOptional', () => {
      expect(getCheckedValue(shortDescription)).toBe(false)
    })
  })

  describe('getListFromState', () => {
    it('should return a list if there is one', () => {
      expect(getListFromState(questionSessionState)).toEqual([
        {
          id: 'c0f36d53-7591-4a5b-93a3-22d492a80bd6',
          text: 'Hydrogen',
          value: '1',
          label: {
            text: 'Hydrogen',
            classes: ''
          }
        },
        {
          id: '6b2ee8a2-0d40-405b-93d9-c9e8ffa0d025',
          text: 'Helium',
          value: '2',
          label: {
            text: 'Helium',
            classes: ''
          }
        },
        {
          id: 'cff0706e-6755-4c73-9d2a-64db754c7484',
          text: 'Lithium',
          value: '3',
          label: {
            text: 'Lithium',
            classes: ''
          }
        }
      ])
    })
    it('should return an empty array if not a list', () => {
      expect(getListFromState({})).toEqual([])
    })
    it('should return an empty array if state is undefined', () => {
      expect(getListFromState(undefined)).toEqual([])
    })
  })

  describe('QuestionPreviewElements', () => {
    it('should create the correct preview elements', () => {
      const previewElements = new QuestionPreviewElements(basePageFields, {})
      expect(previewElements.values).toEqual({
        question: 'Short answer',
        hintText: '',
        userClasses: 'specific-class',
        content: '',
        largeTitle: true,
        optional: true,
        shortDesc: 'Short answer',
        usePostcodeLookup: true,
        items: [],
        prefix: 'pre',
        suffix: 'suf',
        instructionText: ''
      })
    })

    it('should get defaults', () => {
      const previewElements = new QuestionPreviewElements([], {})
      expect(previewElements.values).toEqual({
        question: '',
        hintText: '',
        userClasses: '',
        largeTitle: true,
        content: '',
        optional: false,
        shortDesc: '',
        usePostcodeLookup: false,
        items: [],
        prefix: '',
        suffix: '',
        instructionText: ''
      })
    })

    it('should do nothing when setPreviewHTML is called', () => {
      const previewElements = new QuestionPreviewElements(
        basePageFields,
        undefined
      )
      Object.freeze(previewElements)
      const previewElements2 = structuredClone(previewElements)
      previewElements.setPreviewHTML('abc')
      expect(previewElements).toEqual(previewElements2)
    })

    it('should get autocomplete options', () => {
      const previewElements = new QuestionPreviewElements(
        [...basePageFields, autocompleteOptions],
        {}
      )
      expect(previewElements.autocompleteOptions).toBe(
        'Hydrogen:1\r\n' + 'Helium:2\r\n' + 'Lithium:3\r\n'
      )
    })
  })

  describe('getPreviewConstructor', () => {
    const previewElements = new QuestionPreviewElements(basePageFields, {})

    it('should get TextField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.TextField,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(ShortAnswerQuestion)
    })

    it('should get MultilineTextField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.MultilineTextField,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(LongAnswerQuestion)
    })

    it('should get YesNoField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.YesNoField,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(YesNoQuestion)
    })

    it('should get MonthYearField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.MonthYearField,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(MonthYearQuestion)
    })

    it('should get SelectField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.SelectField,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(ListQuestion)
    })

    it('should get SupportingEvidenceQuestion', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.FileUploadField,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(SupportingEvidenceQuestion)
    })

    it('should get NumberField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.NumberField,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(NumberOnlyQuestion)
    })

    it('should get Html', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.Html,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(Question)
    })

    it('should get InsetText', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.InsetText,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(Question)
    })

    it('should get Details', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.Details,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(Question)
    })

    it('should get List', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.List,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(Question)
    })

    it('should get Markdown', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.Markdown,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(Question)
    })

    it('should get FileUploadField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.FileUploadField,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(Question)
    })

    it('should get AutocompleteField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.AutocompleteField,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(AutocompleteQuestion)
    })

    it('should get CheckboxesField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.CheckboxesField,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(CheckboxSortableQuestion)
    })

    it('should get Question', () => {
      const previewModel = getPreviewConstructor('Question', previewElements)

      expect(previewModel).toBeInstanceOf(Question)
    })

    it('should get DatePartsField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.DatePartsField,
        previewElements
      )
      expect(previewModel).toBeInstanceOf(DateInputQuestion)
    })

    it('should get EmailAddress', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.EmailAddressField,
        previewElements
      )
      expect(previewModel).toBeInstanceOf(EmailAddressQuestion)
    })

    it('should get UkAddress', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.UkAddressField,
        previewElements
      )
      expect(previewModel).toBeInstanceOf(UkAddressQuestion)
    })

    it('should get PhoneNumber', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.TelephoneNumberField,
        previewElements
      )
      expect(previewModel).toBeInstanceOf(PhoneNumberQuestion)
    })

    it('should get RadioSortable', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.RadiosField,
        previewElements
      )
      expect(previewModel).toBeInstanceOf(RadioSortableQuestion)
    })

    it('should get SelectSortable', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.SelectField,
        previewElements
      )
      expect(previewModel).toBeInstanceOf(SelectSortableQuestion)
    })

    it('should get DeclarationField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.DeclarationField,
        previewElements
      )
      expect(previewModel).toBeInstanceOf(Question)
    })
    it('should get EastingNorthingField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.EastingNorthingField,
        previewElements
      )
      expect(previewModel).toBeInstanceOf(EastingNorthingQuestion)
    })

    it('should get OsGridRefField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.OsGridRefField,
        previewElements
      )
      expect(previewModel).toBeInstanceOf(OsGridRefQuestion)
    })

    it('should get NationalGridFieldNumberField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.NationalGridFieldNumberField,
        previewElements
      )
      expect(previewModel).toBeInstanceOf(NationalGridQuestion)
    })

    it('should get LatLongField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.LatLongField,
        previewElements
      )
      expect(previewModel).toBeInstanceOf(LatLongQuestion)
    })

    it('should get HiddenField', () => {
      const previewModel = getPreviewConstructor(
        ComponentType.HiddenField,
        previewElements
      )

      expect(previewModel).toBeInstanceOf(HiddenQuestion)
    })

    it('should get UnsupportedQuestion', () => {
      const previewModel = getPreviewConstructor(
        // @ts-expect-error - invalid field type
        'UnknownField',
        previewElements
      )

      expect(previewModel).toBeInstanceOf(UnsupportedQuestion)
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

    const expectedQuestionModel = /** @type {QuestionBaseModel} */ ({
      classes: '',
      hint: {
        classes: '',
        text: ''
      },
      id: expect.stringContaining('inputField'),
      label: {
        classes: 'govuk-label--l',
        isPageHeading: true,
        text: 'Short answer (optional)'
      },
      name: 'inputField',
      previewClasses: ''
    })

    const fieldSetModelBase = /** @type {QuestionBaseModel} */ ({
      hint: {
        classes: '',
        text: ''
      },
      id: '',
      name: '',
      fieldset: {
        legend: {
          classes: 'govuk-fieldset__legend--l',
          isPageHeading: true,
          text: 'Short answer (optional)'
        }
      },
      classes: ''
    })

    const formGroupBase = {
      formGroup: {
        afterInputs: {
          html: '<div class="govuk-inset-text">No items added yet.</div>'
        }
      }
    }

    const listModelBase = /** @type {QuestionBaseModel} */ ({
      fieldset: {
        legend: {
          classes: 'govuk-fieldset__legend--l',
          isPageHeading: true,
          text: 'Short answer (optional)'
        }
      },
      hint: {
        classes: '',
        text: ''
      },
      id: 'listInput',
      items: [],
      name: 'listInputField',
      classes: ''
    })

    it('should get TextField', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.TextField
      )
      const expectedBaseModel = /** @type {QuestionBaseModel} */ ({
        classes: '',
        hint: {
          classes: '',
          text: ''
        },
        id: expect.stringContaining('inputField'),
        label: {
          classes: 'govuk-label--l',
          isPageHeading: true,
          text: 'Short answer (optional)'
        },
        name: 'inputField',
        previewClasses: ''
      })
      expect(previewModel).toEqual(expectedBaseModel)
    })

    it('should get MultilineTextField', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.MultilineTextField
      )

      expect(previewModel).toEqual({
        ...expectedQuestionModel,
        id: 'longAnswerField',
        name: 'longAnswerField'
      })
    })

    it('should get MonthYearField', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.MonthYearField
      )

      expect(previewModel).toEqual({
        ...fieldSetModelBase,
        items: [
          {
            name: 'month',
            classes: 'govuk-input--width-2'
          },
          {
            name: 'year',
            classes: 'govuk-input--width-4'
          }
        ],
        id: 'monthYear',
        name: 'monthYear'
      })
    })

    it('should get SelectField', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.SelectField
      )

      expect(previewModel).toEqual({
        id: expect.stringContaining('inputField'),
        name: 'inputField',
        label: {
          classes: 'govuk-label--l',
          isPageHeading: true,
          text: 'Short answer (optional)'
        },
        hint: {
          classes: '',
          text: ''
        },
        items: [],
        classes: 'govuk-visually-hidden',
        formGroup: {
          afterInput: {
            html: '<div class="govuk-inset-text">No items added yet.</div>'
          }
        }
      })
    })

    it('should get NumberField', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.NumberField
      )

      expect(previewModel).toEqual({
        ...expectedQuestionModel,
        id: 'numberField',
        name: 'numberField',
        type: 'number'
      })
    })

    it('should get Html', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.Html
      )

      expect(previewModel).toEqual(expectedQuestionModel)
    })

    it('should get InsetText', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.InsetText
      )

      expect(previewModel).toEqual(expectedQuestionModel)
    })

    it('should get Details', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.Details
      )

      expect(previewModel).toEqual(expectedQuestionModel)
    })

    it('should get List', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.List
      )

      expect(previewModel).toEqual(expectedQuestionModel)
    })

    it('should get Markdown', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.Markdown
      )

      expect(previewModel).toEqual(expectedQuestionModel)
    })

    it('should get FileUploadField', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.FileUploadField
      )

      expect(previewModel).toEqual({
        ...expectedQuestionModel,
        id: 'supportingEvidence',
        name: 'supportingEvidence'
      })
    })

    it('should get AutocompleteField', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.AutocompleteField
      )

      expect(previewModel).toEqual({
        id: 'autoCompleteField',
        name: 'autoCompleteField',
        attributes: {
          'data-module': 'govuk-accessible-autocomplete'
        },
        label: {
          classes: 'govuk-label--l',
          isPageHeading: true,
          text: 'Short answer (optional)'
        },
        hint: {
          classes: '',
          text: ''
        },
        items: [{ id: '', text: '', value: '' }]
      })
    })

    it('should get CheckboxesField', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.CheckboxesField
      )

      expect(previewModel).toEqual({
        ...listModelBase,
        ...formGroupBase,
        id: 'checkboxField',
        name: 'checkboxField'
      })
    })

    it('should get Question', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        // @ts-expect-error - unknown component type
        'Question'
      )

      expect(previewModel).toEqual(expectedQuestionModel)
    })

    it('should get DatePartsField', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.DatePartsField
      )
      expect(previewModel).toEqual({
        ...fieldSetModelBase,
        id: 'dateInput',
        name: 'dateInput'
      })
    })

    it('should get EmailAddress', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.EmailAddressField
      )
      const expectedBaseModel = /** @type {QuestionBaseModel} */ ({
        classes: '',
        hint: {
          classes: '',
          text: ''
        },
        id: 'emailAddressField',
        label: {
          classes: 'govuk-label--l',
          isPageHeading: true,
          text: 'Short answer (optional)'
        },
        name: 'emailAddressField',
        previewClasses: ''
      })
      expect(previewModel).toEqual(expectedBaseModel)
    })

    it('should get UkAddress', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.UkAddressField
      )
      const expectedBaseModel = /** @type {QuestionBaseModel} */ ({
        hint: {
          classes: '',
          text: ''
        },
        id: 'addressField',
        fieldset: {
          legend: {
            classes: 'govuk-fieldset__legend--l',
            isPageHeading: true,
            text: 'Short answer (optional)'
          }
        },
        name: 'addressField',
        classes: '',
        usePostcodeLookup: false
      })
      expect(previewModel).toEqual(expectedBaseModel)
    })

    it('should get PhoneNumber', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.TelephoneNumberField
      )
      const expectedBaseModel = /** @type {QuestionBaseModel} */ ({
        classes: '',
        hint: {
          classes: '',
          text: ''
        },
        id: 'phoneNumberField',
        label: {
          classes: 'govuk-label--l',
          isPageHeading: true,
          text: 'Short answer (optional)'
        },
        name: 'phoneNumberField',
        previewClasses: ''
      })
      expect(previewModel).toEqual(expectedBaseModel)
    })

    it('should get RadioSortable', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.RadiosField
      )
      expect(previewModel).toEqual({ ...listModelBase, ...formGroupBase })
    })

    it('should get RadioSortable with list items', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        questionSessionState,
        ComponentType.RadiosField
      )
      expect(previewModel).toEqual({
        ...listModelBase,
        items: [
          {
            id: 'c0f36d53-7591-4a5b-93a3-22d492a80bd6',
            hint: undefined,
            label: {
              classes: '',
              text: 'Hydrogen'
            },
            text: 'Hydrogen',
            value: '1'
          },
          {
            id: '6b2ee8a2-0d40-405b-93d9-c9e8ffa0d025',
            hint: undefined,
            label: {
              classes: '',
              text: 'Helium'
            },
            text: 'Helium',
            value: '2'
          },
          {
            id: 'cff0706e-6755-4c73-9d2a-64db754c7484',
            hint: undefined,
            label: {
              classes: '',
              text: 'Lithium'
            },
            text: 'Lithium',
            value: '3'
          }
        ]
      })
    })

    it('should get EastingNorthingField', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.EastingNorthingField
      )
      expect(previewModel).toMatchObject({
        hint: {
          classes: '',
          text: ''
        },
        instructionText: ''
      })
      // Location fields have a complex structure that may vary
      expect(previewModel).toHaveProperty('id')
    })

    it('should get OsGridRefField', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.OsGridRefField
      )
      expect(previewModel).toMatchObject({
        hint: {
          classes: '',
          text: ''
        },
        instructionText: ''
      })
      // Location fields have a complex structure that may vary
      expect(previewModel).toHaveProperty('id')
    })

    it('should get NationalGridFieldNumberField', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.NationalGridFieldNumberField
      )
      expect(previewModel).toMatchObject({
        hint: {
          classes: '',
          text: ''
        },
        instructionText: ''
      })
      // Location fields have a complex structure that may vary
      expect(previewModel).toHaveProperty('id')
    })

    it('should get LatLongField', () => {
      const previewModel = getPreviewModel(
        basePageFields,
        {},
        ComponentType.LatLongField
      )
      expect(previewModel).toMatchObject({
        hint: {
          classes: '',
          text: ''
        },
        instructionText: ''
      })
      // Location fields have a complex structure that may vary
      expect(previewModel).toHaveProperty('id')
    })
  })
})

/**
 * @import { GovukField, QuestionBaseModel } from '@defra/forms-model'
 */
