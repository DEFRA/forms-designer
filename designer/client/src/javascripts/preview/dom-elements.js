import { CharacterCount } from 'govuk-frontend'

/**
 * @implements {DomElementsBase}
 */
export class DomElements {
  static WRAPPER_ID = 'preview-panel-inner'
  /**
   * @type {HTMLElement|null}
   */
  preview = null
  /**
   * @type {HTMLElement|null}
   */
  previewInner = null

  constructor() {
    const previewEl = document.getElementById('preview-panel-content')
    this.preview = previewEl
    this.previewInner =
      previewEl?.querySelector(`#${DomElements.WRAPPER_ID}`) ?? null
  }

  /**
   * @param {HTMLElement} node
   * @returns {HTMLDivElement}
   * @private
   */
  _wrapNode(node) {
    const wrapper = document.createElement('div')
    wrapper.id = DomElements.WRAPPER_ID
    wrapper.appendChild(node)
    return wrapper
  }

  /**
   * @param {string} html
   * @returns {string}
   * @private
   */
  _wrapHTML(html) {
    return `<div id="preview-panel-inner">${html}</div>`
  }

  /**
   * @param {string} value
   */
  setPreviewHTML(value) {
    if (this.preview) {
      this.preview.innerHTML = this._wrapHTML(value)
      // Reinitialize GOV.UK CharacterCount components after DOM update
      const characterCountElements = this.preview.querySelectorAll(
        '[data-module="govuk-character-count"]'
      )
      characterCountElements.forEach((element) => {
        // eslint-disable-next-line no-new
        new CharacterCount(element) // NOSONAR: javascript:S1848 - Constructor has side effects
      })
    }
  }

  /**
   * @param {HTMLElement} element
   */
  setPreviewDOM(element) {
    if (this.preview) {
      const container = /** @type {HTMLElement} */ (this.previewInner)
      const newContainer = /** @type {HTMLDivElement} */ (
        this._wrapNode(element)
      )
      this.preview.replaceChild(newContainer, container)
      this.previewInner = newContainer
    }
  }
}

/**
 * @import { DomElementsBase } from '@defra/forms-model'
 */
