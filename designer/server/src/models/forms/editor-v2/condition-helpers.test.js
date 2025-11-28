import { ConditionType, OperatorName } from '@defra/forms-model'
import {
  buildDefinition,
  buildQuestionPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import {
  getConditionAsV1,
  getPageConditionDetails,
  getReferencedComponentNamesV2,
  toPresentationHtmlV2,
  toPresentationStringV2
} from '~/src/models/forms/editor-v2/condition-helpers.js'

describe('condition-helpers', () => {
  const componentId = 'test-field'
  const testComponent = buildTextFieldComponent({
    id: componentId,
    name: 'testField',
    title: 'Test Field'
  })

  /** @type {ConditionWrapperV2} */
  const mockConditionV2 = {
    id: 'cond1',
    displayName: 'Test Condition',
    items: [
      {
        id: 'item1',
        componentId,
        operator: OperatorName.Is,
        type: ConditionType.StringValue,
        value: 'test value'
      }
    ]
  }

  const definition = buildDefinition({
    pages: [
      buildQuestionPage({
        components: [testComponent]
      })
    ],
    conditions: [mockConditionV2],
    lists: []
  })

  describe('toPresentationStringV2 and toPresentationHtmlV2', () => {
    it('should convert V2 condition and return presentation string', () => {
      const stringResult = toPresentationStringV2(mockConditionV2, definition)
      expect(typeof stringResult).toBe('string')
      expect(stringResult.length).toBeGreaterThan(0)
    })

    it('should convert V2 condition and return presentation HTML', () => {
      const htmlResult = toPresentationHtmlV2(mockConditionV2, definition)
      expect(typeof htmlResult).toBe('string')
      expect(htmlResult.length).toBeGreaterThan(0)
    })
  })

  describe('getConditionAsV1', () => {
    it('should convert V2 condition to V1 wrapper', () => {
      const result = getConditionAsV1(mockConditionV2, definition)
      expect(result).toBeDefined()
      expect(result.value).toBeDefined()
    })
  })

  describe('getReferencedComponentNamesV2', () => {
    it('should return component names used in condition', () => {
      const result = getReferencedComponentNamesV2(mockConditionV2, definition)
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('getPageConditionDetails', () => {
    it('should return null values when page has no condition', () => {
      const defWithNoCondition = buildDefinition({
        pages: [buildQuestionPage({ id: 'p1' })],
        conditions: []
      })

      const result = getPageConditionDetails(defWithNoCondition, 'p1')

      expect(result.pageCondition).toBeUndefined()
      expect(result.pageConditionDetails).toBeUndefined()
      expect(result.pageConditionPresentationString).toBeNull()
    })

    it('should return condition details when page has condition', () => {
      const defWithCondition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            condition: 'cond1',
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2]
      })

      const result = getPageConditionDetails(defWithCondition, 'p1')

      expect(result.pageCondition).toBe('cond1')
      expect(result.pageConditionDetails).toBeDefined()
      expect(typeof result.pageConditionPresentationString).toBe('string')
    })
  })
})

/**
 * @import { ConditionWrapperV2 } from '@defra/forms-model'
 */
