import { PagePreviewElements } from '@defra/forms-model'

export class PagePreviewElementsSSR extends PagePreviewElements {
  /**
   * @type {string}
   */
  #guidanceText = ''
  /**
   * @param {Page|undefined} page
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
 * @implements {SummaryPageElements}
 */
export class SummaryPreviewSSR extends PagePreviewElementsSSR {
  #declaration = false

  /**
   * @param {Page|undefined} page
   * @param {string} declarationText
   * @param {boolean} showDeclaration
   */
  constructor(page, declarationText, showDeclaration = false) {
    super(page, declarationText)
    this.#declaration = showDeclaration
  }

  get declaration() {
    return this.#declaration
  }
}

/**
 * @import { Page, SummaryPageElements } from '@defra/forms-model'
 */
