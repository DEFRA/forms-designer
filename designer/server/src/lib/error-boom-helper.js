import { ApiErrorCode } from '@defra/forms-model'
import Boom from '@hapi/boom'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'

const duplicatePageTitle = 'Page heading already exists in this form'

const boomMappings = [
  {
    statusCode: 409,
    errorCode: ApiErrorCode.DuplicatePagePathPage,
    errorKey: sessionNames.validationFailure.editorQuestions,
    fieldName: 'pageHeading',
    userMessage: duplicatePageTitle
  },
  {
    statusCode: 409,
    errorCode: ApiErrorCode.DuplicatePagePathPage,
    errorKey: sessionNames.validationFailure.editorGuidance,
    fieldName: 'pageHeading',
    userMessage: duplicatePageTitle
  },
  {
    statusCode: 409,
    errorCode: ApiErrorCode.DuplicatePagePathComponent,
    errorKey: sessionNames.validationFailure.editorGuidance,
    fieldName: 'pageHeading',
    userMessage: duplicatePageTitle
  },
  {
    statusCode: 409,
    errorCode: ApiErrorCode.DuplicatePagePathComponent,
    errorKey: sessionNames.validationFailure.editorQuestionDetails,
    fieldName: 'question',
    userMessage: 'Question or page heading already exists in this form'
  },
  {
    statusCode: 409,
    errorCode: ApiErrorCode.DuplicatePagePathPage,
    errorKey: sessionNames.validationFailure.editorQuestionDetails,
    fieldName: 'question',
    userMessage: 'Question or page heading already exists in this form'
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
 * @param {Boom.Boom<{ message: string, statusCode: number, custom?: { errorCode?: string } }>} boomError
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
      x.statusCode === boomError.data?.statusCode &&
      boomError.data.custom?.errorCode === x.errorCode &&
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
