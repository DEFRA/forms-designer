import '~/src/views/components/textfield.njk'
import '~/src/views/components/radios.njk'
import '~/src/views/components/date-input.njk'

import { DateInput } from '~/src/javascripts/preview/date-input.js'
import { Question } from '~/src/javascripts/preview/question.js'
import { Radio } from '~/src/javascripts/preview/radio.js'
import { Textfield } from '~/src/javascripts/preview/textfield.js'

export function showHideForJs() {
  const previewPanel = document.getElementById('preview-panel')
  if (previewPanel) {
    previewPanel.style = 'display: block'
  }
  const previewErrorsButton = document.getElementById('preview-error-messages')
  if (previewErrorsButton) {
    previewErrorsButton.style = 'display: none'
  }
  const previewPageButton = document.getElementById('preview-page')
  if (previewPageButton) {
    previewPageButton.style = 'display: none'
  }
}

/**
 * @param {string} questionType
 * @returns {Question|Radio|DateInput|Textfield}
 */
export function setupPreview(questionType) {
  /**
   * @type {Question|Radio|DateInput|Textfield}
   */
  let preview
  if (questionType === 'textfield') {
    preview = Textfield.setupPreview()
  } else if (questionType === 'datepartsfield') {
    preview = DateInput.setupPreview()
  } else if (questionType === 'radiosfield') {
    preview = Radio.setupPreview()
  } else {
    preview = Question.setupPreview()
  }
  showHideForJs()

  return preview
}
