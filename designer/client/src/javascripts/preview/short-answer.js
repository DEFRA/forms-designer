import {
  Question,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'

export class ShortAnswer extends Question {
  static setupPreview() {
    const elements = new QuestionDomElements()
    const textfield = new ShortAnswer(elements)
    textfield.init(elements)
    return textfield
  }
}
