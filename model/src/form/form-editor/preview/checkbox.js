import { ComponentType } from '~/src/components/enums.js'
import { applyExclusiveBehaviour } from '~/src/form/form-editor/preview/checkbox-exclusive.js'
import { ListQuestion } from '~/src/form/form-editor/preview/list.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

export class CheckboxQuestion extends ListQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.CheckboxesField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'checkboxesfield.njk'
  listRenderId = 'checkboxField'
  listRenderName = 'checkboxField'

  /**
   * Adds the exclusive behaviour, the "or" divider and the revealed question
   * @protected
   * @returns {ReturnType<ListQuestion['_renderInput']>}
   */
  _renderInput() {
    const base = super._renderInput()

    return {
      ...base,
      items: /** @type {ListItemReadonly[]} */ (
        applyExclusiveBehaviour(base.items, (id) => this.getHighlight(id))
      )
    }
  }
}

/**
 * @import { ListItemReadonly } from '~/src/form/form-editor/types.js'
 */
