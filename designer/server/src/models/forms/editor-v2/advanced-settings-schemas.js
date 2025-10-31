import { questionDetailsFullSchema } from '@defra/forms-model'
import Joi from 'joi'

const MIN_FILES_ERROR_MESSAGE =
  'Minimum file count must be a whole number between 1 and 25'
const MAX_FILES_ERROR_MESSAGE =
  'Maximum file count must be a whole number between 1 and 25'
const EXACT_FILES_ERROR_MESSAGE =
  'Exact file count must be a whole number between 1 and 25'
const MIN_LENGTH_ERROR_MESSAGE =
  'Minimum length must be a positive whole number'
const MAX_LENGTH_ERROR_MESSAGE =
  'Maximum length must be a positive whole number'
const MAX_PRECISION = 5

/**
 * Joi validation schemas for all advanced settings fields
 */
export const allSpecificSchemas = Joi.object().keys({
  maxFuture: questionDetailsFullSchema.maxFutureSchema.messages({
    '*': 'Maximum days in the future must be a positive whole number'
  }),
  maxPast: questionDetailsFullSchema.maxPastSchema.messages({
    '*': 'Maximum days in the past must be a positive whole number'
  }),
  min: questionDetailsFullSchema.minSchema
    .when('max', {
      is: Joi.exist(),
      then: Joi.number().max(Joi.ref('max')),
      otherwise: Joi.number().empty('').integer()
    })
    .messages({
      'number.base': 'Lowest number must be a whole number',
      'number.integer': 'Lowest number must be a whole number',
      '*': 'Lowest number cannot be more than the highest number'
    }),
  max: questionDetailsFullSchema.maxSchema.messages({
    '*': 'Highest number must be a whole number'
  }),
  exactFiles: questionDetailsFullSchema.exactFilesSchema
    .when('minFiles', {
      is: Joi.exist(),
      then: Joi.number().forbidden(),
      otherwise: Joi.number().empty('').integer()
    })
    .messages({
      'number.base': EXACT_FILES_ERROR_MESSAGE,
      'number.integer': EXACT_FILES_ERROR_MESSAGE,
      'number.min': EXACT_FILES_ERROR_MESSAGE,
      'number.max': EXACT_FILES_ERROR_MESSAGE,
      '*': 'Enter an exact amount or choose the minimum and maximum range allowed'
    })
    .when('maxFiles', {
      is: Joi.exist(),
      then: Joi.number().forbidden(),
      otherwise: Joi.number().empty('').integer()
    })
    .messages({
      'number.base': EXACT_FILES_ERROR_MESSAGE,
      'number.integer': EXACT_FILES_ERROR_MESSAGE,
      'number.min': EXACT_FILES_ERROR_MESSAGE,
      'number.max': EXACT_FILES_ERROR_MESSAGE,
      '*': 'Enter an exact amount or choose the minimum and maximum range allowed'
    }),
  minFiles: questionDetailsFullSchema.minFilesSchema.when('maxFiles', {
    is: Joi.exist(),
    then: Joi.number().max(Joi.ref('maxFiles')).messages({
      'number.max':
        'The minimum number of files you accept cannot be greater than the maximum',
      '*': MIN_FILES_ERROR_MESSAGE
    }),
    otherwise: Joi.number().empty('').integer().messages({
      '*': MIN_FILES_ERROR_MESSAGE
    })
  }),
  maxFiles: questionDetailsFullSchema.maxFilesSchema.messages({
    '*': MAX_FILES_ERROR_MESSAGE
  }),
  minLength: questionDetailsFullSchema.minLengthSchema.when('maxLength', {
    is: Joi.exist(),
    then: Joi.number().max(Joi.ref('maxLength')).messages({
      'number.max':
        'Minimum length must be less than or equal to maximum length',
      '*': MIN_LENGTH_ERROR_MESSAGE
    }),
    otherwise: Joi.number().empty('').integer().messages({
      '*': MIN_LENGTH_ERROR_MESSAGE
    })
  }),
  maxLength: questionDetailsFullSchema.maxLengthSchema.messages({
    '*': MAX_LENGTH_ERROR_MESSAGE
  }),
  precision: questionDetailsFullSchema.precisionSchema
    .max(MAX_PRECISION)
    .messages({
      '*': `Enter a whole number between 0 and ${MAX_PRECISION}`
    }),
  prefix: questionDetailsFullSchema.prefixSchema,
  suffix: questionDetailsFullSchema.suffixSchema,
  regex: questionDetailsFullSchema.regexSchema,
  rows: questionDetailsFullSchema.rowsSchema.messages({
    '*': 'Enter a positive whole number'
  }),
  classes: questionDetailsFullSchema.classesSchema,
  giveInstructions: Joi.string().optional().allow(''),
  instructionText: questionDetailsFullSchema.instructionTextSchema
})
