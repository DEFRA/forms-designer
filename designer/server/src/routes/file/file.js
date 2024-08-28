import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { redirectWithErrors } from '../forms/create.js'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { checkFileStatus, createFileLink } from '~/src/lib/file.js'
import { errorViewModel } from '~/src/models/errors.js'
import * as file from '~/src/models/file/file.js'

export const emailSchema = Joi.string().trim().required().messages({
  'string.empty': 'Enter an email address'
})

export default [
  /**
   * @satisfies {ServerRoute< { Params:  { fileId: string } }>}
   */
  ({
    method: 'GET',
    path: '/file-download/{fileId}',
    async handler(request, h) {
      const { params, yar } = request
      const { fileId } = params

      const statusCode = await checkFileStatus(fileId)

      switch (statusCode) {
        case StatusCodes.OK: {
          const validation = yar.flash(sessionNames.validationFailure)[0]
          return h.view('file/download-page', file.fileViewModel(validation))
        }

        case StatusCodes.GONE: {
          const pageTitle = 'The link has expired'
          return h.view('file/expired', errorViewModel(pageTitle))
        }

        default: {
          return h.response('Unhandled file status').code(500)
        }
      }
    }
  }),
  /**
   * @satisfies {ServerRoute< { Params:  { fileId: string }, Payload: { email: string } }>}
   */
  ({
    method: 'POST',
    path: '/file-download/{fileId}',
    async handler(request, h) {
      const { payload, params, auth } = request
      const { token } = auth.credentials
      const { email } = payload
      const { fileId } = params

      try {
        const result = await createFileLink(fileId, email, token)
        return h.redirect(result.url)
      } catch (err) {
        if (
          Boom.isBoom(err) &&
          err.output.statusCode === StatusCodes.GONE.valueOf()
        ) {
          const pageTitle = 'The link has expired'

          return h.view('file/expired', errorViewModel(pageTitle))
        }

        return Boom.internal(
          new Error('Failed to download file', {
            cause: err
          })
        )
      }
    },
    options: {
      validate: {
        payload: Joi.object({
          email: emailSchema
        }).required(),
        failAction: redirectWithErrors
      }
    }
  })
]

/**
 * @import { FileDownload } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */

// 1. Downlaod file from url
// 2. Handle 403, 404, 410 from create file link endpoint