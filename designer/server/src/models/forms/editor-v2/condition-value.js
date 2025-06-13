import {
  ConditionType,
  DateDirections,
  DateUnits,
  getYesNoList
} from '@defra/forms-model'
import upperFirst from 'lodash/upperFirst.js'

import {
  getListFromComponent,
  insertValidationErrors
} from '~/src/lib/utils.js'

const dateUnits = Object.values(DateUnits)
const dateDirections = Object.values(DateDirections)
const GOVUK_RADIOS_SMALL = 'govuk-radios--small'

/**
 * @param { ErrorDetails | undefined } formErrors
 * @param {number} idx
 * @param {string} fieldValueName
 * @param { string | undefined } fieldValue
 */
export function insertDateValidationErrors(
  formErrors,
  idx,
  fieldValueName,
  fieldValue
) {
  if (fieldValue && fieldValue !== '') {
    return {}
  }
  const formError = formErrors ? formErrors[`items[${idx}].value`] : undefined
  return {
    ...(formError && {
      errorMessage: {
        text: formError.text.replace(
          'condition value',
          `condition value ${fieldValueName}`
        )
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
    ...insertDateValidationErrors(formErrors, idx, 'period', periodValue)
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
    classes: GOVUK_RADIOS_SMALL,
    value: unitValue,
    ...insertDateValidationErrors(formErrors, idx, 'unit', unitValue)
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
    classes: GOVUK_RADIOS_SMALL,
    value: directionValue,
    ...insertDateValidationErrors(formErrors, idx, 'direction', directionValue)
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
  return {
    id: `items[${idx}].value`,
    name: `items[${idx}][value][itemId]`,
    fieldset: {
      legend: {
        text: 'Select a value'
      }
    },
    classes: GOVUK_RADIOS_SMALL,
    value:
      'value' in item && 'itemId' in item.value ? item.value.itemId : undefined,
    items: getListFromComponent(selectedComponent, definition)?.items.map(
      (itm) => {
        return { text: itm.text, value: itm.id ?? itm.value }
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
    name: `items[${idx}][value][value]`,
    fieldset: {
      legend: {
        text: 'Select a value'
      }
    },
    classes: 'govuk-radios--small',
    value:
      'value' in item && 'value' in item.value
        ? item.value.value.toString()
        : undefined,
    items: getYesNoList().items.map((itm) => {
      return { text: itm.text, value: itm.value.toString() }
    }),
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
    name: `items[${idx}][value][value]`,
    label: {
      text: 'Enter a value'
    },
    classes: 'govuk-input--width-10',
    value:
      'value' in item && 'value' in item.value ? item.value.value : undefined,
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
    name: `items[${idx}][value][value]`,
    label: {
      text: 'Enter a value'
    },
    classes: 'govuk-input--width-5',
    attributes: {
      inputmode: 'numeric'
    },
    value:
      'value' in item && 'value' in item.value
        ? item.value.value.toString()
        : undefined,
    ...insertValidationErrors(validation?.formErrors[`items[${idx}].value`])
  }
}

/**
 * @import { ErrorDetails } from '~/src/common/helpers/types.js'
 * @import { ConditionalComponentsDef, ConditionDataV2, ConditionRefDataV2, FormDefinition, FormEditor, List } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
