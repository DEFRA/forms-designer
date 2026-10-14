import {
  setupFileTypeListeners,
  updateFileTypes
} from '~/src/javascripts/error-preview/file-upload/file-type-handler'

describe('file-type-handler', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('updateFileTypes', () => {
    test('should return early if no fileTypeSpans are found', () => {
      document.body.innerHTML = `<div>No spans here</div>`

      updateFileTypes()

      expect(document.body.innerHTML).toBe('<div>No spans here</div>')
    })

    test('should display default text when no types are selected', () => {
      document.body.innerHTML = `
        <span class="error-preview-filesMimes">Initial text</span>
        <input id="fileTypes" type="checkbox">
        <input id="fileTypes-2" type="checkbox">
        <input id="fileTypes-3" type="checkbox">
      `

      updateFileTypes()

      const span = document.querySelector('.error-preview-filesMimes')
      expect(span?.textContent).toBe('[files types you accept]')
    })

    test('should update spans with single document type', () => {
      document.body.innerHTML = `
        <span class="error-preview-filesMimes">Initial text</span>
        <input id="fileTypes" type="checkbox" checked>
        <input id="docType1" name="documentTypes" type="checkbox" checked>
        <label for="docType1">PDF</label>
      `

      updateFileTypes()

      const span = document.querySelector('.error-preview-filesMimes')
      expect(span?.textContent).toBe('PDF')
    })

    test('should update spans with single image type', () => {
      document.body.innerHTML = `
        <span class="error-preview-filesMimes">Initial text</span>
        <input id="fileTypes-2" type="checkbox" checked>
        <input id="imgType1" name="imageTypes" type="checkbox" checked>
        <label for="imgType1">JPEG</label>
      `

      updateFileTypes()

      const span = document.querySelector('.error-preview-filesMimes')
      expect(span?.textContent).toBe('JPEG')
    })

    test('should update spans with single tabular data type', () => {
      document.body.innerHTML = `
        <span class="error-preview-filesMimes">Initial text</span>
        <input id="fileTypes-3" type="checkbox" checked>
        <input id="tabType1" name="tabularDataTypes" type="checkbox" checked>
        <label for="tabType1">CSV</label>
      `

      updateFileTypes()

      const span = document.querySelector('.error-preview-filesMimes')
      expect(span?.textContent).toBe('CSV')
    })

    test('should join multiple types with commas and "or"', () => {
      document.body.innerHTML = `
        <span class="error-preview-filesMimes">Initial text</span>
        <input id="fileTypes" type="checkbox" checked>
        <input id="docType1" name="documentTypes" type="checkbox" checked>
        <label for="docType1">PDF</label>
        <input id="docType2" name="documentTypes" type="checkbox" checked>
        <label for="docType2">DOC</label>
        <input id="fileTypes-2" type="checkbox" checked>
        <input id="imgType1" name="imageTypes" type="checkbox" checked>
        <label for="imgType1">JPEG</label>
      `

      updateFileTypes()

      const span = document.querySelector('.error-preview-filesMimes')
      expect(span?.textContent).toBe('PDF, DOC or JPEG')
    })

    test('should update multiple spans', () => {
      document.body.innerHTML = `
        <span class="error-preview-filesMimes">Initial text 1</span>
        <span class="error-preview-filesMimes">Initial text 2</span>
        <input id="fileTypes" type="checkbox" checked>
        <input id="docType1" name="documentTypes" type="checkbox" checked>
        <label for="docType1">PDF</label>
      `

      updateFileTypes()

      const spans = document.querySelectorAll('.error-preview-filesMimes')
      expect(spans[0].textContent).toBe('PDF')
      expect(spans[1].textContent).toBe('PDF')
    })

    test('should handle missing labels', () => {
      document.body.innerHTML = `
        <span class="error-preview-filesMimes">Initial text</span>
        <input id="fileTypes" type="checkbox" checked>
        <input id="docType1" name="documentTypes" type="checkbox" checked>
      `

      updateFileTypes()

      const span = document.querySelector('.error-preview-filesMimes')
      expect(span?.textContent).toBe('[files types you accept]')
    })

    test('should change "must be a" to "must be" for multiple types', () => {
      document.body.innerHTML = `
        <div class="govuk-error-message">File must be a <span class="error-preview-filesMimes">Initial text</span></div>
        <input id="fileTypes" type="checkbox" checked>
        <input id="docType1" name="documentTypes" type="checkbox" checked>
        <label for="docType1">PDF</label>
        <input id="docType2" name="documentTypes" type="checkbox" checked>
        <label for="docType2">DOC</label>
        <input id="docType3" name="documentTypes" type="checkbox" checked>
        <label for="docType3">XLS</label>
      `

      updateFileTypes()

      const errorMessage = document.querySelector('.govuk-error-message')
      expect(errorMessage?.innerHTML).toBe(
        'File must be <span class="error-preview-filesMimes">PDF, DOC or XLS</span>'
      )
    })

    test('should keep "must be a" for single type', () => {
      document.body.innerHTML = `
        <div class="govuk-error-message">File must be a <span class="error-preview-filesMimes">Initial text</span></div>
        <input id="fileTypes" type="checkbox" checked>
        <input id="docType1" name="documentTypes" type="checkbox" checked>
        <label for="docType1">PDF</label>
      `

      updateFileTypes()

      const errorMessage = document.querySelector('.govuk-error-message')
      expect(errorMessage?.innerHTML).toBe(
        'File must be a <span class="error-preview-filesMimes">PDF</span>'
      )
    })

    test('should keep "must be a" for default text', () => {
      document.body.innerHTML = `
        <div class="govuk-error-message">File must be a <span class="error-preview-filesMimes">Initial text</span></div>
        <input id="fileTypes" type="checkbox">
      `

      updateFileTypes()

      const errorMessage = document.querySelector('.govuk-error-message')
      expect(errorMessage?.innerHTML).toBe(
        'File must be a <span class="error-preview-filesMimes">[files types you accept]</span>'
      )
    })

    test('should detect "any" file type and remove li when fileTypes-5 is checked', () => {
      document.body.innerHTML = `
        <ul>
          <li>
            <span class="error-preview-filesMimes">Initial text</span>
          </li>
        </ul>
        <input id="fileTypes-5" type="checkbox" checked>
      `

      updateFileTypes()

      const li = document.querySelector('li')
      expect(li).toBeNull()
    })

    test('should remove li element when "any" is selected', () => {
      document.body.innerHTML = `
        <ul class="govuk-error-summary__list">
          <li>
            <a href="#file-upload">File must be a <span class="error-preview-filesMimes">PDF</span></a>
          </li>
        </ul>
        <input id="fileTypes-5" type="checkbox" checked>
      `

      updateFileTypes()

      const li = document.querySelector('li')
      expect(li).toBeNull()
    })

    test('should not remove li when "any" is not selected', () => {
      document.body.innerHTML = `
        <ul class="govuk-error-summary__list">
          <li>
            <a href="#file-upload">File must be a <span class="error-preview-filesMimes">PDF</span></a>
          </li>
        </ul>
        <input id="fileTypes-5" type="checkbox">
        <input id="fileTypes" type="checkbox" checked>
        <input id="docType1" name="documentTypes" type="checkbox" checked>
        <label for="docType1">PDF</label>
      `

      updateFileTypes()

      const li = document.querySelector('li')
      expect(li).not.toBeNull()
      const span = document.querySelector('.error-preview-filesMimes')
      expect(span?.textContent).toBe('PDF')
    })
  })

  describe('setupFileTypeListeners', () => {
    test('should set up change event listener', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener')

      setupFileTypeListeners()

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      )
      addEventListenerSpy.mockRestore()
    })

    test('should call updateFileTypes immediately when setup', () => {
      document.body.innerHTML = `
        <span class="error-preview-filesMimes">Initial text</span>
        <input id="fileTypes" type="checkbox">
      `

      expect(
        document.querySelector('.error-preview-filesMimes')?.textContent
      ).toBe('Initial text')

      setupFileTypeListeners()

      expect(
        document.querySelector('.error-preview-filesMimes')?.textContent
      ).toBe('[files types you accept]')
    })

    test('should update file types after checkbox change with delay', () => {
      document.body.innerHTML = `
        <span class="error-preview-filesMimes">Initial text</span>
        <input id="fileTypes" type="checkbox">
        <input id="docType1" name="documentTypes" type="checkbox">
        <label for="docType1">PDF</label>
      `

      setupFileTypeListeners()

      expect(
        document.querySelector('.error-preview-filesMimes')?.textContent
      ).toBe('[files types you accept]')

      /** @type {HTMLInputElement} */
      const parent = /** @type {HTMLInputElement} */ (
        document.getElementById('fileTypes')
      )
      parent.checked = true

      /** @type {HTMLInputElement} */
      const checkbox = /** @type {HTMLInputElement} */ (
        document.getElementById('docType1')
      )
      checkbox.checked = true

      const event = document.createEvent('Event')
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      event.initEvent('change', true, true)
      checkbox.dispatchEvent(event)

      expect(
        document.querySelector('.error-preview-filesMimes')?.textContent
      ).toBe('[files types you accept]')

      jest.advanceTimersByTime(10)

      expect(
        document.querySelector('.error-preview-filesMimes')?.textContent
      ).toBe('PDF')
    })

    test('should not update file types when non-checkbox element changes', () => {
      document.body.innerHTML = `
        <span class="error-preview-filesMimes">Initial text</span>
        <input id="testText" type="text">
      `

      setupFileTypeListeners()

      /** @type {HTMLElement|null} */
      const element = document.querySelector('.error-preview-filesMimes')
      if (!element) {
        throw new Error()
      }

      element.textContent = 'test marker'

      /** @type {HTMLInputElement} */
      const textInput = /** @type {HTMLInputElement} */ (
        document.getElementById('testText')
      )
      textInput.value = 'new value'

      const event = document.createEvent('Event')
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      event.initEvent('change', true, true)
      textInput.dispatchEvent(event)

      jest.advanceTimersByTime(10)

      expect(
        document.querySelector('.error-preview-filesMimes')?.textContent
      ).toBe('test marker')
    })
  })
})
