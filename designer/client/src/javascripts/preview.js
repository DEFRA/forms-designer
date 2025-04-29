// import '~/src/javascripts/preview/nunjucks.js'
import '~/src/views/components/textfield.njk'
import '~/src/views/components/radios.njk'

import { Question } from '~/src/javascripts/preview/question.js'
import { Textfield } from '~/src/javascripts/preview/textfield.js'

// @ts-expect-error - Property 'questionType' does not exist on type 'Document' - will be sorted for PROD
if (document.questionType === 'textfield') {
  Textfield.setupPreview()
} else {
  Question.setupPreview()
}
