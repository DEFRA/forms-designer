import { describe, expect, test } from '@jest/globals'

import {
  getConditionsData,
  getPageConditionDetails,
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
            name: 'condition1',
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
        name: 'condition1',
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
              name: 'v2-condition-z',
              displayName: 'Z Condition',
              conditions: []
            },
            {
              name: 'v1-condition',
              displayName: 'V1 Condition'
              // Missing 'conditions' property makes it V1
            },
            {
              name: 'v2-condition-a',
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
              name: 'condition-c',
              displayName: 'Charlie',
              conditions: []
            },
            {
              name: 'condition-a',
              displayName: 'Alpha',
              conditions: []
            },
            {
              name: 'condition-b',
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
})

/**
 * @import { FormDefinition } from '@defra/forms-model'
 */
