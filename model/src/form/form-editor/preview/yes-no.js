import { ComponentType } from '~/src/components/enums.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

export class YesNoQuestion extends FieldsetQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.YesNoField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'radios.njk'
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
      classes: `govuk-radios--inline ${this._highlighted ? HIGHLIGHT_CLASS : ''}`,
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
