import { ApiErrorFunctionCode } from '@defra/forms-model'
import Boom from '@hapi/boom'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'

const boomMappings = [
  {
    errorCode: 409,
    functionCode: ApiErrorFunctionCode.DuplicatePagePathPage,
    errorKey: sessionNames.validationFailure.editorQuestions,
    fieldName: 'pageHeading',
    userMessage: 'This page title already exists - use a unique page title'
  },
  {
    errorCode: 409,
    functionCode: ApiErrorFunctionCode.DuplicatePagePathQuestion,
    errorKey: sessionNames.validationFailure.editorGuidance,
    fieldName: 'pageHeading',
    userMessage: 'This page title already exists - use a unique page title'
  },
  {
    errorCode: 409,
    functionCode: ApiErrorFunctionCode.DuplicatePagePathQuestion,
    errorKey: sessionNames.validationFailure.editorQuestionDetails,
    fieldName: 'question',
    userMessage:
      'This question or page title already exists - use a unique question or page title'
  }
]

/**
 * @param {string} fieldName
 * @param {string} message
 * @returns {Joi.ValidationError}
 */
export function createJoiError(fieldName, message) {
  return new Joi.ValidationError(
    message,
    [
      {
        message,
        path: [fieldName],
        type: 'custom',
        context: { key: fieldName }
      }
    ],
    {}
  )
}

/**
 * @param {Boom.Boom<{ message: string, statusCode: number, custom?: { functionCode?: string } }>} boomError
 * @param {ValidationSessionKey} errorKey
 * @param {string} [fieldName]
 */
export function checkBoomError(boomError, errorKey, fieldName = 'general') {
  if (!Boom.isBoom(boomError)) {
    return undefined
  }

  const boomMessage = /** @type {string} */ (
    boomError.data?.message ?? 'An error occurred'
  )

  const error = boomMappings.find(
    (x) =>
      x.errorCode === boomError.data?.statusCode &&
      boomError.data.custom?.functionCode === x.functionCode &&
      x.errorKey === errorKey
  )

  if (error) {
    return createJoiError(error.fieldName, error.userMessage)
  }

  // Error not found in mappings
  return createJoiError(fieldName, boomMessage)
}

/**
 * @import { ValidationSessionKey } from '@hapi/yar'
 */
