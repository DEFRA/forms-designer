import { DeadLetterQueues, Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { mapUserForAudit } from '~/src/common/helpers/auth/user-helper.js'
import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import {
  deleteDeadLetterQueueMessage,
  getDeadLetterQueueMessages,
  redriveDeadLetterQueueMessages,
  resubmitDeadLetterQueueMessage
} from '~/src/lib/dead-letter-queue.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { publishDlqActionEvent } from '~/src/messaging/publish.js'
import {
  deleteDeadLetterMessageConfirmationViewModel,
  redriveDeadLetterQueueConfirmationViewModel
} from '~/src/models/manage/dead-letter-queue.js'
import {
  dlqMessagesMapper,
  validateMessageJson
} from '~/src/routes/admin/dead-letter-queue-helper.js'

export const ROUTE_FULL_PATH = '/admin/dead-letter-queues'
const CONFIRMATION_PAGE_PATH = 'forms/confirmation-page'

const ADMIN_TOOLS = 'Admin tools'
const MODIFY_AND_RESUBMIT = 'modify-and-resubmit'
const REDRIVE = 'redrive'
const DELETE = 'delete'
const CONFIRM = 'confirm'

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

const dlqModifyParamSchema = Joi.object().keys({
  dlq: dlqSchema,
  messageId: messageIdSchema
})

const dlqModifyPayloadSchema = Joi.object().keys({
  messageJson: Joi.string().required().messages({
    '*': 'Enter JSON content'
  })
})

const dlqActionPayloadSchema = Joi.object().keys({
  action: Joi.string().valid(CONFIRM, DELETE).required(),
  messageId: messageIdSchema
})

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
      const messages = await getDeadLetterQueueMessages(dlq, token)
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

      // Validation errors
      const validation = yar
        .flash(sessionNames.validationFailure.deadLetterQueues)
        .at(0)

      const messages = await getDeadLetterQueueMessages(dlq, token)

      const mappedMessages = dlqMessagesMapper(messages)

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(sessionNames.successNotification).at(0)
      )

      return h.view('admin/dead-letter-queue-view', {
        ...generateTitling(),
        backLink: {
          text: 'Back to dead-letter queues',
          href: ROUTE_FULL_PATH
        },
        navigation,
        notification,
        caption: {
          text: dlq
        },
        messages: mappedMessages,
        queueName: dlq,
        errorList: buildErrorList(validation?.formErrors)
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
    method: 'GET',
    path: `${ROUTE_FULL_PATH}/{dlq}/redrive`,
    handler(request, h) {
      const { params } = request
      const { dlq } = params

      return h.view(
        CONFIRMATION_PAGE_PATH,
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

      const auditUser = mapUserForAudit(auth.credentials.user)
      await publishDlqActionEvent(dlq, REDRIVE, undefined, undefined, auditUser)

      yar.flash(
        sessionNames.successNotification,
        `A redrive for messages in DLQ '${dlq}' has been triggered`
      )

      return h.redirect(ROUTE_FULL_PATH)
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
   * @satisfies {ServerRoute<{ Params: { dlq: DeadLetterQueues }, Payload: { action: string, messageId: string } }>}
   */
  ({
    method: 'POST',
    path: `${ROUTE_FULL_PATH}/{dlq}/delete`,
    async handler(request, h) {
      const { auth, params, payload, yar } = request
      const { token } = auth.credentials
      const { dlq } = params
      const { action, messageId } = payload

      if (action === CONFIRM) {
        return h.view(
          CONFIRMATION_PAGE_PATH,
          deleteDeadLetterMessageConfirmationViewModel(dlq, messageId)
        )
      }

      await deleteDeadLetterQueueMessage(dlq, messageId, token)

      const auditUser = mapUserForAudit(auth.credentials.user)
      await publishDlqActionEvent(dlq, DELETE, messageId, undefined, auditUser)

      yar.flash(
        sessionNames.successNotification,
        `Message '${messageId}' in DLQ '${dlq}' has been deleted`
      )

      return h.redirect(`/admin/dead-letter-queues/${dlq}`)
    },
    options: {
      validate: {
        params: dlqParamSchema,
        payload: dlqActionPayloadSchema
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
   * @satisfies {ServerRoute<{ Params: { dlq: DeadLetterQueues, messageId: string }, Payload: { messageJsonText: string } }>}
   */
  ({
    method: 'POST',
    path: `${ROUTE_FULL_PATH}/{dlq}/modify-redirect/{messageId}`,
    handler(request, h) {
      const { params, payload, yar } = request
      const { dlq, messageId } = params
      const { messageJsonText } = payload

      yar.flash(sessionNames.validationFailure.deadLetterQueues, {
        formValues: { messageJsonExisting: messageJsonText }
      })

      return h
        .redirect(`${ROUTE_FULL_PATH}/${dlq}/modify/${messageId}`)
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        params: dlqModifyParamSchema
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
    path: `${ROUTE_FULL_PATH}/{dlq}/modify/{messageId}`,
    handler(request, h) {
      const { params, yar } = request
      const { dlq, messageId } = params

      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      // Validation errors
      const validation = yar
        .flash(sessionNames.validationFailure.deadLetterQueues)
        .at(0)

      const { formValues, formErrors } = validation ?? {}

      const messageJson = {
        name: 'messageJson',
        id: 'message-json',
        hint: {
          text: "You can leave the 'MessageId' value unchanged - it will get a new value when you resubmit"
        },
        value:
          formValues?.messageJson ??
          JSON.stringify(
            JSON.parse(formValues?.messageJsonExisting ?? '{}'),
            null,
            2
          ),
        rows: 30,
        errorMessage: formErrors?.messageJson
          ? { text: formErrors.messageJson.text }
          : undefined
      }

      return h.view('admin/dead-letter-queue-modify', {
        ...generateTitling(),
        backLink: {
          text: 'Back to dead-letter queues',
          href: ROUTE_FULL_PATH
        },
        navigation,
        caption: {
          text: dlq
        },
        messageJson,
        messageId,
        queueName: dlq,
        messageJsonExisting: formValues?.messageJsonExisting
      })
    },
    options: {
      validate: {
        params: dlqModifyParamSchema
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
   * @satisfies {ServerRoute<{ Params: { dlq: DeadLetterQueues, messageId: string }, Payload: { messageJson: string, origMessageJson: string  } }>}
   */
  ({
    method: 'POST',
    path: `${ROUTE_FULL_PATH}/{dlq}/modify/{messageId}`,
    async handler(request, h) {
      const { auth, params, payload, yar } = request
      const { token } = auth.credentials
      const { dlq, messageId } = params
      const { messageJson, origMessageJson } = payload

      const { error, body } = validateMessageJson(messageJson)
      if (error) {
        return redirectWithErrors(
          request,
          h,
          error,
          sessionNames.validationFailure.deadLetterQueues
        )
      }

      await resubmitDeadLetterQueueMessage(dlq, messageId, body, token)

      await deleteDeadLetterQueueMessage(dlq, messageId, token)

      const auditUser = mapUserForAudit(auth.credentials.user)
      await publishDlqActionEvent(
        dlq,
        MODIFY_AND_RESUBMIT,
        messageId,
        {
          beforeJson: origMessageJson,
          afterJson: messageJson
        },
        auditUser
      )

      yar.flash(
        sessionNames.successNotification,
        `The modified message has been submitted and the original message removed from DLQ '${dlq}'`
      )

      return h.redirect(ROUTE_FULL_PATH)
    },
    options: {
      validate: {
        params: dlqModifyParamSchema,
        payload: dlqModifyPayloadSchema
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
