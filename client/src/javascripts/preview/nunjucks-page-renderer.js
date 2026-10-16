/**
 * @implements {PageRenderer}
 */
export class NunjucksPageRenderer {
  /**
   * @type {RenderBase}
   * @private
   */
  _renderBase

  /**
   * @param {RenderBase} renderBase
   */
  constructor(renderBase) {
    this._renderBase = renderBase
  }

  /**
   * @param {string} questionTemplate
   * @param {PagePreviewPanelMacro} pagePreviewPanelMacro
   */
  render(questionTemplate, pagePreviewPanelMacro) {
    this._renderBase.render(questionTemplate, { params: pagePreviewPanelMacro })
  }
}

/**
 * @import { PageRenderer, PagePreviewPanelMacro, RenderBase } from '@defra/forms-model'
 * @import { NunjucksRendererBase } from '~/src/javascripts/preview/nunjucks-renderer.js'
 */
