import {
  Question,
  QuestionElements
} from '~/src/javascripts/preview/question.js'

export class Textfield extends Question {
  static setupPreview() {
    const elements = new QuestionElements()
    const textfield = new Textfield(elements)
    textfield.render()
    return textfield
  }
}
