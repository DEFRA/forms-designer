import {
  ComponentType,
  ConditionType,
  OperatorName,
  conditionDataSchemaV2,
  conditionWrapperSchemaV2,
  getOperatorNames,
  hasComponentsEvenIfNoNext,
  hasConditionSupport,
  hasListField
} from '@defra/forms-model'
import Joi from 'joi'
import upperFirst from 'lodash/upperFirst.js'

import {
  getListFromComponent,
  insertValidationErrors
} from '~/src/lib/utils.js'
import { toPresentationHtmlV2 } from '~/src/models/forms/editor-v2/common.js'
import { buildValueField } from '~/src/models/forms/editor-v2/condition-value.js'
import {
  hasConditionSupportForPage,
  withPageNumbers
} from '~/src/models/forms/editor-v2/pages-helper.js'

const componentIdSchema = conditionDataSchemaV2.extract('componentId')
const operatorSchema = conditionDataSchemaV2.extract('operator')
const valueSchema = conditionDataSchemaV2.extract('value')
const typeSchema = conditionDataSchemaV2.extract('type')

/**
 * @type {Joi.ObjectSchema<ConditionWrapperPayload>}
 * Custom condition wrapper payload schema that
 * only allows conditions, not condition references.
 *
 * There is a dependency chain in the validation of each condition item:
 * - Condition operator is only required once a componentId has been selected
 * - Condition value is only required once a valid operator has been selected
 * Given this, we don't want to surface errors to the user for operator and
 * value before their dependent fields are valid hence the use of `joi.when` below
 */
export const conditionWrapperSchema = conditionWrapperSchemaV2.keys({
  coordinator: conditionWrapperSchemaV2.extract('coordinator').messages({
    'any.required': 'Choose how you want to combine conditions'
  }),
  items: Joi.array().items(
    conditionDataSchemaV2.keys({
      componentId: componentIdSchema.messages({
        '*': 'Select a question'
      }),
      operator: operatorSchema
        .when('componentId', {
          not: componentIdSchema,
          then: Joi.optional() // Only validate the operator if the componentId is valid
        })
        .messages({
          '*': 'Select a condition type'
        }),
      type: typeSchema
        .when('operator', {
          not: operatorSchema,
          then: Joi.optional() // Only validate the value if the operator is valid
        })
        .messages({
          '*': 'Enter a condition value type'
        }),
      value: valueSchema
        .when('operator', {
          not: operatorSchema,
          then: Joi.optional() // Only validate the value if the operator is valid
        })
        .messages({
          '*': 'Enter a condition value',
          'date.format': 'Enter a condition value in the correct format'
        })
    })
  ),
  displayName: conditionWrapperSchemaV2.extract('displayName').messages({
    'string.empty': 'Enter condition name'
  })
})

/**
 * @param { ConditionDataV2 | ConditionRefDataV2 } item
 * @returns { string | undefined }
 */
export function getComponentId(item) {
  return 'componentId' in item ? item.componentId : undefined
}

/**
 * @param { ConditionDataV2 | ConditionRefDataV2 } item
 * @returns { OperatorName | undefined }
 */
export function getOperator(item) {
  return 'operator' in item ? item.operator : undefined
}

/**
 * @param { OperatorName | undefined } operator
 */
export function isRelativeDate(operator) {
  if (!operator) {
    return false
  }

  return [
    OperatorName.IsAtLeast,
    OperatorName.IsAtMost,
    OperatorName.IsLessThan,
    OperatorName.IsMoreThan
  ].includes(operator)
}

/**
 * Determine if the condition/operator combination should use NumberValue
 * NumberValue is used when the operator is HasLength, IsLongerThan or IsShorterThan
 * or if the component is a NumberField
 * @param { ConditionalComponentsDef | undefined } component
 * @param { OperatorName | undefined } operator
 */
export function isConditionRequiresNumberValue(component, operator) {
  if (!operator) {
    return false
  }

  if (
    [
      OperatorName.HasLength,
      OperatorName.IsLongerThan,
      OperatorName.IsShorterThan
    ].includes(operator)
  ) {
    return true
  }

  if (!component) {
    return false
  }

  return component.type === ComponentType.NumberField
}

/**
 * @param { ConditionalComponentsDef | undefined } selectedComponent
 * @param { OperatorName | undefined } operatorValue
 * @returns
 */
export function getConditionType(selectedComponent, operatorValue) {
  if (hasListField(selectedComponent)) {
    return ConditionType.ListItemRef
  } else if (selectedComponent?.type === ComponentType.YesNoField) {
    return ConditionType.BooleanValue
  } else if (selectedComponent?.type === ComponentType.DatePartsField) {
    return isRelativeDate(operatorValue)
      ? ConditionType.RelativeDate
      : ConditionType.DateValue
  } else if (isConditionRequiresNumberValue(selectedComponent, operatorValue)) {
    return ConditionType.NumberValue
  } else {
    return ConditionType.StringValue
  }
}

/**
 * @param { string | undefined } componentValue
 * @param {number} idx
 * @param {{ text: string, value: OperatorName }[]} operatorNames
 * @param { OperatorName | undefined } operatorValue
 * @param { ValidationFailure<FormEditor> | undefined } validation
 */
