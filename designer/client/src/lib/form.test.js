import { log } from '~/src/lib/form.js'

describe('log', () => {
  /** @type {jest.MockedFunction<typeof navigator.sendBeacon>} */
  let sendBeacon

  beforeEach(() => {
    sendBeacon = jest.fn()
    navigator.sendBeacon = sendBeacon
  })

  it('sends a beacon to /api/log', () => {
    log('info', { message: 'test' })
    expect(sendBeacon).toHaveBeenCalledWith('/api/log', expect.any(Blob))
  })

  it('encodes level and payload as JSON in the blob', async () => {
    log('warn', { message: 'something went wrong', code: 42 })

    const [, blob] = sendBeacon.mock.calls[0]

    const text = await /** @type {Blob} */ (blob).text()
    expect(JSON.parse(text)).toEqual({
      level: 'warn',
      message: 'something went wrong',
      code: 42
    })
  })

  it('sets the blob content type to application/json', () => {
    log('error', { message: 'oops' })

    const [, blob] = sendBeacon.mock.calls[0]

    expect(/** @type {Blob} */ (blob).type).toBe('application/json')
  })

  it('handles an empty payload', async () => {
    log('debug', {})

    const [, blob] = sendBeacon.mock.calls[0]

    const text = await /** @type {Blob} */ (blob).text()
    expect(JSON.parse(text)).toEqual({ level: 'debug' })
  })
})
