import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import * as userSession from '~/src/common/helpers/auth/get-user-session.js'
import { mapUserForAudit } from '~/src/common/helpers/auth/user-helper.js'
import { logger } from '~/src/common/helpers/logging/logger.js'
import config from '~/src/config.js'
import { checkFileStatus, createFileLink } from '~/src/lib/file.js'
import { getFormDefinitionForSubmission } from '~/src/lib/forms.js'
import {
  publishFormFileDownloadFailureEvent,
  publishFormFileDownloadSuccessEvent
} from '~/src/messaging/publish.js'
import { errorViewModel } from '~/src/models/errors.js'
import { downloadCompleteModel } from '~/src/models/file/download-complete.js'
import * as file from '~/src/models/file/file.js'
import { redirectWithErrors } from '~/src/routes/forms/create.js'
import { getSubmissionRecord } from '~/src/services/formSubmissionService.js'

export const emailSchema = Joi.string().trim().required().messages({
  'string.empty': 'Enter an email address'
})

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
      const { query, payload, params, auth, server } = request
      const { credentials } = auth
      const { token } = credentials
      const { fileId } = params
      const { referenceNumber } = query
      let { email } = payload
      const isAsyncFetch = request.headers.accept === 'application/json'

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
        logger.info(`File download link created for file ID ${fileId}`)

        await server.methods.state.set(
          credentials.user.id,
          sessionNames.fileDownloadPassword,
          email,
          config.fileDownloadPasswordTtl
        )

        if (!isAsyncFetch && referenceNumber) {
          return h.redirect(`/files-download/${referenceNumber}`)
        }

        const auditUser = mapUserForAudit(auth.credentials.user)
        await publishFormFileDownloadSuccessEvent(
          fileId,
          fileStatus.filename,
          auditUser
        )

        return isAsyncFetch
          ? { url, fileName: fileStatus.filename }
          : h.view('file/download-complete', downloadCompleteModel(url))
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
            auditUser
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

        throw err
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
        query: Joi.object({
          referenceNumber: Joi.string().optional(),
          ajax: Joi.boolean().optional()
        }),
        payload: Joi.object({
          email: emailSchema
        }).required(),
        failAction: (request, h, err) => {
          return redirectWithErrors(
            request,
            h,
            err,
            false,
            sessionNames.validationFailure.fileDownload
          )
        }
      }
    }
  }),
  /**
   * @satisfies {ServerRoute<{ Params: { referenceNumber: string } }>}
   */
  ({
    method: 'GET',
    path: '/files-download/{referenceNumber}',
    async handler(request, h) {
      const { params, server, auth } = request
      const { referenceNumber } = params
      const { credentials } = auth
      const { token } = credentials

      if (!userSession.hasUser(credentials)) {
        return Boom.unauthorized()
      }

      const record = await getSubmissionRecord(referenceNumber, token)
      const files = record.data.files
      const fileKeys = Object.keys(files)
      const allFiles = fileKeys.flatMap((key) => files[key])

      if (!allFiles.length) {
        return Boom.badRequest('No files associated with this submission')
      }

      const definition = await getFormDefinitionForSubmission(
        record.meta,
        token
      )

      const email = await server.methods.state.get(
        credentials.user.id,
        sessionNames.fileDownloadPassword
      )

      if (!email) {
        const firstFile = allFiles[0]

        return h.redirect(
          `/file-download/${firstFile.fileId}?referenceNumber=${referenceNumber}`
        )
      }

      return h.view(
        'file/download-all',
        file.downloadAllViewModel(email, files, definition)
      )
    },
    options: {
      auth: {
        access: {
          entity: 'user',
          scope: false
        }
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
