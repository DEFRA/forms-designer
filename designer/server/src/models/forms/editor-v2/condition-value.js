import {
  ConditionType,
  DateDirections,
  DateUnits,
  getYesNoList,
  isConditionBooleanValueDataV2,
  isConditionDateValueDataV2,
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
 * @param { string | number | undefined } fieldValue
 */
export function insertDateValidationErrors(formError, fieldValue) {
  if (fieldValue && fieldValue !== '') {
    return {}
  }

  return {
    ...(formError && {
      errorMessage: {
        text: formError.text
      }
    })
  }
}

/**
 * @param {string} fieldName
 * @param {number} idx
 * @param {number} idx2
 */
export function createSequentialId(fieldName, idx, idx2) {
  return `items[${idx}].value.${fieldName}${idx2 > 0 ? idx2 : ''}`
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
    ...insertDateValidationErrors(
      formErrors?.[`items[${idx}].value.period`],
      periodValue
    )
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
    ...insertDateValidationErrors(
      formErrors?.[`items[${idx}].value.unit`],
      unitValue
    )
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
    ...insertDateValidationErrors(
      formErrors?.[`items[${idx}].value.direction`],
      directionValue
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
      isConditionBooleanValueDataV2(item) && typeof item.value === 'boolean'
        ? item.value.toString()
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
 * @param {number} idx
 * @param { ConditionDataV2 } item
 * @param { ValidationFailure<FormEditor> | undefined } validation
 */
export function buildDateValueField(idx, item, validation) {
  return {
    id: `items[${idx}].value`,
    name: `items[${idx}][value]`,
    label: {
      text: 'Enter a date'
    },
    hint: {
      text: 'Format must be YYYY-MM-DD'
    },
    classes: GOVUK_INPUT_WIDTH_10,
    value: isConditionDateValueDataV2(item) ? item.value : undefined,
    ...insertValidationErrors(validation?.formErrors[`items[${idx}].value`])
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
    value:
      isConditionNumberValueDataV2(item) && typeof item.value === 'number'
        ? item.value.toString()
        : undefined,
    ...insertValidationErrors(validation?.formErrors[`items[${idx}].value`])
  }
}

/**
 * @import { ErrorDetails, ErrorDetailsItem } from '~/src/common/helpers/types.js'
 * @import { ConditionalComponentsDef, ConditionDataV2, ConditionListItemRefValueDataV2, FormDefinition, FormEditor, List, RelativeDateValueDataV2 } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
