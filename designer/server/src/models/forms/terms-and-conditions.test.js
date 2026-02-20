import { termsAndConditionsViewModel } from '~/src/models/forms/terms-and-conditions.js'

describe('edit - model - terms and conditions', () => {
  const now = new Date()
  const authorId = 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
  const authorDisplayName = 'Enrique Chase'

  /**
   * @satisfies {FormMetadataAuthor}
   */
  const author = {
    id: authorId,
    displayName: authorDisplayName
  }

  /**
   * @satisfies {FormMetadata}
   */
  const formMetadata = {
    id: '661e4ca5039739ef2902b214',
    slug: 'my-form-slug',
    title: 'Test form',
    organisation: 'Defra',
    teamName: 'Defra Forms',
    teamEmail: 'defraforms@defra.gov.uk',
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author
  }

  it('should test terms and conditions view model', () => {
    const result = termsAndConditionsViewModel(formMetadata)
    expect(result.pageTitle).toBe('Terms and conditions')
    expect(result.fields.termsAndConditionsAgreed.id).toBe(
      'termsAndConditionsAgreed'
    )
    expect(result.fields.termsAndConditionsAgreed.name).toBe(
      'termsAndConditionsAgreed'
    )
    expect(result.fields.termsAndConditionsAgreed.checked).toBe(false)
    expect(result.backLink.href).toBe('/library/my-form-slug')
    expect(result.buttonText).toBe('Save and continue')
  })

  it('should test terms and conditions view model when termsAndConditionsAgreed is true', () => {
    const formMetadataWithAgreement = {
      ...formMetadata,
      termsAndConditionsAgreed: true
    }
    const result = termsAndConditionsViewModel(formMetadataWithAgreement)
    expect(result.fields.termsAndConditionsAgreed.checked).toBe(true)
  })

  it('should test terms and conditions view model when termsAndConditionsAgreed is undefined', () => {
    const formMetadataWithoutAgreement = {
      ...formMetadata,
      termsAndConditionsAgreed: undefined
    }
    const result = termsAndConditionsViewModel(formMetadataWithoutAgreement)
    expect(result.fields.termsAndConditionsAgreed.checked).toBe(false)
  })

  it('should include error details when validation fails', () => {
    const validation = {
      formErrors: {
        termsAndConditionsAgreed: {
          text: 'You must confirm you meet the terms and conditions to continue',
          href: '#termsAndConditionsAgreed'
        }
      }
    }
    const result = termsAndConditionsViewModel(formMetadata, validation)
    expect(result.formErrors).toBe(validation.formErrors)
    expect(result.errorList).toEqual([
      {
        text: 'You must confirm you meet the terms and conditions to continue',
        href: '#termsAndConditionsAgreed'
      }
    ])
  })

  it('should have no errors when validation is undefined', () => {
    const result = termsAndConditionsViewModel(formMetadata)
    expect(result.formErrors).toBeUndefined()
    expect(result.errorList).toEqual([])
  })
})

/**
 * @import { FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 */
