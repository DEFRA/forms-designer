import {
  getOperatorNames,
  hasComponentsEvenIfNoNext,
  hasConditionSupport
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
 * @param {number} idx
 * @param { string | undefined } id
 * @param {{ page: Page, number: number, components: ConditionalComponentsDef[], group: boolean }[]} componentItems
 * @param { ConditionDataV2 | ConditionRefDataV2 } condition
 * @param { ValidationFailure<FormEditor> | undefined } validation
 * @param {string} slug
 * @param {ConditionSessionState} state
 * @param {FormDefinition} definition
 */
export function buildConditionsFields(
  idx,
  id,
  componentItems,
  condition,
  validation,
  slug,
  state,
  definition
) {
  const idField = {
    id: 'id',
    name: `conditions[${idx}][id]`,
    value: condition.id
  }

  const component = {
    id: 'componentId',
    name: `conditions[${idx}][componentId]`,
    label: {
      text: 'Select a question'
    },
    items: componentItems,
    value: 'componentId' in condition ? condition.componentId : undefined,
    ...insertValidationErrors(validation?.formErrors.componentId)
  }

  // TODO - handle REF as well as component
  const selectedComponent =
    'componentId' in condition
      ? componentItems
          .flatMap(({ components }) => components)
          .find((c) => c.id === condition.componentId)
      : undefined

  const operator = component.value
    ? {
        id: 'operator',
        name: `conditions[${idx}][operator]`,
        label: {
          text: 'Condition type'
        },
        items: [{ text: 'Select a condition type', value: '' }].concat(
          ...getOperatorNames(selectedComponent?.type).map((value) => ({
            text: upperFirst(value),
            value
          }))
        ),
        value: 'operator' in condition ? condition.operator : undefined,
        formGroup: {
          afterInput: {
            html: `<button class="govuk-button govuk-!-margin-bottom-0" name="confirmSelectOperator" type="submit"
      value="true">Select</button>`
          }
        },
        ...insertValidationErrors(validation?.formErrors.operator)
      }
    : undefined

  const value =
    'operator' in condition && component.value
      ? {
          id: 'value',
          name: `conditions[${idx}][value]`,
          fieldset: {
            legend: {
              text: 'Select a value'
            }
          },
          classes: 'govuk-radios--small',
          value: 'value' in condition ? condition.value : undefined,
          items: getListFromComponent(selectedComponent, definition)?.items,
          ...insertValidationErrors(validation?.formErrors.value)
        }
      : undefined

  return {
    component,
    operator,
    value,
    idField
  }
}
/**
 * @param {string} slug
 * @param {FormDefinition} definition
 * @param { ValidationFailure<FormEditor> | undefined } validation
 * @param {ConditionSessionState} state
 */
export function buildConditionEditor(slug, definition, validation, state) {
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
  const { id, conditionWrapper } = state

  const conditionFieldsList = (
    conditionWrapper?.conditions ?? [/** @type {ConditionDataV2} */ ({})]
  ).map((condition, idx) => {
    return buildConditionsFields(
      idx,
      id,
      componentItems,
      condition,
      validation,
      slug,
      state,
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
    ]
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { formValues, formErrors } = validation ?? {}

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
    conditionEditor: buildConditionEditor(
      formSlug,
      definition,
      validation,
      state
    )
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
