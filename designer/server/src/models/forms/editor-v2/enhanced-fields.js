import { QuestionEnhancedFields } from '~/src/common/constants/editor.js'
import { GOVUK_LABEL__M } from '~/src/models/forms/editor-v2/common.js'

export const enhancedFieldsPerComponentType =
  /** @type {Partial<Record<ComponentType, QuestionEnhancedFields[]>>} */ ({
    TextField: [],
    MultilineTextField: [],
    YesNoField: [],
    DatePartsField: [],
    MonthYearField: [],
    SelectField: [
      QuestionEnhancedFields.RadioId,
      QuestionEnhancedFields.RadioText,
      QuestionEnhancedFields.RadioHint,
      QuestionEnhancedFields.RadioValue
    ],
    AutocompleteField: [],
    RadiosField: [
      QuestionEnhancedFields.RadioId,
      QuestionEnhancedFields.RadioText,
      QuestionEnhancedFields.RadioHint,
      QuestionEnhancedFields.RadioValue
    ],
    // Checkboxes carry the exclusive option fields after the shared four. The
    // edit template relies on that order, and on the extra fields being absent
    // for every other component type.
    CheckboxesField: [
      QuestionEnhancedFields.RadioId,
      QuestionEnhancedFields.RadioText,
      QuestionEnhancedFields.RadioHint,
      QuestionEnhancedFields.RadioValue,
      QuestionEnhancedFields.RadioExclusive,
      QuestionEnhancedFields.RadioAdditionalTitle,
      QuestionEnhancedFields.RadioAdditionalHint,
      QuestionEnhancedFields.RadioAdditionalMaxLength,
      QuestionEnhancedFields.RadioAdditionalOptional
    ],
    NumberField: [],
    UkAddressField: [],
    TelephoneNumberField: [],
    EmailAddressField: [],
    Html: [],
    InsetText: [],
    Details: [],
    List: [],
    Markdown: [],
    FileUploadField: [],
    DeclarationField: [],
    EastingNorthingField: [],
    OsGridRefField: [],
    NationalGridFieldNumberField: [],
    LatLongField: [],
    HiddenField: []
  })

/**
 * @type { Record<ComponentType, GovukField> }
 */
export const allEnhancedFields =
  /** @type { Record<QuestionEnhancedFields, GovukField> } */ ({
    [QuestionEnhancedFields.RadioId]: {
      name: 'radioId',
      id: 'radioId'
    },
    [QuestionEnhancedFields.RadioText]: {
      name: 'radioText',
      id: 'radioText',
      label: {
        text: 'Item',
        classes: GOVUK_LABEL__M
      }
    },
    [QuestionEnhancedFields.RadioHint]: {
      name: 'radioHint',
      id: 'radioHint',
      label: {
        text: 'Hint text (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Use single short sentence without a full stop'
      }
    },
    [QuestionEnhancedFields.RadioValue]: {
      name: 'radioValue',
      id: 'radioValue',
      label: {
        text: 'Unique identifier (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Used in databases to identify the item'
      }
    },
    [QuestionEnhancedFields.RadioExclusive]: {
      name: 'radioExclusive',
      id: 'radioExclusive',
      items: [
        {
          value: 'true',
          text: 'Make this a ‘none of the above’ item',
          hint: {
            text: 'Selecting it clears every other item. It must be the first or the last item in the list.'
          }
        }
      ]
    },
    [QuestionEnhancedFields.RadioAdditionalTitle]: {
      name: 'radioAdditionalTitle',
      id: 'radioAdditionalTitle',
      label: {
        text: 'Follow-up question (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Shown only while this item is selected. Leave blank for no follow-up question'
      }
    },
    [QuestionEnhancedFields.RadioAdditionalHint]: {
      name: 'radioAdditionalHint',
      id: 'radioAdditionalHint',
      label: {
        text: 'Follow-up question hint text (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Use single short sentence without a full stop'
      }
    },
    [QuestionEnhancedFields.RadioAdditionalMaxLength]: {
      name: 'radioAdditionalMaxLength',
      id: 'radioAdditionalMaxLength',
      classes: 'govuk-input--width-3',
      type: 'number',
      label: {
        text: 'Maximum number of characters (optional)',
        classes: GOVUK_LABEL__M
      }
    },
    [QuestionEnhancedFields.RadioAdditionalOptional]: {
      name: 'radioAdditionalOptional',
      id: 'radioAdditionalOptional',
      items: [
        {
          value: 'true',
          text: 'Make the follow-up question optional'
        }
      ]
    }
  })

/**
 * @import { ComponentType, GovukField } from '@defra/forms-model'
 */
