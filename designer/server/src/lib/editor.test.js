import { ComponentType, ControllerType, Engine } from '@defra/forms-model'

import {
  buildDefinition,
  testFormDefinitionWithExistingGuidance,
  testFormDefinitionWithFileUploadPage,
  testFormDefinitionWithRadioQuestionAndList,
  testFormDefinitionWithTwoPagesAndQuestions,
  testFormDefinitionWithTwoQuestions
} from '~/src/__stubs__/form-definition.js'
import config from '~/src/config.js'
import {
  addPageAndFirstQuestion,
  addQuestion,
  deletePage,
  getControllerType,
  migrateDefinitionToV2,
  reorderPages,
  resolvePageHeading,
  setCheckAnswersDeclaration,
  setPageHeadingAndGuidance,
  updateEditorList,
  updateQuestion
} from '~/src/lib/editor.js'
import { delJson, patchJson, postJson, putJson } from '~/src/lib/fetch.js'
import { createList, updateList } from '~/src/lib/list.js'

jest.mock('~/src/lib/fetch.js')
jest.mock('~/src/lib/list.js')

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
      id: 'p1',
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [
        {
          id: 'c1',
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
      id: 'p2',
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

const radioQuestionDetails = {
  title: 'What is your favourite colour?',
  name: 'what-is-your-fav-colour',
  type: ComponentType.RadiosField,
  list: 'my-list'
}

describe('editor.js', () => {
  const formId = '98dbfb6c-93b7-41dc-86e7-02c7abe4ba38'
  const token = 'someToken'

  beforeEach(() => {
    jest.clearAllMocks()
    jest
      .mocked(createList)
      .mockResolvedValue({
        id: 'id',
        status: 'created',
        list: /** @type {List} */ ({})
      })
    jest
      .mocked(updateList)
      .mockResolvedValue({
        id: 'id',
        status: 'updated',
        list: /** @type {List} */ ({})
      })
  })

  describe('addPageAndFirstQuestion', () => {
    const requestUrl = new URL(
      `./${formId}/definition/draft/pages`,
      formsEndpoint
    )
    const expectedOptions1 = {
      payload: {
        title: '',
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
    test('page heading should override first question title', () => {
      expect(
        resolvePageHeading(page, 'New page heading', page.components)
      ).toBe('New page heading')
    })

    test('page heading should override even when no questions', () => {
      expect(resolvePageHeading(page, 'New page heading', [])).toBe(
        'New page heading'
      )
    })

    test('should return first question title when no page heading', () => {
      expect(resolvePageHeading(page, '', page.components)).toBe(
        'This is your first question'
      )
    })

    test('should return page heading from definition when form page heading not provided and no questions', () => {
      const pageCopy = { ...page, title: 'Test title' }
      expect(resolvePageHeading(pageCopy, '', [])).toBe('Test title')
    })
  })

  describe('addQuestion', () => {
    const requestUrl = new URL(
      `./${formId}/definition/draft/pages/12345/components`,
      formsEndpoint
    )
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

    describe('when postJson succeeds and new list', () => {
      test('returns response body', async () => {
        mockedPostJson
          .mockResolvedValueOnce({
            response: createMockResponse(),
            body: { status: 'created', list: { name: 'abcde' } } // Saving list
          })
          .mockResolvedValueOnce({
            response: createMockResponse(),
            body: { id: 'new-id' } // Saving question
          })

        const list = [
          { id: '1', label: '1', value: '1' },
          { id: '2', label: '2', value: '2' },
          { id: '3', label: '3', value: '3' }
        ]

        const mappedList = [
          { id: '1', text: '1', value: '1' },
          { id: '2', text: '2', value: '2' },
          { id: '3', text: '3', value: '3' }
        ]

        jest.mocked(createList).mockResolvedValue({
          id: 'id',
          status: 'created',
          list: /** @type {List} */ ({
            id: 'id',
            name: 'my-list',
            title: 'title',
            type: 'string',
            items: mappedList
          })
        })

        const actionState = /** @type {QuestionSessionState} */ ({
          editRow: {},
          listItems: list
        })

        const expectedQuestionCall = {
          payload: {
            name: 'what-is-your-fav-colour',
            title: 'What is your favourite colour?',
            type: 'RadiosField',
            list: 'my-list'
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        const expectedListCall = {
          id: expect.any(String),
          name: expect.any(String),
          title: 'title for What is your favourite colour?',
          type: 'string',
          items: [
            { text: '1', value: '1' },
            { text: '2', value: '2' },
            { text: '3', value: '3' }
          ]
        }

        const result = await addQuestion(
          formId,
          token,
          '12345',
          radioQuestionDetails,
          actionState
        )

        expect(mockedPostJson.mock.calls[0][0]).toEqual(requestUrl)
        expect(mockedPostJson.mock.calls[0][1]).toEqual(expectedQuestionCall)

        expect(createList).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String),
          expectedListCall
        )
        expect(result).toEqual({
          list: {
            name: 'abcde'
          },
          status: 'created'
        })
      })

      test('returns error when list update fails', async () => {
        mockedPostJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: 'new-id' } // Saving question
        })
        const list = [
          { id: '1', label: '1', value: '1' },
          { id: '2', label: '2', value: '2' },
          { id: '3', label: '3', value: '3' }
        ]
        jest.mocked(createList).mockResolvedValue({
          id: 'id',
          status: 'failed',
          list: /** @type {List} */ ({})
        })

        const actionState = /** @type {QuestionSessionState} */ ({
          state: {},
          listItems: list
        })

        await expect(
          addQuestion(formId, token, '12345', radioQuestionDetails, actionState)
        ).rejects.toThrow(
          new Error(
            'Unable to save list for question What is your favourite colour?'
          )
        )
      })
    })
  })

  describe('updateQuestion', () => {
    const requestUrl = new URL(
      `./${formId}/definition/draft/pages/12345/components/456`,
      formsEndpoint
    )
    const expectedOptions2 = {
      payload: {
        title: 'What is your name?',
        name: 'what-is-your-name',
        type: ComponentType.TextField
      },
      headers: { Authorization: `Bearer ${token}` }
    }

    describe('when putJson succeeds', () => {
      test('returns response body when no controller defined', async () => {
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: '456' }
        })

        const result = await updateQuestion(
          formId,
          token,
          testFormDefinitionWithTwoPagesAndQuestions,
          '12345',
          '456',
          questionDetails
        )

        expect(mockedPutJson).toHaveBeenCalledWith(requestUrl, expectedOptions2)
        expect(result).toEqual({ id: '456' })
      })

      test('returns response body when controller to change to null', async () => {
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: '456' }
        })

        const expectedPatch = {
          payload: {
            controller: null
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        const result = await updateQuestion(
          formId,
          token,
          testFormDefinitionWithFileUploadPage,
          'p1',
          'q1',
          questionDetails
        )

        expect(mockedPutJson).toHaveBeenCalledWith(requestUrl, expectedOptions2)
        expect(mockedPatchJson).toHaveBeenCalledWith(requestUrl, expectedPatch)
        expect(result).toEqual({ id: '456' })
      })

      test('returns response body when controller to change to File Upload controller', async () => {
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: '456' }
        })

        const questionDetailsFileUpload = {
          type: ComponentType.FileUploadField
        }

        const expectedPut = {
          payload: {
            type: ComponentType.FileUploadField
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        const expectedPatch = {
          payload: {
            controller: ControllerType.FileUpload
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        const result = await updateQuestion(
          formId,
          token,
          testFormDefinitionWithTwoPagesAndQuestions,
          'p1',
          'q1',
          questionDetailsFileUpload
        )

        expect(mockedPutJson).toHaveBeenCalledWith(requestUrl, expectedPut)
        expect(mockedPatchJson).toHaveBeenCalledWith(requestUrl, expectedPatch)
        expect(result).toEqual({ id: '456' })
      })

      test('returns response body when controller is not to change', async () => {
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: '456' }
        })

        const questionDetailsFileUpload = {
          type: ComponentType.FileUploadField
        }

        const expectedPut = {
          payload: {
            type: ComponentType.FileUploadField
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        const result = await updateQuestion(
          formId,
          token,
          testFormDefinitionWithFileUploadPage,
          'p1',
          'q1',
          questionDetailsFileUpload
        )

        expect(mockedPutJson).toHaveBeenCalledWith(requestUrl, expectedPut)
        expect(mockedPatchJson).not.toHaveBeenCalled()
        expect(result).toEqual({ id: '456' })
      })
    })

    describe('when putJson fails', () => {
      test('throws the error', async () => {
        const testError = new Error('Network error')
        mockedPutJson.mockRejectedValueOnce(testError)

        await expect(
          updateQuestion(
            formId,
            token,
            testFormDefinitionWithTwoQuestions,
            '12345',
            '456',
            questionDetails
          )
        ).rejects.toThrow(testError)
      })
    })

    test('should update list if a list question', async () => {
      mockedPutJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: { id: '456' }
      })

      const expectedPut = {
        payload: {
          type: ComponentType.RadiosField
        },
        headers: { Authorization: `Bearer ${token}` }
      }

      const result = await updateQuestion(
        formId,
        token,
        testFormDefinitionWithRadioQuestionAndList,
        'p1',
        'c1',
        { type: ComponentType.RadiosField },
        {}
      )

      expect(mockedPutJson).toHaveBeenCalledWith(requestUrl, expectedPut)
      expect(mockedPatchJson).not.toHaveBeenCalled()
      expect(result).toEqual({ id: '456' })
    })
  })

  describe('setPageHeadingAndGuidance', () => {
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

    describe('when patchJson succeeds', () => {
      test('returns response body when checkbox unselected but old value in page heading', async () => {
        mockedPatchJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: {}
        })

        const expectedOptionsPageHeading1 = {
          payload: {
            title: '',
            path: '/my-new-page-title'
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
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: '456' }
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
            type: ComponentType.Markdown,
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
          type: ComponentType.Markdown,
          id: '45678'
        },
        headers: { Authorization: `Bearer ${token}` }
      }

      await setPageHeadingAndGuidance(
        formId,
        token,
        '12345',
        testFormDefinitionWithExistingGuidance,
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
        testFormDefinitionWithExistingGuidance,
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

  describe('setCheckAnswersDeclaration', () => {
    const newGuidanceRequestUrl = new URL(
      `./${formId}/definition/draft/pages/12345/components?prepend=true`,
      formsEndpoint
    )
    const existingGuidanceRequestUrl = new URL(
      `./${formId}/definition/draft/pages/12345/components/45678`,
      formsEndpoint
    )

    describe('when patchJson succeeds', () => {
      test('returns response body when checkbox selected and value in declaration', async () => {
        const expectedOptionsDeclaration = {
          payload: {
            content: 'Some declaration',
            type: ComponentType.Markdown,
            id: undefined
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        await setCheckAnswersDeclaration(
          formId,
          token,
          '12345',
          formDefinition,
          {
            needDeclaration: 'true',
            declarationText: 'Some declaration'
          }
        )

        expect(mockedPostJson).toHaveBeenCalledWith(
          newGuidanceRequestUrl,
          expectedOptionsDeclaration
        )
        expect(mockedPutJson).not.toHaveBeenCalled()
      })
    })

    test('handles overwriting of existing guidance', async () => {
      const expectedOptionsDeclaration = {
        payload: {
          content: 'Some declaration text 2',
          type: ComponentType.Markdown,
          id: '45678'
        },
        headers: { Authorization: `Bearer ${token}` }
      }

      await setCheckAnswersDeclaration(
        formId,
        token,
        '12345',
        testFormDefinitionWithExistingGuidance,
        {
          needDeclaration: 'true',
          declarationText: 'Some declaration text 2'
        }
      )

      expect(mockedPutJson).toHaveBeenCalledWith(
        existingGuidanceRequestUrl,
        expectedOptionsDeclaration
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

      await setCheckAnswersDeclaration(
        formId,
        token,
        '12345',
        testFormDefinitionWithExistingGuidance,
        {
          needDeclaration: 'false'
        }
      )

      expect(mockedDelJson).toHaveBeenCalledWith(
        removeGuidanceRequestUrl,
        expectedOptionsGuidance
      )
      expect(mockedPostJson).not.toHaveBeenCalled()
    })
  })

  describe('reorderPages', () => {
    const reorderPageUrl = new URL(
      `./${formId}/definition/draft/pages/order`,
      formsEndpoint
    )

    it('should reorder the pages', async () => {
      const pageOrderPayload = [
        'd3214138-1c1f-42c1-9572-37b2f9ba1320',
        '097becaf-ef20-4655-a8da-b2886f06c978',
        'da9a860e-cf05-4b4b-bf4e-7c40e319ad7d'
      ]
      const expectedOrderCall = {
        payload: pageOrderPayload,
        headers: { Authorization: `Bearer ${token}` }
      }
      await reorderPages(formId, token, pageOrderPayload)
      expect(mockedPostJson).toHaveBeenCalledWith(
        reorderPageUrl,
        expectedOrderCall
      )
    })
  })

  describe('migrateDefinitionToV2', () => {
    const migrationDefinitionUrl = new URL(
      `./${formId}/definition/draft/migrate/v2`,
      formsEndpoint
    )

    it('should migrate the definition to v2 and return updated definition', async () => {
      const v2Definition = buildDefinition({
        engine: Engine.V2
      })
      mockedPostJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: v2Definition
      })
      const expectedMigrateCall = {
        payload: {},
        headers: { Authorization: `Bearer ${token}` }
      }
      const result = await migrateDefinitionToV2(formId, token)
      expect(result).toEqual(v2Definition)
      expect(mockedPostJson).toHaveBeenCalledWith(
        migrationDefinitionUrl,
        expectedMigrateCall
      )
    })
  })

  describe('deletePage', () => {
    const requestUrl = new URL(
      `./${formId}/definition/draft/pages/12345`,
      formsEndpoint
    )
    const expectedOptions = {
      headers: { Authorization: `Bearer ${token}` }
    }

    describe('when delJson succeeds', () => {
      test('returns response body', async () => {
        mockedDelJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { result: 'ok' }
        })

        await deletePage(formId, token, '12345')

        expect(mockedDelJson).toHaveBeenCalledWith(requestUrl, expectedOptions)
      })
    })

    describe('when delJson fails', () => {
      test('throws the error', async () => {
        const testError = new Error('Network error')
        mockedDelJson.mockRejectedValueOnce(testError)

        await expect(deletePage(formId, token, '12345')).rejects.toThrow(
          testError
        )
      })
    })
  })

  describe('getControllerType', () => {
    test('gets file upload controller', () => {
      expect(
        getControllerType({
          type: ComponentType.FileUploadField
        })
      ).toEqual({
        controller: ControllerType.FileUpload
      })
    })

    test('gets empty for other question types', () => {
      expect(
        getControllerType({
          type: ComponentType.TextField
        })
      ).toEqual({})
    })
  })

  describe('updateEditorList', () => {
    test('should ignore if not a list question', async () => {
      const res = await updateEditorList(
        formId,
        token,
        {},
        {},
        testFormDefinitionWithTwoPagesAndQuestions
      )
      expect(res).toBeFalsy()
    })

    test('should find list and call updateList', async () => {
      jest.mocked(updateList).mockResolvedValue({
        id: 'id',
        status: 'updated',
        list: /** @type {List} */ ({})
      })
      const listItems = [
        { label: 'option 1', value: 'value 1' },
        { label: 'option 2', value: 'value 2' },
        { label: 'option 3', value: 'value 3' }
      ]
      const res = await updateEditorList(
        formId,
        token,
        { type: ComponentType.RadiosField, list: 'my-list' },
        { listItems },
        testFormDefinitionWithRadioQuestionAndList
      )
      expect(res).toBeTruthy()
    })
  })
})

/**
 * @import { QuestionSessionState, FormDefinition, List, Page } from '@defra/forms-model'
 * @import { IncomingMessage } from 'http'
 */
