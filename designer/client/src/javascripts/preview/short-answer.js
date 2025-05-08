import {
  Question,
  QuestionElements
} from '~/src/javascripts/preview/question.js'

export class ShortAnswer extends Question {
  static setupPreview() {
    const elements = new QuestionElements()
    const textfield = new ShortAnswer(elements)
    textfield.render()
    return textfield
  }
}
