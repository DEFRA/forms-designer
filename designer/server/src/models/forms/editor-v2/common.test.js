import { ConditionType, Coordinator, OperatorName } from '@defra/forms-model'
import {
  buildDefinition,
  buildQuestionPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import {
  testFormDefinitionWithNoQuestions,
  testFormDefinitionWithSinglePage,
  testFormDefinitionWithTwoQuestions,
  testFormDefinitionWithoutSummary
} from '~/src/__stubs__/form-definition.js'
import {
  getPageNum,
  getQuestionNum,
  getQuestionsOnPage,
  tickBoxes,
  toPresentationHtmlV2,
  toPresentationStringV2
} from '~/src/models/forms/editor-v2/common.js'

describe('editor-v2 - model', () => {
  describe('getPageNum', () => {
    test('should return page number if no real page id', () => {
      const pageNum = getPageNum(testFormDefinitionWithSinglePage, 'new')
      expect(pageNum).toBe(2)
    })
    test('should return page number if no real page id - when no summary page', () => {
      const pageNum = getPageNum(testFormDefinitionWithoutSummary, 'new')
      expect(pageNum).toBe(2)
    })
    test('should return page number if proper page id', () => {
      const pageNum = getPageNum(testFormDefinitionWithSinglePage, 'p1')
      expect(pageNum).toBe(1)
    })
    test('should return page number if proper page id - when no summary page', () => {
      const pageNum = getPageNum(testFormDefinitionWithoutSummary, 'p1')
      expect(pageNum).toBe(1)
    })
  })

  describe('getQuestionsOnPage', () => {
    test('should return two questions', () => {
      const questions = getQuestionsOnPage(
        testFormDefinitionWithTwoQuestions,
        'p1'
      )
      expect(questions).toHaveLength(2)
    })
    test('should return no questions when not a question page', () => {
      const questions = getQuestionsOnPage(
        testFormDefinitionWithTwoQuestions,
        'p2'
      )
      expect(questions).toHaveLength(0)
    })

    test('should return one question', () => {
      const questions = getQuestionsOnPage(
        testFormDefinitionWithSinglePage,
        'p1'
      )
      expect(questions).toHaveLength(1)
    })
  })

  describe('getQuestionNum', () => {
    test('should return 1 if no questions', () => {
      const questionNum = getQuestionNum(
        testFormDefinitionWithNoQuestions,
        'p1',
        'new'
      )
      expect(questionNum).toBe(1)
    })
    test('should return 3 when 2 questions on page', () => {
      const questionNum = getQuestionNum(
        testFormDefinitionWithTwoQuestions,
        'p1',
        'new'
      )
      expect(questionNum).toBe(3)
    })

    test('should return specific question number for q1', () => {
      const questionNum = getQuestionNum(
        testFormDefinitionWithTwoQuestions,
        'p1',
        'q1'
      )
      expect(questionNum).toBe(1)
    })

    test('should return specific question number for q2', () => {
      const questionNum = getQuestionNum(
        testFormDefinitionWithTwoQuestions,
        'p1',
        'q2'
      )
      expect(questionNum).toBe(2)
    })

    test('should return snext question number if not found', () => {
      const questionNum = getQuestionNum(
        testFormDefinitionWithTwoQuestions,
        'p1',
        'qxxx'
      )
      expect(questionNum).toBe(3)
    })
  })

  describe('tickBoxes', () => {
    test('should return unchanged if no selections', () => {
      const res = tickBoxes([{ text: 'option1', value: 'value1' }], [])
      expect(res).toEqual([{ text: 'option1', value: 'value1' }])
    })

    test('should select first item if first selection', () => {
      const res = tickBoxes(
        [
          { text: 'option1', value: 'value1' },
          { text: 'option2', value: 'value2' }
        ],
        ['value1']
      )
      expect(res).toEqual([
        { text: 'option1', value: 'value1', checked: true },
        { text: 'option2', value: 'value2', checked: false }
      ])
    })

    test('should select second item if second selection', () => {
      const res = tickBoxes(
        [
          { text: 'option1', value: 'value1' },
          { text: 'option2', value: 'value2' }
        ],
        ['value2']
      )
      expect(res).toEqual([
        { text: 'option1', value: 'value1', checked: false },
        { text: 'option2', value: 'value2', checked: true }
      ])
    })

    test('should ignore if value is undefined', () => {
      const res = tickBoxes(
        [
          { text: 'option1', value: undefined },
          { text: 'option2', value: 'value2' }
        ],
        ['value1']
      )
      expect(res).toEqual([
        { text: 'option1', value: undefined, checked: false },
        { text: 'option2', value: 'value2', checked: false }
      ])
    })

    test('should handle undefined items', () => {
      const res = tickBoxes(undefined, ['value1'])
      expect(res).toEqual([])
    })
  })

  describe('toPresentationStringV2', () => {
    const componentId = 'farm-type-field'
    const testComponent = buildTextFieldComponent({
      id: componentId,
      name: 'farmType',
      title: 'What type of farming do you do?'
    })

    /** @type {ConditionWrapperV2} */
    const mockConditionV2 = {
      id: 'cattle-farm-condition',
      displayName: 'Show if cattle farming',
      items: [
        {
          id: 'cattle-farm-check',
          componentId,
          operator: OperatorName.Is,
          value: {
            type: ConditionType.StringValue,
            value: 'cattle'
          }
        }
      ]
    }

    it('should return presentation string for valid V2 condition', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'farm-details-page',
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2],
        lists: []
      })

      const result = toPresentationStringV2(mockConditionV2, definition)

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle conditions with multiple items and coordinator', () => {
      /** @type {ConditionWrapperV2} */
      const multipleItemsCondition = {
        id: 'organic-and-subsidies-condition',
        displayName: 'Organic farming with subsidies',
        coordinator: Coordinator.AND,
        items: [
          {
            id: 'organic-farming-check',
            componentId,
            operator: OperatorName.Is,
            value: {
              type: ConditionType.StringValue,
              value: 'organic'
            }
          },
          {
            id: 'subsidy-eligibility-check',
            componentId,
            operator: OperatorName.IsNot,
            value: {
              type: ConditionType.StringValue,
              value: 'conventional'
            }
          }
        ]
      }

      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'farm-details-page',
            components: [testComponent]
          })
        ],
        conditions: [multipleItemsCondition],
        lists: []
      })

      const result = toPresentationStringV2(multipleItemsCondition, definition)

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle conditions with lists', () => {
      const farmingTypesList = {
        id: 'farming-types-list',
        name: 'Farming Types',
        title: 'Types of farming operations',
        type: /** @type {const} */ ('string'),
        items: [
          { text: 'Cattle farming', value: 'cattle' },
          { text: 'Crop farming', value: 'crops' }
        ]
      }

      /** @type {ConditionWrapperV2} */
      const conditionWithList = {
        id: 'farming-type-condition',
        displayName: 'Show for specific farming types',
        items: [
          {
            id: 'farming-type-check',
            componentId,
            operator: OperatorName.Is,
            value: {
              type: ConditionType.StringValue,
              value: 'cattle'
            }
          }
        ]
      }

      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'farm-details-page',
            components: [testComponent]
          })
        ],
        conditions: [conditionWithList],
        lists: [farmingTypesList]
      })

      const result = toPresentationStringV2(conditionWithList, definition)

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('toPresentationHtmlV2', () => {
    const componentId = 'farm-type-field'
    const testComponent = buildTextFieldComponent({
      id: componentId,
      name: 'farmType',
      title: 'What type of farming do you do?'
    })

    /** @type {ConditionWrapperV2} */
    const mockConditionV2 = {
      id: 'cattle-farm-condition',
      displayName: 'Show if cattle farming',
      items: [
        {
          id: 'cattle-farm-check',
          componentId,
          operator: OperatorName.Is,
          value: {
            type: ConditionType.StringValue,
            value: 'cattle'
          }
        }
      ]
    }

    it('should return presentation HTML for valid V2 condition', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'farm-details-page',
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2],
        lists: []
      })

      const result = toPresentationHtmlV2(mockConditionV2, definition)

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return valid output for both string and HTML versions', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'farm-details-page',
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2],
        lists: []
      })

      const stringResult = toPresentationStringV2(mockConditionV2, definition)
      const htmlResult = toPresentationHtmlV2(mockConditionV2, definition)

      // Both should return valid strings
      expect(typeof stringResult).toBe('string')
      expect(typeof htmlResult).toBe('string')
      expect(stringResult.length).toBeGreaterThan(0)
      expect(htmlResult.length).toBeGreaterThan(0)
    })
  })
})

/**
 * @import { ConditionWrapperV2 } from '@defra/forms-model'
 */
