import { FormStatus } from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { insertValidationErrors } from '~/src/lib/utils.js'
import {
  baseModelFields,
  buildPreviewUrl,
  getFormSpecificNavigation,
  toPresentationStringV2
} from '~/src/models/forms/editor-v2/common.js'
import { getConditionsData } from '~/src/models/forms/editor-v2/page-conditions.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {ValidationFailure<any>} [validation]
 * @param {string[]} [notification]
 */
export function conditionsJoinViewModel(
  metadata,
  definition,
  validation,
  notification
) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )
  const { formValues, formErrors } = validation ?? {}
  const previewBaseUrl = buildPreviewUrl(metadata.slug, FormStatus.Draft)
  const pageHeading = 'Manage conditions'
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`
  const errorList = buildErrorList(formErrors)

  const allConditions = getConditionsData(definition)

  const conditions = {
    id: 'conditions',
    name: 'conditions',
    fieldset: {
      legend: {
        text: "Joined conditions",
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--m'
      }
    },
    hint: {
      text: 'Select at least two conditions'
    },
    classes: 'govuk-checkboxes--small',
    items: allConditions.map(cond => ({
      text: cond.displayName,
      label: {
        classes: 'govuk-!-font-weight-bold'
      },
      hint: {
        text: toPresentationStringV2(cond, definition)
      },
      value: cond.id,
      checked: formValues?.conditions?.includes(cond.id)
    })),
    ...insertValidationErrors(validation?.formErrors.conditions)
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
    value: formValues?.coordinator,
    items: [
      { text: 'All conditions must be met (AND)', value: 'and' },
      { text: 'Any condition can be met (OR)', value: 'or' }
    ],
    ...insertValidationErrors(validation?.formErrors.coordinator)
  }

  const displayName = {
    id: 'displayName',
    name: 'displayName',
    label: {
      text: 'Name for joined condition',
      classes: 'govuk-label--m'
    },
    classes: 'govuk-input--width-30',
    value: formValues?.displayName,
    hint: {
      text: 'Condition names help you to identify conditions in your form, for example, ‘Not a farmer’. Users will not see condition names.'
    },
    ...insertValidationErrors(validation?.formErrors.displayName)
  }


  return {
    ...baseModelFields(metadata.slug, pageTitle, pageHeading),
    formSlug: metadata.slug,
    previewBaseUrl,
    cardTitle: 'Edit conditions',
    navigation,
    pageCaption: {
      text: pageCaption
    },
    errorList,
    notification,
    fields: {
      conditions,
      coordinator,
      displayName
    }
  }
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
