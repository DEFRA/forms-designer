import { TextField } from '@defra/forms-engine-plugin/engine/components/TextField.js'

import { NJK } from '~/src/javascripts/preview/nunjucks.js'

import '~/src/views/preview-components/inset.njk'
import { NunjucksRenderer } from '~/src/javascripts/preview/nunjucks-renderer.js'

const TEXT_FIELD_BASE = {
  type: 'TextField',
  title: 'Question',
  name: 'XLzcCS',
  shortDescription: 'Short answer',
  hint: '',
  options: {
    required: true
  },
  schema: {},
  id: '795d95a5-191e-4bd1-810f-16968550c370'
}

export class FormsEngineNunjucksRenderer extends NunjucksRenderer {
  /**
   * @param {Question} question
   */
  render(question) {
    const textFieldComponent = {
      ...TEXT_FIELD_BASE,
      title: `${question.titleText} [from plugin]`,
      hint: question.hintText
    }
    const textField = new TextField(textFieldComponent, {
      classes: {
        title: question.titleClasses,
        hint: question.hintClasses
      }
    }).getViewModel({}, [])
    this._render(question.questionTemplate, textField)
  }
}

/**
 * @import { QuestionRenderer, QuestionElements, QuestionBaseModel, RenderContext } from '@defra/forms-model'
 */
