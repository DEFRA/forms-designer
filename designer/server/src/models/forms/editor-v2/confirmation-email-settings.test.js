import {
  buildDefinition,
  buildQuestionPage,
  buildSummaryPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import {
  getPreviewModel,
  settingsFields
} from '~/src/models/forms/editor-v2/confirmation-email-settings.js'

describe('confirmation email settings', () => {
  describe('settingsFields', () => {
    it('should create checkbox field with value false (confirmation email enabled)', () => {
      const fields = settingsFields('false')

      expect(fields.disableConfirmationEmail).toEqual({
        name: 'disableConfirmationEmail',
        id: 'disableConfirmationEmail',
        items: [
          {
            value: 'true',
            text: 'Turn off the confirmation email',
            checked: false
          }
        ]
      })
    })

    it('should create checkbox field with value true (confirmation email disabled)', () => {
      const fields = settingsFields('true')

      expect(fields.disableConfirmationEmail).toEqual({
        name: 'disableConfirmationEmail',
        id: 'disableConfirmationEmail',
        items: [
          {
            value: 'true',
            text: 'Turn off the confirmation email',
            checked: true
          }
        ]
      })
    })

    it('should create checkbox field with undefined value', () => {
      const fields = settingsFields(undefined)

      expect(fields.disableConfirmationEmail).toEqual({
        name: 'disableConfirmationEmail',
        id: 'disableConfirmationEmail',
        items: [
          {
            value: 'true',
            text: 'Turn off the confirmation email',
            checked: false
          }
        ]
      })
    })

    it('should include validation errors when provided', () => {
      const validation = {
        formErrors: {
          disableConfirmationEmail: {
            text: 'Select an option',
            href: '#disableConfirmationEmail'
          }
        },
        formValues: {}
      }

      // @ts-expect-error - Partial validation object for testing error handling
      const fields = settingsFields('false', validation)

      expect(fields.disableConfirmationEmail.errorMessage).toEqual({
        text: 'Select an option'
      })
    })
  })

  describe('getPreviewModel', () => {
    it('should create the preview model for summary page', () => {
      const page = buildSummaryPage()
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            components: [
              buildTextFieldComponent({
                shortDescription: 'Your name'
              })
            ]
          })
        ]
      })
      const previewModel = getPreviewModel(
        page,
        definition,
        'http://preview-url',
        '',
        false,
        true
      )

      expect(previewModel.componentRows.rows).toBeInstanceOf(Array)
      expect(previewModel.components).toEqual([])
      expect(previewModel.previewTitle).toBe('Preview of Check answers page')
      expect(previewModel.previewPageUrl).toBe('http://preview-url')
      expect(previewModel.buttonText).toBe('Send')
      expect(previewModel.hasPageSettingsTab).toBe(true)
    })

    it('should create the preview model with page title', () => {
      const page = buildSummaryPage({
        title: 'Check your answers before submitting'
      })
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            components: [
              buildTextFieldComponent({
                shortDescription: 'Your email'
              })
            ]
          })
        ]
      })
      const previewModel = getPreviewModel(
        page,
        definition,
        'http://another-url',
        '',
        false,
        true
      )

      expect(previewModel.pageTitle).toEqual({
        text: 'Check your answers before sending your form',
        classes: ''
      })
      expect(previewModel.previewPageUrl).toBe('http://another-url')
    })

    it('should handle summary page with confirmation email controller', () => {
      const page = buildSummaryPage()
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            components: [
              buildTextFieldComponent({
                shortDescription: 'Full name'
              })
            ]
          })
        ]
      })
      const previewModel = getPreviewModel(
        page,
        definition,
        'http://test-url',
        '',
        false,
        false
      )

      expect(previewModel.componentRows.rows).toBeInstanceOf(Array)
      expect(previewModel.previewTitle).toBe('Preview of Check answers page')
    })

    it('should include declaration in preview when provided', () => {
      const page = buildSummaryPage()
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            components: [
              buildTextFieldComponent({
                shortDescription: 'Your details'
              })
            ]
          })
        ]
      })
      const declarationText = 'I agree to the terms and conditions'
      const previewModel = getPreviewModel(
        page,
        definition,
        'http://test-url',
        declarationText,
        true,
        true
      )

      expect(previewModel.components).toHaveLength(1)
      expect(previewModel.components[0].model).toMatchObject({
        content: expect.stringContaining(declarationText)
      })
      expect(previewModel.showConfirmationEmail).toBe(true)
    })
  })
})
