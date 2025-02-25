import { ComponentType } from '@defra/forms-model'

import config from '~/src/config.js'
import {
  addPageAndFirstQuestion,
  resolvePageHeading
} from '~/src/lib/editor.js'
import { postJson } from '~/src/lib/fetch.js'

jest.mock('~/src/lib/fetch.js')

const mockedPostJson = /** @type {jest.MockedFunction<typeof postJson>} */ (
  postJson
)

/**
 * Creates a minimal mock response
 * @param {{statusCode?: number}} [props]
 * @returns
 */
function createMockResponse(props = {}) {
  const response = /** @type {IncomingMessage} */ ({
    statusCode: props.statusCode,
    headers: {}
  })
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

  /**
   * @satisfies {Page}
   */
  const page = {
    id: 'f07fbbb1-268c-429b-bba5-5fc1f7353d7c',
    path: '/page-one',
    title: 'Page one',
    section: 'section',
    components: [
      {
        type: ComponentType.TextField,
        name: 'textField',
        title: 'This is your first question',
        hint: 'Help text',
        options: {},
        schema: {}
      },
      {
        type: ComponentType.TextField,
        name: 'textField',
        title: 'This is your second question',
        hint: 'Help text',
        options: {},
        schema: {}
      }
    ],
    next: [{ path: '/summary' }]
  }

  describe('resolvePageHeading', () => {
    test('when checkbox unselected', () => {
      expect(
        resolvePageHeading(false, page, 'New page heading', page.components)
      ).toBe('This is your first question')
    })

    test('when checkbox unselected and no components', () => {
      expect(resolvePageHeading(false, page, 'New page heading', [])).toBe('')
    })

    test('when checkbox selected and page heading provided', () => {
      expect(
        resolvePageHeading(true, page, 'New page heading', page.components)
      ).toBe('New page heading')
    })

    test('when checkbox selected and page heading not provided', () => {
      expect(resolvePageHeading(true, page, '', page.components)).toBe(
        'This is your first question'
      )
    })

    test('when checkbox selected and page heading not provided and no questions', () => {
      const pageCopy = { ...page, title: 'Test title' }
      expect(resolvePageHeading(true, pageCopy, '', [])).toBe('Test title')
    })
  })
})

/**
 * @import { Page } from '@defra/forms-model'
 * @import { IncomingMessage } from 'http'
 */
