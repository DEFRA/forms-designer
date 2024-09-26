import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import config from '~/src/config.js'
import { checkFileStatus, createFileLink } from '~/src/lib/file.js'
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
      const { params, yar, server } = request
      const { fileId } = params

      const statusCode = await checkFileStatus(fileId)

      switch (statusCode) {
        case StatusCodes.OK: {
          const validation = yar.flash(
            sessionNames.validationFailure.fileDownload
          )[0]
          const email =
            /** @type {string | undefined} */ (
              await server.methods.session.get(
                sessionNames.fileDownloadPassword
              )
            ) ?? ''
          return h.view(
            'file/download-page',
            file.fileViewModel(email, validation)
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
      const { token } = auth.credentials
      const { email } = payload
      const { fileId } = params

      try {
        const { url } = await createFileLink(fileId, email, token)

        await server.methods.session.set(
          sessionNames.fileDownloadPassword,
          email,
          {
            cache: {
              expiresIn: config.fileDownloadPasswordTtl
            }
          }
        )
        logger.info(`File download link created for file ID ${fileId}`)
        return h.view('file/download-complete', downloadCompleteModel(url))
      } catch (err) {
        if (
          Boom.isBoom(err) &&
          err.output.statusCode === StatusCodes.GONE.valueOf()
        ) {
          logger.error(`File download link expired for file ID ${fileId}`)

          const pageTitle = 'The link has expired'

          return h.view('file/expired', errorViewModel(pageTitle))
        }

        if (
          Boom.isBoom(err) &&
          err.output.statusCode === StatusCodes.FORBIDDEN.valueOf()
        ) {
          logger.error(
            `Failed to download file for file ID ${fileId} with incorrect email`
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

        return Boom.internal(
          new Error('Failed to download file', {
            cause: err
          })
        )
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
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
