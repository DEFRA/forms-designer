import { ComponentType } from '@defra/forms-model'
import { describe, expect, test } from '@jest/globals'

import {
  getConditionsData,
  getPageConditionDetails,
  getQuestionErrorInfo,
  getQuestionPageInfo,
  getQuestionViewModelData,
  getTabsConfiguration,
  getUrlsConfiguration
} from '~/src/models/forms/editor-v2/question-details-helper.js'

describe('question-details-helper', () => {
  describe('getPageConditionDetails', () => {
    const mockDefinition = /** @type {FormDefinition} */ (
      /** @type {unknown} */ ({
        pages: [
          {
            id: 'page1',
            condition: 'condition1',
            path: '/page1',
            controller: 'controller1',
            title: 'Page 1'
          },
          {
            id: 'page2',
            path: '/page2',
            controller: 'controller2',
            title: 'Page 2'
          }
        ],
        conditions: [
          {
            id: 'condition1',
            displayName: 'Condition 1',
            conditions: []
          }
        ],
        lists: [],
        sections: []
      })
    )

    test('returns undefined values when page not found', () => {
      const result = getPageConditionDetails(mockDefinition, 'nonexistent')

      expect(result).toEqual({
        pageCondition: undefined,
        pageConditionDetails: undefined,
        pageConditionPresentationString: null
      })
    })

    test('returns undefined condition details when page has no condition', () => {
      const result = getPageConditionDetails(mockDefinition, 'page2')

      expect(result).toEqual({
        pageCondition: undefined,
        pageConditionDetails: undefined,
        pageConditionPresentationString: null
      })
    })

    test('returns undefined condition details when condition not found in definition', () => {
      const definitionWithMissingCondition = /** @type {FormDefinition} */ (
        /** @type {unknown} */ ({
          pages: [
            {
              id: 'page1',
              condition: 'missing-condition',
              path: '/page1',
              controller: 'controller1',
              title: 'Page 1'
            }
          ],
          conditions: [],
          lists: [],
          sections: []
        })
      )

      const result = getPageConditionDetails(
        definitionWithMissingCondition,
        'page1'
      )

      expect(result).toEqual({
        pageCondition: 'missing-condition',
        pageConditionDetails: undefined,
        pageConditionPresentationString: null
      })
    })

    test('returns condition details with presentation string when condition found', () => {
      const result = getPageConditionDetails(mockDefinition, 'page1')

      expect(result.pageCondition).toBe('condition1')
      expect(result.pageConditionDetails).toEqual({
        id: 'condition1',
        displayName: 'Condition 1',
        conditions: []
      })
      expect(result.pageConditionPresentationString).toBe('')
    })
  })

  describe('getConditionsData', () => {
    test('returns empty array when no conditions exist', () => {
      const definition = /** @type {FormDefinition} */ (
        /** @type {unknown} */ ({
          conditions: [],
          pages: [],
          lists: [],
          sections: []
        })
      )

      const result = getConditionsData(definition)

      expect(result).toEqual([])
    })

    test('filters out non-V2 conditions and sorts by displayName', () => {
      const definition = /** @type {FormDefinition} */ (
        /** @type {unknown} */ ({
          conditions: [
            {
              id: 'v2-condition-z',
              displayName: 'Z Condition',
              conditions: []
            },
            {
              id: 'v1-condition',
              displayName: 'V1 Condition'
              // Missing 'conditions' property makes it V1
            },
            {
              id: 'v2-condition-a',
              displayName: 'A Condition',
              conditions: []
            }
          ],
          pages: [],
          lists: [],
          sections: []
        })
      )

      const result = getConditionsData(definition)

      expect(result).toHaveLength(2)
      expect(result[0].displayName).toBe('A Condition')
      expect(result[1].displayName).toBe('Z Condition')
    })

    test('returns sorted V2 conditions', () => {
      const definition = /** @type {FormDefinition} */ (
        /** @type {unknown} */ ({
          conditions: [
            {
              id: 'condition-c',
              displayName: 'Charlie',
              conditions: []
            },
            {
              id: 'condition-a',
              displayName: 'Alpha',
              conditions: []
            },
            {
              id: 'condition-b',
              displayName: 'Bravo',
              conditions: []
            }
          ],
          pages: [],
          lists: [],
          sections: []
        })
      )

      const result = getConditionsData(definition)

      expect(result).toHaveLength(3)
      expect(result.map((c) => c.displayName)).toEqual([
        'Alpha',
        'Bravo',
        'Charlie'
      ])
    })
  })

  describe('getTabsConfiguration', () => {
    test('sets question tab as active when currentTab is "question"', () => {
      const result = getTabsConfiguration('question')

      expect(result).toEqual([
        { id: 'question', label: 'Question', active: true },
        { id: 'conditions', label: 'Conditions', active: false }
      ])
    })

    test('sets conditions tab as active when currentTab is "conditions"', () => {
      const result = getTabsConfiguration('conditions')

      expect(result).toEqual([
        { id: 'question', label: 'Question', active: false },
        { id: 'conditions', label: 'Conditions', active: true }
      ])
    })

    test('sets no tab as active when currentTab is unknown', () => {
      const result = getTabsConfiguration('unknown')

      expect(result).toEqual([
        { id: 'question', label: 'Question', active: false },
        { id: 'conditions', label: 'Conditions', active: false }
      ])
    })
  })

  describe('getUrlsConfiguration', () => {
    const baseParams = {
      metadataSlug: 'test-form',
      pageId: 'page1',
      questionId: 'question1',
      stateId: 'state1',
      pagePath: '/test-page',
      questionFieldsOverrideId: 'field1'
    }

    test('generates all URLs with provided parameters', () => {
      const result = getUrlsConfiguration(
        baseParams.metadataSlug,
        baseParams.pageId,
        baseParams.questionId,
        baseParams.stateId,
        baseParams.pagePath,
        baseParams.questionFieldsOverrideId
      )

      expect(result).toEqual({
        previewPageUrl: expect.stringContaining('/test-page?force'),
        previewErrorsUrl: expect.stringContaining('/test-page/field1'),
        deleteUrl: '/library/test-form/editor-v2/page/page1/delete/question1',
        changeTypeUrl:
          '/library/test-form/editor-v2/page/page1/question/question1/type/state1',
        conditionsManagerPath: '/library/test-form/editor-v2/conditions',
        pageConditionsApiUrl:
          '/library/test-form/editor-v2/page/page1/conditions'
      })
    })

    test('handles undefined pagePath', () => {
      const result = getUrlsConfiguration(
        baseParams.metadataSlug,
        baseParams.pageId,
        baseParams.questionId,
        baseParams.stateId,
        undefined,
        baseParams.questionFieldsOverrideId
      )

      expect(result.previewPageUrl).toContain('undefined?force')
      expect(result.previewErrorsUrl).toContain('undefined/field1')
    })

    test('handles undefined questionFieldsOverrideId', () => {
      const result = getUrlsConfiguration(
        baseParams.metadataSlug,
        baseParams.pageId,
        baseParams.questionId,
        baseParams.stateId,
        baseParams.pagePath,
        undefined
      )

      expect(result.previewErrorsUrl).toContain('/test-page/undefined')
    })

    test('generates correct static URLs regardless of parameters', () => {
      const result = getUrlsConfiguration(
        'any-form',
        'any-page',
        'any-question',
        'any-state',
        '/any-path',
        'any-field'
      )

      expect(result.deleteUrl).toBe(
        '/library/any-form/editor-v2/page/any-page/delete/any-question'
      )
      expect(result.changeTypeUrl).toBe(
        '/library/any-form/editor-v2/page/any-page/question/any-question/type/any-state'
      )
      expect(result.conditionsManagerPath).toBe(
        '/library/any-form/editor-v2/conditions'
      )
      expect(result.pageConditionsApiUrl).toBe(
        '/library/any-form/editor-v2/page/any-page/conditions'
      )
    })
  })

  describe('getQuestionErrorInfo', () => {
    const mockGetErrorTemplates = jest.fn()
    const mockHasDataOrErrorForDisplay = jest.fn()

    beforeEach(() => {
      mockGetErrorTemplates.mockReturnValue({
        baseErrors: [],
        advancedSettingsErrors: []
      })
      mockHasDataOrErrorForDisplay.mockReturnValue(false)
    })

    test('handles empty extraFields and undefined validation', () => {
      const result = getQuestionErrorInfo(
        [],
        undefined,
        ComponentType.TextField,
        mockGetErrorTemplates,
        mockHasDataOrErrorForDisplay
      )

      expect(result.extraFieldNames).toEqual([])
      expect(result.errorList).toEqual([])
      expect(result.isOpen).toBe(false)
      expect(mockGetErrorTemplates).toHaveBeenCalledWith(
        ComponentType.TextField
      )
    })

    test('extracts field names and handles validation errors', () => {
      const extraFields = [
        { name: 'field1' },
        { name: undefined },
        { name: 'field2' }
      ]
      const validation = /** @type {ValidationFailure<FormEditor>} */ (
        /** @type {unknown} */ ({
          formErrors: { field1: { text: 'Error' } },
          formValues: {}
        })
      )
      mockHasDataOrErrorForDisplay.mockReturnValue(true)

      const result = getQuestionErrorInfo(
        extraFields,
        validation,
        undefined,
        mockGetErrorTemplates,
        mockHasDataOrErrorForDisplay
      )

      expect(result.extraFieldNames).toEqual(['field1', 'unknown', 'field2'])
      expect(result.isOpen).toBe(true)
    })
  })

  describe('getQuestionPageInfo', () => {
    test('generates correct page information', () => {
      const details = { pageTitle: 'Form Title', questionNum: 3, pageNum: 2 }
      const formTitle = 'Test Form'

      const result = getQuestionPageInfo(details, formTitle)

      expect(result).toEqual({
        pageHeading: 'Form Title',
        pageTitle: 'Edit question 3 - Test Form',
        cardTitle: 'Question 3',
        cardCaption: 'Page 2',
        cardHeading: 'Edit question 3'
      })
    })

    test('handles missing details properties', () => {
      const details = {}
      const formTitle = 'Test Form'

      const result = getQuestionPageInfo(details, formTitle)

      expect(result.pageTitle).toContain('undefined - Test Form')
      expect(result.cardTitle).toContain('undefined')
    })
  })

  describe('getQuestionViewModelData', () => {
    const mockDefinition = {
      pages: [],
      conditions: [],
      lists: [],
      sections: []
    }

    test('combines all configuration data', () => {
      const config = {
        metadataSlug: 'test-form',
        pageId: 'page1',
        questionId: 'q1',
        stateId: 'state1',
        pagePath: '/path',
        questionFieldsOverrideId: 'field1',
        currentTab: 'question'
      }

      const result = getQuestionViewModelData(mockDefinition, config)

      expect(result).toHaveProperty('urls')
      expect(result).toHaveProperty('conditionDetails')
      expect(result).toHaveProperty('allConditions')
      expect(result).toHaveProperty('tabs')
      expect(result.tabs[0].active).toBe(true)
    })

    test('handles undefined optional config properties', () => {
      const config = {
        metadataSlug: 'test',
        pageId: 'page1',
        questionId: 'q1',
        stateId: 'state1',
        pagePath: undefined,
        questionFieldsOverrideId: undefined,
        currentTab: 'conditions'
      }

      const result = getQuestionViewModelData(mockDefinition, config)

      expect(result.urls.previewPageUrl).toContain('undefined')
      expect(result.tabs[1].active).toBe(true)
    })
  })
})

/**
 * @import { FormDefinition, FormEditor } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
