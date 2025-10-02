import { ConditionType, Coordinator, OperatorName } from '@defra/forms-model'
import {
  buildMetaData,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import { testFormDefinitionWithMultipleV2Conditions } from '~/src/__stubs__/form-definition.js'
import {
  conditionCheckChangesViewModel,
  getImpactedPages
} from '~/src/models/forms/editor-v2/condition-check-changes.js'

describe('editor-v2 - condition-check-changes', () => {
  describe('getImpactedPages', () => {
    test('should return no pages', () => {
      const definition = structuredClone(
        testFormDefinitionWithMultipleV2Conditions
      )
      expect(getImpactedPages(definition, '')).toEqual([])
    })

    test('should return one page with its titles', () => {
      const definition = structuredClone(
        testFormDefinitionWithMultipleV2Conditions
      )
      definition.pages[2].condition = 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2'
      expect(
        getImpactedPages(definition, 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2')
      ).toEqual(['Page 3: Fave animal'])
    })

    test('should return multiple pages with their titles', () => {
      const definition = structuredClone(
        testFormDefinitionWithMultipleV2Conditions
      )
      definition.pages[0].condition = 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2'
      definition.pages[1].condition = 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2'
      definition.pages[2].condition = 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2'
      expect(
        getImpactedPages(definition, 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2')
      ).toEqual([
        'Page 1: What is your full name',
        'Page 2: Fave color',
        'Page 3: Fave animal'
      ])
    })
  })

  describe('conditionCheckChangesViewModel', () => {
    const metadata = buildMetaData({
      id: 'test-form-id',
      slug: 'test-form',
      title: 'Test Form'
    })

    const testComponent = buildTextFieldComponent({
      id: 'field-1',
      name: 'testField',
      title: 'Test Field'
    })

    /** @type {ConditionWrapperV2} */
    const referencedCondition1 = {
      id: 'condition-1',
      displayName: 'Referenced condition 1',
      items: [
        {
          id: 'item-ref-1',
          componentId: 'field-1',
          operator: OperatorName.Is,
          type: ConditionType.StringValue,
          value: 'value1'
        }
      ]
    }

    /** @type {ConditionWrapperV2} */
    const referencedCondition2 = {
      id: 'condition-2',
      displayName: 'Referenced condition 2',
      items: [
        {
          id: 'item-ref-2',
          componentId: 'field-1',
          operator: OperatorName.IsNot,
          type: ConditionType.StringValue,
          value: 'value2'
        }
      ]
    }

    /** @type {ConditionWrapperV2} */
    const regularCondition = {
      id: 'regular-condition',
      displayName: 'Regular condition',
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

    /** @type {ConditionWrapperV2} */
    const joinedCondition = {
      id: 'joined-condition',
      displayName: 'Joined condition',
      coordinator: Coordinator.AND,
      items: [
        { id: 'ref-1', conditionId: 'condition-1' },
        { id: 'ref-2', conditionId: 'condition-2' }
      ]
    }

    const definition = {
      ...testFormDefinitionWithMultipleV2Conditions,
      pages: [
        ...testFormDefinitionWithMultipleV2Conditions.pages.slice(0, -1), // Remove summary page
        {
          ...testFormDefinitionWithMultipleV2Conditions.pages[0],
          components: [testComponent]
        },
        ...testFormDefinitionWithMultipleV2Conditions.pages.slice(-1) // Add summary page back
      ],
      conditions: [
        ...testFormDefinitionWithMultipleV2Conditions.conditions,
        referencedCondition1,
        referencedCondition2,
        regularCondition,
        joinedCondition
      ]
    }

    /** @type {ConditionSessionState} */
    const sessionState = {
      id: 'test-condition',
      stateId: 'test-state-id',
      conditionWrapper: {
        id: 'test-condition',
        displayName: 'Updated condition name',
        items: []
      }
    }

    test('should generate correct continue editing path for regular conditions', () => {
      const result = conditionCheckChangesViewModel(
        metadata,
        definition,
        regularCondition,
        sessionState,
        'regular-condition'
      )

      expect(result.continueEditingPath).toBe(
        '/library/test-form/editor-v2/condition/regular-condition/test-state-id'
      )
    })

    test('should generate correct continue editing path for joined conditions', () => {
      const result = conditionCheckChangesViewModel(
        metadata,
        definition,
        joinedCondition,
        sessionState,
        'joined-condition'
      )

      expect(result.continueEditingPath).toBe(
        '/library/test-form/editor-v2/conditions-join/joined-condition'
      )
    })

    test('should include original and new condition details', () => {
      const result = conditionCheckChangesViewModel(
        metadata,
        definition,
        regularCondition,
        sessionState,
        'regular-condition'
      )

      expect(result.originalCondition).toMatchObject({
        name: 'Regular condition'
      })
      expect(result.originalCondition.html).toBeDefined()

      expect(result.newCondition).toMatchObject({
        name: 'Updated condition name'
      })
      expect(result.newCondition.html).toBeDefined()
    })

    test('should handle undefined session state', () => {
      const result = conditionCheckChangesViewModel(
        metadata,
        definition,
        regularCondition,
        undefined,
        'regular-condition'
      )

      expect(result.newCondition.name).toBeUndefined()
      expect(result.continueEditingPath).toBe(
        '/library/test-form/editor-v2/condition/regular-condition/undefined'
      )
    })

    test('should include impacted pages warning', () => {
      const definitionWithConditionUsed = structuredClone(definition)
      definitionWithConditionUsed.pages[1].condition = 'joined-condition'

      const result = conditionCheckChangesViewModel(
        metadata,
        definitionWithConditionUsed,
        joinedCondition,
        sessionState,
        'joined-condition'
      )

      expect(result.warningItems).toEqual(['Page 2: Fave color'])
    })

    test('should return empty warning items when condition not used', () => {
      const result = conditionCheckChangesViewModel(
        metadata,
        definition,
        joinedCondition,
        sessionState,
        'joined-condition'
      )

      expect(result.warningItems).toEqual([])
    })
  })
})

/**
 * @import { ConditionWrapperV2, ConditionSessionState } from '@defra/forms-model'
 */
