import { PreviewPageController } from '~/src/form/form-editor/preview/controller/page-controller.js'

export class ReorderQuestionsPageController extends PreviewPageController {
  /**
   * @param { string | undefined } newOrder
   */
  reorderComponents(newOrder) {
    if (!newOrder) {
      return
    }

    const MAX = Number.MAX_SAFE_INTEGER
    const order = newOrder.split(',')

    if (this._components.length > 0) {
      this._components.sort((a, b) => {
        const posA = a.id && order.includes(a.id) ? order.indexOf(a.id) : MAX
        const posB = b.id && order.includes(b.id) ? order.indexOf(b.id) : MAX

        return posA - posB
      })
    }
  }
}

/**
 * @import { PageRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { FormDefinition } from '~/src/form/form-definition/types.js'
 * @import { ComponentDef } from '~/src/components/types.js'
 */
