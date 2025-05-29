import {
  updateFieldErrorText,
  updateFileUploadErrorText
} from '~/src/javascripts/error-preview/file-upload/error-display'

describe('error-display', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('updateFieldErrorText', () => {
    test('should return early if currentFieldId does not match targetFieldId', () => {
      const element = document.createElement('div')
      element.textContent = 'upload [min file count] files'

      updateFieldErrorText(
        element,
        'maxFiles',
        'minFiles',
        ['upload [min file count] files'],
        /\[min file count\]/g,
        '3',
        '[min file count]'
      )

      expect(element.textContent).toBe('upload [min file count] files')
    })

    test('should not update if text does not include any patterns', () => {
      const element = document.createElement('div')
      element.textContent = 'some other text'

      updateFieldErrorText(
        element,
        'minFiles',
        'minFiles',
        ['upload [min file count] files'],
        /\[min file count\]/g,
        '3',
        '[min file count]'
      )

      expect(element.textContent).toBe('some other text')
    })

    test('should update text when currentFieldId matches targetFieldId and pattern is found', () => {
      const element = document.createElement('div')
      element.innerHTML = 'upload <span>[min file count]</span> files'

      updateFieldErrorText(
        element,
        'minFiles',
        'minFiles',
        ['upload [min file count] files'],
        /\[min file count\]/g,
        '3',
        '[min file count]'
      )

      expect(element.innerHTML).toBe('upload <span>3</span> files')
    })

    test('should use defaultValue when value is empty', () => {
      const element = document.createElement('div')
      element.innerHTML = 'upload <span>[min file count]</span> files'

      updateFieldErrorText(
        element,
        'minFiles',
        'minFiles',
        ['upload [min file count] files'],
        /\[min file count\]/g,
        '',
        '[min file count]'
      )

      expect(element.innerHTML).toBe(
        'upload <span>[min file count]</span> files'
      )
    })

    test('should handle null textContent', () => {
      const element = document.createElement('div')
      Object.defineProperty(element, 'textContent', {
        get: () => null
      })

      updateFieldErrorText(
        element,
        'minFiles',
        'minFiles',
        ['some pattern'],
        /pattern/g,
        '3',
        'default'
      )
      expect(true).toBe(true)
    })
  })

  describe('updateFileUploadErrorText', () => {
    test('should update elements with minFiles class names', () => {
      document.body.innerHTML = `
        <div class="error-preview-min">Old value</div>
        <div class="error-preview-filesMin">Old value</div>
        <div class="govuk-error-message">Please upload [min file count] files</div>
      `

      updateFileUploadErrorText('minFiles', '3')

      const errorPreviewMin = document.querySelector('.error-preview-min')
      const errorPreviewFilesMin = document.querySelector(
        '.error-preview-filesMin'
      )
      const errorMessage = document.querySelector('.govuk-error-message')

      expect(errorPreviewMin?.textContent).toBe('3')
      expect(errorPreviewFilesMin?.textContent).toBe('3')
      expect(errorMessage?.innerHTML).toBe('Please upload 3 files')
    })

    test('should update elements with maxFiles class names', () => {
      document.body.innerHTML = `
        <div class="error-preview-max">Old value</div>
        <div class="error-preview-filesMax">Old value</div>
        <div class="govuk-error-message">You can only upload [max file count] files</div>
      `

      updateFileUploadErrorText('maxFiles', '5')

      const errorPreviewMax = document.querySelector('.error-preview-max')
      const errorPreviewFilesMax = document.querySelector(
        '.error-preview-filesMax'
      )
      const errorMessage = document.querySelector('.govuk-error-message')

      expect(errorPreviewMax?.textContent).toBe('5')
      expect(errorPreviewFilesMax?.textContent).toBe('5')
      expect(errorMessage?.innerHTML).toBe('You can only upload 5 files')
    })

    test('should update elements with exactFiles class names', () => {
      document.body.innerHTML = `
        <div class="error-preview-length">Old value</div>
        <div class="error-preview-filesExact">Old value</div>
        <div class="govuk-error-message">Please upload exactly [exact file count] files</div>
      `

      updateFileUploadErrorText('exactFiles', '2')

      const errorPreviewLength = document.querySelector('.error-preview-length')
      const errorPreviewFilesExact = document.querySelector(
        '.error-preview-filesExact'
      )
      const errorMessage = document.querySelector('.govuk-error-message')

      expect(errorPreviewLength?.textContent).toBe('2')
      expect(errorPreviewFilesExact?.textContent).toBe('2')
      expect(errorMessage?.innerHTML).toBe('Please upload exactly 2 files')
    })

    test('should use placeholders when value is empty', () => {
      document.body.innerHTML = `
        <div class="error-preview-min">Old value</div>
        <div class="error-preview-max">Old value</div>
        <div class="error-preview-length">Old value</div>
      `

      updateFileUploadErrorText('minFiles', '')
      updateFileUploadErrorText('maxFiles', '')
      updateFileUploadErrorText('exactFiles', '')

      const errorPreviewMin = document.querySelector('.error-preview-min')
      const errorPreviewMax = document.querySelector('.error-preview-max')
      const errorPreviewLength = document.querySelector('.error-preview-length')

      expect(errorPreviewMin?.textContent).toBe('[min file count]')
      expect(errorPreviewMax?.textContent).toBe('[max file count]')
      expect(errorPreviewLength?.textContent).toBe('[exact file count]')
    })

    test('should handle all error message patterns for minFiles', () => {
      document.body.innerHTML = `
        <div class="govuk-error-message">Please upload [min file count] files</div>
        <div class="govuk-error-message">Please upload [unknown] files</div>
      `

      updateFileUploadErrorText('minFiles', '3')

      const errorMessages = document.querySelectorAll('.govuk-error-message')
      expect(errorMessages[0].innerHTML).toBe('Please upload 3 files')
      expect(errorMessages[1].innerHTML).toBe('Please upload 3 files')
    })

    test('should handle all error message patterns for maxFiles', () => {
      document.body.innerHTML = `
        <div class="govuk-error-message">You can only upload [max file count] files</div>
        <div class="govuk-error-message">You can only upload [unknown] files</div>
      `

      updateFileUploadErrorText('maxFiles', '5')

      const errorMessages = document.querySelectorAll('.govuk-error-message')
      expect(errorMessages[0].innerHTML).toBe('You can only upload 5 files')
      expect(errorMessages[1].innerHTML).toBe('You can only upload 5 files')
    })

    test('should handle all error message patterns for exactFiles', () => {
      document.body.innerHTML = `
        <div class="govuk-error-message">Please upload exactly [exact file count] files</div>
        <div class="govuk-error-message">Please upload exactly [unknown] files</div>
      `

      updateFileUploadErrorText('exactFiles', '2')

      const errorMessages = document.querySelectorAll('.govuk-error-message')
      expect(errorMessages[0].innerHTML).toBe('Please upload exactly 2 files')
      expect(errorMessages[1].innerHTML).toBe('Please upload exactly 2 files')
    })

    test('should handle multiple different error messages at once', () => {
      document.body.innerHTML = `
        <div class="govuk-error-message">Please upload [min file count] files</div>
        <div class="govuk-error-message">You can only upload [max file count] files</div>
        <div class="govuk-error-message">Please upload exactly [exact file count] files</div>
      `

      updateFileUploadErrorText('minFiles', '2')

      const errorMessages = document.querySelectorAll('.govuk-error-message')
      expect(errorMessages[0].innerHTML).toBe('Please upload 2 files')
      expect(errorMessages[1].innerHTML).toBe(
        'You can only upload [max file count] files'
      )
      expect(errorMessages[2].innerHTML).toBe(
        'Please upload exactly [exact file count] files'
      )
    })
  })
})
