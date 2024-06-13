import { pino, stdSerializers, type LogEvent } from 'pino'

const logLevel = process.env.REACT_LOG_LEVEL

export default pino({
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
        const response = await window.fetch('/api/log', {
          method: 'POST',
          body: JSON.stringify({ level, ...body }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw Error(response.statusText)
        }
      }
    }
  }
})

type LogEventBrowser = Omit<LogEvent, 'messages'> &
  ({ messages: string[] } | { messages: [Error, string] })
