import { submissionGuidanceViewModel } from '~/src/models/forms/submission-guidance.js'

describe('edit - model - submission - guidance', () => {
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
    submissionGuidance: 'We’ll send you an email to let you know the outcome.',
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author
  }

  it('should test submission guidance view model', () => {
    const result = submissionGuidanceViewModel(formMetadata)
    expect(result.pageTitle).toBe(
      'Tell users what happens after they submit their form'
    )
    expect(result.field.id).toBe('submissionGuidance')
    expect(result.field.name).toBe('submissionGuidance')
    expect(result.field.value).toBe(
      'We’ll send you an email to let you know the outcome.'
    )
  })
})

/**
 * @import { FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 */
