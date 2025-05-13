import '~/src/views/components/textfield.njk'
import '~/src/views/components/textarea.njk'
import '~/src/views/components/radios.njk'
import '~/src/views/components/date-input.njk'
import '~/src/views/components/ukaddressfield.njk'
import '~/src/views/components/telephonenumberfield.njk'
import '~/src/views/components/emailaddressfield.njk'

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

  preview.render()

  return preview
}

/**
 * @import { Question, DateInputQuestion, EmailAddressQuestion, PhoneNumberQuestion, RadioSortableQuestion, ShortAnswerQuestion, UkAddressQuestion, PreviewQuestion, ComponentType } from '@defra/forms-model'
 */
