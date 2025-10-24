import {
  FormDefinitionError,
  type FormDefinitionErrorCause
} from '@defra/forms-model'
import { type Boom } from '@hapi/boom'
import { type Request, type ResponseToolkit } from '@hapi/hapi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { type ErrorDetailsItem } from '~/src/common/helpers/types.js'

export const formErrorsToMessages = {
  [FormDefinitionError.UniquePageId]:
    'Each page must have a unique ID. Change the page ID to one that is not already used.',
  [FormDefinitionError.UniquePagePath]:
    'Each page must have a unique path. Change the page path to one that is not already used.',
  [FormDefinitionError.UniquePageComponentId]:
    'Each question on a page must have a unique ID. Change the question ID to one that is not already used.',
  [FormDefinitionError.UniquePageComponentName]:
    'Each question on a page must have a unique name. Change the question name to one that is not already used.',
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
  [FormDefinitionError.RefPageCondition]:
    'This page is referenced by a condition. Remove the condition before making changes to this page.',
  [FormDefinitionError.RefConditionComponentId]:
    'A condition is using a question on this page. Remove the condition before re-attempting its removal.',
  [FormDefinitionError.RefConditionListId]:
    'A condition is using a list in this form. Remove the condition before making changes to the list.',
  [FormDefinitionError.RefConditionItemId]:
    'A condition is using an item in this list. Remove the condition before making changes to the item.',
  [FormDefinitionError.RefConditionConditionId]:
    'A condition is using another condition. Remove the reference before making changes.',
  [FormDefinitionError.RefPageComponentList]:
    'A question on this page is using a list. Remove the reference before making changes to the list.',
  [FormDefinitionError.IncompatibleConditionComponentType]:
    'You cannot change to this question type because this question is used in a condition. Remove the condition or select a different question type.',
  [FormDefinitionError.Other]:
    'There is a problem with the form definition. Check your changes and try again.'
}

export async function handleBadRequest(
  request: Request,
  h: ResponseToolkit,
  response: Boom
) {
  if (response.data && isBoomFormDefinitionErrorCause(response)) {
    const errorDetails = buildErrorDetails(response.data.cause)

    request.yar.clear(sessionNames.badRequestErrorList)
    request.yar.flash(sessionNames.badRequestErrorList, errorDetails)

    await request.yar.commit(h)

    if (request.headers.referer) {
      return h.redirect(request.headers.referer)
    }

    return null
  }

  return null
}

function isBoomFormDefinitionErrorCause(
  cause: Boom
): cause is Boom<{ cause: FormDefinitionErrorCause[] }> {
  return (
    cause.data.error === 'InvalidFormDefinitionError' &&
    Array.isArray(cause.data.cause)
  )
}

function buildErrorDetails(
  cause: FormDefinitionErrorCause[]
): ErrorDetailsItem[] {
  return cause.map((causeItem) => {
    return {
      text:
        formErrorsToMessages[causeItem.id] ||
        `Unknown error: ${causeItem.message} (${causeItem.id})`
    }
  })
}
