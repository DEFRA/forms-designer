import { privacyNoticyViewModel } from '~/src/models/forms/privacy-notice.js'

describe('edit - model - privacy notice', () => {
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
    privacyNoticeUrl: 'https://www.gov.uk/help/privacy-notice',
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author
  }

  it('should test privacy policy view model', () => {
    const result = privacyNoticyViewModel(formMetadata)
    expect(result.pageTitle).toBe('Privacy notice for this form')
    expect(result.field.id).toBe('privacyNoticeUrl')
    expect(result.field.name).toBe('privacyNoticeUrl')
    expect(result.field.value).toBe('https://www.gov.uk/help/privacy-notice')
  })
})

/**
 * @import { FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 */
