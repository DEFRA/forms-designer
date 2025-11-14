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
  #showConfirmationEmail = true

  /**
   * @param {Page|undefined} page
   * @param {string} declarationText
   * @param {boolean} showDeclaration
   * @param {boolean} showConfirmationEmail
   */
  constructor(
    page,
    declarationText,
    showDeclaration = false,
    showConfirmationEmail = true
  ) {
    super(page, declarationText)
    this.#declaration = showDeclaration
    this.#showConfirmationEmail = showConfirmationEmail
  }

  get declaration() {
    return this.#declaration
  }

  get showConfirmationEmail() {
    return this.#showConfirmationEmail
  }
}

/**
 * @import { Page, SummaryPageElements } from '@defra/forms-model'
 */
