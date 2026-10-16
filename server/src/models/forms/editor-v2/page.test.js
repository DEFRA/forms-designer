import { testFormDefinitionWithTwoPagesAndQuestions } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { pageViewModel } from '~/src/models/forms/editor-v2/page.js'

describe('page', () => {
  describe('pageViewModel', () => {
    it('should not include an error message if there isnt one', () => {
      const model = pageViewModel(
        testFormMetadata,
        testFormDefinitionWithTwoPagesAndQuestions
      )
      expect(model.field.errorMessage).toBeUndefined()
    })

    it('should include an error message if there is one', () => {
      const formValues = /** @type {FormEditor} */ ({ pageType: '' })
      const formErrors = /** @type {ErrorDetails} */ ({
        pageType: { text: 'Select a page type', href: '#' }
      })
      const model = pageViewModel(
        testFormMetadata,
        testFormDefinitionWithTwoPagesAndQuestions,
        { pageType: '' },
        { formValues, formErrors }
      )
      expect(model.field.errorMessage?.text).toBe('Select a page type')
    })
  })
})

/**
 * @import { FormEditor } from '@defra/forms-model'
 * @import { ErrorDetails } from '~/src/common/helpers/types.js'
 */
