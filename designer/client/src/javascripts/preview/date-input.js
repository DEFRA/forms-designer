import {
  Question,
  QuestionElements
} from '~/src/javascripts/preview/question.js'

export class DateInput extends Question {
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = 'date-input.njk'

  get renderInput() {
    return {
      id: 'dateInput',
      name: 'dateInputField',
      fieldset: this.fieldSet,
      hint: this.hint
    }
  }

  static setupPreview() {
    const elements = new QuestionElements()
    const dateInputField = new DateInput(elements)
    dateInputField.render()

    return dateInputField
  }
}
