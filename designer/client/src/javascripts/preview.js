import '~/src/views/components/textfield.njk'
import '~/src/views/components/radios.njk'
import '~/src/views/components/date-input.njk'
import '~/src/views/components/ukaddressfield.njk'
import '~/src/views/components/telephonenumberfield.njk'
import '~/src/views/components/emailaddressfield.njk'

import { ComponentType } from '@defra/forms-model'

import { DateInput } from '~/src/javascripts/preview/date-input.js'
import { EmailAddress } from '~/src/javascripts/preview/email-address.js'
import {
  hideHtmlElement,
  showHtmlElement
} from '~/src/javascripts/preview/helper'
import { PhoneNumber } from '~/src/javascripts/preview/phone-number.js'
import { Question } from '~/src/javascripts/preview/question.js'
import { RadioSortable } from '~/src/javascripts/preview/radio-sortable.js'
import { ShortAnswer } from '~/src/javascripts/preview/short-answer.js'
import { UkAddress } from '~/src/javascripts/preview/uk-address.js'

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
 * @returns {Question|RadioSortable|DateInput|ShortAnswer}
 */
export function setupPreview(componentType) {
  /**
   * @type {Question|RadioSortable|DateInput|ShortAnswer|PhoneNumber}
   */
  let preview
  if (componentType === ComponentType.TextField) {
    preview = ShortAnswer.setupPreview()
  } else if (componentType === ComponentType.DatePartsField) {
    preview = DateInput.setupPreview()
  } else if (componentType === ComponentType.RadiosField) {
    preview = RadioSortable.setupPreview()
  } else if (componentType === ComponentType.UkAddressField) {
    preview = UkAddress.setupPreview()
  } else if (componentType === ComponentType.EmailAddressField) {
    preview = EmailAddress.setupPreview()
  } else if (componentType === ComponentType.TelephoneNumberField) {
    preview = PhoneNumber.setupPreview()
  } else {
    preview = Question.setupPreview()
  }
  showHideForJs()

  return preview
}
