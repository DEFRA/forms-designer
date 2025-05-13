import '~/src/views/components/textfield.njk'
import '~/src/views/components/radios.njk'
import '~/src/views/components/date-input.njk'
import '~/src/views/components/ukaddressfield.njk'
import '~/src/views/components/telephonenumberfield.njk'
import '~/src/views/components/emailaddressfield.njk'

import { ComponentType } from '@defra/forms-model'

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
 * @typedef { Question | DateInputQuestion | EmailAddressQuestion | PhoneNumberQuestion | RadioSortableQuestion | ShortAnswerQuestion | UkAddressQuestion } PreviewQuestion
 */

/**
 * @param {ComponentType} componentType
 * @returns {PreviewQuestion}
 */
export function setupPreview(componentType) {
  /**
   * @type {PreviewQuestion}
   */
  let preview
  if (componentType === ComponentType.TextField) {
    preview = SetupPreview.TextField()
  } else if (componentType === ComponentType.DatePartsField) {
    preview = SetupPreview.DatePartsField()
  } else if (componentType === ComponentType.RadiosField) {
    preview = SetupPreview.RadiosField()
  } else if (componentType === ComponentType.UkAddressField) {
    preview = SetupPreview.UkAddressField()
  } else if (componentType === ComponentType.EmailAddressField) {
    preview = SetupPreview.EmailAddressField()
  } else if (componentType === ComponentType.TelephoneNumberField) {
    preview = SetupPreview.TelephoneNumberField()
  } else {
    preview = SetupPreview.Question()
  }
  showHideForJs()

  preview.render()

  return preview
}

/**
 * @import { Question, DateInputQuestion, EmailAddressQuestion, PhoneNumberQuestion, RadioSortableQuestion, ShortAnswerQuestion, UkAddressQuestion } from '@defra/forms-model'
 */
