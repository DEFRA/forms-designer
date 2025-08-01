import {
  ConditionType,
  DateDirections,
  DateUnits,
  getYesNoList,
  isConditionNumberValueDataV2,
  isConditionStringValueDataV2
} from '@defra/forms-model'
import upperFirst from 'lodash/upperFirst.js'

import {
  getListFromComponent,
  insertValidationErrors
} from '~/src/lib/utils.js'

const dateUnits = Object.values(DateUnits)
const dateDirections = Object.values(DateDirections)
const GOVUK_RADIOS_SMALL = 'govuk-radios--small'
const GOVUK_INPUT_WIDTH_10 = 'govuk-input--width-10'

/**
 * @param { ErrorDetailsItem | undefined } formError
 */
export function insertDateValidationErrors(formError) {
  if (!formError) {
    return {}
  }

  return {
    errorMessage: {
      text: formError.text
    }
  }
}

/**
 * Builds a unique id for each option in a radio list, such that the first option's id
 * matches the component's id and subsequent options don't match. This allows the error
 * anchors (if displayed) to navigate to the first radio item.
 * @param {string} fieldName
 * @param {number} idx
 * @param {number} idx2
 */
export function createSequentialId(fieldName, idx, idx2) {
  const trailingIndex = idx2 > 0 ? idx2.toString() : ''
  const fieldNamePart = fieldName.length ? `.${fieldName}` : ''
  return `items[${idx}].value${fieldNamePart}${trailingIndex}`
}

