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

        // An empty key matches any unique constraint for schemas whose
        // uniqueness is a composite of several keys rather than a single one
        if (
          errorDetails.type === FormDefinitionErrorType.Unique &&
          err.code === 'array.unique' &&
          (errorDetails.key === '' || keyMatch === errorDetails.key)
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

        if (
          errorDetails.type === FormDefinitionErrorType.Incompatible &&
          err.code === 'custom.incompatible'
          // Match any key
        ) {
          err.local.errorCode = formError
          err.local.errorType = FormDefinitionErrorType.Incompatible
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

      if (
        detail.context?.errorType === FormDefinitionErrorType.Incompatible &&
        detail.context.errorCode
      ) {
        return {
          id: /** @type {FormDefinitionError} */ detail.context.errorCode,
          type: FormDefinitionErrorType.Incompatible,
          message: detail.message,
          detail: {
            path: detail.path,
            key: detail.context.key,
            valueKey: detail.context.valueKey,
            value: detail.context.value,
            label: detail.context.label,
            incompatibleObject: detail.context.incompatibleObject,
            reason: detail.context.reason
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

/**
 * Human-readable messages for each {@link FormDefinitionError} code, shared
 * by services that surface definition-validation failures (designer editor
 * flows, runner preview error pages).
 */
export const formErrorsToMessages: Record<FormDefinitionError, string> = {
  [FormDefinitionError.UniquePageId]:
    'Each page must have a unique ID. Change the page ID to one that is not already used.',
  [FormDefinitionError.UniquePagePath]:
    'Each page must have a unique path. Change the page path to one that is not already used.',
  [FormDefinitionError.UniquePageComponentId]:
    'Each question on a page must have a unique ID. Change the question ID to one that is not already used.',
  [FormDefinitionError.UniquePageComponentName]:
    'Each question on a page must have a unique name. Change the question name to one that is not already used.',
  [FormDefinitionError.UniqueSectionId]:
    'Each section must have a unique ID. Change the section ID to one that is not already used.',
  [FormDefinitionError.UniqueSectionName]:
    'Each section must have a unique name. Change the section name to one that is not already used.',
  [FormDefinitionError.UniqueSectionTitle]:
    'Each section must have a unique title. Change the section title to one that is not already used.',
  [FormDefinitionError.UniqueListId]:
    'Each list must have a unique ID. Change the list ID to one that is not already used.',
  [FormDefinitionError.UniqueListTitle]:
    'Each list must have a unique title. Change the list title to one that is not already used.',
  [FormDefinitionError.UniqueListName]:
    'Each list must have a unique name. Change the list name to one that is not already used.',
  [FormDefinitionError.UniqueConditionId]:
    'Each condition must have a unique ID. Change the condition ID to one that is not already used.',
  [FormDefinitionError.UniqueConditionDisplayName]:
    'Each condition must have a unique display name. Change the display name to one that is not already used.',
  [FormDefinitionError.UniqueListItemId]:
    'Each item in a list must have a unique ID. Change the item ID to one that is not already used.',
  [FormDefinitionError.UniqueListItemText]:
    'Each item in a list must have unique text. Change the item text to one that is not already used.',
  [FormDefinitionError.UniqueListItemValue]:
    'Each item in a list must have a unique value. Change the item value to one that is not already used.',
  [FormDefinitionError.UniqueOutput]:
    'This email address is already receiving the same submissions. Change the address, condition or format, or remove the duplicate.',
  [FormDefinitionError.RefPageCondition]:
    'This page is referenced by a condition. Remove the condition before making changes to this page.',
  [FormDefinitionError.RefConditionComponentId]:
    'Remove the condition before deleting this page',
  [FormDefinitionError.RefConditionListId]:
    'A condition is using a list in this form. Remove the condition before making changes to the list.',
  [FormDefinitionError.RefConditionItemId]:
    'A condition is using an item in this list. Remove the condition before making changes to the item.',
  [FormDefinitionError.RefConditionConditionId]:
    'A condition is using another condition. Remove the reference before making changes.',
  [FormDefinitionError.RefPageComponentList]:
    'A question on this page is using a list. Remove the reference before making changes to the list.',
  [FormDefinitionError.RefOutputCondition]:
    'A submission email is using a condition that does not exist in this form. Select an existing condition or remove it.',
  [FormDefinitionError.IncompatibleConditionComponentType]:
    'You cannot change to this question type because this question is used in a condition. Remove the condition or select a different question type.',
  [FormDefinitionError.IncompatibleQuestionRegex]:
    'The regex expression is invalid',
  [FormDefinitionError.Other]:
    'There is a problem with the form definition. Check your changes and try again.'
}
