import { DateDirections, DateUnits } from '@defra/forms-model'
import upperFirst from 'lodash/upperFirst.js'

import { insertValidationErrors } from '~/src/lib/utils.js'

const dateUnits = Object.values(DateUnits)
const dateDirections = Object.values(DateDirections)

/**
 * @param { ErrorDetails | undefined } formErrors
 * @param {number} idx
 * @param { string | undefined } fieldValue
 */
export function insertDateValidationErrors(formErrors, idx, fieldValue) {
  if (fieldValue && fieldValue !== '') {
    return {}
  }
  const formError = formErrors ? formErrors[`items[${idx}].value`] : undefined
  return {
    ...(formError && {
      errorMessage: {
        text: formError.text
      }
    })
  }
}

/**
 * @param {number} idx
 * @param { ConditionDataV2 | ConditionRefDataV2 } item
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function relativeDateValueViewModel(idx, item, validation) {
  const { formErrors } = validation ?? {}

  // Period text field
  const periodValue =
    'value' in item && 'period' in item.value ? item.value.period : undefined
  const period = {
    id: `items[${idx}].value`,
    name: `items[${idx}][value][period]`,
    label: {
      text: 'Period'
    },
    classes: 'govuk-input--width-10',
    value: periodValue,
    ...insertDateValidationErrors(formErrors, idx, periodValue)
  }

  // Unit select field
  const unitValue =
    'value' in item && 'unit' in item.value ? item.value.unit : undefined
  const unit = {
    id: `items[${idx}].value.unit`,
    name: `items[${idx}][value][unit]`,
    items: dateUnits.map((value) => ({ text: upperFirst(value), value })),
    fieldset: {
      legend: {
        text: 'Units'
      }
    },
    classes: 'govuk-radios--small',
    value: unitValue,
    ...insertDateValidationErrors(formErrors, idx, unitValue)
  }

  // Direction select field
  const directionValue =
    'value' in item && 'direction' in item.value
      ? item.value.direction
      : undefined
  const direction = {
    id: `items[${idx}].value.direction`,
    name: `items[${idx}][value][direction]`,
    items: dateDirections.map((value) => ({ text: upperFirst(value), value })),
    fieldset: {
      legend: {
        text: 'Direction'
      }
    },
    classes: 'govuk-radios--small',
    value: directionValue,
    ...insertDateValidationErrors(formErrors, idx, directionValue)
  }

  return {
    period,
    unit,
    direction
  }
}

/**
 * @param {List} list
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function listItemRefValueViewModel(list, validation) {
  const { formValues, formErrors } = validation ?? {}

  // Item Id field
  const itemIdField = {
    id: 'itemId',
    name: 'itemId',
    items: list.items.map(({ text, value }) => ({ text, value })),
    value: formValues?.itemId,
    ...insertValidationErrors(formErrors?.itemId)
  }

  return {
    itemId: itemIdField
  }
}

/**
 * @import { ErrorDetails } from '~/src/common/helpers/types.js'
 * @import { ConditionDataV2, ConditionRefDataV2, FormEditor, List } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
