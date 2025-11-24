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
  #isConfirmationEmailSettingsPanel = false

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
    showConfirmationEmail = true,
    isConfirmationEmailSettingsPanel = false
  ) {
    super(page, declarationText)
    this.#declaration = showDeclaration
    this.#showConfirmationEmail = showConfirmationEmail
    this.#isConfirmationEmailSettingsPanel = isConfirmationEmailSettingsPanel
  }

  get declaration() {
    return this.#declaration
  }

  get showConfirmationEmail() {
    return this.#showConfirmationEmail
  }

  get isConfirmationEmailSettingsPanel() {
    return this.#isConfirmationEmailSettingsPanel
  }
}

/**
 * @import { Page, SummaryPageElements } from '@defra/forms-model'
 */
