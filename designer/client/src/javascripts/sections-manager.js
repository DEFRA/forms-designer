const SECTION_HEADING_INPUT_ID = 'section-heading'
const SECTIONS_PREVIEW_ID = 'sections-preview'

const SECTION_CARD_SELECTOR = '[data-section-id]'
const SECTION_PLACEHOLDER_CLASS = 'section-placeholder'
const SECTION_HIGHLIGHT_CLASS = 'app-section-highlight'

const NO_PAGES_IN_SECTION = 'No pages in this section'

/**
 * Generate section heading placeholder text
 * @param {number} sectionNumber
 * @returns {string}
 */
function getSectionHeadingPlaceholder(sectionNumber) {
  return `Section ${sectionNumber} heading`
}

/**
 * Sections Manager
 */
export class SectionsManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupPreviewHighlighting()
  }

  setupEventListeners() {
    const sectionHeadingInput = document.getElementById(
      SECTION_HEADING_INPUT_ID
    )
    if (!sectionHeadingInput) {
      return
    }

    sectionHeadingInput.addEventListener('focus', () => {
      this.showPlaceholderSection()
    })

    sectionHeadingInput.addEventListener('input', (e) => {
      const target = /** @type {HTMLInputElement} */ (e.target)
      this.updateSectionPreview(target.value)
    })

    sectionHeadingInput.addEventListener('blur', () => {
      const input = /** @type {HTMLInputElement | null} */ (
        document.getElementById(SECTION_HEADING_INPUT_ID)
      )
      if (input && !input.value.trim()) {
        this.clearSectionPreview()
      }
    })
  }

  setupPreviewHighlighting() {
    const sectionCards = document.querySelectorAll(SECTION_CARD_SELECTOR)

    sectionCards.forEach((card) => {
      const element = /** @type {HTMLElement} */ (card)
      element.addEventListener('mouseenter', () => {
        this.highlightPreviewSection(element.dataset.sectionId)
      })

      element.addEventListener('mouseleave', () => {
        this.removePreviewHighlight()
      })
    })
  }

  showPlaceholderSection() {
    const preview = document.getElementById(SECTIONS_PREVIEW_ID)
    if (!preview) {
      return
    }

    const existingSections = document.querySelectorAll(SECTION_CARD_SELECTOR)
    const nextNumber = existingSections.length + 1

    const placeholderHtml = `
      <div class="${SECTION_PLACEHOLDER_CLASS}">
        <h4 class="govuk-heading-m">${getSectionHeadingPlaceholder(nextNumber)}</h4>
        <p class="govuk-hint">${NO_PAGES_IN_SECTION}</p>
      </div>
    `

    const firstSection = preview.querySelector('h4')
    if (firstSection) {
      firstSection.insertAdjacentHTML('beforebegin', placeholderHtml)
    } else {
      preview.insertAdjacentHTML('afterbegin', placeholderHtml)
    }
  }

  /**
   * @param {string} text
   */
  updateSectionPreview(text) {
    const placeholder = document.querySelector(`.${SECTION_PLACEHOLDER_CLASS}`)
    if (!placeholder) {
      this.showPlaceholderSection()
      return
    }

    const heading = placeholder.querySelector('h4')
    if (heading) {
      const existingSections = document.querySelectorAll(SECTION_CARD_SELECTOR)
      const nextNumber = existingSections.length + 1
      heading.textContent = text || getSectionHeadingPlaceholder(nextNumber)
    }
  }

  clearSectionPreview() {
    const placeholder = document.querySelector(`.${SECTION_PLACEHOLDER_CLASS}`)
    if (placeholder) {
      placeholder.remove()
    }
  }

  /**
   * @param {string | undefined} sectionId
   */
  highlightPreviewSection(sectionId) {
    if (!sectionId) {
      return
    }

    const preview = document.getElementById(SECTIONS_PREVIEW_ID)
    if (!preview) {
      return
    }

    const section = preview.querySelector(
      `[data-preview-section-id="${sectionId}"]`
    )
    if (section) {
      section.classList.add(SECTION_HIGHLIGHT_CLASS)
    }
  }

  removePreviewHighlight() {
    const highlighted = document.querySelectorAll(`.${SECTION_HIGHLIGHT_CLASS}`)
    highlighted.forEach((section) => {
      section.classList.remove(SECTION_HIGHLIGHT_CLASS)
    })
  }
}

/**
 * Initialises the sections manager if the required element exists.
 * @returns {SectionsManager | null}
 */
export function initSectionsManager() {
  if (document.getElementById(SECTION_HEADING_INPUT_ID)) {
    return new SectionsManager()
  }
  return null
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initSectionsManager()
  })
}

export default SectionsManager
