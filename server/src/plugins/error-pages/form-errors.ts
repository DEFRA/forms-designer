import {
  formErrorsToMessages,
  type FormDefinitionErrorCause
} from '@defra/forms-model'
import { type Boom } from '@hapi/boom'
import { type Request, type ResponseToolkit } from '@hapi/hapi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { type ErrorDetailsItem } from '~/src/common/helpers/types.js'

export { formErrorsToMessages }

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
