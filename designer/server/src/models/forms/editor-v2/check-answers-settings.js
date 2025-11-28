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
 * @param { Page | undefined } page
 * @param {FormDefinition} definition
 * @param {string} previewPageUrl
 * @param {ReturnType<typeof settingsFields>} fields
 * @param {boolean} showConfirmationEmail
 * @returns {PagePreviewPanelMacro & PreviewModelExtras}
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
    previewTitle: DECLARATION_PREVIEW_TITLE,
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
  const pageHeading = 'Declaration'
  const previewPageUrl = `${buildPreviewUrl(metadata.slug, FormStatus.Draft)}${page?.path}?force`

  // prettier-ignore
  const basePreviewModel = getPreviewModel(
    page, definition, previewPageUrl, fields, showConfirmationEmail
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
    tabConfig: getCheckAnswersTabConfig(CHECK_ANSWERS_TAB_DECLARATION),
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
