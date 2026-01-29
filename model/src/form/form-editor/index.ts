import Joi, { type ArraySchema, type GetRuleOptions } from 'joi'

import { ComponentType } from '~/src/components/enums.js'
import {
  MAX_NUMBER_OF_REPEAT_ITEMS,
  MIN_NUMBER_OF_REPEAT_ITEMS
} from '~/src/form/form-definition/index.js'
import {
  type FormEditorInputCheckAnswersSettings,
  type FormEditorInputPage,
  type FormEditorInputPageSettings,
  type FormEditorInputQuestion,
  type GovukField,
  type GovukFieldQuestionOptional,
  type GovukFieldUsePostcodeLookup,
  type GovukStringField
} from '~/src/form/form-editor/types.js'

export enum QuestionTypeSubGroup {
  WrittenAnswerSubGroup = 'writtenAnswerSub',
  DateSubGroup = 'dateSub',
  ListSubGroup = 'listSub',
  LocationSubGroup = 'locationSub'
}

export const pageTypeSchema = Joi.string()
  .required()
  .valid('question', 'guidance')
  .description('Type of page - either a question page or guidance page')

export const questionTypeSchema = Joi.string()
  .required()
  .valid(
    QuestionTypeSubGroup.WrittenAnswerSubGroup,
    QuestionTypeSubGroup.DateSubGroup,
    QuestionTypeSubGroup.LocationSubGroup,
    ComponentType.UkAddressField,
    ComponentType.TelephoneNumberField,
    ComponentType.FileUploadField,
    ComponentType.EmailAddressField,
    ComponentType.DeclarationField,
    QuestionTypeSubGroup.ListSubGroup,
    ComponentType.YesNoField,
    ComponentType.CheckboxesField,
    ComponentType.RadiosField,
    ComponentType.AutocompleteField,
    ComponentType.PaymentField
  )
  .description('The high-level type of question, including grouped types')

export const questionTypeFullSchema = Joi.string()
  .required()
  .valid(
    ComponentType.TextField,
    ComponentType.MultilineTextField,
    ComponentType.NumberField,
    ComponentType.DatePartsField,
    ComponentType.MonthYearField,
    ComponentType.UkAddressField,
    ComponentType.TelephoneNumberField,
    ComponentType.FileUploadField,
    ComponentType.EmailAddressField,
    ComponentType.DeclarationField,
    ComponentType.YesNoField,
    ComponentType.CheckboxesField,
    ComponentType.RadiosField,
    ComponentType.AutocompleteField,
    ComponentType.SelectField,
    ComponentType.EastingNorthingField,
    ComponentType.OsGridRefField,
    ComponentType.NationalGridFieldNumberField,
    ComponentType.LatLongField
  )
  .description('The specific component type to use for this question')

export const writtenAnswerSubSchema = Joi.string()
  .required()
  .valid(
    ComponentType.TextField,
    ComponentType.MultilineTextField,
    ComponentType.NumberField
  )
  .description('Subtype for written answer questions')

export const dateSubSchema = Joi.string()
  .required()
  .valid(ComponentType.DatePartsField, ComponentType.MonthYearField)
  .description('Subtype for date-related questions')

export const listSubSchema = Joi.string()
  .required()
  .valid(
    ComponentType.YesNoField,
    ComponentType.CheckboxesField,
    ComponentType.RadiosField,
    ComponentType.AutocompleteField,
    ComponentType.SelectField
  )
  .description('Subtype for list-related questions')

export const locationSubSchema = Joi.string()
  .required()
  .valid(
    ComponentType.UkAddressField,
    ComponentType.EastingNorthingField,
    ComponentType.OsGridRefField,
    ComponentType.NationalGridFieldNumberField,
    ComponentType.LatLongField
  )
  .description('Subtype for location-related questions')

export const nameSchema = Joi.string()
  .trim()
  .required()
  .description('Unique identifier for the field')

export const questionSchema = Joi.string()
  .trim()
  .required()
  .description('The question text displayed to the user')

export const hintTextSchema = Joi.string()
  .trim()
  .optional()
  .allow('')
  .description('Optional guidance text displayed below the question')

export const instructionTextSchema = Joi.string()
  .trim()
  .optional()
  .allow('')
  .description(
    'Optional instruction text with markdown support to help users answer the question'
  )

export const questionOptionalSchema = Joi.string()
  .trim()
  .optional()
  .valid('', 'true')
  .description(
    'Indicates whether a question is optional. Empty string or "true" values are accepted.'
  )

export const listForQuestionSchema = Joi.string()
  .trim()
  .optional()
  .allow('')
  .description('Unique identifier for the list used by the field')

export const listItemCountSchema = Joi.number()
  .optional()
  .description('Number of list items in the list used by the field')

