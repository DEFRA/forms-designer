import { ComponentType } from '@defra/forms-model'

import config from '~/src/config.js'
import { addPageAndFirstQuestion } from '~/src/lib/editor.js'
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

const questionDetails = {
  title: 'What is your name?',
  name: 'what-is-your-name',
  type: ComponentType.TextField
}

describe('editor.js', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('addPageAndFirstQuestion', () => {
    const formId = '98dbfb6c-93b7-41dc-86e7-02c7abe4ba38'
    const requestUrl = new URL(
      `./${formId}/definition/draft/pages`,
      formsEndpoint
    )
    const token = 'someToken'
    const expectedOptions = {
      payload: {
        title: 'What is your name?',
        path: '/what-is-your-name',
        components: [
          {
            title: 'What is your name?',
            name: 'what-is-your-name',
            type: ComponentType.TextField
          }
        ]
      },
      headers: { Authorization: `Bearer ${token}` }
    }

    describe('when postJson succeeds', () => {
      test('returns response body', async () => {
        mockedPostJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: 'new-id' }
        })

        const result = await addPageAndFirstQuestion(
          formId,
          token,
          questionDetails
        )

        expect(mockedPostJson).toHaveBeenCalledWith(requestUrl, expectedOptions)
        expect(result).toEqual({ id: 'new-id' })
      })
    })

    describe('when postJson fails', () => {
      test('throws the error', async () => {
        const testError = new Error('Network error')
        mockedPostJson.mockRejectedValueOnce(testError)

        await expect(
          addPageAndFirstQuestion(formId, token, questionDetails)
        ).rejects.toThrow(testError)
      })
    })
  })
})
