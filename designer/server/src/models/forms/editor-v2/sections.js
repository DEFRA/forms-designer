import {
  ControllerType,
  FormStatus,
  getPageTitle,
  isPaymentPage,
  isSummaryPage
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { getPageFromDefinition } from '~/src/lib/utils.js'
import {
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { isGuidancePage } from '~/src/models/forms/editor-v2/pages.js'
import {
  buildPreviewUrl,
  buildSectionsForPreview,
  getDeclarationInfo,
  getPaymentInfo
} from '~/src/models/forms/editor-v2/preview-helpers.js'
import {
  CHECK_ANSWERS_CAPTION,
  CHECK_ANSWERS_TAB_SECTIONS,
  getCheckAnswersTabConfig
} from '~/src/models/forms/editor-v2/tab-config.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * @typedef {object} PageSummary
 * @property {string} id - The unique identifier of the page
 * @property {string} path - The URL path for the page
 * @property {string} title - The display title of the page
 * @property {boolean} isGuidance - Whether this is a guidance-only page
 */

/**
 * @typedef {object} SectionWithPages
 * @property {string} id - The unique ID of the section
 * @property {string} name - The internal name/identifier of the section
 * @property {string} title - The display title of the section
 * @property {boolean} hideTitle - Whether to hide the section title in the form
 * @property {number} number - The section number for display
 * @property {Array<PageSummary>} pages - List of pages assigned to this section
 */

/**
 * Build sections with their assigned pages
 * @param {FormDefinition} definition
 * @returns {Array<SectionWithPages>}
 */
function buildSectionsWithPages(definition) {
  const sections = definition.sections
  const pages = definition.pages

  return sections.map((section, index) => ({
    id: section.id ?? '',
    name: section.name,
    title: section.title,
    hideTitle: section.hideTitle ?? false,
    number: index + 1,
    pages: pages
      .filter((page) => page.section === section.id)
      .map((page) => ({
        id: page.id ?? '',
        path: page.path,
        title: getPageTitle(page),
        isGuidance: isGuidancePage(page)
      }))
  }))
}

/**
 * Get unassigned pages that can be assigned to sections
 * Excludes Summary and Status pages as they shouldn't appear in check answers
 * @param {FormDefinition} definition
 * @returns {Array<PageSummary>}
 */
function getUnassignedPages(definition) {
  return definition.pages
    .filter(
      (page) =>
        !page.section &&
        !isSummaryPage(page) &&
        page.controller !== ControllerType.Status &&
        !isPaymentPage(page)
    )
    .map((page) => ({
      id: page.id ?? '',
      path: page.path,
      title: getPageTitle(page),
      isGuidance: isGuidancePage(page)
    }))
}

/**
 * Get unassigned pages for preview, excluding guidance pages
 * Guidance pages can be assigned to sections but won't appear on the check answers page
 * @param {FormDefinition} definition
 * @returns {Array<PageSummary>}
 */
function getUnassignedPagesForPreview(definition) {
  return getUnassignedPages(definition).filter((page) => !page.isGuidance)
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {ValidationFailure<FormEditor>} [validation]
 * @param {string[]} [notification]
 */
export function sectionsViewModel(
  metadata,
  definition,
  pageId,
  validation,
  notification
) {
  const { title: formTitle, slug } = metadata
  const pageTitle = 'Add and organise sections'
  const formPath = formOverviewPath(slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  const sectionsWithPages = buildSectionsWithPages(definition)
  const unassignedPages = getUnassignedPages(definition)
  const previewSections = buildSectionsForPreview(definition)
  const previewUnassignedPages = getUnassignedPagesForPreview(definition)

  const currentPath = `/library/${slug}/editor-v2/page/${pageId}/check-answers-settings/sections`

  const page = getPageFromDefinition(definition, pageId)
  const previewPageUrl = `${buildPreviewUrl(slug, FormStatus.Draft)}${page?.path}?force`
  const declarationInfo = getDeclarationInfo(page)
  const showConfirmationEmail = page?.controller !== ControllerType.Summary

  return {
    ...baseModelFields(slug, `${pageTitle} - ${formTitle}`, formTitle),
    pageId,
    slug,
    pageTitle,
    cardTitle: pageTitle,
    cardCaption: CHECK_ANSWERS_CAPTION,
    tabConfig: getCheckAnswersTabConfig(
      slug,
      pageId,
      CHECK_ANSWERS_TAB_SECTIONS
    ),
    sections: sectionsWithPages,
    unassignedPages,
    currentPath,
    navigation,
    errorList: buildErrorList(validation?.formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    previewModel: {
      sections: previewSections,
      unassignedPages: previewUnassignedPages,
      declaration: declarationInfo,
      showConfirmationEmail,
      payment: getPaymentInfo(definition)
    },
    previewPageUrl,
    notification,
    editorv2Path,
    renameSectionUrl: editorv2Path(slug, `page/${pageId}/rename-section`)
  }
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
