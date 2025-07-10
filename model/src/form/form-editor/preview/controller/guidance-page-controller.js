import { PreviewPageControllerBase } from '~/src/form/form-editor/preview/controller/page-controller-base.js'

const FALLBACK_GUIDANCE_TEXT = 'Guidance text'

export class GuidancePageController extends PreviewPageControllerBase {
  /**
   * @type {Markdown}
   * @protected
   */
  _unhighlightedEmptyGuidance =
    PreviewPageControllerBase.createGuidanceComponent(false)

  /**
   * @type {Markdown}
   * @protected
   */
  _guidanceComponent = PreviewPageControllerBase.createGuidanceComponent(false)

  /**
   * @param {PagePreviewBaseElements} elements
   * @param {PageRenderer} renderer
   */
  constructor(elements, renderer) {
    super(elements, renderer)
    if (elements.guidance.length) {
      this._guidanceComponent.content = elements.guidance
    }
  }

  /**
   * @returns {Markdown[]}
   * @protected
   */
  _getGuidanceComponents() {
    if (this._guidanceText.length) {
      return [this._guidanceComponent]
    }

    if (
      this._isHighlighted(PreviewPageControllerBase.HighlightClass.GUIDANCE)
    ) {
      return [this._emptyGuidance]
    }

    return [this._unhighlightedEmptyGuidance]
  }

  /**
   * @returns {string}
   * @protected
   */
  _getGuidanceText() {
    const guidanceText = super._getGuidanceText()
    if (!guidanceText.length) {
      return FALLBACK_GUIDANCE_TEXT
    }
    return super._getGuidanceText()
  }
}

/**
 * @import { Markdown } from '~/src/form/form-editor/preview/markdown.js'
 * @import { PageRenderer, PagePreviewBaseElements } from '~/src/form/form-editor/preview/types.js'
 */
