import {
  SectionsManager,
  initSectionsManager
} from '~/src/javascripts/sections-manager.js'

describe('sections-manager', () => {
  const sectionsHTML = `
    <input id="sectionHeading" class="govuk-input" type="text" />
    <div id="sections-preview">
      <h4 class="govuk-heading-m" data-preview-section-id="section-1">Section 1: Business details</h4>
      <p class="govuk-hint">No pages in this section</p>
      <h4 class="govuk-heading-m" data-preview-section-id="section-2">Section 2: Contact info</h4>
      <p class="govuk-hint">No pages in this section</p>
      <div data-section-id="section-1"></div>
      <div data-section-id="section-2"></div>
    </div>
  `

  const minimalHTML = `
    <input id="sectionHeading" class="govuk-input" type="text" />
  `

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('SectionsManager', () => {
    describe('constructor', () => {
      it('should initialize successfully when required elements exist', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        expect(manager).toBeInstanceOf(SectionsManager)
      })

      it('should initialize even when sectionHeading does not exist', () => {
        document.body.innerHTML = '<div id="some-other-element"></div>'
        const manager = new SectionsManager()
        expect(manager).toBeInstanceOf(SectionsManager)
      })
    })

    describe('setupEventListeners', () => {
      it('should not error when sectionHeading input does not exist', () => {
        document.body.innerHTML = '<div id="other-element"></div>'
        expect(() => new SectionsManager()).not.toThrow()
      })

      it('should attach focus event listener', () => {
        document.body.innerHTML = minimalHTML
        const manager = new SectionsManager()
        const showPlaceholderSpy = jest.spyOn(manager, 'showPlaceholderSection')

        const input = document.getElementById('sectionHeading')
        input?.dispatchEvent(new FocusEvent('focus'))

        expect(showPlaceholderSpy).toHaveBeenCalled()
      })

      it('should attach input event listener', () => {
        document.body.innerHTML = minimalHTML
        const manager = new SectionsManager()
        const updatePreviewSpy = jest.spyOn(manager, 'updateSectionPreview')

        const input = /** @type {HTMLInputElement} */ (
          document.getElementById('sectionHeading')
        )
        input.value = 'New section'
        input.dispatchEvent(new InputEvent('input'))

        expect(updatePreviewSpy).toHaveBeenCalledWith('New section')
      })

      it('should attach blur event listener and clear preview when input is empty', () => {
        document.body.innerHTML = minimalHTML
        const manager = new SectionsManager()
        const clearPreviewSpy = jest.spyOn(manager, 'clearSectionPreview')

        const input = /** @type {HTMLInputElement} */ (
          document.getElementById('sectionHeading')
        )
        input.value = ''
        input.dispatchEvent(new FocusEvent('blur'))

        expect(clearPreviewSpy).toHaveBeenCalled()
      })

      it('should attach blur event listener and not clear preview when input has value', () => {
        document.body.innerHTML = minimalHTML
        const manager = new SectionsManager()
        const clearPreviewSpy = jest.spyOn(manager, 'clearSectionPreview')

        const input = /** @type {HTMLInputElement} */ (
          document.getElementById('sectionHeading')
        )
        input.value = 'Some section'
        input.dispatchEvent(new FocusEvent('blur'))

        expect(clearPreviewSpy).not.toHaveBeenCalled()
      })

      it('should attach blur event listener and clear preview when input has only whitespace', () => {
        document.body.innerHTML = minimalHTML
        const manager = new SectionsManager()
        const clearPreviewSpy = jest.spyOn(manager, 'clearSectionPreview')

        const input = /** @type {HTMLInputElement} */ (
          document.getElementById('sectionHeading')
        )
        input.value = '   '
        input.dispatchEvent(new FocusEvent('blur'))

        expect(clearPreviewSpy).toHaveBeenCalled()
      })
    })

    describe('setupPreviewHighlighting', () => {
      it('should attach mouseenter event listener to section cards', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        const highlightSpy = jest.spyOn(manager, 'highlightPreviewSection')

        const card = document.querySelector('[data-section-id="section-1"]')
        card?.dispatchEvent(new MouseEvent('mouseenter'))

        expect(highlightSpy).toHaveBeenCalledWith('section-1')
      })

      it('should attach mouseleave event listener to section cards', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        const removeHighlightSpy = jest.spyOn(manager, 'removePreviewHighlight')

        const card = document.querySelector('[data-section-id="section-1"]')
        card?.dispatchEvent(new MouseEvent('mouseleave'))

        expect(removeHighlightSpy).toHaveBeenCalled()
      })
    })

    describe('showPlaceholderSection', () => {
      it('should not add placeholder when preview element does not exist', () => {
        document.body.innerHTML = minimalHTML
        const manager = new SectionsManager()
        manager.showPlaceholderSection()

        const heading = document.getElementById('section-placeholder-heading')
        expect(heading).toBeNull()
      })

      it('should add placeholder to preview with correct section number', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        manager.showPlaceholderSection()

        const heading = document.getElementById('section-placeholder-heading')
        expect(heading).not.toBeNull()
        expect(heading?.textContent).toBe('Section 3: heading')
      })

      it('should add placeholder heading with highlight class', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        manager.showPlaceholderSection()

        const heading = document.getElementById('section-placeholder-heading')
        expect(heading).not.toBeNull()
        expect(heading?.classList.contains('highlight')).toBe(true)
      })

      it('should add placeholder hint text', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        manager.showPlaceholderSection()

        const hint = document.getElementById('section-placeholder-hint')
        expect(hint).not.toBeNull()
        expect(hint?.textContent).toBe('No pages in this section')
      })

      it('should add placeholder at end when no sections exist', () => {
        document.body.innerHTML = `
          <input id="sectionHeading" type="text" />
          <div id="sections-preview"></div>
        `
        const manager = new SectionsManager()
        manager.showPlaceholderSection()

        const heading = document.getElementById('section-placeholder-heading')
        expect(heading).not.toBeNull()
        expect(heading?.textContent).toBe('Section 1: heading')
      })

      it('should remove existing placeholder before adding new one', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        manager.showPlaceholderSection()
        manager.showPlaceholderSection()

        const headings = document.querySelectorAll(
          '#section-placeholder-heading'
        )
        expect(headings).toHaveLength(1)
      })
    })

    describe('updateSectionPreview', () => {
      it('should call showPlaceholderSection when no placeholder exists', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        const showPlaceholderSpy = jest.spyOn(manager, 'showPlaceholderSection')

        manager.updateSectionPreview('New section title')

        expect(showPlaceholderSpy).toHaveBeenCalled()
      })

      it('should update placeholder heading with provided text and section number', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        manager.showPlaceholderSection()
        manager.updateSectionPreview('My Custom Section')

        const heading = document.getElementById('section-placeholder-heading')
        expect(heading?.textContent).toBe('Section 3: My Custom Section')
      })

      it('should show empty heading text when provided text is empty', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        manager.showPlaceholderSection()
        manager.updateSectionPreview('')

        const heading = document.getElementById('section-placeholder-heading')
        expect(heading?.textContent).toBe('Section 3: ')
      })
    })

    describe('clearSectionPreview', () => {
      it('should remove placeholder heading and hint when they exist', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        manager.showPlaceholderSection()

        let heading = document.getElementById('section-placeholder-heading')
        let hint = document.getElementById('section-placeholder-hint')
        expect(heading).not.toBeNull()
        expect(hint).not.toBeNull()

        manager.clearSectionPreview()

        heading = document.getElementById('section-placeholder-heading')
        hint = document.getElementById('section-placeholder-hint')
        expect(heading).toBeNull()
        expect(hint).toBeNull()
      })

      it('should not error when placeholder does not exist', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()

        expect(() => manager.clearSectionPreview()).not.toThrow()
      })
    })

    describe('highlightPreviewSection', () => {
      it('should not error when sectionId is undefined', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()

        expect(() => manager.highlightPreviewSection(undefined)).not.toThrow()
      })

      it('should not error when preview element does not exist', () => {
        document.body.innerHTML = minimalHTML
        const manager = new SectionsManager()

        expect(() => manager.highlightPreviewSection('section-1')).not.toThrow()
      })

      it('should add highlight class to matching section', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()

        manager.highlightPreviewSection('section-1')

        const section = document.querySelector(
          '[data-preview-section-id="section-1"]'
        )
        expect(section?.classList.contains('highlight')).toBe(true)
      })

      it('should not add highlight class when section does not exist', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()

        manager.highlightPreviewSection('non-existent')

        const highlighted = document.querySelector(
          '[data-preview-section-id].highlight'
        )
        expect(highlighted).toBeNull()
      })
    })

    describe('removePreviewHighlight', () => {
      it('should remove highlight class from all sections', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()

        const section1 = document.querySelector(
          '[data-preview-section-id="section-1"]'
        )
        const section2 = document.querySelector(
          '[data-preview-section-id="section-2"]'
        )
        section1?.classList.add('highlight')
        section2?.classList.add('highlight')

        manager.removePreviewHighlight()

        expect(section1?.classList.contains('highlight')).toBe(false)
        expect(section2?.classList.contains('highlight')).toBe(false)
      })

      it('should not error when no highlighted sections exist', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()

        expect(() => manager.removePreviewHighlight()).not.toThrow()
      })

      it('should not error when preview element does not exist', () => {
        document.body.innerHTML = minimalHTML
        const manager = new SectionsManager()

        expect(() => manager.removePreviewHighlight()).not.toThrow()
      })
    })
  })

  describe('initSectionsManager', () => {
    it('should return SectionsManager instance when sectionHeading element exists', () => {
      document.body.innerHTML = minimalHTML
      const manager = initSectionsManager()

      expect(manager).toBeInstanceOf(SectionsManager)
    })

    it('should return null when sectionHeading element does not exist', () => {
      document.body.innerHTML = '<div id="other-element"></div>'
      const manager = initSectionsManager()

      expect(manager).toBeNull()
    })
  })
})
