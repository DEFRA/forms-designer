import Boom from '@hapi/boom'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'

const boomMappings = [
  {
    errorCode: 409,
    errorStartsWith: 'Duplicate page path',
    errorKey: sessionNames.validationFailure.editorQuestions,
    fieldName: 'pageHeading',
    userMessage: 'This page title already exists - use a unique page title'
  },
  {
    errorCode: 409,
    errorStartsWith: 'Duplicate page path',
    errorKey: sessionNames.validationFailure.editorQuestionDetails,
    fieldName: 'question',
    userMessage:
      'This question or page title already exists - use a unique question or page title'
  }
]

/**
 * @param {string} fieldName
 * @param {string} message
 */
export function createJoiError(fieldName, message) {
  const { error } = Joi.object({
    [fieldName]: Joi.forbidden().messages({
      '*': message
    })
  }).validate({ [fieldName]: 'force-error' })
  return error
}

/**
 * @param {Boom.Boom} boomError
 * @param {ValidationSessionKey} errorKey
 * @param {string} [fieldName]
 */
export function checkBoomError(boomError, errorKey, fieldName = 'general') {
  if (!Boom.isBoom(boomError)) {
    return undefined
  }

  const boomMessage = boomError.data?.message ?? 'An error occurred'

  const error = boomMappings.filter(
    (x) =>
      x.errorCode === boomError.data?.statusCode &&
      boomMessage.startsWith(x.errorStartsWith) &&
      x.errorKey === errorKey
  )

  if (error.length) {
    return createJoiError(error[0].fieldName, error[0].userMessage)
  }

  // Error not found in mappings
  return createJoiError(fieldName, boomMessage)
}

/**
 * @import { ValidationSessionKey } from '@hapi/yar'
 */
