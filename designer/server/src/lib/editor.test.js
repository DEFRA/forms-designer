import { ComponentType, ControllerType } from '@defra/forms-model'

import config from '~/src/config.js'
import {
  addPageAndFirstQuestion,
  addQuestion,
  resolvePageHeading,
  setPageHeadingAndGuidance,
  updateQuestion
} from '~/src/lib/editor.js'
import { delJson, patchJson, postJson, putJson } from '~/src/lib/fetch.js'

jest.mock('~/src/lib/fetch.js')

const mockedDelJson = /** @type {jest.MockedFunction<typeof delJson>} */ (
  delJson
)
const mockedPostJson = /** @type {jest.MockedFunction<typeof postJson>} */ (
  postJson
)
const mockedPatchJson = /** @type {jest.MockedFunction<typeof patchJson>} */ (
  patchJson
)
const mockedPutJson = /** @type {jest.MockedFunction<typeof putJson>} */ (
  putJson
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

/**
 * @satisfies {FormDefinition}
 */
const formDefinition = {
  name: 'Test form',
  pages: [
    {
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [
        {
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first field',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
const formDefinitionWithExistingGuidance = {
  name: 'Test form',
  pages: [
    {
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      id: '12345',
      components: [
        {
          id: '45678',
          type: ComponentType.Html,
          name: 'html-guidance',
          title: 'html-title',
          content: 'Original guidance',
          options: {}
        },
        {
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first field',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary
    }
  ],
  conditions: [],
  sections: [],
  lists: []
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
    const expectedOptions1 = {
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

        expect(mockedPostJson).toHaveBeenCalledWith(
          requestUrl,
          expectedOptions1
        )
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

  describe('addQuestion', () => {
    const formId = '98dbfb6c-93b7-41dc-86e7-02c7abe4ba38'
    const requestUrl = new URL(
      `./${formId}/definition/draft/pages/12345/components`,
      formsEndpoint
    )
    const token = 'someToken'
    const expectedOptions2 = {
      payload: {
        title: 'What is your name?',
        name: 'what-is-your-name',
        type: ComponentType.TextField
      },
      headers: { Authorization: `Bearer ${token}` }
    }

    describe('when postJson succeeds', () => {
      test('returns response body', async () => {
        mockedPostJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: 'new-id' }
        })

        const result = await addQuestion(
          formId,
          token,
          '12345',
          questionDetails
        )

        expect(mockedPostJson).toHaveBeenCalledWith(
          requestUrl,
          expectedOptions2
        )
        expect(result).toEqual({ id: 'new-id' })
      })
    })

    describe('when postJson fails', () => {
      test('throws the error', async () => {
        const testError = new Error('Network error')
        mockedPostJson.mockRejectedValueOnce(testError)

        await expect(
          addQuestion(formId, token, '12345', questionDetails)
        ).rejects.toThrow(testError)
      })
    })
  })

  describe('updateQuestion', () => {
    const formId = '98dbfb6c-93b7-41dc-86e7-02c7abe4ba38'
    const requestUrl = new URL(
      `./${formId}/definition/draft/pages/12345/components/456`,
      formsEndpoint
    )
    const token = 'someToken'
    const expectedOptions2 = {
      payload: {
        title: 'What is your name?',
        name: 'what-is-your-name',
        type: ComponentType.TextField
      },
      headers: { Authorization: `Bearer ${token}` }
    }

    describe('when putJson succeeds', () => {
      test('returns response body', async () => {
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: '456' }
        })

        const result = await updateQuestion(
          formId,
          token,
          '12345',
          '456',
          questionDetails
        )

        expect(mockedPutJson).toHaveBeenCalledWith(requestUrl, expectedOptions2)
        expect(result).toEqual({ id: '456' })
      })
    })

    describe('when putJson fails', () => {
      test('throws the error', async () => {
        const testError = new Error('Network error')
        mockedPutJson.mockRejectedValueOnce(testError)

        await expect(
          updateQuestion(formId, token, '12345', '456', questionDetails)
        ).rejects.toThrow(testError)
      })
    })
  })

  describe('setPageHeadingAndGuidance', () => {
    const formId = '98dbfb6c-93b7-41dc-86e7-02c7abe4ba38'
    const pageRequestUrl = new URL(
      `./${formId}/definition/draft/pages/12345`,
      formsEndpoint
    )
    const newGuidanceRequestUrl = new URL(
      `./${formId}/definition/draft/pages/12345/components?prepend=true`,
      formsEndpoint
    )
    const existingGuidanceRequestUrl = new URL(
      `./${formId}/definition/draft/pages/12345/components/45678`,
      formsEndpoint
    )
    const token = 'someToken'

    describe('when patchJson succeeds', () => {
      test('returns response body when checkbox unselected but old value in page heading', async () => {
        mockedPatchJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: {}
        })

        const expectedOptionsPageHeading1 = {
          payload: {
            title: '',
            path: '/'
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        await setPageHeadingAndGuidance(
          formId,
          token,
          '12345',
          formDefinition,
          { pageHeading: 'My new page title' }
        )

        expect(mockedPatchJson).toHaveBeenCalledWith(
          pageRequestUrl,
          expectedOptionsPageHeading1
        )
      })

      test('returns response body when checkbox selected and value in page heading', async () => {
        mockedPatchJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: {}
        })

        const expectedOptionsPageHeading1 = {
          payload: {
            title: 'My new page title',
            path: '/my-new-page-title'
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        await setPageHeadingAndGuidance(
          formId,
          token,
          '12345',
          formDefinition,
          { pageHeading: 'My new page title', pageHeadingAndGuidance: 'true' }
        )

        expect(mockedPatchJson).toHaveBeenCalledWith(
          pageRequestUrl,
          expectedOptionsPageHeading1
        )
        expect(mockedPostJson).not.toHaveBeenCalled()
      })

      test('returns response body when checkbox selected and value in page heading and value in guidance', async () => {
        mockedPatchJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: {}
        })

        const expectedOptionsPageHeading = {
          payload: {
            title: 'My new page title',
            path: '/my-new-page-title'
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        const expectedOptionsGuidance = {
          payload: {
            content: 'Some guidance',
            type: 'Html',
            id: undefined
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        await setPageHeadingAndGuidance(
          formId,
          token,
          '12345',
          formDefinition,
          {
            pageHeading: 'My new page title',
            pageHeadingAndGuidance: 'true',
            guidanceText: 'Some guidance'
          }
        )

        expect(mockedPatchJson).toHaveBeenCalledWith(
          pageRequestUrl,
          expectedOptionsPageHeading
        )
        expect(mockedPostJson).toHaveBeenCalledWith(
          newGuidanceRequestUrl,
          expectedOptionsGuidance
        )
        expect(mockedPutJson).not.toHaveBeenCalled()
      })
    })

    test('handles overwriting of existing guidance', async () => {
      mockedPatchJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: {}
      })

      const expectedOptionsPageHeading = {
        payload: {
          title: 'My new page title',
          path: '/my-new-page-title'
        },
        headers: { Authorization: `Bearer ${token}` }
      }

      const expectedOptionsGuidance = {
        payload: {
          content: 'Some guidance',
          type: 'Html',
          id: '45678'
        },
        headers: { Authorization: `Bearer ${token}` }
      }

      await setPageHeadingAndGuidance(
        formId,
        token,
        '12345',
        formDefinitionWithExistingGuidance,
        {
          pageHeading: 'My new page title',
          pageHeadingAndGuidance: 'true',
          guidanceText: 'Some guidance'
        }
      )

      expect(mockedPatchJson).toHaveBeenCalledWith(
        pageRequestUrl,
        expectedOptionsPageHeading
      )
      expect(mockedPutJson).toHaveBeenCalledWith(
        existingGuidanceRequestUrl,
        expectedOptionsGuidance
      )
      expect(mockedPostJson).not.toHaveBeenCalled()
    })

    test('handles removing existing guidance if user has now blanked text or unselected checkbox', async () => {
      const removeGuidanceRequestUrl = new URL(
        `./${formId}/definition/draft/pages/12345/components/45678`,
        formsEndpoint
      )

      mockedPatchJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: {}
      })

      const expectedOptionsGuidance = {
        headers: { Authorization: `Bearer ${token}` }
      }

      await setPageHeadingAndGuidance(
        formId,
        token,
        '12345',
        formDefinitionWithExistingGuidance,
        {
          pageHeadingAndGuidance: 'false'
        }
      )

      expect(mockedDelJson).toHaveBeenCalledWith(
        removeGuidanceRequestUrl,
        expectedOptionsGuidance
      )
      expect(mockedPostJson).not.toHaveBeenCalled()
    })
  })
})

/**
 * @import { FormDefinition, Page } from '@defra/forms-model'
 * @import { IncomingMessage } from 'http'
 */
