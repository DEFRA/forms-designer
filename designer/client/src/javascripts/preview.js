import '~/src/views/preview-components/autocompletefield.njk'
import '~/src/views/preview-components/checkboxesfield.njk'
import '~/src/views/preview-components/textfield.njk'
import '~/src/views/preview-components/textarea.njk'
import '~/src/views/preview-components/radios.njk'
import '~/src/views/preview-components/date-input.njk'
import '~/src/views/preview-components/monthyearfield.njk'
import '~/src/views/preview-components/ukaddressfield.njk'
import '~/src/views/preview-components/telephonenumberfield.njk'
import '~/src/views/preview-components/fileuploadfield.njk'
import '~/src/views/preview-components/emailaddressfield.njk'

import { ErrorPreview } from '~/src/javascripts/error-preview/error-preview'
import {
  hideHtmlElement,
  showHtmlElement
} from '~/src/javascripts/preview/helper'
import { SetupPreview } from '~/src/javascripts/setup-preview.js'

export function showHideForJs() {
  const previewPanel = document.getElementById('preview-panel')
  showHtmlElement(previewPanel)
  const previewErrorsButton = document.getElementById('preview-error-messages')
  hideHtmlElement(previewErrorsButton)
  const previewPageButton = document.getElementById('preview-page')
  hideHtmlElement(previewPageButton)
}

/**
 * @param {ComponentType} componentType
 * @returns {PreviewQuestion}
 */
export function setupPreview(componentType) {
  const PreviewConstructor =
    /** @type {() => PreviewQuestion} */
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (SetupPreview[componentType] ?? SetupPreview.Question)

  const preview = PreviewConstructor()

  showHideForJs()

  ErrorPreview.setupPreview(componentType)

  preview.render()

  return preview
}

/**
 * @import { PreviewQuestion, ComponentType } from '@defra/forms-model'
 */
