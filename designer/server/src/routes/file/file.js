import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { redirectWithErrors } from '../forms/create.js'

import { checkFileStatus } from '~/src/lib/file.js'
import { errorViewModel } from '~/src/models/errors.js'
import * as file from '~/src/models/file/file.js'

export const schema = Joi.object().keys({
  email: Joi.string()
    .email({ tlds: { allow: ['uk'] } })
    .trim()
    .required()
    .messages({
      'string.empty': 'Enter an email address'
    })
})

export default [
  /**
   * @satisfies {ServerRoute< { Params:  FileDownload, Payload: { email: string} }>}
   */
  ({
    method: 'GET',
    path: '/file-download/{fileId}',
    async handler(request, h) {
      const { params } = request
      const { fileId } = params

      try {
        await checkFileStatus(fileId)

        return h.view('file/download-page', file.fileViewModel(undefined))
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
      auth: false
    }
  }),
  /**
   * @satisfies {ServerRoute< { Params:  FileDownload, Payload: { email: string } }>}
   */
  ({
    method: 'POST',
    path: '/file-download/{fileId}',
    handler(request, h) {
      const { payload } = request
      const { email } = payload

      return h.view('file/download-page', file.fileViewModel(email))
    },
    options: {
      auth: false,
      validate: {
        payload: Joi.object().keys({
          email: schema.extract('email')
        }),
        failAction: redirectWithErrors
      }
    }
  })
]

/**
 * @import { FileDownload } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