export const listItemsDataSchema = Joi.string()
  .allow('')
  .description('List items in JSON format, such as for radios or checkboxes.')

export const exactFilesSchema = Joi.number()
  .empty('')
  .integer()
  .min(1)
  .max(25)
  .description(
    'Specifies the exact number of files required for upload. Must be between 1 and 25.'
  )

export const minFilesSchema = Joi.number()
  .empty('')
  .integer()
  .min(1)
  .max(25)
  .description(
    'Minimum number of files required for upload. Must be between 1 and 25.'
  )

export const maxFilesSchema = Joi.number()
  .empty('')
  .integer()
  .min(1)
  .max(25)
  .description(
    'Maximum number of files allowed for upload. Must be between 1 and 25.'
  )

export const fileTypesSchema = Joi.array()
  .items(Joi.string())
  .single()
  .empty(null)
  .default([])
  .description(
    'Array of allowed file types. Can be provided as a single value or an array.'
  )

export const documentTypesSchema = Joi.array()
  .items(Joi.string())
  .single()
  .empty(null)
  .default([])
  .description(
    'Array of allowed document types. Can be provided as a single value or an array.'
  )

export const imageTypesSchema = Joi.array()
  .items(Joi.string())
  .single()
  .empty(null)
  .default([])
  .description(
    'Array of allowed image types. Can be provided as a single value or an array.'
  )

export const tabularDataTypesSchema = Joi.array()
  .items(Joi.string())
  .single()
  .empty(null)
  .default([])

export const enhancedActionSchema = Joi.string()
  .trim()
  .optional()
  .allow('')
  .description('Action field that can include enhanced functionality')

export const radioIdSchema = Joi.string()
  .trim()
  .optional()
  .allow('')
  .description('Unique identifier for radio options')

export const radioTextSchema = Joi.string()
  .trim()
  .required()
  .description('The visible text shown next to radio options')

export const radioHintSchema = Joi.string()
  .trim()
  .optional()
  .allow('')
  .description(
    'Optional hint text displayed with radio buttons to provide additional guidance'
  )

export const radioValueSchema = Joi.string()
  .trim()
  .optional()
  .allow('')
  .description(
    'Array of allowed tabular data types. Can be provided as a single value or an array.'
  )

export const shortDescriptionSchema = Joi.string()
  .trim()
  .required()
  .description('Brief description of the question for internal use')

export const pageHeadingAndGuidanceSchema = Joi.string()
  .trim()
  .optional()
  .description('Combined heading and guidance for the page')

export const pageHeadingSchema = Joi.string()
  .trim()
  .required()
  .description('Main heading displayed at the top of the page')

export const guidanceTextSchema = Joi.string()
  .trim()
  .description('Guidance text to assist users in completing the page')

export const exitPageSchema = Joi.boolean()
  .default(false)
  .optional()
  .description('Determines if page is set as an Exit Page')

export const repeaterSchema = Joi.string()
  .trim()
  .optional()
  .description(
    'Combined min/max items and question set name for the repeater page'
  )

export const minItemsSchema = Joi.number()
  .empty('')
  .min(MIN_NUMBER_OF_REPEAT_ITEMS)
  .description('The minimum number of repeater items')

export const maxItemsSchema = Joi.number()
  .empty('')
  .max(MAX_NUMBER_OF_REPEAT_ITEMS)
  .description('The maximum number of repeater items')

export const questionSetNameSchema = Joi.string()
  .trim()
  .description('The repeater question set name')

export const needDeclarationSchema = Joi.string()
  .trim()
  .required()
  .description('Whether a declaration is needed')

export const declarationTextSchema = Joi.string()
  .trim()
  .required()
  .description('Text of the declaration that users must agree to')

export const disableConfirmationEmailSchema = Joi.boolean()
  .valid(true)
  .description('Whether confirmation emails should be disabled')

export const enableReferenceNumberSchema = Joi.boolean()
  .valid(true)
  .description('Whether reference number should be enabled')

export const minSchema = Joi.number()
  .empty('')
  .integer()
  .description('Minimum value for numeric inputs')

export const maxSchema = Joi.number()
  .empty('')
  .integer()
  .description('Maximum value for numeric inputs')

export const minLengthSchema = Joi.number()
  .empty('')
  .integer()
  .min(1)
  .description('Minimum character length for text inputs')

export const maxLengthSchema = Joi.number()
  .empty('')
  .integer()
  .min(1)
  .description('Maximum character length for text inputs')

export const maxFutureSchema = Joi.number()
  .empty('')
  .integer()
  .min(0)
  .description('Maximum days in the future allowed for date inputs')

export const maxPastSchema = Joi.number()
  .empty('')
  .integer()
  .min(0)
  .description('Maximum days in the past allowed for date inputs')

