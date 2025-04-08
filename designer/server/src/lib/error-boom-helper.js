import Boom from '@hapi/boom'
import Joi from 'joi'

const baseBoomSchema = Joi.object({
  boomMessage: Joi.string().optional()
})

export const pageBoomSchema = Joi.object({
  pageHeading: Joi.string()
    .when('boomMessage', {
      is: Joi.string().pattern(/^Duplicate page path/),
      then: Joi.forbidden(),
      otherwise: Joi.string().optional()
    })
    .messages({
      '*': 'This page title already exists - use a unique page title'
    })
})

export const questionsBoomSchema = Joi.object({
  question: Joi.string()
    .when('boomMessage', {
      is: Joi.string().pattern(/^Duplicate page path/),
      then: Joi.forbidden(),
      otherwise: Joi.string().optional()
    })
    .messages({
      '*': 'This question or page title already exists - use a unique question or page title'
    })
})

const boomSchema = baseBoomSchema
  .concat(pageBoomSchema)
  .concat(questionsBoomSchema)

/**
 * @param {ValidationSessionKey} errorKey
 * @param {Boom.Boom} boomError
 * @param {string} [fieldName]
 */
export function mapBoomError(errorKey, boomError, fieldName = 'general') {
  const boomMessage = boomError.data?.message ?? 'An error occurred'

  const { error } = boomSchema.validate({ boomMessage, [fieldName]: errorKey })

  if (!error) {
    // Boom schema didn't find a custom message for the error
    return new Joi.ValidationError(
      boomMessage,
      [
        {
          message: boomMessage,
          path: [fieldName],
          type: 'custom',
          context: { key: fieldName }
        }
      ],
      undefined
    )
  }

  return error
}

/**
 * @param {Boom.Boom} boomError
 * @param {Joi.ObjectSchema} schema
 */
export function checkBoomError(boomError, schema) {
  if (!Boom.isBoom(boomError) || boomError.data?.statusCode !== 409) {
    return undefined
  }

  const boomSchema = baseBoomSchema.concat(schema)
  const { error } = boomSchema.validate(boomError)
  return error
}

/**
 * @import { ValidationSessionKey } from '@hapi/yar'
 */
