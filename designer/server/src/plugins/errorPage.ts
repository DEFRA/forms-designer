import {
  type ServerRegisterPluginObject,
  type Request,
  type ResponseToolkit
} from '@hapi/hapi'

import { errorViewModel } from '~/src/models/errors.js'

/*
 * Add an `onPreResponse` listener to return error pages
 */
export default {
  plugin: {
    name: 'error-pages',
    register(server) {
      server.ext('onPreResponse', (request: Request, h: ResponseToolkit) => {
        const response = request.response

        if ('isBoom' in response && response.isBoom) {
          // An error was raised during
          // processing the request
          const statusCode = response.output.statusCode
          const pageTitle = 'You do not have access to this service'

          // In the event of 403
          // return the `403` view
          if (statusCode === 403) {
            return h.view('403', errorViewModel(pageTitle)).code(statusCode)
          }

          request.log('error', {
            statusCode,
            data: response.data,
            message: response.message,
            stack: response.stack
          })

          request.logger.error(response.stack)
        }
        return h.continue
      })
    }
  }
} satisfies ServerRegisterPluginObject<void>
