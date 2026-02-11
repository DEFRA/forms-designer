import {
  ComponentType,
  ControllerType,
  Engine,
  FormDefinitionRequestType
} from '@defra/forms-model'

import {
  buildDefinition,
  testFormDefinitionWithExistingGuidance,
  testFormDefinitionWithFileUploadPage,
  testFormDefinitionWithRadioQuestionAndList,
  testFormDefinitionWithTwoPagesAndQuestions,
  testFormDefinitionWithTwoQuestions
} from '~/src/__stubs__/form-definition.js'
import {
  createMockResponse,
  formsEndpoint,
  mockedDelJson,
  mockedPatchJson,
  mockedPostJson,
  mockedPutJson,
  token
} from '~/src/lib/__stubs__/editor.js'
import {
  addCondition,
  addPageAndFirstQuestion,
  addQuestion,
  addSection,
  assignPageToSection,
  buildRepeaterPayload,
  deleteCondition,
  deletePage,
  deleteQuestion,
  getControllerType,
  getControllerTypeAndProperties,
  getRepeaterProperties,
  migrateDefinitionToV2,
  removeSection,
  reorderPages,
  reorderQuestions,
  resolvePageHeading,
  setCheckAnswersDeclaration,
  setConfirmationEmailSettings,
  setPageCondition,
  setPageSettings,
  unassignPageFromSection,
  updateCondition,
  updateQuestion,
  updateSectionSettings
} from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import {
  removeUniquelyMappedListFromQuestion,
  removeUniquelyMappedListsFromPage
} from '~/src/lib/list.js'
import { stringHasValue } from '~/src/lib/utils.js'

jest.mock('~/src/lib/fetch.js')
jest.mock('~/src/lib/list.js')
jest.mock('~/src/lib/forms.js')

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

/**
 * @satisfies {FormDefinition}
 */
