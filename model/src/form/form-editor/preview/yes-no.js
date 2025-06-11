import { ComponentType } from '~/src/components/enums.js'
import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'
import { Question } from '~/src/index.js'

export class YesNoQuestion extends FieldsetQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.YesNoField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = Question.PATH + 'radios.njk'
  _fieldName = 'yesNo'

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
