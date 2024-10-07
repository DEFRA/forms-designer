import {
  type Request,
  type ResponseToolkit,
  type ServerRegisterPluginObject
} from '@hapi/hapi'

import { errorViewModel } from '~/src/models/errors.js'

const errorCodes = new Map([
  [403, 'You do not have access to this service'],
  [404, 'Page not found'],
  [500, 'Sorry, there is a problem with the service']
])

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
          const errorMessage = errorCodes.get(statusCode)

          if (errorMessage) {
            return h
              .view(statusCode.toString(), errorViewModel(errorMessage))
              .code(statusCode)
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
