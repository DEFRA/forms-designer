import { getSavedReceiptHandle } from '~/src/routes/admin/dead-letter-queue-helper.js'

const mockFlash = jest.fn()
const mockYar = {
  flash: mockFlash
}

describe('dead letter queue helper', () => {
  test('should return receipt handle', () => {
    const messageId = 'message-id'
    mockFlash.mockReturnValueOnce([
      { messageId: 'message-id', receiptHandle: 'receipt-handle' }
    ])
    // @ts-expect-error - partial class mock for Yar
    expect(getSavedReceiptHandle(mockYar, messageId)).toBe('receipt-handle')
  })

  test('should return undefined if not found', () => {
    const messageId = 'message-id'
    mockFlash.mockReturnValueOnce([
      { messageId: 'message-idxxxxx', receiptHandle: 'receipt-handle' }
    ])
    // @ts-expect-error - partial class mock for Yar
    expect(getSavedReceiptHandle(mockYar, messageId)).toBeUndefined()
  })
})
