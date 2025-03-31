import { QuestionEnhancedFields } from '~/src/common/constants/editor.js'
import { GOVUK_LABEL__M } from '~/src/models/forms/editor-v2/common.js'

export const enhancedFieldsPerComponentType =
  /** @type {Record<ComponentType, QuestionEnhancedFields[]> } */ ({
    TextField: [],
    MultilineTextField: [],
    YesNoField: [],
    DatePartsField: [],
    MonthYearField: [],
    SelectField: [],
    AutocompleteField: [],
    RadiosField: [
      QuestionEnhancedFields.RadioId,
      QuestionEnhancedFields.RadioLabel,
      QuestionEnhancedFields.RadioHint,
      QuestionEnhancedFields.RadioValue
    ],
    CheckboxesField: [
      QuestionEnhancedFields.RadioId,
      QuestionEnhancedFields.RadioLabel,
      QuestionEnhancedFields.RadioHint,
      QuestionEnhancedFields.RadioValue
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
    FileUploadField: []
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
    [QuestionEnhancedFields.RadioLabel]: {
      name: 'radioLabel',
      id: 'radioLabel',
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
    }
  })

/**
 * @import { ComponentType, GovukField } from '@defra/forms-model'
 */
