import type Joi from 'joi'

import { FormDefinitionErrorType, formDefinitionErrors, type FormDefinitionError } from '~/src/form/form-manager/types.js'

/**
 * Checks and applies an `errorType` and also an `errorCode` for known errors
 */
export const checkError = (
  err: Joi.ErrorReport,
  formErrors: FormDefinitionError[]
) => {
  if (err.local.errorType) {
    return
  }

  for (const formError of formErrors) {
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
}

export const checkErrors = (
  formErrors: FormDefinitionError | FormDefinitionError[]
) => {
  const poss = Array.isArray(formErrors) ? formErrors : [formErrors]

  return function (errors: Joi.ErrorReport[]) {
    errors.forEach((err) => checkError(err, poss))
    return errors
  }
}
