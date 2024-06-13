import { pino, type LogEvent } from 'pino'

const logLevel = process.env.REACT_LOG_LEVEL

export default pino({
  browser: {
    asObject: true,
    transmit: {
      level: logLevel,
      async send(level, { messages }: LogEvent) {
        const response = await window.fetch('/api/log', {
          method: 'POST',
          body: JSON.stringify({ level, messages }),
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
