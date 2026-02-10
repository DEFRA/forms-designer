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
  GOVUK_LABEL__M,
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
  CHECK_ANSWERS_TAB_DECLARATION,
  getCheckAnswersTabConfig
} from '~/src/models/forms/editor-v2/tab-config.js'
import { formOverviewPath } from '~/src/models/links.js'

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
  const showConfirmationEmail = page?.controller !== ControllerType.Summary
  const showReferenceNumber = definition.options?.showReferenceNumber ?? false
  const fields = settingsFields(
    needDeclaration ? 'true' : 'false',
    declarationText,
    validation
  )
  const pageHeading = 'Declaration'
  const previewPageUrl = `${buildPreviewUrl(metadata.slug, FormStatus.Draft)}${page?.path}?force`

  // prettier-ignore
  const basePreviewModel = getPreviewModel(
    page, definition, previewPageUrl, declarationText, needDeclaration, showConfirmationEmail, showReferenceNumber
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
      CHECK_ANSWERS_TAB_DECLARATION
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
    notification
  }
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor, MarkdownComponent, Page, PagePreviewPanelMacro } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 * @import { PreviewModelExtras } from '~/src/models/forms/editor-v2/preview-helpers.js'
 */
