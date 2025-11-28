import {
  ComponentType,
  ControllerType,
  getPageTitle,
  hasComponentsEvenIfNoNext,
  isSummaryPage
} from '@defra/forms-model'

import config from '~/src/config.js'
import { stringHasValue } from '~/src/lib/utils.js'
import { isGuidancePage } from '~/src/models/forms/editor-v2/pages.js'

export const DEFAULT_TRUNCATE_LENGTH = 50
export const DECLARATION_PREVIEW_TITLE = 'Preview of Check answers page'
export const SUMMARY_CONTROLLER_TEMPLATE = 'summary-controller.njk'

/**
 * Truncate text to a maximum length
 * @param {string} text - The text to truncate
 * @param {number} [maxLength] - Maximum length (defaults to DEFAULT_TRUNCATE_LENGTH)
 * @returns {string} The truncated text with ellipsis if needed
 */
export function truncateText(text, maxLength = DEFAULT_TRUNCATE_LENGTH) {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + '...'
}

/**
 * Builds a live form URL based on its slug.
 * @param {string} slug - The unique identifier for the form.
 */
export function buildFormUrl(slug) {
  const encodedSlug = encodeURIComponent(slug)

  return `${config.previewUrl}/form/${encodedSlug}`
}

/**
 * Builds a URL for previewing a form based on its slug and status.
 * @param {string} slug - The unique identifier for the form.
 * @param {FormStatus} status - The current status of the form.
 */
export function buildPreviewUrl(slug, status) {
  const encodedSlug = encodeURIComponent(slug)
  const encodedStatus = encodeURIComponent(status)

  return `${config.previewUrl}/form/preview/${encodedStatus}/${encodedSlug}`
}

/**
 * Builds a URL for previewing error messages for a question based on its slug.
 * @param {string} slug - The unique identifier for the form.
 */
export function buildPreviewErrorsUrl(slug) {
  const encodedSlug = encodeURIComponent(slug)

  return `${config.previewUrl}/error-preview/draft/${encodedSlug}`
}

/**
 * Build sections with their assigned pages for preview
 * Excludes guidance-only pages as they don't appear on the check answers page
 * @param {FormDefinition} definition
 * @returns {Array<{ name: string, title: string, pages: Array<{ title: string }> }>}
 */
export function buildSectionsForPreview(definition) {
  const sections = definition.sections
  const pages = definition.pages

  return sections.map((section) => ({
    name: section.name,
    title: section.title,
    pages: pages
      .filter((page) => page.section === section.name && !isGuidancePage(page))
      .map((page) => ({
        title: getPageTitle(page)
      }))
  }))
}

/**
 * Get unassigned page titles for preview
 * Excludes Summary, Status, and guidance-only pages as they don't appear on check answers
 * @param {FormDefinition} definition
 * @returns {Array<{ title: string }>}
 */
export function getUnassignedPageTitlesForPreview(definition) {
  const pages = definition.pages
  return pages
    .filter(
      (page) =>
        !page.section &&
        !isSummaryPage(page) &&
        page.controller !== ControllerType.Status &&
        !isGuidancePage(page)
    )
    .map((page) => ({
      title: getPageTitle(page)
    }))
}

/**
 * Get declaration info from the CYA page
 * @param {Page | undefined} page
 * @returns {{ hasDeclaration: boolean, declarationText: string }}
 */
export function getDeclarationInfo(page) {
  const components = hasComponentsEvenIfNoNext(page) ? page.components : []

  const guidanceComponent = /** @type {MarkdownComponent | undefined} */ (
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
 * @typedef {object} BasePreviewModel
 * @property {boolean} needDeclaration - Whether declaration is required
 * @property {string} declarationText - Declaration text content
 */

/**
 * Enriches a base preview model with sections, unassigned pages, and declaration info.
 * Uses spread pattern to avoid mutation of the original model.
 * @template {BasePreviewModel} T
 * @param {T} basePreviewModel - The base preview model to enrich
 * @param {FormDefinition} definition - The form definition
 * @returns {T & { sections: ReturnType<typeof buildSectionsForPreview>, unassignedPages: ReturnType<typeof getUnassignedPageTitlesForPreview>, declaration: { hasDeclaration: boolean, declarationText: string } }}
 */
export function enrichPreviewModel(basePreviewModel, definition) {
  const sections = buildSectionsForPreview(definition)
  const unassignedPages = getUnassignedPageTitlesForPreview(definition)

  return {
    ...basePreviewModel,
    sections,
    unassignedPages,
    declaration: {
      hasDeclaration: basePreviewModel.needDeclaration,
      declarationText: basePreviewModel.declarationText
    }
  }
}

/**
 * @typedef {object} PreviewModelExtras - Extended preview model properties
 * @property {string} previewPageUrl - URL for previewing the page
 * @property {ComponentType} [questionType] - Type of question component
 * @property {string} [previewTitle] - Title for the preview
 * @property {{ rows: { key: { text: string }, value: { text: string } }[] }} componentRows - Component rows data
 * @property {string} buttonText - Text for the submit button
 * @property {boolean} hasPageSettingsTab - Whether page settings tab is shown
 * @property {boolean} showConfirmationEmail - Whether confirmation email is shown
 * @property {string} declarationText - Declaration text content
 * @property {boolean} needDeclaration - Whether declaration is required
 * @property {boolean} isConfirmationEmailSettingsPanel - Whether this is the confirmation email settings panel
 * @property {Array<{ name: string, title: string, pages: Array<{ title: string }> }>} [sections] - Sections for preview
 * @property {Array<{ title: string }>} [unassignedPages] - Unassigned pages for preview
 * @property {{ hasDeclaration: boolean, declarationText: string }} [declaration] - Declaration info for preview
 */

/**
 * @import { FormDefinition, FormStatus, Page, MarkdownComponent } from '@defra/forms-model'
 */
