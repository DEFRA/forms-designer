import {
  ComponentType,
  ConditionType,
  OperatorName,
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
  getFormSpecificNavigation,
  toPresentationHtmlV2
} from '~/src/models/forms/editor-v2/common.js'
import { buildValueField } from '~/src/models/forms/editor-v2/condition-value.js'
import {
  hasConditionSupportForPage,
  withPageNumbers
} from '~/src/models/forms/editor-v2/pages-helper.js'
import { editorFormPath, formOverviewPath } from '~/src/models/links.js'

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
  } else {
    return ConditionType.StringValue
  }
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

  const operator = component.value
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

  const conditionType = getConditionType(selectedComponent, operatorValue)

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
  const value = 'operator' in item && component.value && operator?.value
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

  const legendText = state.id !== 'new' ? '' : 'Create new condition'
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

  const originalConditionHtml = state.originalConditionWrapper
    ? toPresentationHtmlV2(state.originalConditionWrapper, definition)
    : ''

  return {
    legendText,
    conditionFieldsList,
    displayNameField,
    coordinator,
    conditionId: state.id,
    originalConditionHtml
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
 * @import { ConditionalComponentsDef, ConditionDataV2, ConditionRefDataV2, ConditionSessionState, FormMetadata, FormDefinition, FormEditor, Page } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
