import { DateDirections, DateUnits } from '@defra/forms-model'
import upperFirst from 'lodash/upperFirst.js'

import { insertValidationErrors } from '~/src/lib/utils.js'

const dateUnits = Object.values(DateUnits)
const dateDirections = Object.values(DateDirections)

/**
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function relativeDateValueViewModel(validation) {
  const { formValues, formErrors } = validation ?? {}

  // Period text field
  const period = {
    id: 'period',
    name: 'period',
    value: formValues?.period,
    ...insertValidationErrors(formErrors?.period)
  }

  // Unit select field
  const unit = {
    id: 'unit',
    name: 'unit',
    items: dateUnits.map((value) => ({ text: upperFirst(value), value })),
    value: formValues?.unit,
    ...insertValidationErrors(formErrors?.unit)
  }

  // Direction select field
  const direction = {
    id: 'direction',
    name: 'direction',
    items: dateDirections.map((value) => ({ text: upperFirst(value), value })),
    value: formValues?.direction,
    ...insertValidationErrors(formErrors?.direction)
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