export const precisionSchema = Joi.number()
  .empty('')
  .integer()
  .min(0)
  .description('Decimal precision for numeric inputs')

export const prefixSchema = Joi.string()
  .trim()
  .optional()
  .allow('')
  .description('Text to display before the input (e.g., £)')

export const regexSchema = Joi.string()
  .optional()
  .allow('')
  .description('Regular expression pattern for validation')

export const rowsSchema = Joi.number()
  .empty('')
  .integer()
  .min(1)
  .description('Number of rows for multiline text fields')

export const suffixSchema = Joi.string()
  .trim()
  .optional()
  .allow('')
  .description('Text to display after the input (e.g., kg)')

export const classesSchema = Joi.string()
  .trim()
  .optional()
  .allow('')
  .description('Custom CSS classes to apply to the component')

export const jsEnabledSchema = Joi.string()
  .trim()
  .optional()
  .allow('false', 'true')
  .description('Flag to show if Javascript is enabled or not')

export const usePostcodeLookupSchema = Joi.string()
  .trim()
  .optional()
  .valid('', 'true')
  .description(
    'Indicates whether a UK address component supports postcode lookup. Empty string or "true" values are accepted.'
  )

export const paymentDescriptionSchema = Joi.string()
  .trim()
  .required()
  .description('Description of payment - appears in payment providers pages')

export const paymentAmountSchema = Joi.number()
  .empty('')
  .min(0.3)
  .max(100000)
  .description('Amount of payment in pounds')

type GenericRuleOptions<K extends string, T> = Omit<GetRuleOptions, 'args'> & {
  args: Record<K, T>
}

interface DSLSchema<TSchema = Record<string, unknown>[]>
  extends ArraySchema<TSchema> {
  rowSeparator: (rowSep: string | RegExp) => DSLSchema<TSchema>
  row: (rowSep: string | RegExp) => DSLSchema<TSchema>
  colSeparator: (colSep: string | RegExp) => DSLSchema<TSchema>
  col: (colSep: string | RegExp) => DSLSchema<TSchema>
  keys: (keys: string[]) => DSLSchema<TSchema>
}

interface CustomValidator extends Joi.Root {
  dsv<TSchema>(): DSLSchema<TSchema>
}

export const customValidator = Joi.extend((joi: Joi.Root) => {
  return {
    type: 'dsv',
    base: joi.array(),
    messages: {
      'dsv.invalid': 'Invalid parse string'
    },
    coerce: {
      from: 'string',
      method(value: string, helpers) {
        try {
          // Only called when prefs.convert is true
          // Rules
          const rowSeparatorRule = helpers.schema.$_getRule('rowSeparator') as
            | undefined
            | GenericRuleOptions<'rowSeparator', string | RegExp>
          const colSeparatorRule = helpers.schema.$_getRule('colSeparator') as
            | undefined
            | GenericRuleOptions<'colSeparator', string | RegExp>
          const keysRule = helpers.schema.$_getRule('keys') as
            | undefined
            | GenericRuleOptions<'keys', string[]>

          // Rows
          const rowSeparator = rowSeparatorRule?.args.rowSeparator ?? /\r?\n/
          const rows = value
            .split(rowSeparator)
            .map((v) => v.trim())
            .filter(Boolean)

          // Columns
          const colSeparator = colSeparatorRule?.args.colSeparator ?? ','
          const keys = keysRule?.args.keys ?? ['key', 'value']

          const coercedValue = rows.map((row) => {
            return row
              .split(colSeparator)
              .reduce<Record<string, string>>((acc, col, idx) => {
                return {
                  ...acc,
                  [keys[idx]]: col.trim()
                }
              }, {})
          })
          return { value: coercedValue }
        } catch (_err) {
          // eslint-disable-next-line no-console
          console.error(_err)
          return { value, errors: [helpers.error('dsv.invalid')] }
        }
      }
    },
    rules: {
      rowSeparator: {
        convert: true,
        alias: 'row',
        method(rowSeparator: string) {
          return this.$_addRule({
            name: 'rowSeparator',
            args: { rowSeparator }
          })
        },
        args: [
          {
            name: 'rowSeparator',
            ref: true,
            assert: (value) =>
              typeof value === 'string' || value instanceof RegExp,
            message: 'must be a string or regex'
          }
        ]
      },
      colSeparator: {
        convert: true,
        alias: 'col',
        method(colSeparator: string) {
          return this.$_addRule({
            name: 'colSeparator',
            args: { colSeparator }
          })
        },
        args: [
          {
            name: 'colSeparator',
            ref: true,
            assert: (value) =>
              typeof value === 'string' || value instanceof RegExp,
            message: 'must be a string or regex'
          }
        ]
      },
      keys: {
        convert: true,
        method(keys: string[]) {
          return this.$_addRule({ name: 'keys', args: { keys } })
        },
        args: [
          {
            name: 'keys',
            ref: true,
            assert: (value) =>
              Array.isArray(value) && value.every((k) => typeof k === 'string'),
            message: 'must be an array of strings'
          }
        ]
      }
    }
  }
}) as CustomValidator

