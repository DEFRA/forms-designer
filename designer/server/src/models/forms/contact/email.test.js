import { emailViewModel } from '~/src/models/forms/contact/email.js'

describe('edit - model - contact - email', () => {
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
    contact: {
      email: {
        address: 'Enrique.Chase@defra.gov.uk',
        responseTime: '2 weeks'
      }
    },
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author
  }

  it('should test email view model', () => {
    const result = emailViewModel(formMetadata)
    expect(result.pageTitle).toBe('Email address for support')
    expect(result.fields[0].id).toBe('address')
    expect(result.fields[0].name).toBe('address')
    expect(result.fields[0].value).toBe('Enrique.Chase@defra.gov.uk')
    expect(result.fields[1].id).toBe('responseTime')
    expect(result.fields[1].name).toBe('responseTime')
    expect(result.fields[1].value).toBe('2 weeks')
  })
})

/**
 * @import { FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 */
