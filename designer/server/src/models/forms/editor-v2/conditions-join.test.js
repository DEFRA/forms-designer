import {
  ConditionType,
  Coordinator,
  Engine,
  FormStatus,
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
import { conditionsJoinViewModel } from '~/src/models/forms/editor-v2/conditions-join.js'

describe('editor-v2 - conditions-join model', () => {
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

  const testDefinition = buildDefinition({
    pages: [
      buildQuestionPage({ id: 'page1', components: [testComponent] }),
      buildSummaryPage()
    ],
    conditions: [condition1, condition2, condition3],
    engine: Engine.V2
  })

  const existingJoinedCondition = {
    id: 'existing-joined',
    displayName: 'Existing joined condition',
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

  describe('conditionsJoinViewModel', () => {
    it('should return complete view model for new condition', () => {
      const result = conditionsJoinViewModel(metadata, testDefinition, 'new')

      expect(result).toMatchObject({
        formSlug: 'test-form',
        cardTitle: 'Create joined condition',
        pageCaption: { text: 'Test Form' },
        conditionId: 'new'
      })
      expect(result.navigation).toBeDefined()
      expect(result.previewBaseUrl).toBeDefined()
      expect(result.fields).toBeDefined()
      expect(result.backLink).toEqual({
        href: '/library/test-form/editor-v2/conditions',
        text: 'Back to conditions'
      })
    })

    it('should return complete view model for existing condition', () => {
      const result = conditionsJoinViewModel(
        metadata,
        testDefinition,
        'existing-joined',
        existingJoinedCondition
      )

      expect(result).toMatchObject({
        formSlug: 'test-form',
        cardTitle: 'Edit joined condition',
        pageCaption: { text: 'Test Form' },
        conditionId: 'existing-joined'
      })
      expect(result.existingCondition).toBe(existingJoinedCondition)
    })

    it('should generate conditions field correctly', () => {
      const result = conditionsJoinViewModel(metadata, testDefinition, 'new')

      expect(result.fields.conditions).toBeDefined()
      const conditionsField = /** @type {GovukField} */ (
        result.fields.conditions
      )
      expect(conditionsField.id).toBe('conditions')
      expect(conditionsField.name).toBe('conditions')
    })

    it('should exclude current condition from available conditions when editing', () => {
      const definitionWithJoined = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'page1', components: [testComponent] }),
          buildSummaryPage()
        ],
        conditions: [
          condition1,
          condition2,
          condition3,
          existingJoinedCondition
        ],
        engine: Engine.V2
      })

      const result = conditionsJoinViewModel(
        metadata,
        definitionWithJoined,
        'existing-joined',
        existingJoinedCondition
      )

      const conditionsField = /** @type {GovukField} */ (
        result.fields.conditions
      )
      expect(conditionsField.items).toHaveLength(3)
      expect(
        conditionsField.items?.map((/** @type {any} */ item) => item.value)
      ).not.toContain('existing-joined')
    })

    it('should mark selected conditions as checked when editing existing condition', () => {
      const result = conditionsJoinViewModel(
        metadata,
        testDefinition,
        'existing-joined',
        existingJoinedCondition
      )

      const conditionsField = /** @type {GovukField} */ (
        result.fields.conditions
      )
      expect(conditionsField.items?.[0].checked).toBe(true) // condition-1
      expect(conditionsField.items?.[1].checked).toBe(true) // condition-2
      expect(conditionsField.items?.[2].checked).toBe(false) // condition-3
    })

    it('should mark selected conditions as checked from form values', () => {
      const validation = {
        formValues: {
          conditions: ['condition-1', 'condition-3']
        },
        formErrors: {}
      }

      const result = conditionsJoinViewModel(
        metadata,
        testDefinition,
        'new',
        undefined,
        validation
      )

      const conditionsField = /** @type {GovukField} */ (
        result.fields.conditions
      )
      expect(conditionsField.items?.[0].checked).toBe(true) // condition-1
      expect(conditionsField.items?.[1].checked).toBe(false) // condition-2
      expect(conditionsField.items?.[2].checked).toBe(true) // condition-3
    })

    it('should generate coordinator field with correct options', () => {
      const result = conditionsJoinViewModel(metadata, testDefinition, 'new')

      expect(result.fields.coordinator).toMatchObject({
        id: 'coordinator',
        name: 'coordinator',
        fieldset: {
          legend: {
            text: 'How do you want to combine these conditions?',
            classes: 'govuk-fieldset__legend--m'
          }
        },
        classes: 'govuk-radios--inline',
        items: [
          { text: 'All conditions must be met (AND)', value: 'and' },
          { text: 'Any condition can be met (OR)', value: 'or' }
        ]
      })
    })

    it('should set coordinator value from existing condition', () => {
      const result = conditionsJoinViewModel(
        metadata,
        testDefinition,
        'existing-joined',
        existingJoinedCondition
      )

      const coordinatorField = /** @type {GovukField} */ (
        result.fields.coordinator
      )
      expect(coordinatorField.value).toBe(Coordinator.OR)
    })

    it('should set coordinator value from form values', () => {
      const validation = {
        formValues: {
          coordinator: 'and'
        },
        formErrors: {}
      }

      const result = conditionsJoinViewModel(
        metadata,
        testDefinition,
        'new',
        undefined,
        validation
      )

      const coordinatorField = /** @type {GovukField} */ (
        result.fields.coordinator
      )
      expect(coordinatorField.value).toBe('and')
    })

    it('should generate display name field with correct configuration', () => {
      const result = conditionsJoinViewModel(metadata, testDefinition, 'new')

      expect(result.fields.displayName).toMatchObject({
        id: 'displayName',
        name: 'displayName',
        label: {
          text: 'Name for joined condition',
          classes: 'govuk-label--m'
        },
        classes: 'govuk-input--width-30',
        value: '',
        hint: {
          text: "Condition names help you to identify conditions in your form, for example, 'Not a farmer'. Users will not see condition names."
        }
      })
    })

    it('should set display name value from existing condition', () => {
      const result = conditionsJoinViewModel(
        metadata,
        testDefinition,
        'existing-joined',
        existingJoinedCondition
      )

      const displayNameField = /** @type {GovukField} */ (
        result.fields.displayName
      )
      expect(displayNameField.value).toBe('Existing joined condition')
    })

    it('should set display name value from form values', () => {
      const validation = {
        formValues: {
          displayName: 'Form submitted display name'
        },
        formErrors: {}
      }

      const result = conditionsJoinViewModel(
        metadata,
        testDefinition,
        'new',
        undefined,
        validation
      )

      const displayNameField = /** @type {GovukField} */ (
        result.fields.displayName
      )
      expect(displayNameField.value).toBe('Form submitted display name')
    })

    it('should include validation errors in error list', () => {
      const validation = {
        formErrors: {
          conditions: {
            text: 'Select at least two conditions',
            href: '#conditions'
          },
          coordinator: {
            text: 'Select how to combine conditions',
            href: '#coordinator'
          },
          displayName: {
            text: 'Enter a name for this condition',
            href: '#displayName'
          }
        },
        formValues: {}
      }

      const result = conditionsJoinViewModel(
        metadata,
        testDefinition,
        'new',
        undefined,
        validation
      )

      expect(result.errorList).toHaveLength(3)
      expect(result.errorList[0]).toMatchObject({
        text: 'Select at least two conditions',
        href: '#conditions'
      })
      expect(result.errorList[1]).toMatchObject({
        text: 'Select how to combine conditions',
        href: '#coordinator'
      })
      expect(result.errorList[2]).toMatchObject({
        text: 'Enter a name for this condition',
        href: '#displayName'
      })
    })

    it('should include validation errors in field objects', () => {
      const validation = {
        formErrors: {
          conditions: {
            text: 'Select at least two conditions',
            href: '#conditions'
          },
          coordinator: {
            text: 'Select how to combine conditions',
            href: '#coordinator'
          },
          displayName: {
            text: 'Enter a name for this condition',
            href: '#displayName'
          }
        },
        formValues: {}
      }

      const result = conditionsJoinViewModel(
        metadata,
        testDefinition,
        'new',
        undefined,
        validation
      )

      const conditionsField = /** @type {GovukField} */ (
        result.fields.conditions
      )
      const coordinatorField = /** @type {GovukField} */ (
        result.fields.coordinator
      )
      const displayNameField = /** @type {GovukField} */ (
        result.fields.displayName
      )

      expect(/** @type {any} */ (conditionsField).errorMessage).toMatchObject({
        text: 'Select at least two conditions'
      })
      expect(/** @type {any} */ (coordinatorField).errorMessage).toMatchObject({
        text: 'Select how to combine conditions'
      })
      expect(/** @type {any} */ (displayNameField).errorMessage).toMatchObject({
        text: 'Enter a name for this condition'
      })
    })

    it('should include notification when provided', () => {
      const notification = ['Condition saved successfully']

      const result = conditionsJoinViewModel(
        metadata,
        testDefinition,
        'new',
        undefined,
        undefined,
        notification
      )

      expect(result.notification).toEqual(notification)
    })

    it('should handle undefined validation and notification', () => {
      const result = conditionsJoinViewModel(metadata, testDefinition, 'new')

      expect(result.errorList).toEqual([])
      expect(result.notification).toBeUndefined()
    })

    it('should work with existing test data from stubs', () => {
      const result = conditionsJoinViewModel(
        metadata,
        testFormDefinitionWithMultipleV2Conditions,
        'new'
      )

      const conditionsField = /** @type {GovukField} */ (
        result.fields.conditions
      )
      expect(conditionsField.items).toHaveLength(3)
      // Conditions are sorted alphabetically by displayName
      expect(conditionsField.items?.[0].text).toBe('isBobAndFaveColourRedV2')
      expect(conditionsField.items?.[1].text).toBe('isBobV2')
      expect(conditionsField.items?.[2].text).toBe('isFaveColourRedV2')
    })

    it('should generate correct preview URL with draft status', () => {
      const result = conditionsJoinViewModel(metadata, testDefinition, 'new')

      expect(result.previewBaseUrl).toContain(FormStatus.Draft)
      expect(result.previewBaseUrl).toContain(metadata.slug)
    })

    it('should include presentation text in condition hints', () => {
      const result = conditionsJoinViewModel(metadata, testDefinition, 'new')

      // Each condition item should have a hint with presentation text
      const conditionsField = /** @type {GovukField} */ (
        result.fields.conditions
      )
      conditionsField.items?.forEach((/** @type {any} */ item) => {
        expect(item.hint).toBeDefined()
        expect(item.hint?.text).toBeDefined()
        expect(typeof item.hint?.text).toBe('string')
      })
    })

    it('should set correct page titles and headings', () => {
      const result = conditionsJoinViewModel(metadata, testDefinition, 'new')

      expect(result.pageTitle).toBe('Manage conditions - Test Form')
      expect(result.pageHeading).toEqual({
        text: 'Manage conditions',
        size: 'large'
      })
      expect(result.pageCaption.text).toBe('Test Form')
    })
  })
})

/**
 * @import { GovukField } from '@defra/forms-model'
 */
