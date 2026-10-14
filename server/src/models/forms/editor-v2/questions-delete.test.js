import { testFormDefinitionWithTwoQuestions } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import {
  deleteQuestionConfirmationPageViewModel,
  determineCaptionText
} from '~/src/models/forms/editor-v2/question-delete.js'

describe('editor-v2 - question-delete model', () => {
  describe('determineCaptionText', () => {
    test('should return question title if no page title and questionId supplied', () => {
      const page = structuredClone(
        /** @type {PageQuestion} */ (
          testFormDefinitionWithTwoQuestions.pages[0]
        )
      )
      page.title = ''
      const components = page.components
      const res = determineCaptionText(components, page, 'q2')
      expect(res).toBe('This is your second question')
    })

    test('should return first question title if no page title and no questionId supplied', () => {
      const page = structuredClone(
        /** @type {PageQuestion} */ (
          testFormDefinitionWithTwoQuestions.pages[0]
        )
      )
      page.title = ''
      const components = page.components
      const res = determineCaptionText(components, page, undefined)
      expect(res).toBe('This is your first question')
    })

    test('should return page title if page has a title', () => {
      const page = structuredClone(
        /** @type {PageQuestion} */ (
          testFormDefinitionWithTwoQuestions.pages[0]
        )
      )
      const components = page.components
      const res = determineCaptionText(components, page, 'q2')
      expect(res).toBe('Page one')
    })
  })

  describe('deleteQuestionConfirmationPageViewModel', () => {
    const mockMetadata = testFormMetadata
    const mockDefinition = testFormDefinitionWithTwoQuestions
    const pageId = 'p1'
    const questionId = 'q1'

    test('should default badRequestErrorList to empty array when not provided', () => {
      const result = deleteQuestionConfirmationPageViewModel(
        mockMetadata,
        mockDefinition,
        pageId,
        questionId
      )

      expect(result.badRequestErrorList).toEqual([])
    })

    test('should use provided badRequestErrorList when supplied', () => {
      const mockErrorList = [
        { text: 'Error 1', href: '#field1' },
        { text: 'Error 2', href: '#field2' }
      ]

      const result = deleteQuestionConfirmationPageViewModel(
        mockMetadata,
        mockDefinition,
        pageId,
        questionId,
        mockErrorList
      )

      expect(result.badRequestErrorList).toEqual(mockErrorList)
    })
  })
})

/**
 * @import { PageQuestion } from '@defra/forms-model'
 */
