import {
  ComponentType,
  ControllerType,
  FormStatus,
  hasComponentsEvenIfNoNext
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  getPageFromDefinition,
  insertValidationErrors,
  stringHasValue
} from '~/src/lib/utils.js'
import { getPreviewModel } from '~/src/models/forms/editor-v2/check-answers-overview.js'
import {
  SAVE_AND_CONTINUE,
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import {
  SUMMARY_CONTROLLER_TEMPLATE,
  buildPreviewUrl,
  enrichPreviewModel
} from '~/src/models/forms/editor-v2/preview-helpers.js'
import {
  CHECK_ANSWERS_CAPTION,
  CHECK_ANSWERS_TAB_USER_FEEDBACK,
  getCheckAnswersTabConfig
} from '~/src/models/forms/editor-v2/tab-config.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * Constructs the settings fields for the user feedback settings page.
 * @param {boolean} disableUserFeedback
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function settingsFields(disableUserFeedback, validation) {
  return {
    disableUserFeedback: {
      name: 'disableUserFeedback',
      id: 'disableUserFeedback',
      items: [
        {
          value: 'true',
          text: 'Remove GOV.UK feedback page',
          checked: disableUserFeedback
        }
      ],
      ...insertValidationErrors(validation?.formErrors.disableUserFeedback)
    }
  }
}

/**
 * Creates the view model for the user feedback settings page.
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {ValidationFailure<FormEditor>} [validation]
 * @param {string[]} [notification]
 */
export function userFeedbackSettingsViewModel(
  metadata,
  definition,
  pageId,
  validation,
  notification
) {
  const formTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )
  const { formErrors } = validation ?? {}

  const page = getPageFromDefinition(definition, pageId)
  const components = hasComponentsEvenIfNoNext(page) ? page.components : []

  const guidanceComponent = /** @type { MarkdownComponent | undefined } */ (
    components.find((comp, idx) => {
      return comp.type === ComponentType.Markdown && idx === 0
    })
  )

  const declarationText = guidanceComponent?.content ?? ''
  const needDeclaration = stringHasValue(declarationText)

  const disableUserFeedback = definition.options?.disableUserFeedback ?? false

  const showConfirmationEmail = page?.controller !== ControllerType.Summary
  const showReferenceNumber = definition.options?.showReferenceNumber ?? false
  const fields = settingsFields(disableUserFeedback, validation)
  const pageHeading = 'User feedback'
  const previewPageUrl = `${buildPreviewUrl(metadata.slug, FormStatus.Draft)}${page?.path}?force`
  const feedbackPageUrl = buildPreviewUrl('feedback', FormStatus.Live)

  const basePreviewModel = getPreviewModel(
    page,
    definition,
    previewPageUrl,
    declarationText,
    needDeclaration,
    showConfirmationEmail,
    showReferenceNumber
  )
  const previewModel = enrichPreviewModel(basePreviewModel, definition)

  return {
    ...baseModelFields(
      metadata.slug,
      `${pageHeading} - ${formTitle}`,
      formTitle
    ),
    fields,
    cardTitle: pageHeading,
    cardCaption: CHECK_ANSWERS_CAPTION,
    cardHeading: pageHeading,
    tabConfig: getCheckAnswersTabConfig(
      metadata.slug,
      pageId,
      CHECK_ANSWERS_TAB_USER_FEEDBACK
    ),
    navigation,
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    previewModel,
    preview: {
      pageId: page?.id,
      definitionId: metadata.id,
      pageTemplate: SUMMARY_CONTROLLER_TEMPLATE
    },
    buttonText: SAVE_AND_CONTINUE,
    feedbackPageUrl,
    notification
  }
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor, MarkdownComponent } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
