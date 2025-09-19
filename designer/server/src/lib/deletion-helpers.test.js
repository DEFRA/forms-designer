import { ComponentType, ConditionType, OperatorName } from '@defra/forms-model'

import {
  buildDefinition,
  buildQuestionPage,
  buildTextFieldComponent
} from '~/src/__stubs__/form-definition.js'
import {
  buildConditionDependencyErrorView,
  buildConditionUsageMessage,
  getConditionDependencyContext,
  performPageDeletion,
  performQuestionDeletion
} from '~/src/lib/deletion-helpers.js'
import { deletePage, deleteQuestion } from '~/src/lib/editor.js'

jest.mock('~/src/lib/editor.js')

describe('deletion helpers', () => {
  describe('buildConditionUsageMessage', () => {
    const mockComponent = buildTextFieldComponent({
      id: 'field1',
      name: 'field1',
      title: 'First Question'
    })

    /** @type {ConditionWrapperV2} */
    const mockCondition = {
      id: 'cond1',
      displayName: 'Test Condition',
      items: []
    }

    describe('question deletion', () => {
      it('should build message with named question and condition', () => {
        const message = buildConditionUsageMessage(
          'question',
          [mockComponent],
          [mockCondition]
        )
        expect(message).toBe(
          'The question \'First Question\' cannot be deleted because it is used in the condition "Test Condition". Update or delete that condition first.'
        )
      })

      it('should handle multiple conditions', () => {
        /** @type {ConditionWrapperV2[]} */
        const conditions = [
          { id: 'cond1', displayName: 'Condition A', items: [] },
          { id: 'cond2', displayName: 'Condition B', items: [] }
        ]
        const message = buildConditionUsageMessage(
          'question',
          [mockComponent],
          conditions
        )
        expect(message).toBe(
          'The question \'First Question\' cannot be deleted because it is used in the conditions "Condition A" and "Condition B". Update or delete those conditions first.'
        )
      })

      it('should use name when component has no title', () => {
        const componentWithoutTitle = buildTextFieldComponent({
          id: 'field1',
          name: 'field1',
          title: '' // Override the default title
        })
        const message = buildConditionUsageMessage(
          'question',
          [componentWithoutTitle],
          [mockCondition]
        )
        expect(message).toBe(
          'The question \'field1\' cannot be deleted because it is used in the condition "Test Condition". Update or delete that condition first.'
        )
      })

      it('should use component id when no title or name', () => {
        const componentWithIdOnly = buildTextFieldComponent({
          id: 'field1',
          name: '', // Override the default name
          title: '' // Override the default title
        })
        const message = buildConditionUsageMessage(
          'question',
          [componentWithIdOnly],
          [mockCondition]
        )
        expect(message).toBe(
          'The question \'field1\' cannot be deleted because it is used in the condition "Test Condition". Update or delete that condition first.'
        )
      })

      it('should use generic text for multiple different components', () => {
        const components = [
          buildTextFieldComponent({
            id: 'field1',
            title: 'Question 1',
            name: 'field1'
          }),
          buildTextFieldComponent({
            id: 'field2',
            title: 'Question 2',
            name: 'field2'
          })
        ]
        const message = buildConditionUsageMessage('question', components, [
          mockCondition
        ])
        expect(message).toBe(
          'This question cannot be deleted because it is used in the condition "Test Condition". Update or delete that condition first.'
        )
      })

      it('should handle condition without display name', () => {
        /** @type {ConditionWrapperV2} */
        const conditionNoName = { id: 'cond1', displayName: 'cond1', items: [] }
        const message = buildConditionUsageMessage(
          'question',
          [mockComponent],
          [conditionNoName]
        )
        expect(message).toBe(
          'The question \'First Question\' cannot be deleted because it is used in the condition "cond1". Update or delete that condition first.'
        )
      })

      it('should handle empty conditions array', () => {
        const message = buildConditionUsageMessage(
          'question',
          [mockComponent],
          []
        )
        expect(message).toBe(
          "The question 'First Question' cannot be deleted because it is used in existing conditions. Update or delete those conditions first."
        )
      })
    })

    describe('page deletion', () => {
      it('should build message for single component on page', () => {
        const message = buildConditionUsageMessage(
          'page',
          [mockComponent],
          [mockCondition]
        )
        expect(message).toBe(
          'The question \'First Question\' is used in the condition "Test Condition", so this page cannot be deleted. Update or delete that condition first.'
        )
      })

      it('should handle multiple components on page', () => {
        const components = [
          buildTextFieldComponent({
            id: 'field1',
            title: 'Question 1',
            name: 'field1'
          }),
          buildTextFieldComponent({
            id: 'field2',
            title: 'Question 2',
            name: 'field2'
          })
        ]
        const message = buildConditionUsageMessage('page', components, [
          mockCondition
        ])
        expect(message).toBe(
          "The questions 'Question 1' and 'Question 2' are used in the condition \"Test Condition\", so this page cannot be deleted. Update or delete that condition first."
        )
      })

      it('should handle three or more components', () => {
        const components = [
          buildTextFieldComponent({
            id: 'field1',
            title: 'Q1',
            name: 'field1'
          }),
          buildTextFieldComponent({
            id: 'field2',
            title: 'Q2',
            name: 'field2'
          }),
          buildTextFieldComponent({ id: 'field3', title: 'Q3', name: 'field3' })
        ]
        const message = buildConditionUsageMessage('page', components, [
          mockCondition
        ])
        expect(message).toBe(
          "The questions 'Q1', 'Q2' and 'Q3' are used in the condition \"Test Condition\", so this page cannot be deleted. Update or delete that condition first."
        )
      })

      it('should use generic text when no components provided', () => {
        const message = buildConditionUsageMessage('page', [], [mockCondition])
        expect(message).toBe(
          'Questions on this page are used in the condition "Test Condition", so this page cannot be deleted. Update or delete that condition first.'
        )
      })

      it('should handle multiple conditions', () => {
        /** @type {ConditionWrapperV2[]} */
        const conditions = [
          { id: 'cond1', displayName: 'Condition A', items: [] },
          { id: 'cond2', displayName: 'Condition B', items: [] },
          { id: 'cond3', displayName: 'Condition C', items: [] }
        ]
        const message = buildConditionUsageMessage(
          'page',
          [mockComponent],
          conditions
        )
        expect(message).toBe(
          'The question \'First Question\' is used in the conditions "Condition A", "Condition B" and "Condition C", so this page cannot be deleted. Update or delete those conditions first.'
        )
      })
    })
  })

  describe('getConditionDependencyContext', () => {
    const textComponent = buildTextFieldComponent({
      id: 'textField',
      name: 'textField',
      title: 'Text Field'
    })

    /** @type {ComponentDef} */
    const numberComponent = {
      id: 'numberField',
      name: 'numberField',
      title: 'Number Field',
      type: ComponentType.NumberField,
      options: {},
      schema: {}
    }

    /** @type {ComponentDef} */
    const guidanceComponent = {
      id: 'guidance',
      type: ComponentType.Html,
      name: 'guidance',
      title: 'Guidance',
      content: '<p>Some guidance</p>',
      options: {}
    }

    it('should identify components for deletion when deleting entire page', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [textComponent, numberComponent, guidanceComponent]
          })
        ],
        conditions: []
      })

      const context = getConditionDependencyContext(
        definition,
        'page1',
        undefined
      )

      expect(context.deletingQuestionOnly).toBe(false)
      expect(context.componentsForDeletion).toHaveLength(2)
      expect(context.componentsForDeletion).toEqual([
        textComponent,
        numberComponent
      ])
      expect(context.blockingConditions).toHaveLength(0)
      expect(context.blockingComponents).toHaveLength(0)
    })

    it('should identify single question for deletion when multiple exist', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [textComponent, numberComponent]
          })
        ],
        conditions: []
      })

      const context = getConditionDependencyContext(
        definition,
        'page1',
        'textField'
      )

      expect(context.deletingQuestionOnly).toBe(true)
      expect(context.componentsForDeletion).toHaveLength(1)
      expect(context.componentsForDeletion[0].id).toBe('textField')
    })

    it('should treat single question deletion as page deletion', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [textComponent, guidanceComponent]
          })
        ],
        conditions: []
      })

      const context = getConditionDependencyContext(
        definition,
        'page1',
        'textField'
      )

      expect(context.deletingQuestionOnly).toBe(false)
      expect(context.componentsForDeletion).toHaveLength(1)
    })

    it('should identify blocking conditions and components', () => {
      /** @type {ConditionWrapperV2} */
      const condition = {
        id: 'condition1',
        displayName: 'Test Condition',
        items: [
          {
            id: 'item1',
            componentId: 'textField',
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
            components: [textComponent, numberComponent]
          })
        ],
        conditions: [condition]
      })

      const context = getConditionDependencyContext(
        definition,
        'page1',
        undefined
      )

      expect(context.blockingConditions).toHaveLength(1)
      expect(context.blockingConditions[0].id).toBe('condition1')
      expect(context.blockingComponents).toHaveLength(1)
      expect(context.blockingComponents[0].id).toBe('textField')
    })

    it('should handle multiple conditions referencing different components', () => {
      /** @type {ConditionWrapperV2[]} */
      const conditions = [
        {
          id: 'condition1',
          displayName: 'Condition 1',
          items: [
            {
              id: 'item1',
              componentId: 'textField',
              operator: OperatorName.Is,
              type: ConditionType.StringValue,
              value: 'test'
            }
          ]
        },
        {
          id: 'condition2',
          displayName: 'Condition 2',
          items: [
            {
              id: 'item2',
              componentId: 'numberField',
              operator: OperatorName.IsMoreThan,
              type: ConditionType.NumberValue,
              value: 10
            }
          ]
        }
      ]

      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [textComponent, numberComponent]
          })
        ],
        conditions
      })

      const context = getConditionDependencyContext(
        definition,
        'page1',
        undefined
      )

      expect(context.blockingConditions).toHaveLength(2)
      expect(context.blockingComponents).toHaveLength(2)
      expect(context.blockingComponents.map((c) => c.id).sort()).toEqual([
        'numberField',
        'textField'
      ])
    })

    it('should filter undefined component ids', () => {
      const componentNoId = buildTextFieldComponent({
        name: 'noId',
        title: 'No ID'
      })

      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [componentNoId, textComponent]
          })
        ],
        conditions: []
      })

      const context = getConditionDependencyContext(
        definition,
        'page1',
        undefined
      )

      expect(context.componentsForDeletion).toHaveLength(2)
      // Should not throw when creating Set from component ids
      expect(() => context.blockingComponents).not.toThrow()
    })

    it('should handle page with no form components', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [guidanceComponent]
          })
        ],
        conditions: []
      })

      const context = getConditionDependencyContext(
        definition,
        'page1',
        undefined
      )

      expect(context.deletingQuestionOnly).toBe(false)
      expect(context.componentsForDeletion).toHaveLength(0)
      expect(context.blockingConditions).toHaveLength(0)
      expect(context.blockingComponents).toHaveLength(0)
    })

    it('should return empty blocking components when no conditions exist', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [textComponent]
          })
        ],
        conditions: []
      })

      const context = getConditionDependencyContext(
        definition,
        'page1',
        'textField'
      )

      expect(context.blockingConditions).toHaveLength(0)
      expect(context.blockingComponents).toHaveLength(0)
    })
  })

  describe('buildConditionDependencyErrorView', () => {
    const mockComponent = buildTextFieldComponent({
      id: 'field1',
      name: 'field1',
      title: 'Test Component'
    })

    const mockCondition = {
      id: 'cond1',
      displayName: 'Test Condition',
      items: []
    }

    it('should build error view with message and components', () => {
      const dependencyContext = {
        deletingQuestionOnly: true,
        blockingComponents: [mockComponent],
        componentsForDeletion: [mockComponent],
        blockingConditions: [mockCondition]
      }

      const result = buildConditionDependencyErrorView(dependencyContext)

      expect(result.message).toBe(
        'The question \'Test Component\' cannot be deleted because it is used in the condition "Test Condition". Update or delete that condition first.'
      )
      expect(result.componentsForMessage).toEqual([mockComponent])
    })

    it('should use components for deletion when no blocking components', () => {
      const dependencyContext = {
        deletingQuestionOnly: false,
        blockingComponents: [],
        componentsForDeletion: [mockComponent],
        blockingConditions: [mockCondition]
      }

      const result = buildConditionDependencyErrorView(dependencyContext)

      expect(result.componentsForMessage).toEqual([mockComponent])
    })
  })

  describe('performQuestionDeletion', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should call deleteQuestion with correct parameters', async () => {
      const definition = buildDefinition()

      await performQuestionDeletion(
        'formId',
        'token',
        'pageId',
        'questionId',
        definition
      )

      expect(deleteQuestion).toHaveBeenCalledWith(
        'formId',
        'token',
        'pageId',
        'questionId',
        definition
      )
      expect(deletePage).not.toHaveBeenCalled()
    })
  })

  describe('performPageDeletion', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should call deletePage with correct parameters', async () => {
      const definition = buildDefinition()

      await performPageDeletion('formId', 'token', 'pageId', definition)

      expect(deletePage).toHaveBeenCalledWith(
        'formId',
        'token',
        'pageId',
        definition
      )
      expect(deleteQuestion).not.toHaveBeenCalled()
    })
  })
})

/**
 * @import { ComponentDef, ConditionWrapperV2 } from '@defra/forms-model'
 */
