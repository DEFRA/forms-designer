import { insertValidationErrors } from '~/src/lib/utils.js'
import { toPresentationStringV2 } from '~/src/models/forms/editor-v2/common.js'
import { getConditionsData } from '~/src/models/forms/editor-v2/page-conditions.js'

/**
 * Get the list of available conditions for joining, excluding the current one when editing
 * @param {FormDefinition} definition
 * @param {string} conditionId
 * @returns {ConditionWrapperV2[]}
 */
export function getAvailableConditions(definition, conditionId) {
  return getConditionsData(definition).filter(
    (cond) => conditionId === 'new' || cond.id !== conditionId
  )
}

/**
 * Get the list of selected condition IDs from either form values or existing condition
 * @param {any} [formValues]
 * @param {ConditionWrapperV2} [existingCondition]
 * @returns {string[]}
 */
export function getSelectedConditions(formValues, existingCondition) {
  return (
    formValues?.conditions ??
    (existingCondition
      ? existingCondition.items
          .filter((item) => 'conditionId' in item)
          .map((item) => /** @type {ConditionRefDataV2} */ (item).conditionId)
      : [])
  )
}

/**
 * Build the conditions checkbox field configuration
 * @param {ConditionWrapperV2[]} allConditions
 * @param {string[]} selectedConditions
 * @param {FormDefinition} definition
 * @param {ValidationFailure<any>} [validation]
 * @returns {GovukField}
 */
export function buildConditionsField(
  allConditions,
  selectedConditions,
  definition,
  validation
) {
  return {
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
    classes: 'govuk-checkboxes--small',
    items: allConditions.map((cond) => ({
      text: cond.displayName,
      label: {
        classes: 'govuk-!-font-weight-bold'
      },
      hint: {
        text: toPresentationStringV2(cond, definition)
      },
      value: cond.id,
      checked: selectedConditions.includes(cond.id)
    })),
    ...insertValidationErrors(validation?.formErrors.conditions)
  }
}

/**
 * Build the coordinator radio field configuration
 * @param {any} [formValues]
 * @param {ConditionWrapperV2} [existingCondition]
 * @param {ValidationFailure<any>} [validation]
 * @returns {GovukField}
 */
export function buildCoordinatorField(
  formValues,
  existingCondition,
  validation
) {
  const coordinatorValue =
    formValues?.coordinator ?? existingCondition?.coordinator

  return {
    id: 'coordinator',
    name: 'coordinator',
    fieldset: {
      legend: {
        text: 'How do you want to combine these conditions?',
        classes: 'govuk-fieldset__legend--m'
      }
    },
    classes: 'govuk-radios--inline',
    value: coordinatorValue,
    items: [
      { text: 'All conditions must be met (AND)', value: 'and' },
      { text: 'Any condition can be met (OR)', value: 'or' }
    ],
    ...insertValidationErrors(validation?.formErrors.coordinator)
  }
}

/**
 * Build the display name input field configuration
 * @param {any} [formValues]
 * @param {ConditionWrapperV2} [existingCondition]
 * @param {ValidationFailure<any>} [validation]
 * @returns {GovukField}
 */
export function buildDisplayNameField(
  formValues,
  existingCondition,
  validation
) {
  const displayNameValue =
    formValues?.displayName ?? existingCondition?.displayName ?? ''

  return {
    id: 'displayName',
    name: 'displayName',
    label: {
      text: 'Name for joined condition',
      classes: 'govuk-label--m'
    },
    classes: 'govuk-input--width-30',
    value: displayNameValue,
    hint: {
      text: "Condition names help you to identify conditions in your form, for example, 'Not a farmer'. Users will not see condition names."
    },
    ...insertValidationErrors(validation?.formErrors.displayName)
  }
}

/**
 * Check if a condition is a joined condition (contains only condition references)
 * @param {ConditionWrapperV2} condition
 * @returns {boolean}
 */
export function isJoinedCondition(condition) {
  return (
    condition.items.length > 0 &&
    condition.items.every((item) => 'conditionId' in item)
  )
}

/**
 * @import { FormDefinition, ConditionDataV2, ConditionWrapperV2, ConditionRefDataV2, GovukField } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
