import { questionDetailsFullSchema } from '@defra/forms-model'
import Joi from 'joi'

export const baseSchema = Joi.object().keys({
  name: questionDetailsFullSchema.nameSchema,
  question: questionDetailsFullSchema.questionSchema.messages({
    '*': 'Enter a question'
  }),
  hintText: questionDetailsFullSchema.hintTextSchema,
  questionOptional: questionDetailsFullSchema.questionOptionalSchema,
  shortDescription: questionDetailsFullSchema.shortDescriptionSchema.messages({
    '*': 'Enter a short description'
  }),
  questionType: questionDetailsFullSchema.questionTypeFullSchema.messages({
    '*': 'The question type is missing'
  }),
  fileTypes: questionDetailsFullSchema.fileTypesSchema.when('questionType', {
    is: 'FileUploadField',
    then: Joi.required().messages({
      '*': 'Select the type of file you want to upload'
    })
  }),
  documentTypes: questionDetailsFullSchema.documentTypesSchema.when(
    'questionType',
    {
      is: 'FileUploadField',
      then: Joi.array().when('fileTypes', {
        is: Joi.array().has('documents'),
        then: Joi.required().messages({
          '*': 'Choose the document file types you accept'
        })
      })
    }
  ),
  imageTypes: questionDetailsFullSchema.imageTypesSchema.when('questionType', {
    is: 'FileUploadField',
    then: Joi.array().when('fileTypes', {
      is: Joi.array().has('images'),
      then: Joi.required().messages({
        '*': 'Choose the image file types you accept'
      })
    })
  }),
  tabularDataTypes: questionDetailsFullSchema.tabularDataTypesSchema.when(
    'questionType',
    {
      is: 'FileUploadField',
      then: Joi.array().when('fileTypes', {
        is: Joi.array().has('tabular-data'),
        then: Joi.required().messages({
          '*': 'Choose the tabular data file types you accept'
        })
      })
    }
  )
})
