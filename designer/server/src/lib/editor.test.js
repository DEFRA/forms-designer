import { ComponentType } from '@defra/forms-model'

import config from '~/src/config.js'
import { addPage, addQuestion } from '~/src/lib/editor.js'
import { postJson } from '~/src/lib/fetch.js'

jest.mock('~/src/lib/fetch.js')

const mockedPostJson = /** @type {jest.MockedFunction<typeof postJson>} */ (
  postJson
)

/**
 * Creates a minimal mock response
 * @param {object} [props]
 * @param {number} [props.statusCode]
 */
function createMockResponse(props = {}) {
  /** @type {any} */
  const response = {
    statusCode: props.statusCode,
    headers: {}
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response
}

const formsEndpoint = new URL('/forms/', config.managerUrl)

describe('editor.js', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('addPage', () => {
    const formId = '98dbfb6c-93b7-41dc-86e7-02c7abe4ba38'
    const requestUrl = new URL(
      `./${formId}/definition/draft/pages`,
      formsEndpoint
    )
    const token = 'someToken'
    const expectedOptions = {
      payload: { title: 'Untitled', path: '/path-stub' },
      headers: { Authorization: `Bearer ${token}` }
    }

    describe('when postJson succeeds', () => {
      test('returns response body', async () => {
        mockedPostJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: 'new-id' }
        })

        const result = await addPage(formId, token, 'path-stub')

        expect(mockedPostJson).toHaveBeenCalledWith(requestUrl, expectedOptions)
        expect(result).toEqual({ id: 'new-id' })
      })
    })

    describe('when postJson fails', () => {
      test('throws the error', async () => {
        const testError = new Error('Network error')
        mockedPostJson.mockRejectedValueOnce(testError)

        await expect(addPage(formId, token, 'path-stub')).rejects.toThrow(
          testError
        )
      })
    })
  })

  describe('addQuestion', () => {
    const formId = '98dbfb6c-93b7-41dc-86e7-02c7abe4ba38'
    const pageId = '2da66e98-18f9-4822-89d0-2cabfe3cf19b'
    const requestUrl = new URL(
      `./${formId}/definition/draft/pages/${pageId}/question`,
      formsEndpoint
    )
    const token = 'someToken'
    const questionDetails = {
      type: ComponentType.TextField,
      title: 'What is your question?',
      name: 'what-is-your-question'
    }
    const expectedOptions = {
      payload: { questionDetails },
      headers: { Authorization: `Bearer ${token}` }
    }

    describe('when postJson succeeds', () => {
      test('returns response body', async () => {
        mockedPostJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: 'new-id' }
        })

        const result = await addQuestion(formId, token, pageId, questionDetails)

        expect(mockedPostJson).toHaveBeenCalledWith(requestUrl, expectedOptions)
        expect(result).toEqual({ id: 'new-id' })
      })
    })

    describe('when postJson fails', () => {
      test('throws the error', async () => {
        const testError = new Error('Network error')
        mockedPostJson.mockRejectedValueOnce(testError)

        await expect(addPage(formId, token, 'path-stub')).rejects.toThrow(
          testError
        )
      })
    })
  })
})
