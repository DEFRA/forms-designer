import {
  FormStatus,
  getOperatorNames,
  hasComponentsEvenIfNoNext,
  hasConditionSupport
} from '@defra/forms-model'
import upperFirst from 'lodash/upperFirst.js'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  BACK_TO_MANAGE_CONDITIONS,
  buildPreviewUrl,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import {
  withConditionSupport,
  withPageNumbers
} from '~/src/models/forms/editor-v2/pages-helper.js'
import { editorFormPath, formOverviewPath } from '~/src/models/links.js'

/**
 * @param {string} slug
 * @param {FormDefinition} definition
 * @param {ConditionPageState} [state]
 * @param {ConditionWrapperV2} [condition]
 */
export function buildConditionEditor(slug, definition, state, condition) {
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

  const legendText = `${condition ? 'Edit' : 'Create new'} condition`
  const { selectedComponentId, selectedOperator, displayName } = state ?? {}

  const component = {
    id: 'componentId',
    name: 'componentId',
    label: {
      text: 'Select a question'
    },
    items: componentItems,
    value: selectedComponentId
  }

  const confirmSelectComponentAction = editorFormPath(
    slug,
    `condition/set-component${condition ? `/${condition.id}` : ''}`
  )
  const confirmSelectOperatorAction = editorFormPath(
    slug,
    `condition/set-operator${condition ? `/${condition.id}` : ''}?componentId=${selectedComponentId}`
  )

  const operator = selectedComponentId
    ? {
        id: 'operator',
        name: 'operator',
        label: {
          text: 'Condition type'
        },
        items: [{ text: 'Select a condition type', value: '' }].concat(
          ...getOperatorNames(
            componentItems
              .flatMap(({ components }) => components)
              .find((c) => c.id === selectedComponentId)?.type
          ).map((value) => ({ text: upperFirst(value), value }))
        ),
        value: selectedOperator,
        formGroup: {
          afterInput: {
            html: `<button class="govuk-button govuk-!-margin-bottom-0" name="confirmSelectOperator" type="submit"
      value="true" formaction="${confirmSelectOperatorAction}">Select</button>`
          }
        }
      }
    : undefined

  const displayNameField = {
    id: 'displayName',
    name: 'displayName',
    label: {
      text: 'Condition name'
    },
    value: displayName,
    hint: {
      text: "Condition names help you to identify conditions in your form, for example, 'Not a farmer'. Users will not see condition names."
    }
  }

  return {
    legendText,
    component,
    operator,
    value: undefined,
    displayNameField,
    confirmSelectComponentAction
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {ConditionPageState} [state]
 * @param {ConditionWrapperV2} [condition]
 * @param {string[]} [notification]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function conditionViewModel(
  metadata,
  definition,
  state,
  condition,
  notification,
  validation
) {
  const formSlug = metadata.slug
  const formPath = formOverviewPath(formSlug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const previewBaseUrl = buildPreviewUrl(metadata.slug, FormStatus.Draft)
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
    previewBaseUrl,
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
      state,
      condition
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
 * @import { FormMetadata, FormDefinition, FormEditor, ConditionWrapperV2 } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
