import '~/src/views/preview-components/autocompletefield.njk'
import '~/src/views/preview-components/checkboxesfield.njk'
import '~/src/views/preview-components/textfield.njk'
import '~/src/views/preview-components/textarea.njk'
import '~/src/views/preview-components/radios.njk'
import '~/src/views/preview-components/radiosfield.njk'
import '~/src/views/preview-components/selectfield.njk'
import '~/src/views/preview-components/date-input.njk'
import '~/src/views/preview-components/markdown.njk'
import '~/src/views/preview-components/monthyearfield.njk'
import '~/src/views/preview-components/ukaddressfield.njk'
import '~/src/views/preview-components/numberfield.njk'
import '~/src/views/preview-components/yesnofield.njk'
import '~/src/views/preview-components/telephonenumberfield.njk'
import '~/src/views/preview-components/fileuploadfield.njk'
import '~/src/views/preview-components/emailaddressfield.njk'
import '~/src/views/page-preview-component/template.njk'
import '~/src/views/page-preview-component/macro.njk'
import '~/src/views/summary-preview-component/template.njk'
import '~/src/views/summary-preview-component/macro.njk'
import '~/src/views/preview-controllers/page-controller.njk'
import '~/src/views/preview-controllers/summary-controller.njk'
import {
  ComponentType,
  GuidancePageController,
  PreviewPageController,
  SummaryPageController,
  hasComponents
} from '@defra/forms-model'

import { AutocompleteRendererBase } from '~/src/javascripts/preview/autocomplete-renderer.js'
import { NunjucksPageRenderer } from '~/src/javascripts/preview/nunjucks-page-renderer.js'
import { NunjucksRendererBase } from '~/src/javascripts/preview/nunjucks-renderer.js'
import {
  PagePreviewDomElements,
  PagePreviewListeners
} from '~/src/javascripts/preview/page-controller/page-controller.js'
import {
  SummaryPagePreviewDomElements,
  SummaryPagePreviewListeners
} from '~/src/javascripts/preview/page-controller/summary-page-controller.js'

/**
 * @param {Page} page
 * @returns {[ComponentDef[],PagePreviewDomElements,NunjucksPageRenderer]}
 */
function baseControllerSetup(page) {
  const elements = new PagePreviewDomElements()
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
 * @param {Page} page
 * @param {FormDefinition} definition
 */
export function setupPageController(page, definition) {
  const [components, elements, renderer] = baseControllerSetup(page)

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
 * @param { Page | undefined } page
 * @param {FormDefinition} definition
 */
export function setupSummaryPageController(page, definition) {
  const elements = new SummaryPagePreviewDomElements()
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

export function setupGuidanceController() {
  const elements = new PagePreviewDomElements()
  const nunjucksRenderBase = new NunjucksRendererBase(elements)
  const renderer = new NunjucksPageRenderer(nunjucksRenderBase)
  const guidancePageController = new GuidancePageController(elements, renderer)

  return setupListener(guidancePageController, elements)
}

/**
 * @import { ComponentDef, Page, FormDefinition, PreviewPageControllerBase } from '@defra/forms-model'
 */
