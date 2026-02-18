import { insertValidationErrors } from '~/src/lib/utils.js'
import { checkAnswersSettingsBaseViewModel } from '~/src/models/forms/editor-v2/check-answers-overview.js'
import { GOVUK_LABEL__M } from '~/src/models/forms/editor-v2/common.js'
import { enrichPreviewModel } from '~/src/models/forms/editor-v2/preview-helpers.js'
import {
  CHECK_ANSWERS_CAPTION,
  CHECK_ANSWERS_TAB_DECLARATION,
  getCheckAnswersTabConfig
} from '~/src/models/forms/editor-v2/tab-config.js'

/**
 * @param {string | undefined} needDeclarationVal
 * @param {string | undefined} declarationTextVal
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function settingsFields(
  needDeclarationVal,
  declarationTextVal,
  validation
) {
  return {
    needDeclaration: {
      name: 'needDeclaration',
      id: 'needDeclaration',
      hint: {
        text: 'Use a declaration if you need users to declare or agree to something before they submit the form'
      },
      items: [
        {
          value: 'false',
          text: 'No'
        },
        {
          value: 'true',
          text: 'Yes'
        }
      ],
      value: needDeclarationVal,
      ...insertValidationErrors(validation?.formErrors.needDeclaration)
    },
    declarationText: {
      name: 'declarationText',
      id: 'declarationText',
      label: {
        text: 'Declaration text',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Use a declaration if you need users to declare or agree to something before they submit the form'
      },
      rows: 3,
      value: declarationTextVal,
      ...insertValidationErrors(validation?.formErrors.declarationText)
    }
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {ValidationFailure<FormEditor>} [validation]
 * @param {string[]} [notification]
 */
export function checkAnswersSettingsViewModel(
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
    'Declaration',
    validation,
    notification
  )

  const fields = settingsFields(
    model.needDeclaration ? 'true' : 'false',
    model.declarationText,
    validation
  )

  const basePreviewModel = model.previewModel
  const previewModel = enrichPreviewModel(basePreviewModel, definition)

  return {
    ...model,
    fields,
    cardCaption: CHECK_ANSWERS_CAPTION,
    tabConfig: getCheckAnswersTabConfig(
      metadata.slug,
      pageId,
      CHECK_ANSWERS_TAB_DECLARATION
    ),
    previewModel
  }
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
