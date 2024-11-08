import { notificationEmailViewModel } from '~/src/models/forms/notification-email.js'

describe('edit - model - notification email', () => {
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
    notificationEmail: 'notificationemail@defra.gov.uk',
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author
  }

  it('should test notification email view model', () => {
    const result = notificationEmailViewModel(formMetadata)
    expect(result.pageTitle).toBe('Email address for submitted forms')
    expect(result.field.id).toBe('notificationEmail')
    expect(result.field.name).toBe('notificationEmail')
    expect(result.field.value).toBe('notificationemail@defra.gov.uk')
  })
})

/**
 * @import { FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 */
