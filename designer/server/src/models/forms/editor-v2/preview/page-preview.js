import { PagePreviewElements } from '@defra/forms-model'

export class PagePreviewElementsSSR extends PagePreviewElements {
  /**
   * @type {string}
   */
  #guidanceText = ''
  /**
   * @param {Page} page
   */
  constructor(page, guidanceText = '') {
    super(page)
    this.#guidanceText = guidanceText
  }

  get guidance() {
    return this.#guidanceText
  }
}

/**
 * @import { Page } from '@defra/forms-model'
 */
