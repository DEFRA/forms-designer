import { ConditionType, OperatorName } from '@defra/forms-model'
import {
  buildDefinition,
  buildMetaData,
  buildPaymentComponent,
  buildQuestionPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import {
  CONDITION_REFERENCE_MESSAGE,
  PAYMENT_AND_CONDITIONAL_REFERENCE_MESSAGE,
  PAYMENT_REFERENCE_MESSAGE,
  deleteConditionConfirmationPageViewModel
} from '~/src/models/forms/editor-v2/condition-delete.js'

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

      expect(result.pageHeading).toEqual({
        text: 'Delete condition: Show if cattle farming',
        size: 'large'
      })
      expect(result.pageCaption).toEqual({ text: 'Test form' })
      expect(result.pageTitle).toBe(
        'Delete condition: Show if cattle farming - Test form'
      )
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

      expect(result.pageHeading).toEqual({
        text: 'Delete condition: Show if cattle farming',
        size: 'large'
      })
      expect(result.bodyWarning).not.toBeNull()
      expect(result.bodyWarning?.html).toContain(
        'Deleting this condition will affect:'
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

    it('refuses deletion when a PaymentField uses the condition', () => {
      const paymentComponent = buildPaymentComponent({
        id: 'pf-1',
        options: {
          amount: 0,
          description: 'Fee',
          conditionalAmounts: [{ amount: 5, condition: conditionId }]
        }
      })
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            components: [paymentComponent]
          })
        ],
        conditions: [mockConditionV2]
      })

      const result = deleteConditionConfirmationPageViewModel(
        metadata,
        definition,
        conditionId
      )

      expect(result.bodyHeadingText).toBe('You cannot delete this condition')
      expect(result.errorList).toEqual([{ text: PAYMENT_REFERENCE_MESSAGE }])
      expect(result.bodyWarning?.html).toContain(
        'This condition is currently used by:'
      )
      expect(result.bodyWarning?.html).toContain(
        '<li>Conditional payment amount on page 1</li>'
      )
      expect(result.buttons).toEqual([
        {
          href: '/library/test-form/editor-v2/conditions',
          text: 'Back to conditions',
          classes: 'govuk-button--secondary'
        }
      ])
    })

    it('refuses deletion when another condition references it', () => {
      const referencingCondition = {
        id: 'joined-condition',
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

      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2, referencingCondition]
      })

      const result = deleteConditionConfirmationPageViewModel(
        metadata,
        definition,
        conditionId
      )

      expect(result.errorList).toEqual([{ text: CONDITION_REFERENCE_MESSAGE }])
      expect(result.bodyWarning?.html).toContain(
        '<li>Condition: Joined condition</li>'
      )
      expect(result.buttons).toHaveLength(1)
      expect(result.buttons[0].text).toBe('Back to conditions')
    })

    it('names both blockers when a payment and a condition reference it', () => {
      const paymentComponent = buildPaymentComponent({
        id: 'pf-1',
        options: {
          amount: 0,
          description: 'Fee',
          conditionalAmounts: [{ amount: 5, condition: conditionId }]
        }
      })
      const referencingCondition = {
        id: 'joined-condition',
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

      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'page1',
            components: [testComponent],
            condition: conditionId
          }),
          buildQuestionPage({
            id: 'page2',
            components: [paymentComponent]
          })
        ],
        conditions: [mockConditionV2, referencingCondition]
      })

      const result = deleteConditionConfirmationPageViewModel(
        metadata,
        definition,
        conditionId
      )

      expect(result.errorList).toEqual([
        { text: PAYMENT_AND_CONDITIONAL_REFERENCE_MESSAGE }
      ])
      expect(result.bodyWarning?.html).toContain(
        '<li>Conditional payment amount on page 2</li>'
      )
      expect(result.bodyWarning?.html).toContain(
        '<li>Condition: Joined condition</li>'
      )
      // The pages the condition controls are irrelevant while it cannot be deleted
      expect(result.bodyWarning?.html).not.toContain('<li>Page 1</li>')
      expect(result.buttons).toHaveLength(1)
    })

    it('refuses deletion when given a reason from forms-manager', () => {
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
        conditionId,
        CONDITION_REFERENCE_MESSAGE
      )

      expect(result.errorList).toEqual([{ text: CONDITION_REFERENCE_MESSAGE }])
      // Nothing in this definition references it, so there is nothing to list
      expect(result.bodyWarning).toBeNull()
      expect(result.buttons).toHaveLength(1)
    })

    it('lists the email actions that use the condition', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2],
        outputs: [
          {
            emailAddress: 'unconditional@example.com',
            audience: 'human',
            version: '2'
          },
          {
            emailAddress: 'cattle@example.com',
            audience: 'human',
            version: '2',
            condition: conditionId
          },
          {
            emailAddress: 'cattle-data@example.com',
            audience: 'machine',
            version: '1',
            condition: conditionId
          }
        ]
      })

      const result = deleteConditionConfirmationPageViewModel(
        metadata,
        definition,
        conditionId
      )

      expect(result.bodyWarning).not.toBeNull()
      expect(result.bodyWarning?.html).toContain(
        'Deleting this condition will affect:'
      )
      expect(result.bodyWarning?.html).toContain(
        '<li>Emails sent to cattle@example.com (Human-readable) - this output will be deleted</li>'
      )
      expect(result.bodyWarning?.html).toContain(
        '<li>Emails sent to cattle-data@example.com (Machine-readable - version 1) - this output will be deleted</li>'
      )
      expect(result.bodyWarning?.html).not.toContain(
        'unconditional@example.com'
      )
      // No pages use the condition, so only the email actions are listed
      expect(result.bodyWarning?.html).not.toContain('<li>Page')
    })

    it('lists both affected pages and email actions', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            components: [testComponent],
            condition: conditionId
          })
        ],
        conditions: [mockConditionV2],
        outputs: [
          {
            emailAddress: 'cattle@example.com',
            audience: 'human',
            version: '2',
            condition: conditionId
          }
        ]
      })

      const result = deleteConditionConfirmationPageViewModel(
        metadata,
        definition,
        conditionId
      )

      // Pages and email actions share the one list, pages first
      expect(result.bodyWarning?.html).toContain(
        `Deleting this condition will affect:<ul class="govuk-list govuk-list--bullet">
        <li>Page 1</li><li>Emails sent to cattle@example.com (Human-readable) - this output will be deleted</li>
      </ul>`
      )
    })

    it('does not warn about email actions that use another condition', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2],
        outputs: [
          {
            emailAddress: 'other@example.com',
            audience: 'human',
            version: '2',
            condition: 'another-condition'
          }
        ]
      })

      const result = deleteConditionConfirmationPageViewModel(
        metadata,
        definition,
        conditionId
      )

      expect(result.bodyWarning).toBeNull()
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

      expect(result.pageHeading).toEqual({
        text: 'Delete condition: Custom condition name',
        size: 'large'
      })
    })
  })
})
