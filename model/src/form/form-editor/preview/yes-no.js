import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'
import { Question } from '~/src/index.js'

export class YesNoQuestion extends FieldsetQuestion {
  /**
   * @type {string}
   */
  questionTemplate = Question.PATH + 'radios.njk'
  fieldName = 'yesNo'

  /**
   * @returns {Partial<QuestionBaseModel>}
   */
  get customRenderFields() {
    /**
     *
     */
    return {
      type: 'boolean',
      items: /** @type {ListElement[]} */ ([
        {
          id: 'yesNo-yes',
          text: 'Yes',
          value: true,
          label: {
            text: 'Yes',
            classes: ''
          }
        },
        {
          id: 'yesNo-no',
          text: 'No',
          value: false,
          label: {
            text: 'No',
            classes: ''
          }
        }
      ])
    }
  }
}

/**
 * @import { QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
 * @import { ListElement } from '~/src/form/form-editor/types.js'
 */
