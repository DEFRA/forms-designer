import { FormStatus } from '@defra/forms-model'

import { insertValidationErrors } from '~/src/lib/utils.js'
import { checkAnswersSettingsBaseViewModel } from '~/src/models/forms/editor-v2/check-answers-overview.js'
import {
  buildPreviewUrl,
  enrichPreviewModel
} from '~/src/models/forms/editor-v2/preview-helpers.js'
import {
  CHECK_ANSWERS_CAPTION,
  CHECK_ANSWERS_TAB_USER_FEEDBACK,
  getCheckAnswersTabConfig
} from '~/src/models/forms/editor-v2/tab-config.js'

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
  const model = checkAnswersSettingsBaseViewModel(
    metadata,
    definition,
    pageId,
    'User feedback',
    validation,
    notification
  )

  const disableUserFeedback = definition.options?.disableUserFeedback ?? false
  const fields = settingsFields(disableUserFeedback, validation)
  const feedbackPageUrl = buildPreviewUrl('feedback', FormStatus.Live)

  const basePreviewModel = model.previewModel
  const previewModel = enrichPreviewModel(basePreviewModel, definition)

  return {
    ...model,
    fields,
    cardCaption: CHECK_ANSWERS_CAPTION,
    tabConfig: getCheckAnswersTabConfig(
      metadata.slug,
      pageId,
      CHECK_ANSWERS_TAB_USER_FEEDBACK
    ),
    previewModel,
    feedbackPageUrl
  }
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor, MarkdownComponent } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
