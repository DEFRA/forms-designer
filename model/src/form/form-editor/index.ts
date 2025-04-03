import Joi from 'joi'

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
  .description('Type of page - either a question page or guidance page')

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
    ComponentType.YesNoField,
    ComponentType.CheckboxesField,
    ComponentType.RadiosField,
    ComponentType.AutocompleteField
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
export const listSubSchema = Joi.string()
  .required()
  .valid(
    ComponentType.YesNoField,
    ComponentType.CheckboxesField,
    ComponentType.RadiosField,
    ComponentType.AutocompleteField
  )
  .description('Subtype for date-related questions')

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
  .min(0)
  .max(25)
  .description(
    'Minimum number of files required for upload. Must be between 0 and 25.'
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

export const radioLabelSchema = Joi.string()
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

export const needDeclarationSchema = Joi.string()
  .trim()
  .required()
  .description('Whether a declaration is needed')

export const declarationTextSchema = Joi.string()
  .trim()
  .required()
  .description('Text of the declaration that users must agree to')

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
  .min(1)
  .description('Maximum days in the future allowed for date inputs')

export const maxPastSchema = Joi.number()
  .empty('')
  .integer()
  .min(1)
  .description('Maximum days in the past allowed for date inputs')

export const precisionSchema = Joi.number()
  .empty('')
  .integer()
  .min(1)
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

export const questionDetailsFullSchema = {
  classesSchema,
  documentTypesSchema,
  enhancedActionSchema,
  exactFilesSchema,
  fileTypesSchema,
  hintTextSchema,
  imageTypesSchema,
  listForQuestionSchema,
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
  radioHintSchema,
  radioIdSchema,
  radioLabelSchema,
  radioValueSchema,
  regexSchema,
  rowsSchema,
  shortDescriptionSchema,
  suffixSchema,
  tabularDataTypesSchema
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
