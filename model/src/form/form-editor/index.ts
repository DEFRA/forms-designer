import Joi from 'joi'

import { ComponentType } from '~/src/components/enums.js'
import {
  type FormEditorInputCheckAnswersSettings,
  type FormEditorInputPage,
  type FormEditorInputPageSettings,
  type FormEditorInputQuestion
} from '~/src/form/form-editor/types.js'

export const pageTypeSchema = Joi.string()
  .required()
  .valid('question', 'guidance')
export const questionTypeSchema = Joi.string()
  .required()
  .valid(
    'written-answer-group',
    'date-group',
    ComponentType.UkAddressField,
    ComponentType.TelephoneNumberField,
    ComponentType.FileUploadField,
    ComponentType.EmailAddressField,
    ComponentType.SelectField
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
    ComponentType.SelectField
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

export const nameSchema = Joi.string().optional().allow('')
export const questionSchema = Joi.string().required()
export const hintTextSchema = Joi.string().optional().allow('')
export const questionOptionalSchema = Joi.string().optional().valid('', 'true')
export const shortDescriptionSchema = Joi.string().required()
export const pageHeadingAndGuidanceSchema = Joi.string().optional()
export const pageHeadingSchema = Joi.string().required()
export const guidanceTextSchema = Joi.string().optional().allow('')
export const needDeclarationSchema = Joi.string().required()
export const declarationTextSchema = Joi.string().required()

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
