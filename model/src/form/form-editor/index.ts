import Joi, { type ArraySchema, type GetRuleOptions } from 'joi'

import { ComponentType } from '~/src/components/enums.js'
import {
  type FormEditorInputCheckAnswersSettings,
  type FormEditorInputPage,
  type FormEditorInputPageSettings,
  type FormEditorInputQuestion
} from '~/src/form/form-editor/types.js'

export enum QuestionTypeSubGroup {
  WrittenAnswerSubGroup = 'writtenAnswerSub',
  DateSubGroup = 'dateSub',
  ListSubGroup = 'listSub'
}

export const pageTypeSchema = Joi.string()
  .required()
  .valid('question', 'guidance')
export const questionTypeSchema = Joi.string()
  .required()
  .valid(
    QuestionTypeSubGroup.WrittenAnswerSubGroup,
    QuestionTypeSubGroup.DateSubGroup,
    ComponentType.UkAddressField,
    ComponentType.TelephoneNumberField,
    ComponentType.FileUploadField,
    ComponentType.EmailAddressField,
    QuestionTypeSubGroup.ListSubGroup,
    ComponentType.YesNoField,
    ComponentType.CheckboxesField,
    ComponentType.RadiosField,
    ComponentType.AutocompleteField
  )

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
    ComponentType.YesNoField,
    ComponentType.CheckboxesField,
    ComponentType.RadiosField,
    ComponentType.AutocompleteField
  )

export const writtenAnswerSubSchema = Joi.string()
  .required()
  .valid(
    ComponentType.TextField,
    ComponentType.MultilineTextField,
    ComponentType.NumberField
  )
export const dateSubSchema = Joi.string()
  .required()
  .valid(ComponentType.DatePartsField, ComponentType.MonthYearField)
export const listSubSchema = Joi.string()
  .required()
  .valid(
    ComponentType.YesNoField,
    ComponentType.CheckboxesField,
    ComponentType.RadiosField,
    ComponentType.AutocompleteField
  )

export const nameSchema = Joi.string().trim().required()
export const questionSchema = Joi.string().trim().required()
export const hintTextSchema = Joi.string().trim().optional().allow('')
export const questionOptionalSchema = Joi.string()
  .trim()
  .optional()
  .valid('', 'true')
export const shortDescriptionSchema = Joi.string().trim().required()
export const pageHeadingAndGuidanceSchema = Joi.string().trim().optional()
export const pageHeadingSchema = Joi.string().trim().required()
export const guidanceTextSchema = Joi.string().trim()
export const needDeclarationSchema = Joi.string().trim().required()
export const declarationTextSchema = Joi.string().trim().required()
export const exactFilesSchema = Joi.number().empty('').integer().min(1).max(25)
export const minFilesSchema = Joi.number().empty('').integer().min(0).max(25)
export const maxFilesSchema = Joi.number().empty('').integer().min(1).max(25)
export const minSchema = Joi.number().empty('').integer()
export const maxSchema = Joi.number().empty('').integer()
export const minLengthSchema = Joi.number().empty('').integer().min(1)
export const maxLengthSchema = Joi.number().empty('').integer().min(1)
export const maxFutureSchema = Joi.number().empty('').integer().min(0)
export const maxPastSchema = Joi.number().empty('').integer().min(0)
export const precisionSchema = Joi.number().empty('').integer().min(0).max(5)
export const prefixSchema = Joi.string().trim().optional().allow('')
export const regexSchema = Joi.string().optional().allow('')
export const rowsSchema = Joi.number().empty('').integer().min(1)
export const suffixSchema = Joi.string().trim().optional().allow('')
export const classesSchema = Joi.string().trim().optional().allow('')
export const fileTypesSchema = Joi.array()
  .items(Joi.string())
  .single()
  .empty(null)
  .default([])
export const documentTypesSchema = Joi.array()
  .items(Joi.string())
  .single()
  .empty(null)
  .default([])
export const imageTypesSchema = Joi.array()
  .items(Joi.string())
  .single()
  .empty(null)
  .default([])
export const tabularDataTypesSchema = Joi.array()
  .items(Joi.string())
  .single()
  .empty(null)
  .default([])

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
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  [keys[idx]]: (col || acc[keys[0]]).trim()
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
  .dsv<{ text: string; value: string }>()
  .row(/\r?\n/)
  .col(':')
  .keys(['text', 'value'])
  .items(
    customValidator.object({
      text: customValidator.string(),
      value: customValidator.string()
    })
  )
  .min(1)
  .required()

export const questionDetailsFullSchema = {
  classesSchema,
  documentTypesSchema,
  exactFilesSchema,
  fileTypesSchema,
  hintTextSchema,
  imageTypesSchema,
  maxFilesSchema,
  maxFutureSchema,
  maxLengthSchema,
  maxPastSchema,
  maxSchema,
  minFilesSchema,
  minLengthSchema,
  minSchema,
  nameSchema,
  precisionSchema,
  prefixSchema,
  questionOptionalSchema,
  questionSchema,
  questionTypeFullSchema,
  regexSchema,
  rowsSchema,
  shortDescriptionSchema,
  suffixSchema,
  tabularDataTypesSchema,
  autoCompleteOptionsSchema
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
