import { ConditionType, OperatorName } from '@defra/forms-model'
import {
  buildDefinition,
  buildQuestionPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import { findConditionReferences } from '~/src/lib/condition-references.js'

describe('condition-references', () => {
  const componentId = 'farm-type-field'
  const conditionId = 'cattle-farm-condition'
  const referencingConditionId = 'joined-condition'

  const testComponent = buildTextFieldComponent({
    id: componentId,
    name: 'farmType',
    title: 'What type of farming do you do?'
  })

  const baseCondition = {
    id: conditionId,
    displayName: 'Show if cattle farming',
    items: [
      {
        id: 'cattle-farm-check',
        componentId,
        operator: OperatorName.Is,
        type: ConditionType.StringValue,
        value: 'cattle'
      }
    ]
  }

  const referencingCondition = {
    id: referencingConditionId,
    displayName: 'Joined condition',
    items: [
      {
        id: 'joined-item',
        conditionId,
        operator: OperatorName.Is,
        type: ConditionType.StringValue,
        value: true
      }
    ]
  }

  describe('findConditionReferences', () => {
    it('should return empty arrays when condition has no references', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [testComponent]
          })
        ],
        conditions: [baseCondition]
      })

      const result = findConditionReferences(definition, conditionId)

      expect(result.pages).toHaveLength(0)
      expect(result.conditions).toHaveLength(0)
    })

    it('should find pages that reference the condition', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            title: 'Farm Details',
            components: [testComponent],
            condition: conditionId
          })
        ],
        conditions: [baseCondition]
      })

      const result = findConditionReferences(definition, conditionId)

      expect(result.pages).toHaveLength(1)
      expect(result.pages[0]).toEqual({
        pageId: 'page1',
        pageNumber: 1,
        pageTitle: 'Farm Details'
      })
      expect(result.conditions).toHaveLength(0)
    })

    it('should find multiple pages that reference the condition', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            title: 'Farm Details',
            components: [testComponent],
            condition: conditionId
          }),
          buildQuestionPage({
            id: 'page2',
            title: 'Livestock Information',
            components: [testComponent],
            condition: conditionId
          }),
          buildQuestionPage({
            id: 'page3',
            title: 'Other Page',
            components: [testComponent]
          })
        ],
        conditions: [baseCondition]
      })

      const result = findConditionReferences(definition, conditionId)

      expect(result.pages).toHaveLength(2)
      expect(result.pages[0]).toEqual({
        pageId: 'page1',
        pageNumber: 1,
        pageTitle: 'Farm Details'
      })
      expect(result.pages[1]).toEqual({
        pageId: 'page2',
        pageNumber: 2,
        pageTitle: 'Livestock Information'
      })
      expect(result.conditions).toHaveLength(0)
    })

    it('should handle pages without titles', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [testComponent],
            condition: conditionId
          })
        ],
        conditions: [baseCondition]
      })

      const result = findConditionReferences(definition, conditionId)

      expect(result.pages).toHaveLength(1)
      expect(result.pages[0]).toEqual({
        pageId: 'page1',
        pageNumber: 1,
        pageTitle: 'Page One'
      })
    })

    it('should handle pages without IDs', () => {
      const definition = buildDefinition({
        pages: [
          {
            ...buildQuestionPage({
              components: [testComponent],
              condition: conditionId
            }),
            id: undefined
          }
        ],
        conditions: [baseCondition]
      })

      const result = findConditionReferences(definition, conditionId)

      expect(result.pages).toHaveLength(1)
      expect(result.pages[0]).toEqual({
        pageId: '',
        pageNumber: 1,
        pageTitle: 'Page One'
      })
    })

    it('should find conditions that reference the condition', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [testComponent]
          })
        ],
        conditions: [baseCondition, referencingCondition]
      })

      const result = findConditionReferences(definition, conditionId)

      expect(result.pages).toHaveLength(0)
      expect(result.conditions).toHaveLength(1)
      expect(result.conditions[0]).toEqual({
        conditionId: referencingConditionId,
        conditionName: 'Joined condition'
      })
    })

    it('should find multiple conditions that reference the condition', () => {
      const secondReferencingCondition = {
        id: 'second-joined-condition',
        displayName: 'Another joined condition',
        items: [
          {
            id: 'second-joined-item',
            conditionId,
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: true
          }
        ]
      }

      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [testComponent]
          })
        ],
        conditions: [
          baseCondition,
          referencingCondition,
          secondReferencingCondition
        ]
      })

      const result = findConditionReferences(definition, conditionId)

      expect(result.pages).toHaveLength(0)
      expect(result.conditions).toHaveLength(2)
      expect(result.conditions[0]).toEqual({
        conditionId: referencingConditionId,
        conditionName: 'Joined condition'
      })
      expect(result.conditions[1]).toEqual({
        conditionId: 'second-joined-condition',
        conditionName: 'Another joined condition'
      })
    })

    it('should find both page and condition references', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            title: 'Farm Details',
            components: [testComponent],
            condition: conditionId
          }),
          buildQuestionPage({
            id: 'page2',
            title: 'Other Page',
            components: [testComponent]
          })
        ],
        conditions: [baseCondition, referencingCondition]
      })

      const result = findConditionReferences(definition, conditionId)

      expect(result.pages).toHaveLength(1)
      expect(result.pages[0]).toEqual({
        pageId: 'page1',
        pageNumber: 1,
        pageTitle: 'Farm Details'
      })
      expect(result.conditions).toHaveLength(1)
      expect(result.conditions[0]).toEqual({
        conditionId: referencingConditionId,
        conditionName: 'Joined condition'
      })
    })

    it('should handle conditions with multiple items', () => {
      const multiItemCondition = {
        id: 'multi-item-condition',
        displayName: 'Multi-item condition',
        items: [
          {
            id: 'item1',
            componentId,
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'test'
          },
          {
            id: 'item2',
            conditionId,
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: true
          }
        ]
      }

      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [testComponent]
          })
        ],
        conditions: [baseCondition, multiItemCondition]
      })

      const result = findConditionReferences(definition, conditionId)

      expect(result.pages).toHaveLength(0)
      expect(result.conditions).toHaveLength(1)
      expect(result.conditions[0]).toEqual({
        conditionId: 'multi-item-condition',
        conditionName: 'Multi-item condition'
      })
    })

    it('should not find conditions that reference different conditions', () => {
      const nonReferencingCondition = {
        id: 'non-referencing-condition',
        displayName: 'Non-referencing condition',
        items: [
          {
            id: 'non-ref-item',
            conditionId: 'different-condition-id',
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: true
          }
        ]
      }

      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [testComponent]
          })
        ],
        conditions: [baseCondition, nonReferencingCondition]
      })

      const result = findConditionReferences(definition, conditionId)

      expect(result.pages).toHaveLength(0)
      expect(result.conditions).toHaveLength(0)
    })

    it('should handle empty definition', () => {
      const definition = buildDefinition({
        pages: [],
        conditions: []
      })

      const result = findConditionReferences(definition, conditionId)

      expect(result.pages).toHaveLength(0)
      expect(result.conditions).toHaveLength(0)
    })

    it('should handle condition items without conditionId property', () => {
      const conditionWithoutRef = {
        id: 'condition-without-ref',
        displayName: 'Condition without ref',
        items: [
          {
            id: 'item-without-ref',
            componentId,
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'test'
          }
        ]
      }

      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [testComponent]
          })
        ],
        conditions: [baseCondition, conditionWithoutRef]
      })

      const result = findConditionReferences(definition, conditionId)

      expect(result.pages).toHaveLength(0)
      expect(result.conditions).toHaveLength(0)
    })
  })
})
