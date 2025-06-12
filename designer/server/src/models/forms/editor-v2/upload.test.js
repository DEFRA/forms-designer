import { testFormDefinitionWithSummaryOnly } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { uploadViewModel } from '~/src/models/forms/editor-v2/upload.js'

describe('upload view model', () => {
  describe('uploadViewModel', () => {
    test('should return correct view model without validation errors', () => {
      const result = uploadViewModel(
        testFormMetadata,
        testFormDefinitionWithSummaryOnly
      )

      expect(result).toEqual({
        form: testFormMetadata,
        backLink: {
          href: '/library/my-form-slug/editor-v2/pages',
          text: 'Back to pages'
        },
        navigation: expect.any(Object),
        pageTitle: 'Upload a form - Test form',
        pageHeading: {
          text: 'Upload a form'
        },
        pageCaption: {
          text: 'Test form'
        },
        errorList: [],
        formErrors: undefined,
        formValues: undefined,
        uploadAction: '/library/my-form-slug/editor-v2/upload',
        downloadAction: '/library/my-form-slug/editor-v2/download',
        currentFormData: JSON.stringify(
          testFormDefinitionWithSummaryOnly,
          null,
          2
        ),
        formSlug: 'my-form-slug'
      })
    })

    test('should return correct view model with validation errors', () => {
      const validation = {
        formErrors: {
          formDefinition: {
            text: 'Select a file to upload',
            href: '#formDefinition'
          }
        },
        formValues: {
          someField: 'someValue'
        }
      }

      const result = uploadViewModel(
        testFormMetadata,
        testFormDefinitionWithSummaryOnly,
        validation
      )

      expect(result.errorList).toEqual([
        {
          text: 'Select a file to upload',
          href: '#formDefinition'
        }
      ])
      expect(result.formErrors).toEqual(validation.formErrors)
      expect(result.formValues).toEqual(validation.formValues)
    })

    test('should handle validation object with no formErrors', () => {
      const validation = {
        formValues: {
          someField: 'someValue'
        }
      }

      const result = uploadViewModel(
        testFormMetadata,
        testFormDefinitionWithSummaryOnly,
        validation
      )

      expect(result.errorList).toEqual([])
      expect(result.formErrors).toBeUndefined()
      expect(result.formValues).toEqual(validation.formValues)
    })

    test('should handle empty validation object', () => {
      const validation = {}

      const result = uploadViewModel(
        testFormMetadata,
        testFormDefinitionWithSummaryOnly,
        validation
      )

      expect(result.errorList).toEqual([])
      expect(result.formErrors).toBeUndefined()
      expect(result.formValues).toBeUndefined()
    })

    test('should generate correct URLs for different form slugs', () => {
      const customMetadata = {
        ...testFormMetadata,
        slug: 'my-custom-form'
      }

      const result = uploadViewModel(
        customMetadata,
        testFormDefinitionWithSummaryOnly
      )

      expect(result.backLink.href).toBe(
        '/library/my-custom-form/editor-v2/pages'
      )
      expect(result.uploadAction).toBe(
        '/library/my-custom-form/editor-v2/upload'
      )
      expect(result.downloadAction).toBe(
        '/library/my-custom-form/editor-v2/download'
      )
      expect(result.formSlug).toBe('my-custom-form')
    })

    test('should stringify form definition correctly', () => {
      const result = uploadViewModel(
        testFormMetadata,
        testFormDefinitionWithSummaryOnly
      )

      expect(result.currentFormData).toBe(
        JSON.stringify(testFormDefinitionWithSummaryOnly, null, 2)
      )
      expect(JSON.parse(result.currentFormData)).toEqual(
        testFormDefinitionWithSummaryOnly
      )
    })

    test('should include navigation object', () => {
      const result = uploadViewModel(
        testFormMetadata,
        testFormDefinitionWithSummaryOnly
      )

      expect(result.navigation).toBeDefined()
      expect(typeof result.navigation).toBe('object')
    })
  })
})
