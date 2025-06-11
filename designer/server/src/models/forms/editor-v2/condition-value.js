import { DateDirections, DateUnits } from '@defra/forms-model'
import upperFirst from 'lodash/upperFirst.js'

import { insertValidationErrors } from '~/src/lib/utils.js'

const dateUnits = Object.values(DateUnits)
const dateDirections = Object.values(DateDirections)

/**
 * @param {number} idx
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function relativeDateValueViewModel(idx, validation) {
  const { formValues, formErrors } = validation ?? {}

  // Period text field
  const period = {
    id: `items[${idx}].value.period`,
    name: `items[${idx}][value][period]`,
    label: {
      text: 'Enter a period'
    },
    classes: 'govuk-input--width-10',
    value: formValues?.period,
    ...insertValidationErrors(
      formErrors ? formErrors[`items[${idx}].value.unit`] : undefined
    )
  }

  // Unit select field
  const unit = {
    id: `items[${idx}].value.unit`,
    name: `items[${idx}][value][unit]`,
    items: dateUnits.map((value) => ({ text: upperFirst(value), value })),
    fieldset: {
      legend: {
        text: 'Select a unit'
      }
    },
    classes: 'govuk-radios--small',
    value: formValues?.unit,
    ...insertValidationErrors(
      formErrors ? formErrors[`items[${idx}].value.unit`] : undefined
    )
  }

  // Direction select field
  const direction = {
    id: `items[${idx}].value.direction`,
    name: `items[${idx}][value][direction]`,
    items: dateDirections.map((value) => ({ text: upperFirst(value), value })),
    fieldset: {
      legend: {
        text: 'Select a direction'
      }
    },
    classes: 'govuk-radios--small',
    value: formValues?.direction,
    ...insertValidationErrors(
      formErrors ? formErrors[`items[${idx}].value.direction`] : undefined
    )
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
 * @import { FormEditor, List } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
