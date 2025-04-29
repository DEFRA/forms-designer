import {
  Question,
  QuestionElements,
  type DefaultComponent,
  type QuestionBaseModel
} from '~/src/javascripts/preview/question.js'

export interface DateInputModel extends QuestionBaseModel {
  fieldset: {
    legend: DefaultComponent
  }
}
export class DateInput extends Question {
  protected _questionTemplate = 'date-input.njk'

  get renderInput(): DateInputModel {
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
  }
}
