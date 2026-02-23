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
  const formMetadataLegacy = {
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
    privacyNoticeType: 'text',
    privacyNoticeText: 'Some text',
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author
  }

  it('should test privacy policy view model (legacy)', () => {
    const result = privacyNoticyViewModel(formMetadataLegacy)
    expect(result.pageTitle).toBe('Privacy notice for this form')
    expect(result.fields.privacyNoticeType.id).toBe('privacyNoticeType')
    expect(result.fields.privacyNoticeType.name).toBe('privacyNoticeType')

    expect(result.fields.privacyNoticeText.id).toBe('privacyNoticeText')
    expect(result.fields.privacyNoticeText.name).toBe('privacyNoticeText')

    expect(result.fields.privacyNoticeUrl.id).toBe('privacyNoticeUrl')
    expect(result.fields.privacyNoticeUrl.name).toBe('privacyNoticeUrl')
    expect(result.fields.privacyNoticeUrl.value).toBe(
      'https://www.gov.uk/help/privacy-notice'
    )
    expect(result.fields.privacyNoticeType.items[0].checked).toBe(false)
    expect(result.fields.privacyNoticeType.items[1].checked).toBe(true)
  })

  it('should handle privacy policy settings in view model (new)', () => {
    const result = privacyNoticyViewModel(formMetadata)
    expect(result.pageTitle).toBe('Privacy notice for this form')
    expect(result.fields.privacyNoticeType.id).toBe('privacyNoticeType')
    expect(result.fields.privacyNoticeType.name).toBe('privacyNoticeType')

    expect(result.fields.privacyNoticeText.id).toBe('privacyNoticeText')
    expect(result.fields.privacyNoticeText.name).toBe('privacyNoticeText')
    expect(result.fields.privacyNoticeText.value).toBe('Some text')

    expect(result.fields.privacyNoticeUrl.id).toBe('privacyNoticeUrl')
    expect(result.fields.privacyNoticeUrl.name).toBe('privacyNoticeUrl')
    expect(result.fields.privacyNoticeType.items[0].checked).toBe(true)
    expect(result.fields.privacyNoticeType.items[1].checked).toBe(false)
  })
})

/**
 * @import { FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 */