const formDefinitionRepeater = {
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
      next: [{ path: '/summary' }],
      controller: ControllerType.Repeat,
      repeat: {
        options: {
          name: 'EdRRjo',
          title: 'Children'
        },
        schema: {
          min: 2,
          max: 3
        }
      }
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

/** @type {Partial<ComponentDef>} */
const questionDetails = {
  title: 'What is your name?',
  name: 'what-is-your-name',
  type: ComponentType.TextField
}

/** @type {Partial<ComponentDef>} */
const radioQuestionDetails = {
  title: 'What is your favourite colour?',
  name: 'what-is-your-fav-colour',
  type: ComponentType.RadiosField,
  list: 'my-list'
}

/** @type {Partial<ComponentDef>} */
const guidanceDetails = {
  name: 'markdown-component',
  type: ComponentType.Markdown,
  content: "Please use the 'Contact us' form to get in touch with us."
}

describe('editor.js', () => {
  const formId = '98dbfb6c-93b7-41dc-86e7-02c7abe4ba38'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addPageAndFirstQuestion', () => {
    const requestUrl = new URL(
      `./${formId}/definition/draft/pages`,
      formsEndpoint
    )

    describe('when postJson succeeds', () => {
      test('returns response body', async () => {
        const expectedOptions = {
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

      test('preserves page settings', async () => {
        const expectedOptions = {
          payload: {
            title: 'You are not eligible for this service',
            path: '/you-are-not-eligible-for-this-service',
            controller: ControllerType.Terminal,
            components: [
              {
                name: 'markdown-component',
                type: ComponentType.Markdown,
                content:
                  "Please use the 'Contact us' form to get in touch with us."
              }
            ]
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        mockedPostJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: 'new-id' }
        })

        const result = await addPageAndFirstQuestion(
          formId,
          token,
          guidanceDetails,
          {
            title: 'You are not eligible for this service',
            controller: ControllerType.Terminal
          }
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

        const expectedQuestionCall = {
          payload: {
            name: 'what-is-your-fav-colour',
            title: 'What is your favourite colour?',
            type: 'RadiosField',
            list: 'my-list'
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        const result = await addQuestion(
          formId,
          token,
          '12345',
          radioQuestionDetails
        )

        expect(mockedPostJson.mock.calls[0][0]).toEqual(requestUrl)
        expect(mockedPostJson.mock.calls[0][1]).toEqual(expectedQuestionCall)

        expect(result).toEqual({
          list: {
            name: 'abcde'
          },
          status: 'created'
        })
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

        const result = await updateQuestion(
          formId,
          token,
          testFormDefinitionWithFileUploadPage,
          'p1',
          'q1',
          questionDetails
        )

        expect(mockedPutJson).toHaveBeenCalledWith(requestUrl, expectedOptions2)
        expect(result).toEqual({ id: '456' })
      })

      test('returns response body when controller to change to File Upload controller', async () => {
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: '456' }
        })

        /** @type {Partial<ComponentDef>} */
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
            controller: ControllerType.FileUpload,
            path: '/page-one'
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

        /** @type {Partial<ComponentDef>} */
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

      test('preserves repeater settings when updating a question on a repeater page', async () => {
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: 'c1' }
        })

        const updatedQuestionDetails = /** @type {Partial<ComponentDef>} */ ({
          title: 'Updated field title',
          name: 'textField',
          type: ComponentType.TextField,
          options: {
            required: false
          }
        })

        const result = await updateQuestion(
          formId,
          token,
          formDefinitionRepeater,
          'p1',
          'c1',
          updatedQuestionDetails
        )

        expect(mockedPatchJson).not.toHaveBeenCalled()

        expect(mockedPutJson).toHaveBeenCalledWith(
          new URL(
            `./${formId}/definition/draft/pages/p1/components/c1`,
            formsEndpoint
          ),
          {
            payload: updatedQuestionDetails,
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        expect(result).toEqual({ id: 'c1' })
      })

      test('preserves repeater settings when schema values are undefined', async () => {
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: 'c1' }
        })

        const formDefinitionRepeaterNoSchema = /** @type {FormDefinition} */ ({
          ...formDefinitionRepeater,
          pages: [
            {
              ...formDefinitionRepeater.pages[0],
              repeat: {
                options: { name: 'test', title: 'Test' },
                schema: { min: undefined, max: undefined }
              }
            },
            formDefinitionRepeater.pages[1]
          ]
        })

        await updateQuestion(
          formId,
          token,
          formDefinitionRepeaterNoSchema,
          'p1',
          'c1',
          { type: ComponentType.TextField }
        )

        expect(mockedPatchJson).not.toHaveBeenCalled()
      })

      test('preserves repeater settings when options values are undefined', async () => {
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: 'c1' }
        })

        const formDefinitionRepeaterNoOptions = /** @type {FormDefinition} */ ({
          ...formDefinitionRepeater,
          pages: [
            {
              ...formDefinitionRepeater.pages[0],
              repeat: {
                options: { name: undefined, title: undefined },
                schema: { min: 1, max: 5 }
              }
            },
            formDefinitionRepeater.pages[1]
          ]
        })

        await updateQuestion(
          formId,
          token,
          formDefinitionRepeaterNoOptions,
          'p1',
          'c1',
          { type: ComponentType.TextField }
        )

        expect(mockedPatchJson).not.toHaveBeenCalled()
      })

      test('preserves customValidationMessage component options', async () => {
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: 'c1' }
        })

        const formDefinitionWithOptions = /** @type {FormDefinition} */ ({
          ...formDefinition,
          pages: [
            {
              ...formDefinition.pages[0],
              components: [
                {
                  ...formDefinition.pages[0].components?.at(0),
                  options: {
                    required: true,
                    customValidationMessage: 'This is a custom email error',
                    customValidationMessages: {
                      'any.required': 'This is a custom required error',
                      'string.empty': 'This is a custom empty string error',
                      'string.email': 'This is a custom invalid email error'
                    }
                  }
                }
              ]
            },
            formDefinition.pages[1]
          ]
        })

        await updateQuestion(
          formId,
          token,
          formDefinitionWithOptions,
          'p1',
          'c1',
          {
            type: ComponentType.TextField,
            options: { classes: 'govuk-input--width-10', required: false }
          }
        )

        expect(mockedPatchJson).not.toHaveBeenCalled()

        expect(mockedPutJson).toHaveBeenCalledWith(
          new URL(
            `./${formId}/definition/draft/pages/p1/components/c1`,
            formsEndpoint
          ),
          {
            payload: {
              type: ComponentType.TextField,
              options: {
                required: false,
                customValidationMessage: 'This is a custom email error',
                customValidationMessages: {
                  'any.required': 'This is a custom required error',
                  'string.empty': 'This is a custom empty string error',
                  'string.email': 'This is a custom invalid email error'
                },
                classes: 'govuk-input--width-10'
              }
            },
            headers: { Authorization: `Bearer ${token}` }
          }
        )
      })

      test('empty classes string overrides any current value in component options', async () => {
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: 'c1' }
        })

        const formDefinitionWithOptions = /** @type {FormDefinition} */ ({
          ...formDefinition,
          pages: [
            {
              ...formDefinition.pages[0],
              components: [
                {
                  ...formDefinition.pages[0].components?.at(0),
                  options: {
                    required: true,
                    classes: 'govuk-input--width-10'
                  }
                }
              ]
            },
            formDefinition.pages[1]
          ]
        })

        await updateQuestion(
          formId,
          token,
          formDefinitionWithOptions,
          'p1',
          'c1',
          {
            type: ComponentType.TextField,
            options: { classes: '', required: false }
          }
        )

        expect(mockedPatchJson).not.toHaveBeenCalled()

        expect(mockedPutJson).toHaveBeenCalledWith(
          new URL(
            `./${formId}/definition/draft/pages/p1/components/c1`,
            formsEndpoint
          ),
          {
            payload: {
              type: ComponentType.TextField,
              options: {
                required: false,
                classes: ''
              }
            },
            headers: { Authorization: `Bearer ${token}` }
          }
        )
      })

      test('does not interfere when page is not a repeater', async () => {
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: '456' }
        })

        const nonRepeaterPage = /** @type {FormDefinition} */ ({
          ...formDefinition,
          pages: [
            {
              id: 'p1',
              path: '/page-one',
              title: 'Page one',
              section: 'Section 1',
              controller: undefined, // Not a repeater
              components: [
                {
                  id: 'q1',
                  type: ComponentType.TextField,
                  name: 'field1',
                  title: 'Field 1',
                  hint: 'Hint text',
                  options: { required: true },
                  schema: {}
                }
              ],
              next: [{ path: '/summary' }]
            }
          ]
        })

        const updatedQuestionDetails = /** @type {Partial<ComponentDef>} */ ({
          title: 'Updated field',
          name: 'field1',
          type: ComponentType.TextField,
          options: { required: false }
        })

        await updateQuestion(
          formId,
          token,
          nonRepeaterPage,
          'p1',
          'q1',
          updatedQuestionDetails
        )

        // Should NOT call patch (no controller change needed)
        expect(mockedPatchJson).not.toHaveBeenCalled()

        // Should only update the question, without any repeater payload
        expect(mockedPutJson).toHaveBeenCalledWith(
          new URL(
            `./${formId}/definition/draft/pages/p1/components/q1`,
            formsEndpoint
          ),
          {
            payload: updatedQuestionDetails, // No repeater settings added
            headers: { Authorization: `Bearer ${token}` }
          }
        )
      })

      test('bug scenario: preserves repeater settings (min:1, max:5) when changing question from mandatory to optional', async () => {
        // 1. Create page with mandatory question
        // 2. Make page "Allow multiple responses" with min:1, max:5
        // 3. Make question optional
        // Expected: Question is optional AND page still has repeater settings

        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: 'c1' }
        })

        // Page with repeater settings (min:1, max:5) and mandatory question
        const pageWithRepeaterAndMandatoryQuestion =
          /** @type {FormDefinition} */ ({
            ...formDefinitionRepeater,
            pages: [
              {
                ...formDefinitionRepeater.pages[0],
                controller: ControllerType.Repeat,
                repeat: {
                  options: { name: 'test-repeater', title: 'Add another' },
                  schema: { min: 1, max: 5 }
                },
                components: [
                  {
                    id: 'c1',
                    type: ComponentType.TextField,
                    name: 'mandatoryField',
                    title: 'Mandatory field',
                    hint: 'This field is mandatory',
                    options: { required: true }, // Currently mandatory
                    schema: {}
                  }
                ]
              }
            ]
          })

        // User makes the question optional
        const updatedQuestionDetails = /** @type {Partial<ComponentDef>} */ ({
          title: 'Mandatory field',
          name: 'mandatoryField',
          type: ComponentType.TextField,
          options: { required: false } // Changed to optional
        })

        const result = await updateQuestion(
          formId,
          token,
          pageWithRepeaterAndMandatoryQuestion,
          'p1',
          'c1',
          updatedQuestionDetails
        )

        // Should NOT call patch (which would update page settings and potentially lose repeater)
        expect(mockedPatchJson).not.toHaveBeenCalled()

        // Should only update the question
        expect(mockedPutJson).toHaveBeenCalledWith(
          new URL(
            `./${formId}/definition/draft/pages/p1/components/c1`,
            formsEndpoint
          ),
          {
            payload: updatedQuestionDetails,
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        expect(result).toEqual({ id: 'c1' })
        // Repeater settings (min:1, max:5) are preserved - not lost!
      })

      test('returns response body when path should change to first question', async () => {
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: '456' }
        })

        mockedPatchJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: '456' }
        })

        const patchUrl = new URL(
          `./${formId}/definition/draft/pages/p1`,
          formsEndpoint
        )

        /** @type {Partial<ComponentDef>} */
        const questionDetails = {
          type: ComponentType.TextField,
          title: 'My first question'
        }

        const expectedPut = {
          payload: {
            type: ComponentType.TextField,
            title: 'My first question'
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        const expectedPatch = {
          payload: {
            controller: null,
            path: '/my-first-question'
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        const formDefinitionWithNoPageHeading = structuredClone(
          testFormDefinitionWithTwoPagesAndQuestions
        )
        formDefinitionWithNoPageHeading.pages[0].title = ''

        const result = await updateQuestion(
          formId,
          token,
          formDefinitionWithNoPageHeading,
          'p1',
          'q1',
          questionDetails
        )

        expect(mockedPutJson).toHaveBeenCalledWith(requestUrl, expectedPut)
        expect(mockedPatchJson).toHaveBeenCalledWith(patchUrl, expectedPatch)
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
        { type: ComponentType.RadiosField }
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
            path: '/this-is-your-first-field'
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        await setPageSettings(formId, token, 'p1', formDefinition, {
          pageHeading: 'My new page title'
        })

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

        await setPageSettings(formId, token, '12345', formDefinition, {
          pageHeading: 'My new page title',
          pageHeadingAndGuidance: 'true'
        })

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

        await setPageSettings(formId, token, '12345', formDefinition, {
          pageHeading: 'My new page title',
          pageHeadingAndGuidance: 'true',
          guidanceText: 'Some guidance'
        })

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

      test('returns response body when page heading checkbox selected and mark as exit page selected', async () => {
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
            path: '/my-new-page-title',
            controller: ControllerType.Terminal
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

        await setPageSettings(formId, token, '12345', formDefinition, {
          pageHeading: 'My new page title',
          pageHeadingAndGuidance: 'true',
          guidanceText: 'Some guidance',
          exitPage: true
        })

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

      await setPageSettings(
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

      await setPageSettings(
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

  describe('setRepeaterSetting', () => {
    const pageRequestUrl = new URL(
      `./${formId}/definition/draft/pages/12345`,
      formsEndpoint
    )

    test('updates repeater options and schema', async () => {
      mockedPatchJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: {}
      })

      await setPageSettings(formId, token, 'p1', formDefinition, {
        pageHeading: 'Page one',
        repeater: 'true',
        minItems: 2,
        maxItems: 5,
        questionSetName: 'Cows'
      })

      const expectedOptionsRepeater = {
        payload: {
          controller: ControllerType.Repeat,
          repeat: {
            options: {
              name: expect.any(String),
              title: 'Cows'
            },
            schema: {
              min: 2,
              max: 5
            }
          },
          title: '',
          path: '/this-is-your-first-field'
        },
        headers: { Authorization: `Bearer ${token}` }
      }

      expect(mockedPatchJson).toHaveBeenCalledWith(
        pageRequestUrl,
        expectedOptionsRepeater
      )
    })

    test('clears repeater options and schema', async () => {
      mockedPatchJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: {}
      })

      await setPageSettings(formId, token, 'p1', formDefinitionRepeater, {
        pageHeading: 'Page one'
      })

      const expectedOptionsRepeater = {
        payload: {
          controller: null,
          title: '',
          path: '/this-is-your-first-field'
        },
        headers: { Authorization: `Bearer ${token}` }
      }

      expect(mockedPatchJson).toHaveBeenCalledWith(
        pageRequestUrl,
        expectedOptionsRepeater
      )
    })

    test('scenario: user unchecks repeater checkbox - removes repeater controller', async () => {
      mockedPatchJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: {}
      })

      await setPageSettings(formId, token, 'p1', formDefinitionRepeater, {
        pageHeading: 'Page one'
        // Note: NO 'repeater' property in payload means checkbox is unchecked
        // This is how the UI sends the payload when user unchecks "Allow multiple responses"
      })

      const expectedOptions = {
        payload: {
          controller: null, // Controller removed
          title: '',
          path: '/this-is-your-first-field'
        },
        headers: { Authorization: `Bearer ${token}` }
      }

      expect(mockedPatchJson).toHaveBeenCalledWith(
        pageRequestUrl,
        expectedOptions
      )
    })

    test('scenario: user checks repeater checkbox - adds repeater controller', async () => {
      // This demonstrates: Currently non-repeater → changing to repeater
      mockedPatchJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: {}
      })

      await setPageSettings(formId, token, 'p1', formDefinition, {
        pageHeading: 'Page one',
        repeater: 'true', // User checked "Allow multiple responses"
        minItems: 1,
        maxItems: 3,
        questionSetName: 'Add another item'
      })

      const expectedOptions = {
        payload: {
          controller: ControllerType.Repeat,
          repeat: {
            options: {
              name: expect.any(String),
              title: 'Add another item'
            },
            schema: {
              min: 1,
              max: 3
            }
          },
          title: '',
          path: '/this-is-your-first-field'
        },
        headers: { Authorization: `Bearer ${token}` }
      }

      expect(mockedPatchJson).toHaveBeenCalledWith(
        pageRequestUrl,
        expectedOptions
      )
    })

    test('updates repeater settings on existing repeater page and preserves name', async () => {
      mockedPatchJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: {}
      })

      const existingName = /** @type {string} */ (
        formDefinitionRepeater.pages[0].repeat?.options.name
      )

      await setPageSettings(formId, token, 'p1', formDefinitionRepeater, {
        pageHeading: 'Page one',
        repeater: 'true',
        minItems: 1,
        maxItems: 4,
        questionSetName: 'Updated repeater title'
      })

      const expectedOptionsRepeater = {
        payload: {
          controller: ControllerType.Repeat,
          repeat: {
            options: {
              name: existingName,
              title: 'Updated repeater title'
            },
            schema: {
              min: 1,
              max: 4
            }
          },
          title: '',
          path: '/this-is-your-first-field'
        },
        headers: { Authorization: `Bearer ${token}` }
      }

      expect(mockedPatchJson).toHaveBeenCalledWith(
        pageRequestUrl,
        expectedOptionsRepeater
      )
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

  describe('setConfirmationEmailSettings', () => {
    const pageRequestUrl = new URL(
      `./${formId}/definition/draft/pages/12345`,
      formsEndpoint
    )

    describe('when patchJson succeeds', () => {
      test('sets controller to SummaryWithConfirmationEmail when confirmation email is enabled', async () => {
        mockedPatchJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: {}
        })

        const expectedOptions = {
          payload: {
            controller: ControllerType.SummaryWithConfirmationEmail
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        await setConfirmationEmailSettings(formId, token, '12345', {
          disableConfirmationEmail: false
        })

        expect(mockedPatchJson).toHaveBeenCalledWith(
          pageRequestUrl,
          expectedOptions
        )
      })

      test('sets controller to Summary when confirmation email is disabled', async () => {
        mockedPatchJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: {}
        })

        const expectedOptions = {
          payload: {
            controller: ControllerType.Summary
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        await setConfirmationEmailSettings(formId, token, '12345', {
          disableConfirmationEmail: true
        })

        expect(mockedPatchJson).toHaveBeenCalledWith(
          pageRequestUrl,
          expectedOptions
        )
      })

      test('handles undefined disableConfirmationEmail as falsy (enables confirmation email)', async () => {
        mockedPatchJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: {}
        })

        const expectedOptions = {
          payload: {
            controller: ControllerType.SummaryWithConfirmationEmail
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        await setConfirmationEmailSettings(formId, token, '12345', {})

        expect(mockedPatchJson).toHaveBeenCalledWith(
          pageRequestUrl,
          expectedOptions
        )
      })
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

  describe('reorderQuestions', () => {
    const reorderQuestionUrl = new URL(
      `./${formId}/definition/draft/page/p1/components/order`,
      formsEndpoint
    )

    it('should reorder the questions', async () => {
      const questionOrderPayload = [
        'd3214138-1c1f-42c1-9572-37b2f9ba1320',
        '097becaf-ef20-4655-a8da-b2886f06c978',
        'da9a860e-cf05-4b4b-bf4e-7c40e319ad7d'
      ]
      const expectedOrderCall = {
        payload: questionOrderPayload,
        headers: { Authorization: `Bearer ${token}` }
      }
      await reorderQuestions(formId, token, 'p1', questionOrderPayload)
      expect(mockedPostJson).toHaveBeenCalledWith(
        reorderQuestionUrl,
        expectedOrderCall
      )
    })

    it('should handle empty array as payload', async () => {
      const questionOrderPayload = /** @type {string[]} */ ([])
      await reorderQuestions(formId, token, 'p1', questionOrderPayload)
      expect(mockedPostJson).not.toHaveBeenCalled()
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

        await deletePage(formId, token, '12345', formDefinition)

        expect(mockedDelJson).toHaveBeenCalledWith(requestUrl, expectedOptions)
        expect(removeUniquelyMappedListsFromPage).toHaveBeenCalledWith(
          formId,
          formDefinition,
          token,
          '12345'
        )
      })
    })

    describe('when delJson fails', () => {
      test('throws the error', async () => {
        const testError = new Error('Network error')
        mockedDelJson.mockRejectedValueOnce(testError)

        await expect(
          deletePage(formId, token, '12345', formDefinition)
        ).rejects.toThrow(testError)
      })
    })
  })

  describe('deleteQuestion', () => {
    const requestUrl = new URL(
      `./${formId}/definition/draft/pages/12345/components/67890`,
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

        await deleteQuestion(formId, token, '12345', '67890', formDefinition)

        expect(mockedDelJson).toHaveBeenCalledWith(requestUrl, expectedOptions)
        expect(removeUniquelyMappedListFromQuestion).toHaveBeenCalledWith(
          formId,
          formDefinition,
          token,
          '12345',
          '67890'
        )
      })
    })

    describe('when delJson fails', () => {
      test('throws the error', async () => {
        const testError = new Error('Network error')
        mockedDelJson.mockRejectedValueOnce(testError)

        await expect(
          deleteQuestion(formId, token, '12345', '67890', formDefinition)
        ).rejects.toThrow(testError)
      })
    })
  })

  describe('deleteCondition', () => {
    const requestUrl = new URL(
      `./${formId}/definition/draft/conditions/67890`,
      formsEndpoint
    )
    const expectedOptions = {
      headers: { Authorization: `Bearer ${token}` }
    }

    describe('when delJson succeeds', () => {
      test('calls forms manager DELETE endpoint', async () => {
        mockedDelJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { result: 'ok' }
        })

        await deleteCondition(formId, token, '67890')

        expect(mockedDelJson).toHaveBeenCalledWith(requestUrl, expectedOptions)
      })
    })

    describe('when delJson fails', () => {
      test('throws the error', async () => {
        const testError = new Error('Network error')
        mockedDelJson.mockRejectedValueOnce(testError)

        await expect(deleteCondition(formId, token, '67890')).rejects.toThrow(
          testError
        )
      })
    })
  })

  describe('setPageCondition', () => {
    const requestUrl = new URL(
      `./${formId}/definition/draft/pages/12345`,
      formsEndpoint
    )

    describe('when patchJsonByType succeeds', () => {
      test('sets page condition when conditionName is provided', async () => {
        const expectedOptions = {
          payload: {
            condition: 'test-condition-name'
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        mockedPatchJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: {}
        })

        await setPageCondition(formId, token, '12345', 'test-condition-name')

        expect(mockedPatchJson).toHaveBeenCalledWith(
          requestUrl,
          expectedOptions
        )
      })

      test('removes page condition when conditionName is null', async () => {
        const expectedOptions = {
          payload: {
            condition: null
          },
          headers: { Authorization: `Bearer ${token}` }
        }

        mockedPatchJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: {}
        })

        await setPageCondition(formId, token, '12345', null)

        expect(mockedPatchJson).toHaveBeenCalledWith(
          requestUrl,
          expectedOptions
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

    test('returns current controller by default', () => {
      expect(
        getControllerType(
          {
            type: ComponentType.TextField
          },
          ControllerType.Repeat
        )
      ).toEqual({ controller: ControllerType.Repeat })
    })
  })

  const testCondition = /** @type {ConditionWrapperV2} */ ({
    id: '2764cf2a-0382-43cb-9e7f-48b72644e668',
    displayName: 'cond1'
  })

  describe('updateCondition', () => {
    const requestUrl = new URL(
      `./${formId}/definition/draft/conditions/12345`,
      formsEndpoint
    )

    const expectedConditionPayload = {
      payload: {
        id: '2764cf2a-0382-43cb-9e7f-48b72644e668',
        displayName: 'cond1'
      },
      headers: { Authorization: `Bearer ${token}` }
    }

    describe('when putJson succeeds', () => {
      test('returns response body when successful', async () => {
        mockedPutJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: '456' }
        })

        const result = await updateCondition(formId, token, testCondition)

        expect(mockedPutJson).toHaveBeenCalledWith(
          requestUrl,
          expectedConditionPayload
        )
        expect(result).toEqual({ id: '456' })
      })
    })

    describe('when putJson fails', () => {
      test('throws the error', async () => {
        const testError = new Error('Network error')
        mockedPutJson.mockRejectedValueOnce(testError)

        await expect(
          updateCondition(formId, token, testCondition)
        ).rejects.toThrow(testError)
      })
    })
  })

  describe('addCondition', () => {
    const requestUrl = new URL(
      `./${formId}/definition/draft/conditions/12345`,
      formsEndpoint
    )

    const expectedConditionPayload = {
      payload: {
        id: '2764cf2a-0382-43cb-9e7f-48b72644e668',
        displayName: 'cond1'
      },
      headers: { Authorization: `Bearer ${token}` }
    }

    describe('when postJson succeeds', () => {
      test('returns response body when successful', async () => {
        mockedPostJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: { id: '456' }
        })

        const result = await addCondition(formId, token, testCondition)

        expect(mockedPostJson).toHaveBeenCalledWith(
          requestUrl,
          expectedConditionPayload
        )
        expect(result).toEqual({ id: '456' })
      })
    })

    describe('when postJson fails', () => {
      test('throws the error', async () => {
        const testError = new Error('Network error')
        mockedPostJson.mockRejectedValueOnce(testError)

        await expect(
          addCondition(formId, token, testCondition)
        ).rejects.toThrow(testError)
      })
    })
  })

  describe('buildRepeaterPayload', () => {
    test('should return empty payload when controller type is not Repeat', () => {
      const page = /** @type {Page} */ ({})
      const result = buildRepeaterPayload(page, ControllerType.Page)
      expect(result).toEqual({})
    })

    test('should return empty payload when controller type is undefined', () => {
      const page = /** @type {Page} */ ({})
      const result = buildRepeaterPayload(page, undefined)
      expect(result).toEqual({})
    })

    test('should return repeater payload when page is undefined', () => {
      const result = buildRepeaterPayload(undefined, ControllerType.Repeat)
      expect(result).toEqual({ repeater: 'true' })
    })

    test('should build payload with all repeater settings when page has complete repeat config', () => {
      const page = /** @type {PageRepeat} */ ({
        controller: ControllerType.Repeat,
        repeat: {
          schema: { min: 2, max: 10 },
          options: { title: 'Test Repeater', name: 'test-repeater' }
        }
      })
      const result = buildRepeaterPayload(page, ControllerType.Repeat)
      expect(result).toEqual({
        repeater: 'true',
        minItems: 2,
        maxItems: 10,
        questionSetName: 'Test Repeater'
      })
    })

    test('should build payload with only schema when options are missing', () => {
      const page = /** @type {PageRepeat} */ ({
        controller: ControllerType.Repeat,
        repeat: {
          schema: { min: 1, max: 5 }
        }
      })
      const result = buildRepeaterPayload(page, ControllerType.Repeat)
      expect(result).toEqual({
        repeater: 'true',
        minItems: 1,
        maxItems: 5
      })
    })

    test('should build payload with only options when schema is missing', () => {
      const page = /** @type {PageRepeat} */ ({
        controller: ControllerType.Repeat,
        repeat: {
          options: { title: 'Only Options', name: 'only-options' }
        }
      })
      const result = buildRepeaterPayload(page, ControllerType.Repeat)
      expect(result).toEqual({
        repeater: 'true',
        questionSetName: 'Only Options'
      })
    })

    test('should build payload with only repeater flag when repeat object is missing', () => {
      const page = /** @type {Page} */ ({
        controller: ControllerType.Repeat
      })
      const result = buildRepeaterPayload(page, ControllerType.Repeat)
      expect(result).toEqual({
        repeater: 'true'
      })
    })

    test('should handle undefined schema values', () => {
      const page = {
        controller: ControllerType.Repeat,
        repeat: {
          schema: { min: undefined, max: undefined },
          options: { title: 'Test Title', name: 'test-name' }
        }
      }
      // @ts-expect-error - Intentionally testing edge case with undefined values
      const result = buildRepeaterPayload(page, ControllerType.Repeat)
      expect(result).toEqual({
        repeater: 'true',
        minItems: undefined,
        maxItems: undefined,
        questionSetName: 'Test Title'
      })
    })

    test('should handle undefined options title', () => {
      const page = {
        controller: ControllerType.Repeat,
        repeat: {
          schema: { min: 3, max: 7 },
          options: { title: undefined, name: 'test-name' }
        }
      }
      // @ts-expect-error - Intentionally testing edge case with undefined values
      const result = buildRepeaterPayload(page, ControllerType.Repeat)
      expect(result).toEqual({
        repeater: 'true',
        minItems: 3,
        maxItems: 7,
        questionSetName: undefined
      })
    })
  })

  describe('getRepeaterProperties', () => {
    test('should return properties including random id', () => {
      const page = /** @type {PageRepeat} */ ({
        repeat: { options: { name: 'repeater-name' } }
      })
      const payload = {
        minItems: 1,
        maxItems: 5,
        questionSetName: 'qSetName'
      }
      const res = getRepeaterProperties(page, false, payload)
      expect(res).toEqual({
        repeat: {
          options: {
            name: expect.any(String),
            title: 'qSetName'
          },
          schema: {
            max: 5,
            min: 1
          }
        }
      })
      expect(res.repeat.options.name).not.toBe('repeater-name')
    })

    test('should return propertieswith existing name', () => {
      const page = /** @type {PageRepeat} */ ({
        repeat: { options: { name: 'repeater-name' } }
      })
      const payload = {
        minItems: 1,
        maxItems: 5,
        questionSetName: 'qSetName'
      }
      const res = getRepeaterProperties(page, true, payload)
      expect(res).toEqual({
        repeat: {
          options: {
            name: 'repeater-name',
            title: 'qSetName'
          },
          schema: {
            max: 5,
            min: 1
          }
        }
      })
    })
  })

  describe('getControllerTypeAndProperties', () => {
    test('should return controller type for file upload', () => {
      const page = /** @type {Page} */ ({})
      const components = /** @type {ComponentDef[]} */ ([
        {
          type: ComponentType.FileUploadField
        }
      ])
      const payload = {}
      const { controllerType, additionalProperties } =
        getControllerTypeAndProperties(page, components, payload)
      expect(controllerType).toBe(ControllerType.FileUpload)
      expect(additionalProperties).toEqual({})
    })

    test('should clear controller type if no longer file upload', () => {
      const page = /** @type {Page} */ ({
        controller: ControllerType.FileUpload
      })
      const components = /** @type {ComponentDef[]} */ ([])
      const payload = {}
      const { controllerType, additionalProperties } =
        getControllerTypeAndProperties(page, components, payload)
      expect(controllerType).toBeNull()
      expect(additionalProperties).toEqual({})
    })

    test('should return controller type for exit page', () => {
      const page = /** @type {Page} */ ({})
      const components = /** @type {ComponentDef[]} */ ([])
      const payload = {
        exitPage: true
      }
      const { controllerType, additionalProperties } =
        getControllerTypeAndProperties(page, components, payload)
      expect(controllerType).toBe(ControllerType.Terminal)
      expect(additionalProperties).toEqual({})
    })

    test('should clear controller type if no longer exit page', () => {
      const page = /** @type {Page} */ ({ controller: ControllerType.Terminal })
      const components = /** @type {ComponentDef[]} */ ([])
      const payload = {
        exitPage: false
      }
      const { controllerType, additionalProperties } =
        getControllerTypeAndProperties(page, components, payload)
      expect(controllerType).toBeNull()
      expect(additionalProperties).toEqual({})
    })

    test('should return controller type for repeat page', () => {
      const page = /** @type {Page} */ ({})
      const components = /** @type {ComponentDef[]} */ ([])
      const payload = {
        repeater: 'yes',
        minItems: 2,
        maxItems: 4,
        questionSetName: 'questionSetName'
      }
      const { controllerType, additionalProperties } =
        getControllerTypeAndProperties(page, components, payload)
      expect(controllerType).toBe(ControllerType.Repeat)
      expect(additionalProperties).toEqual({
        repeat: {
          options: {
            name: expect.any(String),
            title: 'questionSetName'
          },
          schema: {
            min: 2,
            max: 4
          }
        }
      })
    })

    test('should clear controller type if no longer repeat page', () => {
      const page = /** @type {PageRepeat} */ ({
        controller: ControllerType.Repeat
      })
      const components = /** @type {ComponentDef[]} */ ([])
      const payload = {}
      const { controllerType, additionalProperties } =
        getControllerTypeAndProperties(page, components, payload)
      expect(controllerType).toBeNull()
      expect(additionalProperties).toEqual({})
    })

    test('should clear repeat controller when component changed to PaymentField', () => {
      const page = /** @type {PageRepeat} */ ({
        controller: ControllerType.Repeat
      })
      const components = /** @type {ComponentDef[]} */ ([
        { type: ComponentType.PaymentField }
      ])
      const payload = {
        repeater: 'true',
        minItems: 1,
        maxItems: 4,
        questionSetName: 'a repeater'
      }
      const { controllerType, additionalProperties } =
        getControllerTypeAndProperties(page, components, payload)
      expect(controllerType).toBeNull()
      expect(additionalProperties).toEqual({})
    })

    test('should not set repeat controller when PaymentField is present', () => {
      const page = /** @type {Page} */ ({})
      const components = /** @type {ComponentDef[]} */ ([
        { type: ComponentType.PaymentField }
      ])
      const payload = {
        repeater: 'yes',
        minItems: 1,
        maxItems: 5,
        questionSetName: 'test'
      }
      const { controllerType, additionalProperties } =
        getControllerTypeAndProperties(page, components, payload)
      expect(controllerType).toBeUndefined()
      expect(additionalProperties).toEqual({})
    })
  })

  describe('stringHasValue', () => {
    test('should return coorect boolean value', () => {
      expect(stringHasValue(undefined)).toBe(false)
      expect(stringHasValue(null)).toBe(false)
      expect(stringHasValue('')).toBe(false)
      expect(stringHasValue('a')).toBe(true)
      expect(stringHasValue('Something')).toBe(true)
    })
  })

  describe('addSection', () => {
    const definitionWithoutSections = buildDefinition({
      pages: [
        {
          id: 'p1',
          path: '/page-one',
          title: 'Page one',
          components: [],
          next: []
        }
      ],
      sections: []
    })

    test('should add a new section to the form', async () => {
      const expectedDefinition = buildDefinition({
        pages: definitionWithoutSections.pages,
        sections: [
          {
            id: expect.any(String),
            name: 'new-section',
            title: 'New Section',
            hideTitle: false
          }
        ]
      })

      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWithoutSections)
        .mockResolvedValueOnce(expectedDefinition)
      mockedPutJson.mockResolvedValueOnce({
        body: { id: formId, sections: [], status: 'updated' },
        response: createMockResponse()
      })

      const result = await addSection(formId, token, 'New Section')

      expect(forms.getDraftFormDefinition).toHaveBeenCalledWith(formId, token)
      expect(mockedPutJson).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          payload: {
            sections: [
              expect.objectContaining({
                id: expect.any(String),
                name: 'new-section',
                title: 'New Section',
                hideTitle: false,
                pageIds: []
              })
            ],
            requestType: FormDefinitionRequestType.CREATE_SECTION
          }
        })
      )
      expect(result.sections).toHaveLength(1)
      expect(result.sections[0].name).toBe('new-section')
      expect(result.sections[0].title).toBe('New Section')
    })
  })

  describe('removeSection', () => {
    const definitionWithPagesInSection = buildDefinition({
      pages: [
        {
          id: 'p1',
          path: '/page-one',
          title: 'Page one',
          section: 'section-id-to-remove',
          components: [],
          next: []
        },
        {
          id: 'p2',
          path: '/page-two',
          title: 'Page two',
          section: 'other-section-id',
          components: [],
          next: []
        },
        {
          id: 'p3',
          path: '/page-three',
          title: 'Page three',
          section: 'section-id-to-remove',
          components: [],
          next: []
        }
      ],
      sections: [
        {
          id: 'section-id-to-remove',
          name: 'section-to-remove',
          title: 'Section to Remove',
          hideTitle: false
        },
        {
          id: 'other-section-id',
          name: 'other-section',
          title: 'Other Section',
          hideTitle: false
        }
      ]
    })

    test('should remove section and unassign all pages from it', async () => {
      const expectedDefinition = buildDefinition({
        pages: [
          {
            id: 'p1',
            path: '/page-one',
            title: 'Page one',
            components: [],
            next: []
          },
          {
            id: 'p2',
            path: '/page-two',
            title: 'Page two',
            section: 'other-section-id',
            components: [],
            next: []
          },
          {
            id: 'p3',
            path: '/page-three',
            title: 'Page three',
            components: [],
            next: []
          }
        ],
        sections: [
          {
            id: 'other-section-id',
            name: 'other-section',
            title: 'Other Section',
            hideTitle: false
          }
        ]
      })

      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(structuredClone(definitionWithPagesInSection))
        .mockResolvedValueOnce(expectedDefinition)
      mockedPutJson.mockResolvedValueOnce({
        body: { id: formId, sections: [], status: 'updated' },
        response: createMockResponse()
      })

      const result = await removeSection(formId, token, 'section-id-to-remove')

      expect(forms.getDraftFormDefinition).toHaveBeenCalledWith(formId, token)
      expect(mockedPutJson).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          payload: {
            sections: [
              expect.objectContaining({
                id: 'other-section-id',
                name: 'other-section',
                title: 'Other Section'
              })
            ],
            requestType: FormDefinitionRequestType.DELETE_SECTION
          }
        })
      )
      expect(result.sections).toHaveLength(1)
    })

    test('should handle removing a section that does not exist', async () => {
      const defWithOnlyOtherSection = buildDefinition({
        pages: [],
        sections: [
          {
            id: 'other-section-id',
            name: 'other-section',
            title: 'Other Section',
            hideTitle: false
          }
        ]
      })
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(structuredClone(defWithOnlyOtherSection))
        .mockResolvedValueOnce(defWithOnlyOtherSection)
      mockedPutJson.mockResolvedValueOnce({
        body: { id: formId, sections: [], status: 'updated' },
        response: createMockResponse()
      })

      const result = await removeSection(formId, token, 'non-existent-section')

      expect(result.sections).toHaveLength(1)
      expect(result.sections[0].name).toBe('other-section')
    })
  })

  describe('assignPageToSection', () => {
    const definitionForAssign = buildDefinition({
      pages: [
        {
          id: 'p1',
          path: '/page-one',
          title: 'Page one',
          components: [],
          next: []
        },
        {
          id: 'p2',
          path: '/page-two',
          title: 'Page two',
          section: 'existing-section-id',
          components: [],
          next: []
        }
      ],
      sections: [
        {
          id: 'existing-section-id',
          name: 'existing-section',
          title: 'Existing Section',
          hideTitle: false
        },
        {
          id: 'new-section-id',
          name: 'new-section',
          title: 'New Section',
          hideTitle: false
        }
      ]
    })

    test('should assign a page to a section', async () => {
      const expectedDefinition = buildDefinition({
        pages: [
          {
            id: 'p1',
            path: '/page-one',
            title: 'Page one',
            section: 'new-section-id',
            components: [],
            next: []
          },
          {
            id: 'p2',
            path: '/page-two',
            title: 'Page two',
            section: 'existing-section-id',
            components: [],
            next: []
          }
        ],
        sections: definitionForAssign.sections
      })

      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(structuredClone(definitionForAssign))
        .mockResolvedValueOnce(expectedDefinition)
      mockedPutJson.mockResolvedValueOnce({
        body: { id: formId, sections: [], status: 'updated' },
        response: createMockResponse()
      })

      const result = await assignPageToSection(
        formId,
        token,
        'p1',
        'new-section-id'
      )

      expect(forms.getDraftFormDefinition).toHaveBeenCalledWith(formId, token)
      expect(mockedPutJson).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          payload: {
            sections: expect.arrayContaining([
              expect.objectContaining({
                id: 'new-section-id',
                pageIds: expect.arrayContaining(['p1'])
              })
            ]),
            requestType: FormDefinitionRequestType.ASSIGN_SECTIONS
          }
        })
      )
      expect(result.pages[0].section).toBe('new-section-id')
    })

    test('should reassign a page from one section to another', async () => {
      const expectedDefinition = buildDefinition({
        pages: [
          {
            id: 'p1',
            path: '/page-one',
            title: 'Page one',
            components: [],
            next: []
          },
          {
            id: 'p2',
            path: '/page-two',
            title: 'Page two',
            section: 'new-section-id',
            components: [],
            next: []
          }
        ],
        sections: definitionForAssign.sections
      })

      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(structuredClone(definitionForAssign))
        .mockResolvedValueOnce(expectedDefinition)
      mockedPutJson.mockResolvedValueOnce({
        body: { id: formId, sections: [], status: 'updated' },
        response: createMockResponse()
      })

      const result = await assignPageToSection(
        formId,
        token,
        'p2',
        'new-section-id'
      )

      expect(result.pages[1].section).toBe('new-section-id')
    })

    test('should handle assigning a non-existent page', async () => {
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(structuredClone(definitionForAssign))
        .mockResolvedValueOnce(definitionForAssign)
      mockedPutJson.mockResolvedValueOnce({
        body: { id: formId, sections: [], status: 'updated' },
        response: createMockResponse()
      })

      const result = await assignPageToSection(
        formId,
        token,
        'non-existent-page',
        'new-section-id'
      )

      expect(result.pages[0].section).toBeUndefined()
      expect(result.pages[1].section).toBe('existing-section-id')
    })
  })

  describe('unassignPageFromSection', () => {
    const definitionForUnassign = buildDefinition({
      pages: [
        {
          id: 'p1',
          path: '/page-one',
          title: 'Page one',
          section: 'some-section-id',
          components: [],
          next: []
        },
        {
          id: 'p2',
          path: '/page-two',
          title: 'Page two',
          components: [],
          next: []
        }
      ],
      sections: [
        {
          id: 'some-section-id',
          name: 'some-section',
          title: 'Some Section',
          hideTitle: false
        }
      ]
    })

    test('should unassign a page from its section', async () => {
      const expectedDefinition = buildDefinition({
        pages: [
          {
            id: 'p1',
            path: '/page-one',
            title: 'Page one',
            components: [],
            next: []
          },
          {
            id: 'p2',
            path: '/page-two',
            title: 'Page two',
            components: [],
            next: []
          }
        ],
        sections: definitionForUnassign.sections
      })

      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(structuredClone(definitionForUnassign))
        .mockResolvedValueOnce(expectedDefinition)
      mockedPutJson.mockResolvedValueOnce({
        body: { id: formId, sections: [], status: 'updated' },
        response: createMockResponse()
      })

      const result = await unassignPageFromSection(formId, token, 'p1')

      expect(forms.getDraftFormDefinition).toHaveBeenCalledWith(formId, token)
      expect(mockedPutJson).toHaveBeenCalled()
      expect(result.pages[0].section).toBeUndefined()
    })

    test('should handle unassigning a page that has no section', async () => {
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(structuredClone(definitionForUnassign))
        .mockResolvedValueOnce(definitionForUnassign)
      mockedPutJson.mockResolvedValueOnce({
        body: { id: formId, sections: [], status: 'updated' },
        response: createMockResponse()
      })

      const result = await unassignPageFromSection(formId, token, 'p2')

      expect(result.pages[1].section).toBeUndefined()
    })

    test('should handle unassigning a non-existent page', async () => {
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(structuredClone(definitionForUnassign))
        .mockResolvedValueOnce(definitionForUnassign)
      mockedPutJson.mockResolvedValueOnce({
        body: { id: formId, sections: [], status: 'updated' },
        response: createMockResponse()
      })

      const result = await unassignPageFromSection(
        formId,
        token,
        'non-existent-page'
      )

      expect(result.pages[0].section).toBe('some-section-id')
    })
  })

  describe('updateSectionSettings', () => {
    const definitionForSettings = buildDefinition({
      pages: [],
      sections: [
        {
          id: 'my-section-id',
          name: 'my-section',
          title: 'My Section',
          hideTitle: false
        },
        {
          id: 'other-section-id',
          name: 'other-section',
          title: 'Other Section',
          hideTitle: true
        }
      ]
    })

    test('should update hideTitle setting to true', async () => {
      const expectedDefinition = buildDefinition({
        pages: [],
        sections: [
          {
            id: 'my-section-id',
            name: 'my-section',
            title: 'My Section',
            hideTitle: true
          },
          {
            id: 'other-section-id',
            name: 'other-section',
            title: 'Other Section',
            hideTitle: true
          }
        ]
      })

      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(structuredClone(definitionForSettings))
        .mockResolvedValueOnce(expectedDefinition)
      mockedPutJson.mockResolvedValueOnce({
        body: { id: formId, sections: [], status: 'updated' },
        response: createMockResponse()
      })

      const result = await updateSectionSettings(
        formId,
        token,
        'my-section-id',
        {
          hideTitle: true
        }
      )

      expect(forms.getDraftFormDefinition).toHaveBeenCalledWith(formId, token)
      expect(mockedPutJson).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          payload: {
            sections: expect.arrayContaining([
              expect.objectContaining({
                id: 'my-section-id',
                hideTitle: true
              })
            ]),
            requestType: FormDefinitionRequestType.ASSIGN_SECTIONS
          }
        })
      )
      expect(result.sections[0].hideTitle).toBe(true)
    })

    test('should update hideTitle setting to false', async () => {
      const expectedDefinition = buildDefinition({
        pages: [],
        sections: [
          {
            id: 'my-section-id',
            name: 'my-section',
            title: 'My Section',
            hideTitle: false
          },
          {
            id: 'other-section-id',
            name: 'other-section',
            title: 'Other Section',
            hideTitle: false
          }
        ]
      })

      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(structuredClone(definitionForSettings))
        .mockResolvedValueOnce(expectedDefinition)
      mockedPutJson.mockResolvedValueOnce({
        body: { id: formId, sections: [], status: 'updated' },
        response: createMockResponse()
      })

      const result = await updateSectionSettings(
        formId,
        token,
        'other-section-id',
        { hideTitle: false }
      )

      expect(result.sections[1].hideTitle).toBe(false)
    })

    test('should default hideTitle to false when undefined', async () => {
      const expectedDefinition = buildDefinition({
        pages: [],
        sections: [
          {
            id: 'my-section-id',
            name: 'my-section',
            title: 'My Section',
            hideTitle: false
          },
          {
            id: 'other-section-id',
            name: 'other-section',
            title: 'Other Section',
            hideTitle: true
          }
        ]
      })

      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(structuredClone(definitionForSettings))
        .mockResolvedValueOnce(expectedDefinition)
      mockedPutJson.mockResolvedValueOnce({
        body: { id: formId, sections: [], status: 'updated' },
        response: createMockResponse()
      })

      const result = await updateSectionSettings(
        formId,
        token,
        'my-section-id',
        {}
      )

      expect(result.sections[0].hideTitle).toBe(false)
    })

    test('should handle updating a non-existent section', async () => {
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(structuredClone(definitionForSettings))
        .mockResolvedValueOnce(definitionForSettings)
      mockedPutJson.mockResolvedValueOnce({
        body: { id: formId, sections: [], status: 'updated' },
        response: createMockResponse()
      })

      const result = await updateSectionSettings(
        formId,
        token,
        'non-existent-section-id',
        { hideTitle: true }
      )

      expect(result.sections[0].hideTitle).toBe(false)
      expect(result.sections[1].hideTitle).toBe(true)
    })
  })
})

/**
 * @import { ComponentDef, ConditionWrapperV2, FormDefinition, Page, PageRepeat } from '@defra/forms-model'
 */
