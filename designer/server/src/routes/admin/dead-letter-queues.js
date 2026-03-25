import { DeadLetterQueues, Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import {
  deleteDeadLetterQueueMessage,
  getDeadLetterQueueMessages,
  redriveDeadLetterQueueMessages
} from '~/src/lib/dead-letter-queue.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import {
  deleteDeadLetterMessageConfirmationViewModel,
  redriveDeadLetterQueueConfirmationViewModel
} from '~/src/models/manage/dead-letter-queue.js'
import { getSavedReceiptHandle } from '~/src/routes/admin/dead-letter-queue-helper.js'

export const ROUTE_FULL_PATH = '/admin/dead-letter-queues'

const ADMIN_TOOLS = 'Admin tools'

const dlqSchema = Joi.string()
  .required()
  .valid(...Object.values(DeadLetterQueues))

const dlqPayloadSchema = Joi.object().keys({
  dlq: dlqSchema.messages({
    '*': 'Select a dead-letter queue'
  })
})

const dlqParamSchema = Joi.object().keys({
  dlq: dlqSchema.messages({
    '*': 'Missing dead-letter queue'
  })
})

const messageIdSchema = Joi.string().required().messages({
  '*': 'Missing message id'
})

const dlqAndMessageParamSchema = Joi.object().keys({
  dlq: dlqSchema,
  messageId: messageIdSchema
})

/**
 * Keep specific properties
 * @param {any[]} messages
 */
export function dlqMessageMapper(messages) {
  return messages.map((m) => ({
    json: {
      MessageId: m.MessageId,
      Body: JSON.parse(m.Body)
    },
    receiptHandle: m.ReceiptHandle
  }))
}

export function generateTitling() {
  const pageHeading = ADMIN_TOOLS

  return {
    pageTitle: `${pageHeading} - dead-letter queues`,
    pageHeading: {
      text: pageHeading
    },
    backLink: {
      text: 'Back to admin tools home',
      href: '/admin/index'
    }
  }
}

/**
 * Get counts from each dead-letter queue
 * @param {string} token
 */
