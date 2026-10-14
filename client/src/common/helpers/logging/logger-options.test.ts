import { stdSerializers } from 'pino'

import { loggerOptions } from '~/src/common/helpers/logging/logger-options.js'
import * as form from '~/src/lib/form.js'

jest.mock('~/src/lib/form.js')

const send = (
  ...args: Parameters<typeof loggerOptions.browser.transmit.send>
) => loggerOptions.browser.transmit.send(...args)

describe('loggerOptions', () => {
  describe('browser', () => {
    it('has asObject set to false', () => {
      expect(loggerOptions.browser.asObject).toBe(false)
    })

    it('has serialize set to false', () => {
      expect(loggerOptions.browser.serialize).toBe(false)
    })
  })

  describe('transmit', () => {
    it('uses REACT_LOG_LEVEL as the level', () => {
      expect(loggerOptions.browser.transmit.level).toBe(
        process.env.REACT_LOG_LEVEL
      )
    })

    describe('send', () => {
      const mockLog = jest.mocked(form.log)

      beforeEach(() => {
        jest.clearAllMocks()
      })

      it('calls form.log with the level and messages when the first message is not an Error', () => {
        const messages = ['something went wrong', 'extra detail']
        send('warn', { messages } as Parameters<typeof send>[1])

        expect(mockLog).toHaveBeenCalledWith('warn', { messages })
      })

      it('calls form.log with serialized error and remaining params when the first message is an Error', () => {
        const error = new Error('boom')
        const messages: [Error, string] = [error, 'extra detail']
        send('error', { messages } as Parameters<typeof send>[1])

        expect(mockLog).toHaveBeenCalledWith('error', {
          messages: ['extra detail'],
          error: stdSerializers.errWithCause(error)
        })
      })

      it('includes the error cause in the serialized error', () => {
        const cause = new Error('root cause')
        const error = Object.assign(new Error('wrapper'), { cause })
        const messages: [Error, string] = [error, 'context']
        send('error', { messages } as Parameters<typeof send>[1])

        const [, body] = mockLog.mock.calls[0]
        expect(body).toHaveProperty('error.cause.message', 'root cause')
      })

      it('passes the correct log level through to form.log', () => {
        const messages = ['info message']
        send('info', { messages } as Parameters<typeof send>[1])

        expect(mockLog).toHaveBeenCalledWith('info', expect.any(Object))
      })

      it('calls form.log exactly once per send call', () => {
        const messages = ['msg']
        send('debug', { messages } as Parameters<typeof send>[1])

        expect(mockLog).toHaveBeenCalledTimes(1)
      })
    })
  })
})
