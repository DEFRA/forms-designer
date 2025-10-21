import { QuestionAdvancedSettings } from '~/src/common/constants/editor.js'
import {
  GOVUK_INPUT_WIDTH_3,
  GOVUK_LABEL__M
} from '~/src/models/forms/editor-v2/common.js'

/**
 * Configuration mapping component types to their available advanced settings
 * @type {Record<ComponentType, QuestionAdvancedSettings[]>}
 */
export const advancedSettingsPerComponentType =
  /** @type {Record<ComponentType, QuestionAdvancedSettings[]> } */ ({
    TextField: [
      QuestionAdvancedSettings.MinLength,
      QuestionAdvancedSettings.MaxLength,
      QuestionAdvancedSettings.Regex,
      QuestionAdvancedSettings.Classes
    ],
    MultilineTextField: [
      QuestionAdvancedSettings.MinLength,
      QuestionAdvancedSettings.MaxLength,
      QuestionAdvancedSettings.Rows,
      QuestionAdvancedSettings.Regex,
      QuestionAdvancedSettings.Classes
    ],
    YesNoField: [],
    DatePartsField: [
      QuestionAdvancedSettings.MaxPast,
      QuestionAdvancedSettings.MaxFuture,
      QuestionAdvancedSettings.Classes
    ],
    MonthYearField: [],
    SelectField: [],
    AutocompleteField: [],
    RadiosField: [],
    CheckboxesField: [],
    NumberField: [
      QuestionAdvancedSettings.Min,
      QuestionAdvancedSettings.Max,
      QuestionAdvancedSettings.Precision,
      QuestionAdvancedSettings.Prefix,
      QuestionAdvancedSettings.Suffix
    ],
    UkAddressField: [],
    TelephoneNumberField: [QuestionAdvancedSettings.Classes],
    EmailAddressField: [QuestionAdvancedSettings.Classes],
    Html: [],
    InsetText: [],
    Details: [],
    List: [],
    Markdown: [],
    FileUploadField: [
      QuestionAdvancedSettings.MinFiles,
      QuestionAdvancedSettings.MaxFiles,
      QuestionAdvancedSettings.ExactFiles
    ],
    EastingNorthingField: [
      QuestionAdvancedSettings.GiveInstructions,
      QuestionAdvancedSettings.InstructionText,
      QuestionAdvancedSettings.Classes
    ],
    OsGridRefField: [
      QuestionAdvancedSettings.GiveInstructions,
      QuestionAdvancedSettings.InstructionText,
      QuestionAdvancedSettings.Classes
    ],
    NationalGridFieldNumberField: [
      QuestionAdvancedSettings.GiveInstructions,
      QuestionAdvancedSettings.InstructionText,
      QuestionAdvancedSettings.Classes
    ],
    LatLongField: [
      QuestionAdvancedSettings.GiveInstructions,
      QuestionAdvancedSettings.InstructionText,
      QuestionAdvancedSettings.Classes
    ]
  })

/**
 * Field definitions for all advanced settings
 * @type {Record<ComponentType, GovukField>}
 */
export const allAdvancedSettingsFields =
  /** @type { Record<QuestionAdvancedSettings, GovukField> } */ ({
    [QuestionAdvancedSettings.Classes]: {
      name: 'classes',
      id: 'classes',
      label: {
        text: 'Classes (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: "Apply CSS classes to this field. For example, 'govuk-input govuk-!-width-full'"
      },
      rows: 1
    },
    [QuestionAdvancedSettings.Min]: {
      name: 'min',
      id: 'min',
      label: {
        text: 'Lowest number users can enter (optional)',
        classes: GOVUK_LABEL__M
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.Max]: {
      name: 'max',
      id: 'max',
      label: {
        text: 'Highest number users can enter (optional)',
        classes: GOVUK_LABEL__M
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.ExactFiles]: {
      name: 'exactFiles',
      id: 'exactFiles',
      label: {
        text: 'Exact file count (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'The exact number of files users can upload. Using this setting negates any values you set for Min or Max file count'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.MinFiles]: {
      name: 'minFiles',
      id: 'minFiles',
      label: {
        text: 'Minimum file count (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'The minimum number of files users can upload'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.MaxFiles]: {
      name: 'maxFiles',
      id: 'maxFiles',
      label: {
        text: 'Maximum file count (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'The maximum number of files users can upload'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.MinLength]: {
      name: 'minLength',
      id: 'minLength',
      label: {
        text: 'Minimum character length (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'The minimum number of characters users can enter'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.MaxLength]: {
      name: 'maxLength',
      id: 'maxLength',
      label: {
        text: 'Maximum character length (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'The maximum number of characters users can enter'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.MaxFuture]: {
      name: 'maxFuture',
      id: 'maxFuture',
      label: {
        text: 'Max days in the future (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Determines the latest date users can enter'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.MaxPast]: {
      name: 'maxPast',
      id: 'maxPast',
      label: {
        text: 'Max days in the past (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Determines the earliest date users can enter'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.Precision]: {
      name: 'precision',
      id: 'precision',
      label: {
        text: 'Precision (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Specifies the number of decimal places users can enter. For example, to allow users to enter numbers with up to two decimal places, set this to 2'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.Prefix]: {
      name: 'prefix',
      id: 'prefix',
      label: {
        text: 'Prefix (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: "For example, a symbol or abbreviation for the type of information you're asking for, like, '£'"
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.Regex]: {
      name: 'regex',
      id: 'regex',
      label: {
        text: 'Regex (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: "Specifies a regular expression to validate users' inputs. Use JavaScript syntax"
      },
      rows: 3
    },
    [QuestionAdvancedSettings.Rows]: {
      name: 'rows',
      id: 'rows',
      label: {
        text: 'Rows (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Specifices the number of textarea rows (default is 5 rows)'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.Suffix]: {
      name: 'suffix',
      id: 'suffix',
      label: {
        text: 'Suffix (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: "For example, a symbol or abbreviation for the type of information you're asking for, like, 'per item' or 'Kg'"
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.GiveInstructions]: {
      name: 'giveInstructions',
      id: 'giveInstructions',
      classes: 'govuk-checkboxes--small',
      items: [
        {
          value: 'true',
          text: 'Give instructions to help users answer this question',
          checked: false
        }
      ]
    },
    [QuestionAdvancedSettings.InstructionText]: {
      name: 'instructionText',
      id: 'instructionText',
      label: {
        text: 'Instructions to help users answer this question',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'You can use markdown formatting.'
      },
      rows: 8
    }
  })

/**
 * @import { ComponentType, GovukField } from '@defra/forms-model'
 */
