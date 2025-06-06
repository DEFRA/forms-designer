import { TextField } from '@defra/forms-engine-plugin/engine/components/TextField.js'
import { QuestionRenderer, type Question } from '@defra/forms-model'

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

export class QuestionComponentRenderer extends QuestionRenderer {
  constructor() {
    super()
  }

  render(question: Question) {
    const textField = {
      ...TEXT_FIELD_BASE,
      title: question.titleText,
      hint: question.hintText
    }
    return new TextField(textField, {
      classes: {
        title: question.titleClasses,
        hint: question.hintClasses
      }
    }).getViewModel({}, [])
  }
}
