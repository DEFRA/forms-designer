import { stdSerializers, type LogEvent, type LoggerOptions } from 'pino'

import * as form from '~/src/lib/form.js'

const logLevel = process.env.REACT_LOG_LEVEL

export const loggerOptions = {
  browser: {
    asObject: false,
    serialize: false,
    transmit: {
      level: logLevel,
      async send(level, { messages }: LogEventBrowser) {
        const [error, ...params] = messages

        // Log event request body
        const body = !(error instanceof Error)
          ? { messages }
          : {
              messages: params,
              error: stdSerializers.errWithCause(error)
            }

        // Submit log event request
        return form.log(level, body)
      }
    }
  }
} satisfies LoggerOptions

type LogEventBrowser = Omit<LogEvent, 'messages'> &
  ({ messages: string[] } | { messages: [Error, string] })
