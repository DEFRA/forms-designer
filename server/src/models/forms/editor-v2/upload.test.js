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
        downloadAction: '/library/my-form-slug/editor-v2/download'
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
      expect(result.downloadAction).toBe(
        '/library/my-custom-form/editor-v2/download'
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
