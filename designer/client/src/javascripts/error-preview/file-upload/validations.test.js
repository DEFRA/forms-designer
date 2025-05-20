import { setupFileUploadValidation } from '~/src/javascripts/error-preview/file-upload/validations'

describe('validations', () => {
  describe('setupFileUploadValidation', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
    })

    test('should return early if required elements are not found', () => {
      document.body.innerHTML = `
        <input id="minFiles" type="number">
        <input id="maxFiles" type="number">
        <!-- exactFiles is missing -->
      `

      setupFileUploadValidation()

      expect(document.body.innerHTML).toBe(`
        <input id="minFiles" type="number">
        <input id="maxFiles" type="number">
        <!-- exactFiles is missing -->
      `)
    })

    test('should remove error classes when no values are set', () => {
      document.body.innerHTML = `
        <div>
          <input id="minFiles" type="number" value="" class="govuk-input--error">
          <input id="maxFiles" type="number" value="" class="govuk-input--error">
          <input id="exactFiles" type="number" value="" class="govuk-input--error">
        </div>
      `

      setupFileUploadValidation()

      expect(
        document
          .getElementById('minFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(false)
      expect(
        document
          .getElementById('maxFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(false)
      expect(
        document
          .getElementById('exactFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(false)

      expect(document.getElementById('file-validation-warning')).toBeNull()
    })

    test('should show error when both exact and min/max values are set', () => {
      document.body.innerHTML = `
        <div>
          <input id="minFiles" type="number" value="1">
          <input id="maxFiles" type="number" value="5">
          <input id="exactFiles" type="number" value="3">
        </div>
      `

      setupFileUploadValidation()

      expect(
        document
          .getElementById('minFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(true)
      expect(
        document
          .getElementById('maxFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(true)
      expect(
        document
          .getElementById('exactFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(true)

      const validationMsg = document.getElementById('file-validation-warning')
      expect(validationMsg).not.toBeNull()
      expect(validationMsg?.className).toBe('govuk-error-message')
      expect(validationMsg?.innerHTML).toContain(
        'You can only set either exact count OR min/max range, not both'
      )
    })

    test('should show error when exact and only min value is set', () => {
      document.body.innerHTML = `
        <div>
          <input id="minFiles" type="number" value="1">
          <input id="maxFiles" type="number" value="">
          <input id="exactFiles" type="number" value="3">
        </div>
      `

      setupFileUploadValidation()

      expect(
        document
          .getElementById('minFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(true)
      expect(
        document
          .getElementById('maxFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(false)
      expect(
        document
          .getElementById('exactFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(true)

      expect(document.getElementById('file-validation-warning')).not.toBeNull()
    })

    test('should show error when exact and only max value is set', () => {
      document.body.innerHTML = `
        <div>
          <input id="minFiles" type="number" value="">
          <input id="maxFiles" type="number" value="5">
          <input id="exactFiles" type="number" value="3">
        </div>
      `

      setupFileUploadValidation()

      expect(
        document
          .getElementById('minFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(false)
      expect(
        document
          .getElementById('maxFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(true)
      expect(
        document
          .getElementById('exactFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(true)

      expect(document.getElementById('file-validation-warning')).not.toBeNull()
    })

    test('should not show error when only exact value is set', () => {
      document.body.innerHTML = `
        <div>
          <input id="minFiles" type="number" value="">
          <input id="maxFiles" type="number" value="">
          <input id="exactFiles" type="number" value="3">
        </div>
      `

      setupFileUploadValidation()

      expect(
        document
          .getElementById('minFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(false)
      expect(
        document
          .getElementById('maxFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(false)
      expect(
        document
          .getElementById('exactFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(false)

      expect(document.getElementById('file-validation-warning')).toBeNull()
    })

    test('should not show error when only min/max values are set', () => {
      document.body.innerHTML = `
        <div>
          <input id="minFiles" type="number" value="1">
          <input id="maxFiles" type="number" value="5">
          <input id="exactFiles" type="number" value="">
        </div>
      `

      setupFileUploadValidation()

      expect(
        document
          .getElementById('minFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(false)
      expect(
        document
          .getElementById('maxFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(false)
      expect(
        document
          .getElementById('exactFiles')
          ?.classList.contains('govuk-input--error')
      ).toBe(false)

      expect(document.getElementById('file-validation-warning')).toBeNull()
    })

    test('should clear min/max when setting exact files', () => {
      document.body.innerHTML = `
        <div>
          <input id="minFiles" type="number" value="1">
          <input id="maxFiles" type="number" value="5">
          <input id="exactFiles" type="number" value="">
        </div>
      `

      setupFileUploadValidation()

      /** @type {HTMLInputElement} */
      const exactFiles = /** @type {HTMLInputElement} */ (
        document.getElementById('exactFiles')
      )
      exactFiles.value = '3'

      const event = document.createEvent('Event')
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      event.initEvent('input', true, true)
      exactFiles.dispatchEvent(event)

      // Min/max should be cleared
      /** @type {HTMLInputElement} */
      const minFiles = /** @type {HTMLInputElement} */ (
        document.getElementById('minFiles')
      )
      /** @type {HTMLInputElement} */
      const maxFiles = /** @type {HTMLInputElement} */ (
        document.getElementById('maxFiles')
      )
      expect(minFiles.value).toBe('')
      expect(maxFiles.value).toBe('')
    })

    test('should clear exact when setting min files', () => {
      document.body.innerHTML = `
        <div>
          <input id="minFiles" type="number" value="">
          <input id="maxFiles" type="number" value="">
          <input id="exactFiles" type="number" value="3">
        </div>
      `

      setupFileUploadValidation()

      /** @type {HTMLInputElement} */
      const minFiles = /** @type {HTMLInputElement} */ (
        document.getElementById('minFiles')
      )
      minFiles.value = '1'

      const event = document.createEvent('Event')
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      event.initEvent('input', true, true)
      minFiles.dispatchEvent(event)

      /** @type {HTMLInputElement} */
      const exactFiles = /** @type {HTMLInputElement} */ (
        document.getElementById('exactFiles')
      )
      expect(exactFiles.value).toBe('')
    })

    test('should clear exact when setting max files', () => {
      document.body.innerHTML = `
        <div>
          <input id="minFiles" type="number" value="">
          <input id="maxFiles" type="number" value="">
          <input id="exactFiles" type="number" value="3">
        </div>
      `

      setupFileUploadValidation()

      /** @type {HTMLInputElement} */
      const maxFiles = /** @type {HTMLInputElement} */ (
        document.getElementById('maxFiles')
      )
      maxFiles.value = '5'

      const event = document.createEvent('Event')
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      event.initEvent('input', true, true)
      maxFiles.dispatchEvent(event)

      /** @type {HTMLInputElement} */
      const exactFiles = /** @type {HTMLInputElement} */ (
        document.getElementById('exactFiles')
      )
      expect(exactFiles.value).toBe('')
    })

    test('should remove validation message when conflict is resolved', () => {
      document.body.innerHTML = `
        <div>
          <input id="minFiles" type="number" value="1">
          <input id="maxFiles" type="number" value="5">
          <input id="exactFiles" type="number" value="3">
        </div>
      `

      setupFileUploadValidation()

      expect(document.getElementById('file-validation-warning')).not.toBeNull()

      /** @type {HTMLInputElement} */
      const exactFiles = /** @type {HTMLInputElement} */ (
        document.getElementById('exactFiles')
      )
      exactFiles.value = ''

      const event = document.createEvent('Event')
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      event.initEvent('input', true, true)
      exactFiles.dispatchEvent(event)

      expect(document.getElementById('file-validation-warning')).toBeNull()
    })
  })
})
