import { phoneViewModel } from '~/src/models/forms/contact/phone.js'

describe('edit - model - contact - phone', () => {
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
      phone: 'A\r\nB\r\nC'
    },
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author
  }

  it('should test phone view model', () => {
    const result = phoneViewModel(formMetadata)
    expect(result.pageTitle).toBe('Phone number and opening times')
    expect(result.field.id).toBe('phone')
    expect(result.field.name).toBe('phone')
    expect(result.field.value).toBe('A\r\nB\r\nC')
  })
})

/**
 * @import { FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 */
