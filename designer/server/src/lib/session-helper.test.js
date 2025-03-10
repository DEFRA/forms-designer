import {
  getFlashFromSession,
  setFlashInSession
} from '~/src/lib/session-helper.js'

const mockFlash = jest.fn()

const mockYar = /** @type {Yar}} */ ({
  flash: mockFlash,
  id: '',
  reset: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  clear: jest.fn(),
  touch: jest.fn(),
  lazy: jest.fn(),
  commit: jest.fn()
})

describe('Session functions', () => {
  test('getFlashFromSession should call flash', () => {
    mockFlash.mockReturnValue(['stored-val'])
    const res = getFlashFromSession(mockYar, 'my-key')
    expect(mockFlash).toHaveBeenCalledWith('my-key')
    expect(res).toBe('stored-val')
  })

  test('getFlashFromSession should handle undefined value', () => {
    mockFlash.mockReturnValue(undefined)
    const res = getFlashFromSession(mockYar, 'my-key')
    expect(mockFlash).toHaveBeenCalledWith('my-key')
    expect(res).toBeUndefined()
  })

  test('setFlashInSession should call flash', () => {
    setFlashInSession(mockYar, 'my-key', 'my-val')
    expect(mockFlash).toHaveBeenCalledWith('my-key', 'my-val')
  })
})

/**
 * @import { Yar } from '@hapi/yar'
 */
