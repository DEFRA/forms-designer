import {
  ComponentType,
  FormStatus,
  hasComponentsEvenIfNoNext
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { getPageFromDefinition, stringHasValue } from '~/src/lib/utils.js'
import {
  BACK_TO_ADD_AND_EDIT_PAGES,
  baseModelFields,
  buildPreviewUrl,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { isGuidancePage } from '~/src/models/forms/editor-v2/pages.js'
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
    name: section.name,
    title: section.title,
    hideTitle: section.hideTitle ?? false,
    number: index + 1,
    pages: pages
      .filter((page) => page.section === section.name)
      .map((page) => ({
        id: page.id ?? '',
        path: page.path,
        title: page.title,
        isGuidance: isGuidancePage(page)
      }))
  }))
}

/**
 * Get unassigned pages (excludes the current CYA page)
 * @param {FormDefinition} definition
 * @param {string} currentPageId - The CYA page ID to exclude
 * @returns {Array<PageSummary>}
 */
function getUnassignedPages(definition, currentPageId) {
  return definition.pages
    .filter((page) => page.id !== currentPageId && !page.section)
    .map((page) => ({
      id: page.id ?? '',
      path: page.path,
      title: page.title,
      isGuidance: isGuidancePage(page)
    }))
}

/**
 * Get all unassigned pages for preview (no exclusions)
 * @param {FormDefinition} definition
 * @returns {Array<PageSummary>}
 */
function getUnassignedPagesForPreview(definition) {
  return definition.pages
    .filter((page) => !page.section)
    .map((page) => ({
      id: page.id ?? '',
      path: page.path,
      title: page.title,
      isGuidance: isGuidancePage(page)
    }))
}

/**
 * Get declaration info from the CYA page
 * @param {Page | undefined} page
 * @returns {{ hasDeclaration: boolean, declarationText: string }}
 */
function getDeclarationInfo(page) {
  const components = hasComponentsEvenIfNoNext(page) ? page.components : []

  const guidanceComponent = /** @type { MarkdownComponent | undefined } */ (
    components.find((comp, idx) => {
      return comp.type === ComponentType.Markdown && idx === 0
    })
  )

  const declarationText = guidanceComponent?.content ?? ''

  return {
    hasDeclaration: stringHasValue(declarationText),
    declarationText
  }
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
  const unassignedPages = getUnassignedPages(definition, pageId)
  const previewUnassignedPages = getUnassignedPagesForPreview(definition)

  const currentPath = `/library/${slug}/editor-v2/page/${pageId}/check-answers-settings/sections`

  const page = getPageFromDefinition(definition, pageId)
  const previewPageUrl = `${buildPreviewUrl(slug, FormStatus.Draft)}${page?.path}?force`
  const declarationInfo = getDeclarationInfo(page)

  return {
    ...baseModelFields(slug, `${pageTitle} - ${formTitle}`, formTitle),
    pageId,
    slug,
    pageTitle,
    cardTitle: pageTitle,
    cardCaption: 'Check answers',
    sections: sectionsWithPages,
    unassignedPages,
    currentPath,
    backLink: {
      href: editorv2Path(slug, `page/${pageId}/check-answers-settings`),
      text: BACK_TO_ADD_AND_EDIT_PAGES
    },
    navigation,
    errorList: buildErrorList(validation?.formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    previewModel: {
      sections: sectionsWithPages,
      unassignedPages: previewUnassignedPages,
      declaration: declarationInfo
    },
    previewPageUrl,
    notification,
    editorv2Path
  }
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor, MarkdownComponent, Page } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