export const autoCompleteOptionsSchema = customValidator
  .dsv<{ text: string; value: string }[]>()
  .row(/\r?\n/)
  .col(':')
  .keys(['text', 'value'])
  .items(
    customValidator.object({
      text: customValidator.string().min(1).disallow('').required(),
      value: customValidator
        .string()
        .default((parent: { text: string; value?: string }) => parent.text)
        .min(1)
        .disallow('')
    })
  )
  .min(1)
  .unique('text')
  .unique('value', { ignoreUndefined: true })
  .required()

export const questionDetailsFullSchema = {
  autoCompleteOptionsSchema,
  classesSchema,
  declarationTextSchema,
  documentTypesSchema,
  enhancedActionSchema,
  exactFilesSchema,
  fileTypesSchema,
  hintTextSchema,
  imageTypesSchema,
  instructionTextSchema,
  jsEnabledSchema,
  listForQuestionSchema,
  listItemCountSchema,
  listItemsDataSchema,
  maxFilesSchema,
  maxFutureSchema,
  maxLengthSchema,
  maxPastSchema,
  maxSchema,
  minFilesSchema,
  minLengthSchema,
  minSchema,
  nameSchema,
  paymentAmountSchema,
  paymentDescriptionSchema,
  precisionSchema,
  prefixSchema,
  questionOptionalSchema,
  questionSchema,
  questionTypeFullSchema,
  radioHintSchema,
  radioIdSchema,
  radioTextSchema,
  radioValueSchema,
  regexSchema,
  rowsSchema,
  shortDescriptionSchema,
  suffixSchema,
  tabularDataTypesSchema,
  usePostcodeLookupSchema
}

export const formEditorInputPageKeys = {
  pageType: pageTypeSchema,
  questionType: questionTypeSchema
}

/**
 * Joi schema for `FormEditorInputPage` interface
 * @see {@link FormEditorInputPage}
 */
export const formEditorInputPageSchema = Joi.object<FormEditorInputPage>()
  .keys(formEditorInputPageKeys)
  .required()
  .description('Input schema for creating a new page in the form editor')

export const formEditorInputheckAnswersSettingsKeys = {
  declarationText: shortDescriptionSchema
}

/**
 * Joi schema for `FormEditorInputCheckAnswersSettings` interface
 * @see {@link FormEditorInputCheckAnswersSettings}
 */
export const formEditorInputCheckAnswersSettingSchema =
  Joi.object<FormEditorInputCheckAnswersSettings>()
    .keys(formEditorInputheckAnswersSettingsKeys)
    .required()
    .description('Configuration for the check-answers page')

export const formEditorInputQuestionKeys = {
  question: questionSchema,
  shortDescription: shortDescriptionSchema,
  hintText: hintTextSchema,
  questionOptional: questionOptionalSchema
}

/**
 * Joi schema for `FormEditorInputQuestion` interface
 * @see {@link FormEditorInputQuestion}
 */
export const formEditorInputQuestionSchema =
  Joi.object<FormEditorInputQuestion>()
    .keys(formEditorInputQuestionKeys)
    .required()
    .description(
      'Input schema for creating or updating a question in the form editor'
    )

export const formEditorInputPageSettingsKeys = {
  pageHeadingAndGuidance: pageHeadingAndGuidanceSchema,
  pageHeading: pageHeadingSchema,
  guidanceText: guidanceTextSchema
}

/**
 * Joi schema for `FormEditorInputPageSettings` interface
 * @see {@link FormEditorInputPageSettings}
 */
export const formEditorInputPageSettingsSchema =
  Joi.object<FormEditorInputPageSettings>()
    .keys(formEditorInputPageSettingsKeys)
    .required()
    .description('Settings for page content and display in the form editor')

export function govukFieldValueIsString(
  govukField: GovukField
): govukField is GovukStringField {
  return [
    'question',
    'hintText',
    'shortDescription',
    'autoCompleteOptions',
    'classes',
    'prefix',
    'suffix'
  ].includes(`${govukField.name}`)
}

export function govukFieldIsChecked(
  govukField: GovukField
): govukField is GovukFieldQuestionOptional | GovukFieldUsePostcodeLookup {
  if (
    govukField.name !== 'questionOptional' &&
    govukField.name !== 'usePostcodeLookup'
  ) {
    return false
  }
  const checkedValue = govukField.items?.[0].checked
  return typeof checkedValue === 'boolean'
}

// A list of allowed template funtions for use within error message templates
export const allowedErrorTemplateFunctions = ['lowerFirst', 'capitalise']
