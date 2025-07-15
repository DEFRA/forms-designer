/**
 * @param {InputEvent} inputEvent
 * @returns {string}
 */
export function getTargetValue(inputEvent) {
  const target = /** @type {HTMLInputElement} */ (inputEvent.target)
  return target.value
}

/**
 * @param {Event} changeEvent
 * @returns {boolean}
 */
export function getTargetChecked(changeEvent) {
  const target = /** @type {HTMLInputElement} */ (changeEvent.target)
  return target.checked
}

export class PageListenerBase {
  /**
   * @type {PreviewPageControllerBase}
   * @protected
   */
  _pageController
  /**
   * @type {PagePreviewDomElements}
   * @protected
   */
  _baseElements

  /**
   *
   * @param {PreviewPageControllerBase} pageController
   * @param {PagePreviewDomElements} baseElements
   */
  constructor(pageController, baseElements) {
    this._pageController = pageController
    this._baseElements = baseElements
  }

  /**
   * @returns {[HTMLInputElement|null, EventListenerObject, string][]}
   */
  getListeners() {
    return [[]]
  }

  /**
   * @private
   */
  _setListeners() {
    const listeners = this.getListeners()
    for (const [htmlInputElement, eventListener, listenerType] of listeners) {
      if (htmlInputElement) {
        htmlInputElement.addEventListener(listenerType, eventListener)
      }
    }
  }

  initListeners() {
    this._setListeners()
    this._pageController.render()
  }

  clearListeners() {
    const listeners = this.getListeners()
    for (const [htmlInputElement, eventListener, listenerType] of listeners) {
      if (htmlInputElement) {
        htmlInputElement.removeEventListener(listenerType, eventListener)
      }
    }
  }
}

/**
 * @import { PageOverviewElements, DomElementsBase, PreviewPageControllerBase } from '@defra/forms-model'
 */