export async function getMessageCounts(token) {
  const radioItems = []
  for (const dlq of Object.values(DeadLetterQueues)) {
    try {
      const { messages } = await getDeadLetterQueueMessages(dlq, token)
      const countSuffix = messages.length === 1 ? 'message' : 'messages'
      radioItems.push({
        value: dlq,
        text: `${dlq} - ${messages.length} ${countSuffix}`
      })
    } catch {
      radioItems.push({
        value: dlq,
        text: `${dlq} - error`
      })
    }
  }
  return radioItems
}

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH,
    async handler(request, h) {
      const { auth, yar } = request
      const { token } = auth.credentials

      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      // Validation errors
      const validation = yar
        .flash(sessionNames.validationFailure.deadLetterQueues)
        .at(0)

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(sessionNames.successNotification).at(0)
      )

      const { formValues, formErrors } = validation ?? {}

      const items = await getMessageCounts(token)

      const dlqOptions = {
        fieldset: {
          legend: {
            text: 'Which dead-letter queue do you want to inspect?',
            isPageHeading: false,
            classes: 'govuk-fieldset__legend--l'
          }
        },
        id: 'dlq',
        name: 'dlq',
        items,
        errorMessage: formErrors?.dlq
          ? { text: formErrors.dlq.text }
          : undefined
      }
      return h.view('admin/dead-letter-queues', {
        ...generateTitling(),
        navigation,
        notification,
        dlqOptions,
        errorList: buildErrorList(formErrors, ['dlq']),
        formErrors,
        formValues
      })
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.DeadLetterQueues}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: { dlq: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH,
    handler(request, h) {
      const { payload } = request
      const { dlq } = payload

      // Redirect to queue page
      return h
        .redirect(`/admin/dead-letter-queues/${dlq}`)
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: dlqPayloadSchema,
        failAction: (request, h, err) => {
          return redirectWithErrors(
            request,
            h,
            err,
            sessionNames.validationFailure.deadLetterQueues
          )
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.DeadLetterQueues}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: { dlq: DeadLetterQueues } }>}
   */
  ({
    method: 'GET',
    path: `${ROUTE_FULL_PATH}/{dlq}`,
    async handler(request, h) {
      const { auth, params, yar } = request
      const { token } = auth.credentials
      const { dlq } = params

      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      const { messages } = await getDeadLetterQueueMessages(dlq, token)

      const mappedMessages = dlqMessageMapper(messages)

      const messageHandles = mappedMessages.map((m) => ({
        messageId: m.json.MessageId,
        receiptHandle: m.receiptHandle
      }))

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(sessionNames.successNotification).at(0)
      )

      // Flash list of messages in order to retrieve receipt handle (a long string) if deleting a message
      yar.flash(sessionNames.deadLetterQueueMessages, messageHandles)

      return h.view('admin/dead-letter-queue-view', {
        ...generateTitling(),
        backLink: {
          text: 'Back to dead-letter queues',
          href: '/admin/dead-letter-queues'
        },
        navigation,
        notification,
        caption: {
          text: dlq
        },
        messages: mappedMessages,
        queueName: dlq
      })
    },
    options: {
      validate: {
        params: dlqParamSchema
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.DeadLetterQueues}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: { dlq: DeadLetterQueues } }>}
   */
  ({
    method: 'POST',
    path: `${ROUTE_FULL_PATH}/{dlq}`,
    handler(request, h) {
      const { params } = request
      const { dlq } = params

      return h.redirect(`${ROUTE_FULL_PATH}/${dlq}/redrive`)
    },
    options: {
      validate: {
        params: dlqParamSchema
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.DeadLetterQueues}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: { dlq: DeadLetterQueues } }>}
   */
  ({
    method: 'GET',
    path: `${ROUTE_FULL_PATH}/{dlq}/redrive`,
    handler(request, h) {
      const { params } = request
      const { dlq } = params

      return h.view(
        'forms/confirmation-page',
        redriveDeadLetterQueueConfirmationViewModel(dlq)
      )
    },
    options: {
      validate: {
        params: dlqParamSchema
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.DeadLetterQueues}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: { dlq: DeadLetterQueues } }>}
   */
  ({
    method: 'POST',
    path: `${ROUTE_FULL_PATH}/{dlq}/redrive`,
    async handler(request, h) {
      const { auth, params, yar } = request
      const { token } = auth.credentials
      const { dlq } = params

      await redriveDeadLetterQueueMessages(dlq, token)

      yar.flash(
        sessionNames.successNotification,
        `A redrive for messages in DLQ '${dlq}' has been triggered`
      )

      return h.redirect('/admin/dead-letter-queues')
    },
    options: {
      validate: {
        params: dlqParamSchema
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.DeadLetterQueues}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { dlq: DeadLetterQueues, messageId: string } }>}
   */
  ({
    method: 'GET',
    path: `${ROUTE_FULL_PATH}/{dlq}/delete/{messageId}`,
    handler(request, h) {
      const { params } = request
      const { dlq, messageId } = params

      return h.view(
        'forms/confirmation-page',
        deleteDeadLetterMessageConfirmationViewModel(dlq, messageId)
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.DeadLetterQueues}`]
        }
      },
      validate: {
        params: dlqAndMessageParamSchema
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: { dlq: DeadLetterQueues, messageId: string } }>}
   */
  ({
    method: 'POST',
    path: `${ROUTE_FULL_PATH}/{dlq}/delete/{messageId}`,
    async handler(request, h) {
      const { auth, params, yar } = request
      const { token } = auth.credentials
      const { dlq, messageId } = params

      // Retrieve appropriate receipt handle from saved list of messages
      const receiptHandle = getSavedReceiptHandle(yar, messageId)

      if (!receiptHandle) {
        throw new Error('ReceiptHandle not found in session')
      }

      await deleteDeadLetterQueueMessage(dlq, receiptHandle, messageId, token)

      yar.flash(
        sessionNames.successNotification,
        `Message '${messageId}' in DLQ '${dlq}' has been deleted`
      )

      return h.redirect(`/admin/dead-letter-queues/${dlq}`)
    },
    options: {
      validate: {
        params: dlqAndMessageParamSchema
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.DeadLetterQueues}`]
        }
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
