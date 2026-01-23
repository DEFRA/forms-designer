import { ControllerType, FormStatus } from '@defra/forms-model'

import { getPageFromDefinition } from '~/src/lib/utils.js'
import {
  BACK_TO_ADD_AND_EDIT_PAGES,
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import {
  SUMMARY_CONTROLLER_TEMPLATE,
  buildPreviewUrl,
  buildSectionsForPreview,
  getDeclarationInfo,
  getUnassignedPageTitlesForPreview
} from '~/src/models/forms/editor-v2/preview-helpers.js'
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
 */
function buildSummaries(
  slug,
  pageId,
  declarationInfo,
  sectionsSummary,
  showConfirmationEmail,
  showReferenceNumber
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
    }
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

  const previewPageUrl = `${buildPreviewUrl(slug, FormStatus.Draft)}${page?.path}?force`

  // Build preview model
  const sectionsForPreview = buildSectionsForPreview(definition)
  const unassignedPages = getUnassignedPageTitlesForPreview(definition)

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
      showReferenceNumber
    ),

    // Preview model
    previewModel: {
      sections: sectionsForPreview,
      unassignedPages,
      declaration: declarationInfo,
      showConfirmationEmail,
      declarationText: declarationInfo.declarationText,
      needDeclaration: declarationInfo.hasDeclaration,
      isConfirmationEmailSettingsPanel: false
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
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 */
