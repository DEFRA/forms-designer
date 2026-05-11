import { log } from '~/src/lib/form.js'

describe('log', () => {
  beforeEach(() => {
    navigator.sendBeacon = jest.fn()
  })

  it('sends a beacon to /api/log', () => {
    log('info', { message: 'test' })
    expect(navigator.sendBeacon).toHaveBeenCalledWith(
      '/api/log',
      expect.any(Blob)
    )
  })

  it('encodes level and payload as JSON in the blob', async () => {
    log('warn', { message: 'something went wrong', code: 42 })

    const [, blob] = /** @type {[string, Blob]} */ (
      navigator.sendBeacon.mock.calls[0]
    )

    const text = await blob.text()
    expect(JSON.parse(text)).toEqual({
      level: 'warn',
      message: 'something went wrong',
      code: 42
    })
  })

  it('sets the blob content type to application/json', () => {
    log('error', { message: 'oops' })

    const [, blob] = /** @type {[string, Blob]} */ (
      navigator.sendBeacon.mock.calls[0]
    )

    expect(blob.type).toBe('application/json')
  })

  it('handles an empty payload', async () => {
    log('debug', {})

    const [, blob] = /** @type {[string, Blob]} */ (
      navigator.sendBeacon.mock.calls[0]
    )

    const text = await blob.text()
    expect(JSON.parse(text)).toEqual({ level: 'debug' })
  })
})
