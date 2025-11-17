import {
  ComponentType,
  ControllerType,
  FormStatus,
  SummaryPageController
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  getPageFromDefinition,
  insertValidationErrors
} from '~/src/lib/utils.js'
import {
  SAVE_AND_CONTINUE,
  baseModelFields,
  buildPreviewUrl,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { SummaryPreviewSSR } from '~/src/models/forms/editor-v2/preview/page-preview.js'
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
          value: 'false',
          text: 'No'
        },
        {
          value: 'true',
          text: 'Yes, I have an equivalent confirmation process'
        }
      ],
      value: disableConfirmationEmailVal,
      ...insertValidationErrors(validation?.formErrors.disableConfirmationEmail)
    }
  }
}

export const emptyRenderer = {
  /**
   * @param {string} _a
   * @param {PagePreviewPanelMacro} _b
   * @returns {void}
   */
  render(_a, _b) {
    // Nothing to do here.
  }
}

/**
 * @param { Page | undefined } page
 * @param {FormDefinition} definition
 * @param {string} previewPageUrl
 * @returns {PagePreviewPanelMacro & {
 *    previewPageUrl: string;
 *    questionType?: ComponentType,
 *    previewTitle?: string,
 *    componentRows: { rows: { key: { text: string }, value: { text: string } }[] },
 *    buttonText: string,
 *    hasPageSettingsTab: boolean
 * }}
 */
export function getPreviewModel(page, definition, previewPageUrl) {
  const elements = new SummaryPreviewSSR(page, '', false)

  const previewPageController = new SummaryPageController(
    elements,
    definition,
    emptyRenderer
  )

  return {
    previewTitle: 'Preview of Check answers page',
    pageTitle: previewPageController.pageTitle,
    components: previewPageController.components,
    guidance: previewPageController.guidance,
    sectionTitle: previewPageController.sectionTitle,
    buttonText: previewPageController.buttonText,
    previewPageUrl,
    questionType: ComponentType.TextField,
    componentRows: previewPageController.componentRows,
    hasPageSettingsTab: true
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

  const disableConfirmationEmailVal =
    page?.controller === ControllerType.Summary ? 'true' : 'false'
  const fields = settingsFields(disableConfirmationEmailVal, validation)
  const pageHeading = 'Confirmation emails'
  const previewPageUrl = `${buildPreviewUrl(metadata.slug, FormStatus.Draft)}${page?.path}?force`

  const previewModel = getPreviewModel(page, definition, previewPageUrl)

  return {
    ...baseModelFields(
      metadata.slug,
      `${pageHeading} - ${formTitle}`,
      formTitle
    ),
    fields,
    cardTitle: pageHeading,
    cardCaption: 'Check answers',
    cardHeading: pageHeading,
    navigation,
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    previewModel,
    preview: {
      pageId: page?.id,
      definitionId: metadata.id,
      pageTemplate: 'summary-controller.njk'
    },
    buttonText: SAVE_AND_CONTINUE,
    notification
  }
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor, MarkdownComponent, Page, PagePreviewPanelMacro } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
