import {
  ComponentType,
  ControllerType,
  FormStatus,
  SummaryPageController,
  hasComponentsEvenIfNoNext
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  getPageFromDefinition,
  insertValidationErrors,
  stringHasValue
} from '~/src/lib/utils.js'
import {
  SAVE_AND_CONTINUE,
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { SummaryPreviewSSR } from '~/src/models/forms/editor-v2/preview/page-preview.js'
import {
  DECLARATION_PREVIEW_TITLE,
  SUMMARY_CONTROLLER_TEMPLATE,
  buildPreviewUrl,
  enrichPreviewModel
} from '~/src/models/forms/editor-v2/preview-helpers.js'
import { dummyRenderer } from '~/src/models/forms/editor-v2/questions.js'
import {
  CHECK_ANSWERS_CAPTION,
  CHECK_ANSWERS_TAB_CONFIRMATION_EMAILS,
  getCheckAnswersTabConfig
} from '~/src/models/forms/editor-v2/tab-config.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * Constructs the settings fields for the confirmation email settings page, specifically the radio button options.
 * @param {string | undefined} disableConfirmationEmailVal
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function settingsFields(disableConfirmationEmailVal, validation) {
  return {
    disableConfirmationEmail: {
      name: 'disableConfirmationEmail',
      id: 'disableConfirmationEmail',
      items: [
        {
          value: 'true',
          text: 'Turn off the confirmation email',
          checked: disableConfirmationEmailVal === 'true'
        }
      ],
      ...insertValidationErrors(validation?.formErrors.disableConfirmationEmail)
    }
  }
}

/**
 * @param { Page | undefined } page
 * @param {FormDefinition} definition
 * @param {string} previewPageUrl
 * @param {string} declarationText
 * @param {boolean} needDeclaration
 * @param {boolean} showConfirmationEmail
 * @returns {PagePreviewPanelMacro & PreviewModelExtras}
 */
export function getPreviewModel(
  page,
  definition,
  previewPageUrl,
  declarationText,
  needDeclaration,
  showConfirmationEmail
) {
  const elements = new SummaryPreviewSSR(
    page,
    declarationText,
    needDeclaration,
    showConfirmationEmail
  )

  const previewPageController = new SummaryPageController(
    elements,
    definition,
    dummyRenderer
  )

  return {
    previewTitle: DECLARATION_PREVIEW_TITLE,
    pageTitle: previewPageController.pageTitle,
    components: previewPageController.components,
    guidance: previewPageController.guidance,
    sectionTitle: previewPageController.sectionTitle,
    buttonText: previewPageController.buttonText,
    previewPageUrl,
    questionType: ComponentType.TextField,
    componentRows: previewPageController.componentRows,
    hasPageSettingsTab: true,
    showConfirmationEmail: previewPageController.showConfirmationEmail,
    declarationText,
    needDeclaration,
    isConfirmationEmailSettingsPanel: true
  }
}

/**
 * Creates the view model for the confirmation email settings page.
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {ValidationFailure<FormEditor>} [validation]
 * @param {string[]} [notification]
 */
export function confirmationEmailSettingsViewModel(
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

  const disableConfirmationEmailVal =
    page?.controller === ControllerType.Summary ? 'true' : 'false'
  const showConfirmationEmail = page?.controller !== ControllerType.Summary
  const fields = settingsFields(disableConfirmationEmailVal, validation)
  const pageHeading = 'Confirmation email'
  const previewPageUrl = `${buildPreviewUrl(metadata.slug, FormStatus.Draft)}${page?.path}?force`

  const basePreviewModel = getPreviewModel(
    page,
    definition,
    previewPageUrl,
    declarationText,
    needDeclaration,
    showConfirmationEmail
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
      CHECK_ANSWERS_TAB_CONFIRMATION_EMAILS
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
