import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import * as userSession from '~/src/common/helpers/auth/get-user-session.js'
import { mapUserForAudit } from '~/src/common/helpers/auth/user-helper.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import config from '~/src/config.js'
import { checkFileStatus, createFileLink } from '~/src/lib/file.js'
import {
  publishFormFileDownloadFailureEvent,
  publishFormFileDownloadSuccessEvent
} from '~/src/messaging/publish.js'
import { errorViewModel } from '~/src/models/errors.js'
import { downloadCompleteModel } from '~/src/models/file/download-complete.js'
import * as file from '~/src/models/file/file.js'
import { redirectWithErrors } from '~/src/routes/forms/create.js'

export const emailSchema = Joi.string().trim().required().messages({
  'string.empty': 'Enter an email address'
})
const logger = createLogger()

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { fileId: string } }>}
   */
  ({
    method: 'GET',
    path: '/file-download/{fileId}',
    async handler(request, h) {
      const { params, yar, server, auth } = request
      const { fileId } = params
      const { credentials } = auth

      if (!userSession.hasUser(credentials)) {
        return Boom.unauthorized()
      }

      const { statusCode } = await checkFileStatus(fileId)

      switch (statusCode) {
        case StatusCodes.OK: {
          const validation = yar.flash(
            sessionNames.validationFailure.fileDownload
          )[0]

          const email = await server.methods.state.get(
            credentials.user.id,
            sessionNames.fileDownloadPassword
          )

          return h.view(
            'file/download-page',
            file.fileViewModel(email ?? '', validation)
          )
        }

        case StatusCodes.GONE: {
          const pageTitle = 'The link has expired'
          return h.view('file/expired', errorViewModel(pageTitle))
        }

        case StatusCodes.NOT_FOUND: {
          return Boom.notFound()
        }

        default: {
          return Boom.internal('Unhandled file status')
        }
      }
    },
    options: {
      auth: {
        access: {
          entity: 'user',
          scope: false
        }
      }
    }
  }),
  /**
   * @satisfies {ServerRoute<{ Params: { fileId: string }, Payload: { email: string } }>}
   */
  ({
    method: 'POST',
    path: '/file-download/{fileId}',
    async handler(request, h) {
      const { payload, params, auth, server } = request
      const { credentials } = auth
      const { token } = credentials
      let { email } = payload
      const { fileId } = params

      if (!userSession.hasUser(credentials)) {
        return Boom.unauthorized()
      }

      let fileStatus
      try {
        fileStatus = await checkFileStatus(fileId)
        const emailIsCaseSensitive = fileStatus.emailIsCaseSensitive

        // If the email isn't case-sensitive,
        // we lowercase the email before sending it to the submission API.
        if (!emailIsCaseSensitive) {
          email = email.toLowerCase()
        }

        const { url } = await createFileLink(fileId, email, token)

        await server.methods.state.set(
          credentials.user.id,
          sessionNames.fileDownloadPassword,
          email,
          config.fileDownloadPasswordTtl
        )
        logger.info(`File download link created for file ID ${fileId}`)

        const auditUser = mapUserForAudit(auth.credentials.user)
        await publishFormFileDownloadSuccessEvent(
          fileId,
          fileStatus.filename,
          auditUser,
          fileStatus.form
        )
        return h.view('file/download-complete', downloadCompleteModel(url))
      } catch (err) {
        if (
          Boom.isBoom(err) &&
          err.output.statusCode === StatusCodes.GONE.valueOf()
        ) {
          logger.info(
            `[fileExpired] File download link expired for file ID ${fileId}`
          )

          const pageTitle = 'The link has expired'

          return h.view('file/expired', errorViewModel(pageTitle))
        }

        if (
          Boom.isBoom(err) &&
          err.output.statusCode === StatusCodes.FORBIDDEN.valueOf()
        ) {
          logger.info(
            `[fileAuthFailed] Failed to download file for file ID ${fileId}. Email ${email} did not match retrieval key.`
          )
          const auditUser = mapUserForAudit(auth.credentials.user)
          await publishFormFileDownloadFailureEvent(
            fileId,
            fileStatus?.filename ?? 'unknown',
            auditUser,
            fileStatus?.form
          )

          const validation = {
            formErrors: {
              email: {
                text: 'This is not the email address the file was sent to. To confirm the file was meant for your team, enter the email address the file was sent to.'
              }
            },
            formValues: { email }
          }

          return h.view(
            'file/download-page',
            file.fileViewModel(email, validation)
          )
        }

        // prettier-ignore
        return Boom.internal(new Error('Failed to download file', { cause: err }))
      }
    },
    options: {
      auth: {
        access: {
          entity: 'user',
          scope: false
        }
      },
      validate: {
        payload: Joi.object({
          email: emailSchema
        }).required(),
        failAction: (request, h, err) => {
          // prettier-ignore
          return redirectWithErrors(request, h, err, false, sessionNames.validationFailure.fileDownload)
        }
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
