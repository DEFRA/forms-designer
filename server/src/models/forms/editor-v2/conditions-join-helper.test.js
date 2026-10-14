import { ConditionType, Coordinator, OperatorName } from '@defra/forms-model'
import {
  buildDefinition,
  buildQuestionPage,
  buildSummaryPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import {
  buildConditionsField,
  buildCoordinatorField,
  buildDisplayNameField,
  getAvailableConditions,
  getSelectedConditions,
  isJoinedCondition
} from '~/src/models/forms/editor-v2/conditions-join-helper.js'

describe('conditions-join-helper', () => {
  const componentId = 'test-field'
  const testComponent = buildTextFieldComponent({
    id: componentId,
    name: 'testField',
    title: 'Test Field'
  })

  const condition1 = {
    id: 'condition-1',
    displayName: 'First condition',
    items: [
      {
        id: 'item-1',
        componentId,
        operator: OperatorName.Is,
        type: ConditionType.StringValue,
        value: 'value1'
      }
    ]
  }

  const condition2 = {
    id: 'condition-2',
    displayName: 'Second condition',
    items: [
      {
        id: 'item-2',
        componentId,
        operator: OperatorName.IsNot,
        type: ConditionType.StringValue,
        value: 'value2'
      }
    ]
  }

  const condition3 = {
    id: 'condition-3',
    displayName: 'Third condition',
    items: [
      {
        id: 'item-3',
        componentId,
        operator: OperatorName.Is,
        type: ConditionType.StringValue,
        value: 'value3'
      }
    ]
  }

  const joinedCondition = {
    id: 'joined-condition',
    displayName: 'Joined condition',
    coordinator: Coordinator.OR,
    items: [
      {
        id: 'ref-1',
        conditionId: 'condition-1'
      },
      {
        id: 'ref-2',
        conditionId: 'condition-2'
      }
    ]
  }

  const testDefinition = buildDefinition({
    pages: [
      buildQuestionPage({ id: 'page1', components: [testComponent] }),
      buildSummaryPage()
    ],
    conditions: [condition1, condition2, condition3, joinedCondition]
  })

  describe('getAvailableConditions', () => {
    it('should return all conditions when conditionId is "new"', () => {
      const result = getAvailableConditions(testDefinition, 'new')

      expect(result).toHaveLength(4)
      // Conditions are sorted alphabetically by displayName: "First condition", "Joined condition", "Second condition", "Third condition"
      expect(result.map((c) => c.id)).toEqual([
        'condition-1',
        'joined-condition',
        'condition-2',
        'condition-3'
      ])
    })

    it('should exclude the current condition when editing', () => {
      const result = getAvailableConditions(testDefinition, 'condition-2')

      expect(result).toHaveLength(3)
      // Conditions are sorted alphabetically by displayName, excluding "Second condition" (condition-2)
      expect(result.map((c) => c.id)).toEqual([
        'condition-1',
        'joined-condition',
        'condition-3'
      ])
    })

    it('should handle empty conditions array', () => {
      const emptyDefinition = buildDefinition({
        pages: [buildSummaryPage()],
        conditions: []
      })

      const result = getAvailableConditions(emptyDefinition, 'new')
      expect(result).toHaveLength(0)
    })
  })

  describe('getSelectedConditions', () => {
    it('should return form values when available', () => {
      const formValues = {
        conditions: ['condition-1', 'condition-3']
      }

      const result = getSelectedConditions(formValues, joinedCondition)
      expect(result).toEqual(['condition-1', 'condition-3'])
    })

    it('should return existing condition IDs when no form values', () => {
      const result = getSelectedConditions(undefined, joinedCondition)
      expect(result).toEqual(['condition-1', 'condition-2'])
    })

    it('should return empty array when no form values or existing condition', () => {
      const result = getSelectedConditions(undefined, undefined)
      expect(result).toEqual([])
    })

    it('should filter out non-condition references from existing condition', () => {
      const mixedCondition = {
        ...joinedCondition,
        items: [
          { id: 'ref-1', conditionId: 'condition-1' },
          {
            id: 'data-1',
            componentId: 'comp-1',
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'test'
          },
          { id: 'ref-2', conditionId: 'condition-2' }
        ]
      }

      const result = getSelectedConditions(undefined, mixedCondition)
      expect(result).toEqual(['condition-1', 'condition-2'])
    })

    it('should handle empty form values conditions array', () => {
      const formValues = { conditions: [] }
      const result = getSelectedConditions(formValues, joinedCondition)
      expect(result).toEqual([])
    })
  })

  describe('buildConditionsField', () => {
    const allConditions = [condition1, condition2, condition3]
    const selectedConditions = ['condition-1', 'condition-3']

    it('should build conditions field with correct structure', () => {
      const result = buildConditionsField(
        allConditions,
        selectedConditions,
        testDefinition,
        undefined
      )

      expect(result).toMatchObject({
        id: 'conditions',
        name: 'conditions',
        fieldset: {
          legend: {
            text: 'Joined conditions',
            isPageHeading: true,
            classes: 'govuk-fieldset__legend--m'
          }
        },
        hint: {
          text: 'Select at least two conditions to join'
        },
        classes: 'govuk-checkboxes--small'
      })
    })

    it('should mark selected conditions as checked', () => {
      const result = buildConditionsField(
        allConditions,
        selectedConditions,
        testDefinition,
        undefined
      )

      const checkboxesField = /** @type {GovukFieldWithError} */ (result)
      expect(checkboxesField.items?.[0].checked).toBe(true) // condition-1
      expect(checkboxesField.items?.[1].checked).toBe(false) // condition-2
      expect(checkboxesField.items?.[2].checked).toBe(true) // condition-3
    })

    it('should include presentation text in hints', () => {
      const result = buildConditionsField(
        allConditions,
        selectedConditions,
        testDefinition,
        undefined
      )

      const checkboxesField = /** @type {GovukFieldWithError} */ (result)
      checkboxesField.items?.forEach((/** @type {any} */ item) => {
        expect(item.hint).toBeDefined()
        expect(item.hint?.text).toBeDefined()
      })
    })

    it('should include validation errors when present', () => {
      const validation = {
        formValues: {},
        formErrors: {
          conditions: {
            text: 'Select at least two conditions',
            href: '#conditions'
          }
        }
      }

      const result = buildConditionsField(
        allConditions,
        selectedConditions,
        testDefinition,
        validation
      )

      const checkboxesField = /** @type {GovukFieldWithError} */ (result)
      expect(checkboxesField.errorMessage).toMatchObject({
        text: 'Select at least two conditions'
      })
    })

    it('should handle empty conditions array', () => {
      const result = buildConditionsField([], [], testDefinition, undefined)
      const checkboxesField = /** @type {GovukFieldWithError} */ (result)
      expect(checkboxesField.items).toHaveLength(0)
    })
  })

  describe('buildCoordinatorField', () => {
    it('should build coordinator field with form value', () => {
      const formValues = { coordinator: 'and' }

      const result = buildCoordinatorField(
        formValues,
        joinedCondition,
        undefined
      )

      expect(result).toMatchObject({
        id: 'coordinator',
        name: 'coordinator',
        fieldset: {
          legend: {
            text: 'How do you want to combine these conditions?',
            classes: 'govuk-fieldset__legend--m'
          }
        },
        classes: 'govuk-radios--inline',
        value: 'and',
        items: [
          { text: 'All conditions must be met (AND)', value: 'and' },
          { text: 'Any condition can be met (OR)', value: 'or' }
        ]
      })
    })

    it('should use existing condition value when no form value', () => {
      const result = buildCoordinatorField(
        undefined,
        joinedCondition,
        undefined
      )
      const radiosField = /** @type {GovukFieldWithError} */ (result)
      expect(radiosField.value).toBe(Coordinator.OR)
    })

    it('should have no value when neither form value nor existing condition', () => {
      const result = buildCoordinatorField(undefined, undefined, undefined)
      const radiosField = /** @type {GovukFieldWithError} */ (result)
      expect(radiosField.value).toBeUndefined()
    })

    it('should include validation errors when present', () => {
      const validation = {
        formValues: {},
        formErrors: {
          coordinator: {
            text: 'Choose how to combine conditions',
            href: '#coordinator'
          }
        }
      }

      const result = buildCoordinatorField(undefined, undefined, validation)
      const radiosField = /** @type {GovukFieldWithError} */ (result)
      expect(radiosField.errorMessage).toMatchObject({
        text: 'Choose how to combine conditions'
      })
    })
  })

  describe('buildDisplayNameField', () => {
    it('should build display name field with form value', () => {
      const formValues = { displayName: 'My custom condition' }

      const result = buildDisplayNameField(
        formValues,
        joinedCondition,
        undefined
      )

      expect(result).toMatchObject({
        id: 'displayName',
        name: 'displayName',
        label: {
          text: 'Name for joined condition',
          classes: 'govuk-label--m'
        },
        classes: 'govuk-input--width-30',
        value: 'My custom condition',
        hint: {
          text: "Condition names help you to identify conditions in your form, for example, 'Not a farmer'. Users will not see condition names."
        }
      })
    })

    it('should use existing condition value when no form value', () => {
      const result = buildDisplayNameField(
        undefined,
        joinedCondition,
        undefined
      )
      const inputField = /** @type {GovukFieldWithError} */ (result)
      expect(inputField.value).toBe('Joined condition')
    })

    it('should use empty string when neither form value nor existing condition', () => {
      const result = buildDisplayNameField(undefined, undefined, undefined)
      const inputField = /** @type {GovukFieldWithError} */ (result)
      expect(inputField.value).toBe('')
    })

    it('should include validation errors when present', () => {
      const validation = {
        formValues: {},
        formErrors: {
          displayName: {
            text: 'Enter a condition name',
            href: '#displayName'
          }
        }
      }

      const result = buildDisplayNameField(undefined, undefined, validation)
      const inputField = /** @type {GovukFieldWithError} */ (result)
      expect(inputField.errorMessage).toMatchObject({
        text: 'Enter a condition name'
      })
    })

    it('should handle empty string in form values', () => {
      const formValues = { displayName: '' }
      const result = buildDisplayNameField(
        formValues,
        joinedCondition,
        undefined
      )
      const inputField = /** @type {GovukFieldWithError} */ (result)
      expect(inputField.value).toBe('')
    })
  })

  describe('isJoinedCondition', () => {
    it('should return true for conditions with only condition references', () => {
      const condition = {
        id: 'test-joined',
        displayName: 'Test joined condition',
        coordinator: Coordinator.AND,
        items: [
          { id: 'ref-1', conditionId: 'condition-1' },
          { id: 'ref-2', conditionId: 'condition-2' },
          { id: 'ref-3', conditionId: 'condition-3' }
        ]
      }

      expect(isJoinedCondition(condition)).toBe(true)
    })

    it('should return false for conditions with component references', () => {
      const condition = {
        id: 'test-regular',
        displayName: 'Test regular condition',
        items: [
          {
            id: 'item-1',
            componentId: 'field-1',
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'test'
          }
        ]
      }

      expect(isJoinedCondition(condition)).toBe(false)
    })

    it('should return false for mixed conditions (both condition and component refs)', () => {
      const condition = {
        id: 'test-mixed',
        displayName: 'Test mixed condition',
        coordinator: Coordinator.OR,
        items: [
          { id: 'ref-1', conditionId: 'condition-1' },
          {
            id: 'item-1',
            componentId: 'field-1',
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'test'
          }
        ]
      }

      expect(isJoinedCondition(condition)).toBe(false)
    })

    it('should return false for conditions with empty items array', () => {
      const condition = {
        id: 'test-empty',
        displayName: 'Test empty condition',
        items: []
      }

      expect(isJoinedCondition(condition)).toBe(false)
    })

    it('should return true for single condition reference', () => {
      const condition = {
        id: 'test-single',
        displayName: 'Test single ref condition',
        items: [{ id: 'ref-1', conditionId: 'condition-1' }]
      }

      expect(isJoinedCondition(condition)).toBe(true)
    })
  })
})

/**
 * @typedef {GovukField & { errorMessage?: { text: string } }} GovukFieldWithError
 * @import { GovukField } from '@defra/forms-model'
 */
