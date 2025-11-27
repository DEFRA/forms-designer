import {
  SectionsManager,
  initSectionsManager
} from '~/src/javascripts/sections-manager.js'

describe('sections-manager', () => {
  const sectionsHTML = `
    <div id="section-heading" class="govuk-input"></div>
    <div id="sections-preview">
      <div data-section-id="section-1" data-preview-section-id="section-1">
        <h4 class="govuk-heading-m">Section 1</h4>
      </div>
      <div data-section-id="section-2" data-preview-section-id="section-2">
        <h4 class="govuk-heading-m">Section 2</h4>
      </div>
    </div>
  `

  const minimalHTML = `
    <div id="section-heading" class="govuk-input"></div>
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

      it('should initialize even when section-heading does not exist', () => {
        document.body.innerHTML = '<div id="some-other-element"></div>'
        const manager = new SectionsManager()
        expect(manager).toBeInstanceOf(SectionsManager)
      })
    })

    describe('setupEventListeners', () => {
      it('should not error when section-heading input does not exist', () => {
        document.body.innerHTML = '<div id="other-element"></div>'
        expect(() => new SectionsManager()).not.toThrow()
      })

      it('should attach focus event listener', () => {
        document.body.innerHTML = minimalHTML
        const manager = new SectionsManager()
        const showPlaceholderSpy = jest.spyOn(manager, 'showPlaceholderSection')

        const input = document.getElementById('section-heading')
        input?.dispatchEvent(new FocusEvent('focus'))

        expect(showPlaceholderSpy).toHaveBeenCalled()
      })

      it('should attach input event listener', () => {
        document.body.innerHTML = minimalHTML
        const manager = new SectionsManager()
        const updatePreviewSpy = jest.spyOn(manager, 'updateSectionPreview')

        const input = /** @type {HTMLInputElement} */ (
          document.getElementById('section-heading')
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
          document.getElementById('section-heading')
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
          document.getElementById('section-heading')
        )
        input.value = 'Some section'
        input.dispatchEvent(new FocusEvent('blur'))

        expect(clearPreviewSpy).not.toHaveBeenCalled()
      })

      it('should attach blur event listener and not clear preview when input has only whitespace', () => {
        document.body.innerHTML = minimalHTML
        const manager = new SectionsManager()
        const clearPreviewSpy = jest.spyOn(manager, 'clearSectionPreview')

        const input = /** @type {HTMLInputElement} */ (
          document.getElementById('section-heading')
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

        const placeholder = document.querySelector('.section-placeholder')
        expect(placeholder).toBeNull()
      })

      it('should add placeholder to preview with correct section number', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        manager.showPlaceholderSection()

        const placeholder = document.querySelector('.section-placeholder')
        expect(placeholder).not.toBeNull()
        expect(placeholder?.querySelector('h4')?.textContent).toBe(
          'Section 3 heading'
        )
      })

      it('should add placeholder before first h4 if it exists', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        manager.showPlaceholderSection()

        const placeholder = document.querySelector('.section-placeholder')
        expect(placeholder).not.toBeNull()
        expect(placeholder?.querySelector('h4')?.textContent).toBe(
          'Section 3 heading'
        )
      })

      it('should add placeholder at start when no sections exist', () => {
        document.body.innerHTML = `
          <div id="section-heading"></div>
          <div id="sections-preview"></div>
        `
        const manager = new SectionsManager()
        manager.showPlaceholderSection()

        const placeholder = document.querySelector('.section-placeholder')
        expect(placeholder).not.toBeNull()
        expect(placeholder?.querySelector('h4')?.textContent).toBe(
          'Section 1 heading'
        )
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

      it('should update placeholder heading with provided text', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        manager.showPlaceholderSection()
        manager.updateSectionPreview('My Custom Section')

        const placeholder = document.querySelector('.section-placeholder')
        expect(placeholder?.querySelector('h4')?.textContent).toBe(
          'My Custom Section'
        )
      })

      it('should show default text when provided text is empty', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        manager.showPlaceholderSection()
        manager.updateSectionPreview('')

        const placeholder = document.querySelector('.section-placeholder')
        expect(placeholder?.querySelector('h4')?.textContent).toBe(
          'Section 3 heading'
        )
      })
    })

    describe('clearSectionPreview', () => {
      it('should remove placeholder element when it exists', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()
        manager.showPlaceholderSection()

        let placeholder = document.querySelector('.section-placeholder')
        expect(placeholder).not.toBeNull()

        manager.clearSectionPreview()

        placeholder = document.querySelector('.section-placeholder')
        expect(placeholder).toBeNull()
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
        expect(section?.classList.contains('app-section-highlight')).toBe(true)
      })

      it('should not add highlight class when section does not exist', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()

        manager.highlightPreviewSection('non-existent')

        const highlighted = document.querySelector('.app-section-highlight')
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
        section1?.classList.add('app-section-highlight')
        section2?.classList.add('app-section-highlight')

        manager.removePreviewHighlight()

        expect(section1?.classList.contains('app-section-highlight')).toBe(
          false
        )
        expect(section2?.classList.contains('app-section-highlight')).toBe(
          false
        )
      })

      it('should not error when no highlighted sections exist', () => {
        document.body.innerHTML = sectionsHTML
        const manager = new SectionsManager()

        expect(() => manager.removePreviewHighlight()).not.toThrow()
      })
    })
  })

  describe('initSectionsManager', () => {
    it('should return SectionsManager instance when section-heading element exists', () => {
      document.body.innerHTML = minimalHTML
      const manager = initSectionsManager()

      expect(manager).toBeInstanceOf(SectionsManager)
    })

    it('should return null when section-heading element does not exist', () => {
      document.body.innerHTML = '<div id="other-element"></div>'
      const manager = initSectionsManager()

      expect(manager).toBeNull()
    })
  })
})