/**
 * @param {number} idx
 * @param { Partial<ConditionDataV2> } item
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function relativeDateValueViewModel(idx, item, validation) {
  const { formErrors } = validation ?? {}

  const valueObj = /** @type { RelativeDateValueDataV2 | undefined } */ (
    item.value
  )

  // Period text field
  const periodValue = valueObj?.period
  const period = {
    id: `items[${idx}].value.period`,
    name: `items[${idx}][value][period]`,
    label: {
      text: 'Period'
    },
    classes: GOVUK_INPUT_WIDTH_10,
    value: periodValue,
    ...insertDateValidationErrors(formErrors?.[`items[${idx}].value.period`])
  }

  // Unit select field
  const unitValue = valueObj?.unit
  const unit = {
    id: `items[${idx}].value.unit`,
    name: `items[${idx}][value][unit]`,
    items: dateUnits.map((value, idx2) => ({
      text: upperFirst(value),
      value,
      id: createSequentialId('unit', idx, idx2)
    })),
    fieldset: {
      legend: {
        text: 'Units'
      }
    },
    classes: GOVUK_RADIOS_SMALL,
    value: unitValue,
    ...insertDateValidationErrors(formErrors?.[`items[${idx}].value.unit`])
  }

  // Direction select field
  const directionValue = valueObj?.direction
  const direction = {
    id: `items[${idx}].value.direction`,
    name: `items[${idx}][value][direction]`,
    items: dateDirections.map((value, idx2) => ({
      text: upperFirst(value),
      value,
      id: createSequentialId('direction', idx, idx2)
    })),
    fieldset: {
      legend: {
        text: 'Direction'
      }
    },
    classes: GOVUK_RADIOS_SMALL,
    value: directionValue,
    ...insertDateValidationErrors(formErrors?.[`items[${idx}].value.direction`])
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
 * @param {ConditionType} type
 * @param {number} idx
 * @param { ConditionDataV2 } item
 * @param { ConditionalComponentsDef | undefined } selectedComponent
 * @param {FormDefinition} definition
 * @param { ValidationFailure<FormEditor> | undefined } validation
 */
export function buildValueField(
  type,
  idx,
  item,
  selectedComponent,
  definition,
  validation
) {
  switch (type) {
    case ConditionType.ListItemRef: {
      return buildListItemValueField(
        idx,
        item,
        selectedComponent,
        definition,
        validation
      )
    }

    case ConditionType.BooleanValue: {
      return buildBooleanValueField(idx, item, validation)
    }

    case ConditionType.DateValue: {
      return buildDateValueField(idx, item, validation)
    }

    case ConditionType.StringValue: {
      return buildStringValueField(idx, item, validation)
    }

    case ConditionType.NumberValue: {
      return buildNumberValueField(idx, item, validation)
    }

    case ConditionType.RelativeDate: {
      return relativeDateValueViewModel(idx, item, validation)
    }

    default: {
      throw new Error(`Invalid condition type ${type}`)
    }
  }
}

/**
 * @param {number} idx
 * @param { ConditionDataV2 } item
 * @param { ConditionalComponentsDef | undefined } selectedComponent
 * @param {FormDefinition} definition
 * @param { ValidationFailure<FormEditor> | undefined } validation
 */
function buildListItemValueField(
  idx,
  item,
  selectedComponent,
  definition,
  validation
) {
  const valueObj =
    /** @type { ConditionListItemRefValueDataV2 | undefined } */ (item.value)

  return {
    id: `items[${idx}].value.itemId`,
    name: `items[${idx}][value][itemId]`,
    fieldset: {
      legend: {
        text: 'Select a value'
      }
    },
    classes: GOVUK_RADIOS_SMALL,
    value: valueObj?.itemId,
    items: getListFromComponent(selectedComponent, definition)?.items.map(
      (itm, idx2) => {
        return {
          text: itm.text,
          value: itm.id ?? itm.value,
          id: createSequentialId('itemId', idx, idx2)
        }
      }
    ),
    ...insertValidationErrors(validation?.formErrors[`items[${idx}].value`])
  }
}

/**
 * @param {number} idx
 * @param { ConditionDataV2 } item
 * @param { ValidationFailure<FormEditor> | undefined } validation
 */
function buildBooleanValueField(idx, item, validation) {
  return {
    id: `items[${idx}].value`,
    name: `items[${idx}][value]`,
    fieldset: {
      legend: {
        text: 'Select a value'
      }
    },
    classes: GOVUK_RADIOS_SMALL,
    value:
      typeof item.value === 'boolean' || typeof item.value === 'string'
        ? `${item.value}`
        : undefined,
    items: getYesNoList().items.map((itm, idx2) => {
      return {
        text: itm.text,
        value: itm.value.toString(),
        id: createSequentialId('', idx, idx2)
      }
    }),
    ...insertValidationErrors(validation?.formErrors[`items[${idx}].value`])
  }
}

/**
 * @param { string | undefined } value
 * @param {number} idx
 */
export function buildDateItems(value, idx) {
  const [year, month, day] = (typeof value === 'string' ? value : '--').split(
    '-'
  )
  return [
    {
      label: 'Day',
      name: `itemAbsDates[${idx}][day]`,
      value: day,
      classes: 'govuk-input--width-2'
    },
    {
      label: 'Month',
      name: `itemAbsDates[${idx}][month]`,
      value: month,
      classes: 'govuk-input--width-2'
    },
    {
      label: 'Year',
      name: `itemAbsDates[${idx}][year]`,
      value: year,
      classes: 'govuk-input--width-4'
    }
  ]
}

/**
 * @param {number} idx
 * @param { ConditionDataV2 } item
 * @param { ValidationFailure<FormEditor> | undefined } validation
 */
export function buildDateValueField(idx, item, validation) {
  return {
    dateField: {
      id: `items[${idx}].value`,
      name: `items[${idx}][value]`,
      fieldset: {
        legend: {
          text: 'Enter a date'
        }
      },
      items: buildDateItems(
        typeof item.value === 'string' ? item.value : undefined,
        idx
      ),
      ...insertValidationErrors(validation?.formErrors[`items[${idx}].value`])
    },
    indexField: {
      name: `itemAbsDates[${idx}][idx]`,
      value: `${idx}`
    }
  }
}

/**
 * @param {number} idx
 * @param { ConditionDataV2 } item
 * @param { ValidationFailure<FormEditor> | undefined } validation
 */
function buildStringValueField(idx, item, validation) {
  return {
    id: `items[${idx}].value`,
    name: `items[${idx}][value]`,
    label: {
      text: 'Enter a value'
    },
    classes: GOVUK_INPUT_WIDTH_10,
    value: isConditionStringValueDataV2(item) ? item.value : undefined,
    ...insertValidationErrors(validation?.formErrors[`items[${idx}].value`])
  }
}

/**
 * @param {number} idx
 * @param { ConditionDataV2 } item
 * @param { ValidationFailure<FormEditor> | undefined } validation
 */
function buildNumberValueField(idx, item, validation) {
  return {
    id: `items[${idx}].value`,
    name: `items[${idx}][value]`,
    label: {
      text: 'Enter a value'
    },
    classes: 'govuk-input--width-5',
    attributes: {
      inputmode: 'numeric'
    },
    value: isConditionNumberValueDataV2(item) ? item.value : undefined,
    ...insertValidationErrors(validation?.formErrors[`items[${idx}].value`])
  }
}

/**
 * @import { ErrorDetailsItem } from '~/src/common/helpers/types.js'
 * @import { ConditionalComponentsDef, ConditionDataV2, ConditionListItemRefValueDataV2, FormDefinition, FormEditor, List, RelativeDateValueDataV2 } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
