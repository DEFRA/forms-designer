import { FormStatus } from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  baseModelFields,
  buildPreviewUrl,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import {
  buildConditionsField,
  buildCoordinatorField,
  buildDisplayNameField,
  getAvailableConditions,
  getSelectedConditions
} from '~/src/models/forms/editor-v2/conditions-join-helper.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} conditionId
 * @param {ConditionWrapperV2} [existingCondition]
 * @param {ValidationFailure<any>} [validation]
 * @param {string[]} [notification]
 */
export function conditionsJoinViewModel(
  metadata,
  definition,
  conditionId,
  existingCondition,
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

  const allConditions = getAvailableConditions(definition, conditionId)
  const selectedConditions = getSelectedConditions(
    formValues,
    existingCondition
  )

  const conditions = buildConditionsField(
    allConditions,
    selectedConditions,
    definition,
    validation
  )

  const coordinator = buildCoordinatorField(
    formValues,
    existingCondition,
    validation
  )

  const displayName = buildDisplayNameField(
    formValues,
    existingCondition,
    validation
  )

  const cardTitle =
    conditionId === 'new' ? 'Create joined condition' : 'Edit joined condition'

  return {
    ...baseModelFields(metadata.slug, pageTitle, pageHeading),
    formSlug: metadata.slug,
    previewBaseUrl,
    cardTitle,
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
    },
    existingCondition,
    conditionId,
    backLink: {
      href: `/library/${metadata.slug}/editor-v2/conditions`,
      text: 'Back to conditions'
    }
  }
}

/**
 * @import { FormMetadata, FormDefinition, ConditionWrapperV2, ConditionRefDataV2 } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
