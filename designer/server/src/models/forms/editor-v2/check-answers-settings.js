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
  GOVUK_LABEL__M,
  SAVE_AND_CONTINUE,
  baseModelFields,
  buildPreviewUrl,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { SummaryPreviewSSR } from '~/src/models/forms/editor-v2/preview/page-preview.js'
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

export const dummyRenderer = {
  /**
   * @param {string} _a
   * @param {PagePreviewPanelMacro} _b
   * @returns {never}
   */
  render(_a, _b) {
    // Server Side Render shouldn't use render
    throw new Error('Not implemented')
  }
}

/**
 * @param { Page | undefined } page
 * @param {FormDefinition} definition
 * @param {string} previewPageUrl
 * @param {ReturnType<typeof settingsFields>} fields
 * @param {boolean} showConfirmationEmail
 * @returns {PagePreviewPanelMacro & {
 *    previewPageUrl: string;
 *    questionType?: ComponentType,
 *    previewTitle?: string,
 *    componentRows: { rows: { key: { text: string }, value: { text: string } }[] },
 *    buttonText: string,
 *    hasPageSettingsTab: boolean,
 *    showConfirmationEmail: boolean,
 *    declarationText: string,
 *    needDeclaration: boolean,
 *    isConfirmationEmailSettingsPanel: boolean
 * }}
 */
export function getPreviewModel(
  page,
  definition,
  previewPageUrl,
  fields,
  showConfirmationEmail
) {
  const declarationText = fields.declarationText.value ?? ''
  const needDeclaration = Boolean(fields.needDeclaration.value)

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
    previewTitle: 'Preview of Check answers page',
    pageTitle: previewPageController.pageTitle,
    components: previewPageController.components,
    guidance: previewPageController.guidance,
    sectionTitle: previewPageController.sectionTitle,
    buttonText: previewPageController.buttonText,
    previewPageUrl,
    questionType: ComponentType.TextField, // components[0]?.type
    componentRows: previewPageController.componentRows,
    hasPageSettingsTab: true,
    showConfirmationEmail: previewPageController.showConfirmationEmail,
    declarationText,
    needDeclaration,
    isConfirmationEmailSettingsPanel: false
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
  const { formValues, formErrors } = validation ?? {}

  const page = getPageFromDefinition(definition, pageId)
  const components = hasComponentsEvenIfNoNext(page) ? page.components : []

  const guidanceComponent = /** @type { MarkdownComponent | undefined } */ (
    components.find((comp, idx) => {
      return comp.type === ComponentType.Markdown && idx === 0
    })
  )

  const declarationTextVal =
    formValues?.declarationText ?? guidanceComponent?.content
  const needDeclarationVal =
    formValues?.needDeclaration ?? `${stringHasValue(declarationTextVal)}`
  const showConfirmationEmail = page?.controller !== ControllerType.Summary
  const fields = settingsFields(
    needDeclarationVal,
    declarationTextVal,
    validation
  )
  const pageHeading = 'Page settings'
  const previewPageUrl = `${buildPreviewUrl(metadata.slug, FormStatus.Draft)}${page?.path}?force`

  // prettier-ignore
  const previewModel = getPreviewModel(
    page, definition, previewPageUrl, fields, showConfirmationEmail
  )

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
