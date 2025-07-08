import { ConditionType, OperatorName } from '@defra/forms-model'
import {
  buildDefinition,
  buildMetaData,
  buildQuestionPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import { deleteConditionConfirmationPageViewModel } from '~/src/models/forms/editor-v2/condition-delete.js'

describe('editor-v2 - condition-delete model', () => {
  const componentId = 'farm-type-field'
  const pageId = 'farm-details-page'
  const conditionId = 'cattle-farm-condition'

  const testComponent = buildTextFieldComponent({
    id: componentId,
    name: 'farmType',
    title: 'What type of farming do you do?'
  })

  const metadata = buildMetaData({
    title: 'Test form',
    slug: 'test-form'
  })

  const mockConditionV2 = {
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

  describe('deleteConditionConfirmationPageViewModel', () => {
    it('should return correct view model for condition with no references', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2]
      })

      const result = deleteConditionConfirmationPageViewModel(
        metadata,
        definition,
        conditionId
      )

      expect(result.pageTitle).toBe(
        'Are you sure you want to delete this condition? - Test form'
      )
      expect(result.pageHeading).toEqual({
        text: 'Are you sure you want to delete this condition?',
        size: 'large'
      })
      expect(result.bodyCaptionText).toBe('Condition: Show if cattle farming')
      expect(result.bodyHeadingText).toBe(
        'Are you sure you want to delete this condition?'
      )
      expect(result.bodyWarning).toBeNull()
      expect(result.buttons).toHaveLength(2)
      expect(result.buttons[0].text).toBe('Delete condition')
      expect(result.buttons[0].classes).toBe('govuk-button--warning')
      expect(result.buttons[1].text).toBe('Cancel')
      expect(result.buttons[1].classes).toBe('govuk-button--secondary')
      expect(result.buttons[1].href).toBe(
        '/library/test-form/editor-v2/conditions'
      )
    })

    it('should return correct view model for condition with page references', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            components: [testComponent],
            condition: conditionId
          })
        ],
        conditions: [mockConditionV2]
      })

      const result = deleteConditionConfirmationPageViewModel(
        metadata,
        definition,
        conditionId
      )

      expect(result.pageTitle).toBe(
        'Are you sure you want to delete this condition? - Test form'
      )
      expect(result.bodyWarning).not.toBeNull()
      expect(result.bodyWarning?.html).toContain(
        'Deleting this condition will affect the following pages:'
      )
      expect(result.bodyWarning?.html).toContain('<li>Page 1</li>')
    })

    it('should return correct view model for condition with multiple page references', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [testComponent],
            condition: conditionId
          }),
          buildQuestionPage({
            id: 'page2',
            components: [testComponent],
            condition: conditionId
          })
        ],
        conditions: [mockConditionV2]
      })

      const result = deleteConditionConfirmationPageViewModel(
        metadata,
        definition,
        conditionId
      )

      expect(result.bodyWarning).not.toBeNull()
      expect(result.bodyWarning?.html).toContain('<li>Page 1</li>')
      expect(result.bodyWarning?.html).toContain('<li>Page 2</li>')
    })

    it('should handle condition with different display name', () => {
      const customCondition = {
        id: 'custom-condition',
        displayName: 'Custom condition name',
        items: [
          {
            id: 'custom-check',
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
            id: pageId,
            components: [testComponent]
          })
        ],
        conditions: [customCondition]
      })

      const result = deleteConditionConfirmationPageViewModel(
        metadata,
        definition,
        'custom-condition'
      )

      expect(result.bodyCaptionText).toBe('Condition: Custom condition name')
    })
  })
})
