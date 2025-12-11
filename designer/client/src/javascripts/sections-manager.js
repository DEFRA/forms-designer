const SECTION_HEADING_INPUT_ID = 'sectionHeading'
const SECTIONS_PREVIEW_ID = 'sections-preview'

const SECTION_CARD_SELECTOR = '[data-section-id]'
const PLACEHOLDER_HEADING_ID = 'section-placeholder-heading'
const PLACEHOLDER_HINT_ID = 'section-placeholder-hint'
const HIGHLIGHT_CLASS = 'highlight'

const NO_PAGES_IN_SECTION = 'No pages in this section'

/**
 * Generate section title with number prefix
 * @param {number} sectionNumber
 * @param {string} [heading]
 * @returns {string}
 */
function getSectionTitle(sectionNumber, heading) {
  const headingText = heading ?? 'heading'
  return `Section ${sectionNumber}: ${headingText}`
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

    this.clearSectionPreview()

    const existingSections = preview.querySelectorAll(
      '[data-preview-section-id]'
    )
    const nextNumber = existingSections.length + 1

    const placeholderHtml = `<h4 id="${PLACEHOLDER_HEADING_ID}" class="govuk-heading-m ${HIGHLIGHT_CLASS}">${getSectionTitle(nextNumber)}</h4>
<p id="${PLACEHOLDER_HINT_ID}" class="govuk-hint">${NO_PAGES_IN_SECTION}</p>`

    const unassignedPagesList = preview.querySelector(
      'dl.govuk-summary-list:last-child'
    )
    if (unassignedPagesList) {
      unassignedPagesList.insertAdjacentHTML('beforebegin', placeholderHtml)
    } else {
      preview.insertAdjacentHTML('beforeend', placeholderHtml)
    }
  }

  /**
   * @param {string} text
   */
  updateSectionPreview(text) {
    const heading = document.getElementById(PLACEHOLDER_HEADING_ID)
    if (!heading) {
      this.showPlaceholderSection()
      this.updateSectionPreview(text)
      return
    }

    const preview = document.getElementById(SECTIONS_PREVIEW_ID)
    const existingSections =
      preview?.querySelectorAll('[data-preview-section-id]') ?? []
    const nextNumber = existingSections.length + 1
    heading.textContent = getSectionTitle(nextNumber, text)
  }

  clearSectionPreview() {
    const heading = document.getElementById(PLACEHOLDER_HEADING_ID)
    const hint = document.getElementById(PLACEHOLDER_HINT_ID)
    if (heading) {
      heading.remove()
    }
    if (hint) {
      hint.remove()
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
      section.classList.add(HIGHLIGHT_CLASS)
    }
  }

  removePreviewHighlight() {
    const preview = document.getElementById(SECTIONS_PREVIEW_ID)
    if (!preview) {
      return
    }

    const highlighted = preview.querySelectorAll(
      `[data-preview-section-id].${HIGHLIGHT_CLASS}`
    )
    highlighted.forEach((section) => {
      section.classList.remove(HIGHLIGHT_CLASS)
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