export function buildOperatorField(
  componentValue,
  idx,
  operatorNames,
  operatorValue,
  validation
) {
  return componentValue
    ? {
        id: `items[${idx}].operator`,
        name: `items[${idx}][operator]`,
        label: {
          text: 'Condition type'
        },
        items: [{ text: 'Select a condition type', value: '' }].concat(
          operatorNames
        ),
        value:
          operatorValue && operatorNames.find((x) => x.value === operatorValue)
            ? operatorValue
            : undefined,
        formGroup: {
          afterInput: {
            html: `<button class="govuk-button govuk-!-margin-bottom-0 govuk-!-margin-left-3" name="action" type="submit"
      value="confirmSelectOperator">Select</button>`
          }
        },
        ...insertValidationErrors(
          validation?.formErrors[`items[${idx}].operator`]
        )
      }
    : undefined
}

/**
 * @param {number} idx
 * @param {{ page: Page, number: number, components: ConditionalComponentsDef[], group: boolean }[]} componentItems
 * @param { ConditionDataV2 | ConditionRefDataV2 } item
 * @param { ValidationFailure<FormEditor> | undefined } validation
 * @param {FormDefinition} definition
 */
export function buildConditionsFields(
  idx,
  componentItems,
  item,
  validation,
  definition
) {
  const idField = {
    id: 'id',
    name: `items[${idx}][id]`,
    value: item.id
  }

  const component = {
    id: `items[${idx}].componentId`,
    name: `items[${idx}][componentId]`,
    label: {
      text: 'Select a question'
    },
    classes: 'govuk-input--width-20',
    items: componentItems,
    value: getComponentId(item),
    ...insertValidationErrors(
      validation?.formErrors[`items[${idx}].componentId`]
    )
  }

  const selectedComponent =
    'componentId' in item
      ? componentItems
          .flatMap(({ components }) => components)
          .find((c) => c.id === item.componentId)
      : undefined

  const operatorValue = getOperator(item)

  const operatorNames = getOperatorNames(selectedComponent?.type).map(
    (val) => ({
      text: upperFirst(val),
      value: val
    })
  )

  const operator = buildOperatorField(
    component.value,
    idx,
    operatorNames,
    operatorValue,
    validation
  )

  const conditionType = getConditionType(selectedComponent, operatorValue)

  const listId =
    conditionType === ConditionType.ListItemRef
      ? getListFromComponent(selectedComponent, definition)?.id
      : undefined

  const conditionTypeName = `items[${idx}][type]`

  const listIdName =
    conditionType === ConditionType.ListItemRef
      ? `items[${idx}][value][listId]`
      : ''

  // prettier-ignore
  const value = 'operator' in item && component.value && operator?.value
      ? buildValueField(conditionType, idx, item, selectedComponent, definition, validation)
      : undefined

  // prettier-ignore
  return { component, operator, value, conditionType, idField, listId, conditionTypeName, listIdName}
}

/**
 * @param {FormDefinition} definition
 */
export function getComponentsPerPageNumber(definition) {
  return definition.pages
    .map(withPageNumbers)
    .filter(({ page }) => hasConditionSupportForPage(page))
    .map(({ page, number }) => {
      const components = hasComponentsEvenIfNoNext(page)
        ? page.components.filter(hasConditionSupport)
        : []

      return {
        page,
        number,
        components,
        group: components.length > 1
      }
    })
}

/**
 * @param {FormDefinition} definition
 * @param { ValidationFailure<FormEditor> | undefined } validation
 * @param {ConditionSessionState} state
 */
export function buildConditionEditor(definition, validation, state) {
  const componentsPerPageNumber = getComponentsPerPageNumber(definition)
  const legendText = state.id !== 'new' ? '' : 'Create new condition'
  const { conditionWrapper } = state

  const conditionFieldsList = (
    conditionWrapper?.items ?? [/** @type {ConditionDataV2} */ ({})]
  ).map((item, idx) => {
    return buildConditionsFields(
      idx,
      componentsPerPageNumber,
      item,
      validation,
      definition
    )
  })

  const displayNameField = {
    id: 'displayName',
    name: 'displayName',
    label: {
      text: 'Condition name',
      classes: 'govuk-label--m'
    },
    classes: 'govuk-input--width-20',
    value: conditionWrapper?.displayName,
    hint: {
      text: 'Condition names help you to identify conditions in your form, for example, ‘Not a farmer’. Users will not see condition names.'
    },
    ...insertValidationErrors(validation?.formErrors.displayName)
  }

  const coordinator = {
    id: 'coordinator',
    name: 'coordinator',
    fieldset: {
      legend: {
        text: 'How do you want to combine these conditions?',
        classes: 'govuk-fieldset__legend--m'
      }
    },
    classes: 'govuk-radios--inline',
    value: conditionWrapper?.coordinator,
    items: [
      { text: 'All conditions must be met (AND)', value: 'and' },
      { text: 'Any condition can be met (OR)', value: 'or' }
    ],
    ...insertValidationErrors(validation?.formErrors.coordinator)
  }

  const originalCondition = /** @type { ConditionWrapperV2 | undefined } */ (
    definition.conditions.find((x) =>
      'id' in x ? x.id === state.id : undefined
    )
  )
  const originalConditionHtml = originalCondition
    ? toPresentationHtmlV2(originalCondition, definition)
    : ''

  return {
    legendText,
    conditionFieldsList,
    displayNameField,
    coordinator,
    conditionId: state.id,
    originalCondition: {
      name: originalCondition?.displayName,
      html: originalConditionHtml
    }
  }
}

/**
 * @typedef {Partial<Omit<ConditionWrapperV2, 'items'>> & { action?: string, removeAction?: string, items?: Partial<ConditionDataV2>[] }} ConditionWrapperPayload
 */

/**
 * @import { ConditionalComponentsDef, ConditionDataV2, ConditionRefDataV2, ConditionSessionState, ConditionWrapperV2, FormDefinition, FormEditor, Page } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
