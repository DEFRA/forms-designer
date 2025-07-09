import {
  ConditionType,
  Coordinator,
  Engine,
  OperatorName
} from '@defra/forms-model'
import {
  buildDefinition,
  buildMetaData,
  buildQuestionPage,
  buildSummaryPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import { testFormDefinitionWithMultipleV2Conditions } from '~/src/__stubs__/form-definition.js'
import {
  buildConditionsTable,
  conditionsViewModel
} from '~/src/models/forms/editor-v2/conditions.js'

describe('editor-v2 - conditions model', () => {
  const metadata = buildMetaData({
    slug: 'test-form',
    title: 'Test Form'
  })

  const componentId = 'test-field'
  const testComponent = buildTextFieldComponent({
    id: componentId,
    name: 'testField',
    title: 'Test Field'
  })

  const regularCondition = {
    id: 'regular-condition',
    displayName: 'Regular condition',
    items: [
      {
        id: 'regular-item-1',
        componentId,
        operator: OperatorName.Is,
        type: ConditionType.StringValue,
        value: 'test-value'
      }
    ]
  }

  const multiItemRegularCondition = {
    id: 'multi-regular-condition',
    displayName: 'Multi-item regular condition',
    coordinator: Coordinator.AND,
    items: [
      {
        id: 'regular-item-1',
        componentId,
        operator: OperatorName.Is,
        type: ConditionType.StringValue,
        value: 'value1'
      },
      {
        id: 'regular-item-2',
        componentId,
        operator: OperatorName.IsNot,
        type: ConditionType.StringValue,
        value: 'value2'
      }
    ]
  }

  const joinedCondition = {
    id: 'joined-condition',
    displayName: 'Joined condition',
    coordinator: Coordinator.OR,
    items: [
      {
        id: 'joined-item-1',
        conditionId: 'regular-condition'
      },
      {
        id: 'joined-item-2',
        conditionId: 'multi-regular-condition'
      }
    ]
  }

  const mixedCondition = {
    id: 'mixed-condition',
    displayName: 'Mixed condition',
    coordinator: Coordinator.AND,
    items: [
      {
        id: 'mixed-item-1',
        componentId,
        operator: OperatorName.Is,
        type: ConditionType.StringValue,
        value: 'test'
      },
      {
        id: 'mixed-item-2',
        conditionId: 'regular-condition'
      }
    ]
  }

  const emptyCondition = {
    id: 'empty-condition',
    displayName: 'Empty condition',
    items: []
  }

  describe('buildConditionsTable', () => {
    it('should return empty table when no conditions exist', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'page1', components: [testComponent] })
        ],
        conditions: [],
        engine: Engine.V2
      })

      const result = buildConditionsTable(metadata.slug, definition)

      expect(result).toEqual({
        firstCellIsHeader: false,
        classes: 'app-conditions-table',
        head: [{ text: 'Condition' }, { text: 'Used in' }, { text: 'Actions' }],
        rows: []
      })
    })

    it('should sort conditions alphabetically by displayName', () => {
      const conditionZ = {
        id: 'z-condition',
        displayName: 'Z condition',
        items: [
          {
            id: 'z-item',
            componentId,
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'z'
          }
        ]
      }

      const conditionA = {
        id: 'a-condition',
        displayName: 'A condition',
        items: [
          {
            id: 'a-item',
            componentId,
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'a'
          }
        ]
      }

      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'page1', components: [testComponent] })
        ],
        conditions: [conditionZ, conditionA],
        engine: Engine.V2
      })

      const result = buildConditionsTable(metadata.slug, definition)

      expect(result.rows).toHaveLength(2)
      expect(result.rows[0][0].html).toContain('A condition')
      expect(result.rows[1][0].html).toContain('Z condition')
    })

    it('should route regular conditions to condition editor', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'page1', components: [testComponent] })
        ],
        conditions: [regularCondition],
        engine: Engine.V2
      })

      const result = buildConditionsTable(metadata.slug, definition)

      expect(result.rows).toHaveLength(1)
      const actionsHtml = result.rows[0][2].html
      expect(actionsHtml).toContain(
        'href="/library/test-form/editor-v2/condition/regular-condition"'
      )
      expect(actionsHtml).not.toContain('conditions-join')
    })

    it('should route multi-item regular conditions to condition editor', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'page1', components: [testComponent] })
        ],
        conditions: [multiItemRegularCondition],
        engine: Engine.V2
      })

      const result = buildConditionsTable(metadata.slug, definition)

      expect(result.rows).toHaveLength(1)
      const actionsHtml = result.rows[0][2].html
      expect(actionsHtml).toContain(
        'href="/library/test-form/editor-v2/condition/multi-regular-condition"'
      )
      expect(actionsHtml).not.toContain('conditions-join')
    })

    it('should route purely joined conditions to conditions-join editor', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'page1', components: [testComponent] })
        ],
        conditions: [
          regularCondition,
          multiItemRegularCondition,
          joinedCondition
        ],
        engine: Engine.V2
      })

      const result = buildConditionsTable(metadata.slug, definition)

      expect(result.rows).toHaveLength(3)

      const joinedRow = result.rows.find((row) =>
        row[0]?.html?.includes('Joined condition')
      )

      expect(joinedRow).toBeDefined()
      expect(joinedRow?.[2]?.html).toContain(
        'href="/library/test-form/editor-v2/conditions-join/joined-condition"'
      )
    })

    it('should route mixed conditions (component + condition references) to condition editor', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'page1', components: [testComponent] })
        ],
        conditions: [regularCondition, mixedCondition],
        engine: Engine.V2
      })

      const result = buildConditionsTable(metadata.slug, definition)

      expect(result.rows).toHaveLength(2)

      const mixedRow = result.rows.find((row) =>
        row[0]?.html?.includes('Mixed condition')
      )

      expect(mixedRow).toBeDefined()
      expect(mixedRow?.[2]?.html).toContain(
        'href="/library/test-form/editor-v2/condition/mixed-condition"'
      )
      expect(mixedRow?.[2]?.html).not.toContain('conditions-join')
    })

    it('should handle condition with empty items array', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'page1', components: [testComponent] })
        ],
        conditions: [emptyCondition],
        engine: Engine.V2
      })

      const result = buildConditionsTable(metadata.slug, definition)

      expect(result.rows).toHaveLength(1)
      const actionsHtml = result.rows[0][2].html
      expect(actionsHtml).toContain(
        'href="/library/test-form/editor-v2/condition/empty-condition"'
      )
      expect(actionsHtml).not.toContain('conditions-join')
    })

    it('should show pages where condition is used', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            title: 'Page One',
            condition: 'regular-condition',
            components: [testComponent]
          }),
          buildQuestionPage({
            id: 'page2',
            title: 'Page Two',
            condition: 'regular-condition',
            components: [testComponent]
          }),
          buildQuestionPage({
            id: 'page3',
            title: 'Page Three',
            components: [testComponent]
          }),
          buildSummaryPage()
        ],
        conditions: [regularCondition],
        engine: Engine.V2
      })

      const result = buildConditionsTable(metadata.slug, definition)

      expect(result.rows).toHaveLength(1)
      const usageText = result.rows[0][1].text
      expect(usageText).toBe('Page 1, Page 2')
    })

    it('should show empty usage when condition is not used on any pages', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'page1', components: [testComponent] }),
          buildSummaryPage()
        ],
        conditions: [regularCondition],
        engine: Engine.V2
      })

      const result = buildConditionsTable(metadata.slug, definition)

      expect(result.rows).toHaveLength(1)
      const usageText = result.rows[0][1].text
      expect(usageText).toBe('')
    })

    it('should include condition display name and presentation HTML', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'page1', components: [testComponent] })
        ],
        conditions: [regularCondition],
        engine: Engine.V2
      })

      const result = buildConditionsTable(metadata.slug, definition)

      expect(result.rows).toHaveLength(1)
      const conditionHtml = result.rows[0][0].html
      expect(conditionHtml).toContain('Regular condition')
      expect(conditionHtml).toContain('govuk-!-font-weight-bold')
    })

    it('should include edit and delete links for all conditions', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'page1', components: [testComponent] })
        ],
        conditions: [
          regularCondition,
          multiItemRegularCondition,
          joinedCondition
        ],
        engine: Engine.V2
      })

      const result = buildConditionsTable(metadata.slug, definition)

      expect(result.rows).toHaveLength(3)

      result.rows.forEach((row) => {
        const actionsHtml = row[2].html
        expect(actionsHtml).toContain('>Edit</a>')
        expect(actionsHtml).toContain('>Delete</a>')
        expect(actionsHtml).toContain('app-table-actions')
        expect(actionsHtml).toContain('app-vertical-divider')
      })
    })

    it('should always route delete links to condition editor regardless of type', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'page1', components: [testComponent] })
        ],
        conditions: [
          regularCondition,
          multiItemRegularCondition,
          joinedCondition
        ],
        engine: Engine.V2
      })

      const result = buildConditionsTable(metadata.slug, definition)

      expect(result.rows).toHaveLength(3)

      result.rows.forEach((row) => {
        const actionsHtml = row[2].html
        expect(actionsHtml).toMatch(
          /href="\/library\/test-form\/editor-v2\/condition\/[^"]+\/delete"/
        )
      })
    })

    it('should correctly route joined conditions vs regular conditions based on item types', () => {
      const result = buildConditionsTable(
        metadata.slug,
        testFormDefinitionWithMultipleV2Conditions
      )

      expect(result.rows).toHaveLength(3)

      // Check that conditions are sorted alphabetically
      expect(result.rows[0][0].html).toContain('isBobAndFaveColourRedV2')
      expect(result.rows[1][0].html).toContain('isBobV2')
      expect(result.rows[2][0].html).toContain('isFaveColourRedV2')

      // Check that the joined condition routes to conditions-join editor
      expect(result.rows[0][2].html).toContain('conditions-join')

      // Check that regular conditions route to condition editor
      expect(result.rows[1][2].html).toContain(
        'condition/d5e9f931-e151-4dd6-a2b9-68a03f3537e2'
      )
      expect(result.rows[2][2].html).toContain(
        'condition/4a82930a-b8f5-498c-adae-6158bb2aeeb5'
      )
    })
  })

  describe('conditionsViewModel', () => {
    it('should return complete view model with required fields', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'page1', components: [testComponent] })
        ],
        conditions: [regularCondition],
        engine: Engine.V2
      })

      const result = conditionsViewModel(metadata, definition)

      expect(result).toMatchObject({
        formSlug: 'test-form',
        cardTitle: 'All conditions',
        pageCaption: { text: 'Test Form' }
      })
      expect(result.summaryTable).toBeDefined()
      expect(result.navigation).toBeDefined()
      expect(result.previewBaseUrl).toBeDefined()
    })

    it('should include error list when validation errors exist', () => {
      const definition = buildDefinition({
        conditions: [],
        engine: Engine.V2
      })

      const validation = {
        formErrors: {
          testField: {
            text: 'Test error',
            href: '#testField'
          }
        },
        formValues: {}
      }

      const result = conditionsViewModel(metadata, definition, validation)

      expect(result.errorList).toBeDefined()
      expect(result.errorList).toHaveLength(1)
    })

    it('should include notification when provided', () => {
      const definition = buildDefinition({
        conditions: [],
        engine: Engine.V2
      })

      const notification = ['Condition saved successfully']

      const result = conditionsViewModel(
        metadata,
        definition,
        undefined,
        notification
      )

      expect(result.notification).toEqual(notification)
    })

    it('should handle undefined validation and notification', () => {
      const definition = buildDefinition({
        conditions: [],
        engine: Engine.V2
      })

      const result = conditionsViewModel(metadata, definition)

      expect(result.errorList).toEqual([])
      expect(result.notification).toBeUndefined()
    })

    it('should pass conditions to buildConditionsTable', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'page1', components: [testComponent] })
        ],
        conditions: [
          regularCondition,
          multiItemRegularCondition,
          joinedCondition
        ],
        engine: Engine.V2
      })

      const result = conditionsViewModel(metadata, definition)

      expect(result.summaryTable.rows).toHaveLength(3)
    })

    it('should generate view model with multiple conditions of different types', () => {
      const result = conditionsViewModel(
        metadata,
        testFormDefinitionWithMultipleV2Conditions
      )

      expect(result.summaryTable.rows).toHaveLength(3)
      expect(result.formSlug).toBe('test-form')
      expect(result.cardTitle).toBe('All conditions')
    })
  })
})

/**
 * @import { ConditionDataV2, ConditionRefDataV2, ConditionWrapperV2 } from '@defra/forms-model'
 */
