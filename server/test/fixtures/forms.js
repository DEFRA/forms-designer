const now = new Date()
const authorId = 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
const authorDisplayName = 'Enrique Chase'

/**
 * @satisfies {import("@defra/forms-model").FormMetadataAuthor}
 */
const author = {
  id: authorId,
  displayName: authorDisplayName
}

/**
 * @satisfies {import("@defra/forms-model").FormMetadata[]}
 */
export const forms = [
  {
    id: '661e4ca5039739ef2902b214',
    slug: 'my-form-slug',
    title: 'Test form',
    organisation: 'Defra',
    teamName: 'Defra Forms',
    teamEmail: 'defraforms@defra.gov.uk',
    draft: {
      createdAt: now,
      createdBy: author,
      updatedAt: now,
      updatedBy: author
    },
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author
  }
]
