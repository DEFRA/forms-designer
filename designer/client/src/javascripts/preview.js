// import '~/src/javascripts/preview/nunjucks.js'
import '~/src/views/components/textfield.njk'
import '~/src/views/components/radios.njk'

import { Question } from '~/src/javascripts/preview/question.js'
import { Textfield } from '~/src/javascripts/preview/textfield.js'

/**
 * @param {string} questionType
 */
export function setupPreview(questionType) {
  if (questionType === 'textfield') {
    Textfield.setupPreview()
  } else {
    Question.setupPreview()
  }
}
