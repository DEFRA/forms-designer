import Boom from '@hapi/boom'
import {
  type Request,
  type ResponseToolkit,
  type ServerRegisterPluginObject
} from '@hapi/hapi'
import { type Yar } from '@hapi/yar'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { type ViewResponse } from '~/src/typings/hapi/index.js'

/**
 * Plugin to handle flash message context for views.
 *
 * This plugin reads flash messages from the session and adds them to the view context
 * BEFORE YAR's onPreResponse handler commits the session. This ensures flash messages
 * are properly consumed and deleted in a single request cycle.
 *
 * Must be registered AFTER error-pages plugin (which sets flash) but BEFORE final render.
 */
export default {
  plugin: {
    name: 'flash-context',
    register(server) {
      server.ext('onPreResponse', (request: Request, h: ResponseToolkit) => {
        const response = request.response

        if (Boom.isBoom(response)) {
          return h.continue
        }

        // Check if this is a view response from the Vision plugin
        // @ts-expect-error - Vision plugin adds 'view' variety at runtime
        if ('variety' in response && response.variety === 'view') {
          const viewResponse = response as unknown as ViewResponse

          // Only process if yar session is available
          // Some routes (like /favicon.ico) may have yar as null
          const yar = (request as { yar?: Yar | null }).yar

          if (yar?.id) {
            const badRequestErrorList = yar.flash(
              sessionNames.badRequestErrorList
            )

            const context = viewResponse.source.context ?? {}
            viewResponse.source.context = {
              ...context,
              badRequestErrorList
            }
          }
        }

        return h.continue
      })
    }
  }
} satisfies ServerRegisterPluginObject<void>
