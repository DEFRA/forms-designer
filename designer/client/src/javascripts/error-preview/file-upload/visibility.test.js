import { updateFileUploadVisibility } from '~/src/javascripts/error-preview/file-upload/visibility'

describe('visibility', () => {
  describe('updateFileUploadVisibility', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
    })

    test('should update min file count spans when minFiles input changes', () => {
      document.body.innerHTML = `
        <input id="minFiles" type="number" value="3">
        <input id="maxFiles" type="number" value="">
        <input id="exactFiles" type="number" value="">
        <span class="error-preview-min">Initial text</span>
        <span class="error-preview-min">Initial text</span>
      `

      const minFilesInput = /** @type {HTMLInputElement} */ (
        document.getElementById('minFiles')
      )

      updateFileUploadVisibility({ source: minFilesInput })

      const minSpans = document.querySelectorAll('.error-preview-min')
      expect(minSpans).toHaveLength(2)
      expect(minSpans[0].textContent).toBe('3')
      expect(minSpans[1].textContent).toBe('3')
    })

    test('should update max file count spans when maxFiles input changes', () => {
      document.body.innerHTML = `
        <input id="minFiles" type="number" value="">
        <input id="maxFiles" type="number" value="10">
        <input id="exactFiles" type="number" value="">
        <span class="error-preview-max">Initial text</span>
        <span class="error-preview-max">Initial text</span>
      `

      const maxFilesInput = /** @type {HTMLInputElement} */ (
        document.getElementById('maxFiles')
      )

      updateFileUploadVisibility({ source: maxFilesInput })

      const maxSpans = document.querySelectorAll('.error-preview-max')
      expect(maxSpans).toHaveLength(2)
      expect(maxSpans[0].textContent).toBe('10')
      expect(maxSpans[1].textContent).toBe('10')
    })

    test('should update exact file count spans when exactFiles input changes', () => {
      document.body.innerHTML = `
        <input id="minFiles" type="number" value="">
        <input id="maxFiles" type="number" value="">
        <input id="exactFiles" type="number" value="5">
        <span class="error-preview-length">Initial text</span>
        <span class="error-preview-length">Initial text</span>
      `

      const exactFilesInput = /** @type {HTMLInputElement} */ (
        document.getElementById('exactFiles')
      )

      updateFileUploadVisibility({ source: exactFilesInput })

      const exactSpans = document.querySelectorAll('.error-preview-length')
      expect(exactSpans).toHaveLength(2)
      expect(exactSpans[0].textContent).toBe('5')
      expect(exactSpans[1].textContent).toBe('5')
    })

    test('should use placeholders when min input value is empty', () => {
      document.body.innerHTML = `
        <input id="minFiles" type="number" value="">
        <input id="maxFiles" type="number" value="">
        <input id="exactFiles" type="number" value="">
        <span class="error-preview-min">Initial text</span>
      `

      const minFilesInput = /** @type {HTMLInputElement} */ (
        document.getElementById('minFiles')
      )

      updateFileUploadVisibility({ source: minFilesInput })

      const minSpan = document.querySelector('.error-preview-min')
      expect(minSpan?.textContent).toBe('[min file count]')
    })

    test('should use placeholders when max input value is empty', () => {
      document.body.innerHTML = `
        <input id="minFiles" type="number" value="">
        <input id="maxFiles" type="number" value="">
        <input id="exactFiles" type="number" value="">
        <span class="error-preview-max">Initial text</span>
      `

      const maxFilesInput = /** @type {HTMLInputElement} */ (
        document.getElementById('maxFiles')
      )

      updateFileUploadVisibility({ source: maxFilesInput })

      const maxSpan = document.querySelector('.error-preview-max')
      expect(maxSpan?.textContent).toBe('[max file count]')
    })

    test('should use placeholders when exact input value is empty', () => {
      document.body.innerHTML = `
        <input id="minFiles" type="number" value="">
        <input id="maxFiles" type="number" value="">
        <input id="exactFiles" type="number" value="">
        <span class="error-preview-length">Initial text</span>
      `

      const exactFilesInput = /** @type {HTMLInputElement} */ (
        document.getElementById('exactFiles')
      )

      updateFileUploadVisibility({ source: exactFilesInput })

      const exactSpan = document.querySelector('.error-preview-length')
      expect(exactSpan?.textContent).toBe('[exact file count]')
    })

    test('should handle multiple different span types at once', () => {
      document.body.innerHTML = `
        <input id="minFiles" type="number" value="3">
        <input id="maxFiles" type="number" value="10">
        <input id="exactFiles" type="number" value="5">
        <span class="error-preview-min">Min initial</span>
        <span class="error-preview-max">Max initial</span>
        <span class="error-preview-length">Exact initial</span>
      `

      const minFilesInput = /** @type {HTMLInputElement} */ (
        document.getElementById('minFiles')
      )

      updateFileUploadVisibility({ source: minFilesInput })

      expect(document.querySelector('.error-preview-min')?.textContent).toBe(
        '3'
      )
      expect(document.querySelector('.error-preview-max')?.textContent).toBe(
        'Max initial'
      )
      expect(document.querySelector('.error-preview-length')?.textContent).toBe(
        'Exact initial'
      )
    })
  })
})
