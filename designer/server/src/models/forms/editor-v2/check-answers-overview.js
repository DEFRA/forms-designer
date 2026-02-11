import {
  ComponentType,
  ControllerType,
  FormStatus,
  SummaryPageController,
  hasComponentsEvenIfNoNext
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { getPageFromDefinition, stringHasValue } from '~/src/lib/utils.js'
import {
  BACK_TO_ADD_AND_EDIT_PAGES,
  SAVE_AND_CONTINUE,
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { SummaryPreviewSSR } from '~/src/models/forms/editor-v2/preview/page-preview.js'
import {
  DECLARATION_PREVIEW_TITLE,
  SUMMARY_CONTROLLER_TEMPLATE,
  buildPreviewUrl,
  buildSectionsForPreview,
  getDeclarationInfo,
  getPaymentInfo,
  getUnassignedPageTitlesForPreview
} from '~/src/models/forms/editor-v2/preview-helpers.js'
import { dummyRenderer } from '~/src/models/forms/editor-v2/questions.js'
import {
  CHECK_ANSWERS_TAB_PAGE_OVERVIEW,
  PAGE_OVERVIEW_TITLE,
  getCheckAnswersTabConfig
} from '~/src/models/forms/editor-v2/tab-config.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * Build sections summary for the overview
 * @param {FormDefinition} definition
 * @returns {{ count: number, titles: string[] }}
 */
function getSectionsSummary(definition) {
  const sections = definition.sections
  return {
    count: sections.length,
    titles: sections.map((section) => section.title)
  }
}

/**
 * @param {string} slug
 * @param {string} pageId
 * @param {{ hasDeclaration: boolean, declarationText: string }} declarationInfo
 * @param {{ count: number, titles: string[] }} sectionsSummary
 * @param {boolean} showConfirmationEmail
 * @param {boolean} showReferenceNumber
 * @param {boolean} disableUserFeedback
 */
function buildSummaries(
  slug,
  pageId,
  declarationInfo,
  sectionsSummary,
  showConfirmationEmail,
  showReferenceNumber,
  disableUserFeedback
) {
  return {
    // Declaration summary
    declaration: {
      hasDeclaration: declarationInfo.hasDeclaration,
      text: declarationInfo.hasDeclaration
        ? declarationInfo.declarationText
        : null,
      link: editorv2Path(
        slug,
        `page/${pageId}/check-answers-settings/declaration`
      )
    },

    // Reference number summary
    referenceNumber: {
      enabled: showReferenceNumber,
      link: editorv2Path(
        slug,
        `page/${pageId}/check-answers-settings/reference-number`
      )
    },

    // Confirmation email summary
    confirmationEmail: {
      enabled: showConfirmationEmail,
      link: editorv2Path(
        slug,
        `page/${pageId}/check-answers-settings/confirmation-email`
      )
    },

    // Sections summary
    sections: {
      count: sectionsSummary.count,
      titles: sectionsSummary.titles,
      link: editorv2Path(slug, `page/${pageId}/check-answers-settings/sections`)
    },

    // User feedback summary
    userFeedback: {
      enabled: !disableUserFeedback,
      link: editorv2Path(
        slug,
        `page/${pageId}/check-answers-settings/user-feedback`
      )
    }
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} pageHeading
 * @param {ValidationFailure<FormEditor>} [validation]
 * @param {string[]} [notification]
 */
export function checkAnswersSettingsBaseViewModel(
  metadata,
  definition,
  pageId,
  pageHeading,
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
  const page = getPageFromDefinition(definition, pageId)
  const components = hasComponentsEvenIfNoNext(page) ? page.components : []

  const { formErrors } = validation ?? {}

  const guidanceComponent = /** @type { MarkdownComponent | undefined } */ (
    components.find((comp, idx) => {
      return comp.type === ComponentType.Markdown && idx === 0
    })
  )

  const declarationText = guidanceComponent?.content ?? ''
  const needDeclaration = stringHasValue(declarationText)
  const showConfirmationEmail = page?.controller !== ControllerType.Summary
  const showReferenceNumber = definition.options?.showReferenceNumber ?? false
  const previewPageUrl = `${buildPreviewUrl(metadata.slug, FormStatus.Draft)}${page?.path}?force`

  // prettier-ignore
  const previewModel = getPreviewModel(
    page, definition, previewPageUrl, declarationText, needDeclaration, showConfirmationEmail, showReferenceNumber
  )

  return {
    ...baseModelFields(
      metadata.slug,
      `${pageHeading} - ${formTitle}`,
      formTitle
    ),
    cardTitle: pageHeading,
    cardHeading: pageHeading,
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
    notification,
    declarationText,
    needDeclaration,
    page
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 */
export function checkAnswersOverviewViewModel(metadata, definition, pageId) {
  const { title: formTitle, slug } = metadata
  const pageTitle = 'Check answers page overview'
  const formPath = formOverviewPath(slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  const page = getPageFromDefinition(definition, pageId)
  const declarationInfo = getDeclarationInfo(page)
  const showReferenceNumber = definition.options?.showReferenceNumber ?? false
  const sectionsSummary = getSectionsSummary(definition)
  const showConfirmationEmail = page?.controller !== ControllerType.Summary
  const disableUserFeedback = definition.options?.disableUserFeedback ?? false

  const previewPageUrl = `${buildPreviewUrl(slug, FormStatus.Draft)}${page?.path}?force`

  // Build preview model
  const sectionsForPreview = buildSectionsForPreview(definition)
  const unassignedPages = getUnassignedPageTitlesForPreview(definition)
  const paymentInfo = getPaymentInfo(definition, slug)

  return {
    ...baseModelFields(slug, `${pageTitle} - ${formTitle}`, formTitle),
    pageId,
    slug,
    pageTitle,
    cardTitle: PAGE_OVERVIEW_TITLE,
    cardHeading: pageTitle,
    tabConfig: getCheckAnswersTabConfig(
      slug,
      pageId,
      CHECK_ANSWERS_TAB_PAGE_OVERVIEW
    ),
    navigation,
    backLink: {
      href: editorv2Path(slug, 'pages'),
      text: BACK_TO_ADD_AND_EDIT_PAGES
    },

    ...buildSummaries(
      slug,
      pageId,
      declarationInfo,
      sectionsSummary,
      showConfirmationEmail,
      showReferenceNumber,
      disableUserFeedback
    ),

    // Preview model
    previewModel: {
      sections: sectionsForPreview,
      unassignedPages,
      declaration: declarationInfo,
      showConfirmationEmail,
      declarationText: declarationInfo.declarationText,
      needDeclaration: declarationInfo.hasDeclaration,
      isConfirmationEmailSettingsPanel: false,
      payment: paymentInfo
    },
    previewPageUrl,

    // Preview config
    preview: {
      pageId: page?.id,
      definitionId: metadata.id,
      pageTemplate: SUMMARY_CONTROLLER_TEMPLATE
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
 * @param {boolean} showReferenceNumber
 * @returns {PagePreviewPanelMacro & PreviewModelExtras}
 */
export function getPreviewModel(
  page,
  definition,
  previewPageUrl,
  declarationText,
  needDeclaration,
  showConfirmationEmail,
  showReferenceNumber
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
    showReferenceNumber,
    declarationText,
    needDeclaration,
    isConfirmationEmailSettingsPanel: true
  }
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor, MarkdownComponent, Page, PagePreviewPanelMacro } from '@defra/forms-model'
 * @import { PreviewModelExtras } from '~/src/models/forms/editor-v2/preview-helpers.js'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
