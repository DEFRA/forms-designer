import { StatusCodes } from 'http-status-codes'

import { checkFileStatus } from '~/src/lib/file.js'

export default [
  /**
   * @satisfies {ServerRoute< { Params:  FileDownload }>}
   */
  ({
    method: 'GET',
    path: '/file-download/{fileId}',
    async handler(request, h) {
      const { fileId } = request.params

      const status = await checkFileStatus(fileId)

      if (status === StatusCodes.OK) {
        h.view('/provide-password')
      }

      if (status === StatusCodes.GONE) {
        h.view('/expired')
      }
    },
    options: {
      auth: false
    }
  })
]

/**
 * @import { FileDownload } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
