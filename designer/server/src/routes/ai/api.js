import { StatusCodes } from 'http-status-codes'

import * as scopes from '~/src/common/constants/scopes.js'
import { anthropicGetShortDescription } from '~/src/service/langchain.js'
export default [
  /**
   * @satisfies {ServerRoute<{ Params: FormByIdInput }>}
   */
  ({
    method: 'POST',
    path: '/api/ai/short_description',
    options: {
      async handler(request, h) {
        const { title } = request.payload

        try {
          // const { short_description: shortDescription } =
          //   await getShortDescription(title)
          // const shortDescription = await langchainJS(title)
          const shortDescription = await anthropicGetShortDescription(title)

          return h.response({ shortDescription }).code(StatusCodes.OK)
        } catch (e) {
          console.error(e)
          throw e
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  })
]

/**
 * @import { FormByIdInput, FormDefinition } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { Level, SerializedError } from 'pino'
 */
