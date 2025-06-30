import type Joi from 'joi'
import { type ValidationError } from 'joi'

import {
  FormDefinitionError,
  FormDefinitionErrorType,
  formDefinitionErrors,
  type FormDefinitionErrorCause
} from '~/src/form/form-manager/types.js'

/**
 * Checks and applies an `errorType` and also an `errorCode` for known errors
 */
export const checkErrors = (
  formErrors: FormDefinitionError | FormDefinitionError[]
) => {
  const possibleErrors = Array.isArray(formErrors) ? formErrors : [formErrors]

  return function (errors: Joi.ErrorReport[]) {
    errors.forEach((err) => {
      if (err.local.errorType) {
        return
      }

      for (const formError of possibleErrors) {
        const errorDetails = formDefinitionErrors[formError]

        // Joi's `context.key` will be the index for arrays
        // in which case use the path, otherwise use the key
        const keyMatch =
          typeof err.local.key === 'number' ? err.local.path : err.local.key

        if (
          errorDetails.type === FormDefinitionErrorType.Unique &&
          err.code === 'array.unique' &&
          keyMatch === errorDetails.key
        ) {
          err.local.errorCode = formError
          err.local.errorType = FormDefinitionErrorType.Unique
          return
        }

        if (
          errorDetails.type === FormDefinitionErrorType.Ref &&
          err.code === 'any.only' &&
          keyMatch === errorDetails.key
        ) {
          err.local.errorCode = formError
          err.local.errorType = FormDefinitionErrorType.Ref
          return
        }

        err.local.errorType = FormDefinitionErrorType.Type
      }
    })
    return errors
  }
}

/**
 * Get the custom errors from a form definition joi validation error
 */
export function getErrors(
  validationError: ValidationError | undefined
): FormDefinitionErrorCause[] {
  return (
    validationError?.details.map((detail) => {
      if (
        detail.context?.errorType === FormDefinitionErrorType.Unique &&
        detail.context.errorCode
      ) {
        return {
          id: /** @type {FormDefinitionError} */ detail.context.errorCode,
          type: FormDefinitionErrorType.Unique,
          message: detail.message,
          detail: {
            path: detail.path,
            pos: detail.context.pos,
            dupePos: detail.context.dupePos
          }
        }
      }

      if (
        detail.context?.errorType === FormDefinitionErrorType.Ref &&
        detail.context.errorCode
      ) {
        return {
          id: /** @type {FormDefinitionError} */ detail.context.errorCode,
          type: FormDefinitionErrorType.Ref,
          message: detail.message,
          detail: {
            path: detail.path
          }
        }
      }

      // Catch all others
      return {
        id: FormDefinitionError.Other,
        type: FormDefinitionErrorType.Type,
        message: detail.message,
        detail: detail.context
      }
    }) ?? []
  )
}
