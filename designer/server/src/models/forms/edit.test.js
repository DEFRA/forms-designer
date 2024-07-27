import { teamDetailsViewModel } from './edit.js'

describe('edit - model', () => {
  const now = new Date()
  const authorId = 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
  const authorDisplayName = 'Enrique Chase'

  /**
   * @satisfies {import('~/dist/types/index.js').FormMetadataAuthor}
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

  it('should test team details view model', () => {
    const result = teamDetailsViewModel(formMetadata)
    expect(result.fields[0].id).toBe('teamName')
    expect(result.fields[0].value).toBe('Defra Forms')
    expect(result.fields[1].id).toBe('teamEmail')
    expect(result.fields[1].value).toBe('defraforms@defra.gov.uk')
  })
})

/**
 * @typedef {import('@defra/forms-model').FormMetadata} FormMetadata
 */
