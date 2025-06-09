import {
  ConditionType,
  getOperatorNames,
  hasComponentsEvenIfNoNext,
  hasConditionSupport,
  hasListField
} from '@defra/forms-model'
import upperFirst from 'lodash/upperFirst.js'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  getListFromComponent,
  insertValidationErrors
} from '~/src/lib/utils.js'
import {
  BACK_TO_MANAGE_CONDITIONS,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import {
  withConditionSupport,
  withPageNumbers
} from '~/src/models/forms/editor-v2/pages-helper.js'
import { editorFormPath, formOverviewPath } from '~/src/models/links.js'

/**
 * @param {ConditionType} type
 * @param {number} idx
 * @param { ConditionDataV2 | ConditionRefDataV2 } item
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
      return {
        id: `items[${idx}].value`,
        name: `items[${idx}][value][itemId]`,
        fieldset: {
          legend: {
            text: 'Select a value'
          }
        },
        classes: 'govuk-radios--small',
        value:
          'value' in item && 'itemId' in item.value
            ? item.value.itemId
            : undefined,
        items: getListFromComponent(selectedComponent, definition)?.items.map(
          (itm) => {
            return { text: itm.text, value: itm.id }
          }
        ),
        ...insertValidationErrors(validation?.formErrors[`items[${idx}].value`])
      }
    }

    case ConditionType.StringValue: {
      return {
        id: `items[${idx}].value`,
        name: `items[${idx}][value][value]`,
        label: {
          text: 'Enter a value'
        },
        value:
          'value' in item && 'value' in item.value
            ? item.value.value
            : undefined,
        ...insertValidationErrors(validation?.formErrors[`items[${idx}].value`])
      }
    }

    default: {
      throw new Error(`Invalid condition type ${type}`)
    }
  }
}

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
    items: componentItems,
    value: getComponentId(item),
    ...insertValidationErrors(
      validation?.formErrors[`items[${idx}].componentId`]
    )
  }

  // TODO - handle REF as well as component
  const selectedComponent =
    'componentId' in item
      ? componentItems
          .flatMap(({ components }) => components)
          .find((c) => c.id === item.componentId)
      : undefined

  const operator = component.value
    ? {
        id: `items[${idx}].operator`,
        name: `items[${idx}][operator]`,
        label: {
          text: 'Condition type'
        },
        items: [{ text: 'Select a condition type', value: '' }].concat(
          ...getOperatorNames(selectedComponent?.type).map((val) => ({
            text: upperFirst(val),
            value: val
          }))
        ),
        value: getOperator(item),
        formGroup: {
          afterInput: {
            html: `<button class="govuk-button govuk-!-margin-bottom-0" name="action" type="submit"
      value="confirmSelectOperator">Select</button>`
          }
        },
        ...insertValidationErrors(
          validation?.formErrors[`items[${idx}].operator`]
        )
      }
    : undefined

  // TODO - enhance to handle date absolute + relative
  // TODO - is there an easier/better way to determine the condition type?
  const conditionType = hasListField(selectedComponent)
    ? ConditionType.ListItemRef
    : ConditionType.StringValue

  const listId =
    conditionType === ConditionType.ListItemRef
      ? getListFromComponent(selectedComponent, definition)?.id
      : undefined

  const conditionTypeName = `items[${idx}][value][type]`

  const listIdName =
    conditionType === ConditionType.ListItemRef
      ? `items[${idx}][value][listId]`
      : ''

  // prettier-ignore
  const value = 'operator' in item && component.value && item.operator.length
      ? buildValueField(conditionType, idx, item, selectedComponent, definition, validation)
      : undefined

  // prettier-ignore
  return { component, operator, value, conditionType, idField, listId, conditionTypeName, listIdName}
}

/**
 * @param {FormDefinition} definition
 * @param { ValidationFailure<FormEditor> | undefined } validation
 * @param {ConditionSessionState} state
 */
export function buildConditionEditor(definition, validation, state) {
  const componentItems = definition.pages
    .map(withPageNumbers)
    .filter(({ page }) => withConditionSupport(page))
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

  const legendText = `${state.id !== 'new' ? 'Edit' : 'Create new'} condition`
  const { conditionWrapper } = state

  const conditionFieldsList = (
    conditionWrapper?.items ?? [/** @type {ConditionDataV2} */ ({})]
  ).map((item, idx) => {
    return buildConditionsFields(
      idx,
      componentItems,
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
    value: conditionWrapper?.displayName,
    hint: {
      text: "Condition names help you to identify conditions in your form, for example, 'Not a farmer'. Users will not see condition names."
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

  return {
    legendText,
    conditionFieldsList,
    displayNameField,
    coordinator
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {ConditionSessionState} state
 * @param {string[]} [notification]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function conditionViewModel(
  metadata,
  definition,
  state,
  notification,
  validation
) {
  const formSlug = metadata.slug
  const formPath = formOverviewPath(formSlug)
  const navigation = getFormSpecificNavigation(formPath, metadata, definition)
  const pageHeading = 'Manage conditions'
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`
  const { formErrors } = validation ?? {}

  return {
    backLink: {
      href: editorFormPath(metadata.slug, 'conditions'),
      text: BACK_TO_MANAGE_CONDITIONS
    },
    pageTitle,
    pageHeading: {
      text: pageHeading,
      size: 'large'
    },
    useNewMasthead: true,
    formSlug,
    navigation,
    pageCaption: {
      text: pageCaption
    },
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    notification,
    conditionEditor: buildConditionEditor(definition, validation, state)
  }
}

/**
 * @typedef {object} ConditionPageState
 * @property {string} [selectedComponentId] - The component id
 * @property {string} [selectedOperator] - The operator
 * @property {string} [displayName] - The condition display name
 */

/**
 * @import { ConditionalComponentsDef, ConditionDataV2, ConditionRefDataV2, ConditionSessionState, FormMetadata, FormDefinition, FormEditor, Page, OperatorName } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
