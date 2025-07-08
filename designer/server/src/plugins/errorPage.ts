import {
  type Request,
  type ResponseToolkit,
  type ServerRegisterPluginObject
} from '@hapi/hapi'
import { StatusCodes } from 'http-status-codes'

import { errorViewModel } from '~/src/models/errors.js'

const errorCodes = new Map([
  [400, 'Sorry, there is a problem with the service'],
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

          if (statusCode === StatusCodes.NOT_FOUND.valueOf()) {
            request.logger.info(
              `[notFound] Request for non-existent resource: ${request.method.toUpperCase()} ${request.url.pathname}`
            )

            return h
              .view('404', errorViewModel('Page not found'))
              .code(statusCode)
          }

          const logLevel =
            statusCode === StatusCodes.NOT_FOUND.valueOf() ? 'info' : 'error'
          request.logger[logLevel](
            response,
            statusCode === StatusCodes.NOT_FOUND.valueOf()
              ? 'Resource not found'
              : 'Unhandled error found'
          )

          if (errorMessage) {
            return h
              .view(statusCode.toString(), errorViewModel(errorMessage))
              .code(statusCode)
          }
        }
        return h.continue
      })
    }
  }
} satisfies ServerRegisterPluginObject<void>
