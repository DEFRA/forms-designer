import '~/src/views/page-preview-component/macro.njk'
import '~/src/views/page-preview-component/template.njk'
import '~/src/views/preview-components/autocompletefield.njk'
import '~/src/views/preview-components/checkboxesfield.njk'
import '~/src/views/preview-components/date-input.njk'
import '~/src/views/preview-components/datepartsfield.njk'
import '~/src/views/preview-components/declarationfield.njk'
import '~/src/views/preview-components/eastingnorthingfield.njk'
import '~/src/views/preview-components/emailaddressfield.njk'
import '~/src/views/preview-components/fileuploadfield.njk'
import '~/src/views/preview-components/latlongfield.njk'
import '~/src/views/preview-components/markdown.njk'
import '~/src/views/preview-components/monthyearfield.njk'
import '~/src/views/preview-components/multilinetextfield.njk'
import '~/src/views/preview-components/nationalgridfieldnumberfield.njk'
import '~/src/views/preview-components/numberfield.njk'
import '~/src/views/preview-components/osgridreffield.njk'
import '~/src/views/preview-components/radios.njk'
import '~/src/views/preview-components/radiosfield.njk'
import '~/src/views/preview-components/selectfield.njk'
import '~/src/views/preview-components/telephonenumberfield.njk'
import '~/src/views/preview-components/textarea.njk'
import '~/src/views/preview-components/textfield.njk'
import '~/src/views/preview-components/ukaddressfield.njk'
import '~/src/views/preview-components/yesnofield.njk'
import '~/src/views/preview-components/hiddenfield.njk'
import '~/src/views/preview-components/unsupportedquestion.njk'
import '~/src/views/preview-controllers/page-controller.njk'
import '~/src/views/preview-controllers/summary-controller.njk'
import '~/src/views/summary-preview-component/macro.njk'
import '~/src/views/summary-preview-component/template.njk'
import {
  ComponentType,
  GuidancePageController,
  PreviewPageController,
  ReorderQuestionsPageController,
  SummaryPageController,
  hasComponents
} from '@defra/forms-model'

import { AutocompleteRendererBase } from '~/src/javascripts/preview/autocomplete-renderer.js'
import { NunjucksPageRenderer } from '~/src/javascripts/preview/nunjucks-page-renderer.js'
import { NunjucksRendererBase } from '~/src/javascripts/preview/nunjucks-renderer.js'
import { getPageAndDefinition } from '~/src/javascripts/preview/page-controller/get-page-details.js'
import {
  PagePreviewDomElements,
  PagePreviewListeners
} from '~/src/javascripts/preview/page-controller/page-controller.js'
import {
  ReorderQuestionsPagePreviewDomElements,
  ReorderQuestionsPagePreviewListeners
} from '~/src/javascripts/preview/page-controller/reorder-questions-page-controller'
import {
  SummaryPagePreviewDomElements,
  SummaryPagePreviewListeners
} from '~/src/javascripts/preview/page-controller/summary-page-controller.js'

/**
 * Get section info for a page from the definition
 * @param {Page} page
 * @param {FormDefinition} definition
 * @returns {PageSectionInfo | undefined}
 */
function getSectionInfoForPage(page, definition) {
  if (!page.section) {
    return undefined
  }
  const section = definition.sections.find((s) => s.id === page.section)
  if (!section) {
    return undefined
  }
  return {
    title: section.title,
    hideTitle: section.hideTitle === true
  }
}

/**
 * @param {Page} page
 * @param {FormDefinition} definition
 * @returns {[ComponentDef[],PagePreviewDomElements,NunjucksPageRenderer]}
 */
function baseControllerSetup(page, definition) {
  const sectionInfo = getSectionInfoForPage(page, definition)
  const elements = new PagePreviewDomElements(sectionInfo)
  const components = /** @type {ComponentDef[]} */ (
    hasComponents(page) ? page.components : []
  )

  const hasAutocomplete = components.some(
    (component) => component.type === ComponentType.AutocompleteField
  )
  const nunjucksRenderBase = hasAutocomplete
    ? new AutocompleteRendererBase(elements)
    : new NunjucksRendererBase(elements)

  const renderer = new NunjucksPageRenderer(nunjucksRenderBase)

  return [components, elements, renderer]
}

/**
 * @param {PreviewPageControllerBase} previewPageController
 * @param {PagePreviewDomElements} elements
 * @returns {PreviewPageControllerBase}
 */
function setupListener(previewPageController, elements) {
  const listeners = new PagePreviewListeners(previewPageController, elements)
  listeners.initListeners()

  return previewPageController
}

/**
 * Setup the Page Controller for client
 * @param {string} pageId
 * @param {string} definitionId
 */
export async function setupPageController(pageId, definitionId) {
  const { page, definition } = await getPageAndDefinition(definitionId, pageId)
  if (!page) {
    throw new Error(`Page not found with id ${pageId}`)
  }
  const [components, elements, renderer] = baseControllerSetup(page, definition)

  const previewPageController = new PreviewPageController(
    components,
    elements,
    definition,
    renderer
  )

  return setupListener(previewPageController, elements)
}

/**
 * Setup the Page Controller for client
 * @param {string} definitionId
 * @param {SummaryPageInitialState} initialState
 */
export async function setupSummaryPageController(definitionId, initialState) {
  const { definition } = await getPageAndDefinition(definitionId, undefined)
  const elements = new SummaryPagePreviewDomElements(initialState)
  const nunjucksRenderBase = new NunjucksRendererBase(elements)
  const renderer = new NunjucksPageRenderer(nunjucksRenderBase)

  const previewPageController = new SummaryPageController(
    elements,
    definition,
    renderer
  )

  const listeners = new SummaryPagePreviewListeners(
    previewPageController,
    elements
  )
  listeners.initListeners()

  return previewPageController
}

/**
 * @param {PageSectionInfo} [sectionInfo]
 */
export function setupGuidanceController(sectionInfo) {
  const elements = new PagePreviewDomElements(sectionInfo)
  const nunjucksRenderBase = new NunjucksRendererBase(elements)
  const renderer = new NunjucksPageRenderer(nunjucksRenderBase)
  const guidancePageController = new GuidancePageController(elements, renderer)

  return setupListener(guidancePageController, elements)
}

/**
 * Setup the Page Controller for client
 * @param {string} pageId
 * @param {string} definitionId
 */
export async function setupReorderQuestionsController(pageId, definitionId) {
  const { page, definition } = await getPageAndDefinition(definitionId, pageId)
  const elements = new ReorderQuestionsPagePreviewDomElements()
  const components = /** @type {ComponentDef[]} */ (
    hasComponents(page) ? page.components : []
  )

  const hasAutocomplete = components.some(
    (component) => component.type === ComponentType.AutocompleteField
  )
  const nunjucksRenderBase = hasAutocomplete
    ? new AutocompleteRendererBase(elements)
    : new NunjucksRendererBase(elements)

  const renderer = new NunjucksPageRenderer(nunjucksRenderBase)
  const reorderQuestionsPageController = new ReorderQuestionsPageController(
    components,
    elements,
    definition,
    renderer
  )

  const listeners = new ReorderQuestionsPagePreviewListeners(
    reorderQuestionsPageController,
    elements
  )
  listeners.initListeners()

  return reorderQuestionsPageController
}

/**
 * @import { ComponentDef, FormDefinition, Page, PageSectionInfo, PreviewPageControllerBase, SummaryPageInitialState } from '@defra/forms-model'
 */
