import Joi from 'joi'

import { ComponentType } from '~/src/components/enums.js'
import {
  type FormEditor,
  type FormEditorInput
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

export const questionSchema = Joi.string().required()
export const hintTextSchema = Joi.string().optional().allow('')
export const questionOptionalSchema = Joi.boolean()
export const shortDescriptionSchema = Joi.string().required()

export const formEditorInputKeys = {
  pageType: pageTypeSchema,
  questionType: questionTypeSchema
}

/**
 * Joi schema for `FormEditorInput` interface
 * @see {@link FormEditorInput}
 */
export const formEditorInputSchema = Joi.object<FormEditorInput>()
  .keys(formEditorInputKeys)
  .required()

/**
 * Joi schema for `FormEditor` interface
 * @see {@link FormEditor}
 */
export const formEditorSchema = formEditorInputSchema.append<FormEditor>({
  pageType: pageTypeSchema,
  questionType: questionTypeSchema
})
