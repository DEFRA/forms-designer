import {
  phoneViewModel,
  emailViewModel,
  onlineViewModel
} from '~/src/models/forms/contact.js'

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
    expect(result.fields.address.id).toBe('address')
    expect(result.fields.address.name).toBe('address')
    expect(result.fields.address.value).toBe('Enrique.Chase@defra.gov.uk')
    expect(result.fields.responseTime.id).toBe('responseTime')
    expect(result.fields.responseTime.name).toBe('responseTime')
    expect(result.fields.responseTime.value).toBe('2 weeks')
  })
})

describe('edit - model - contact - online', () => {
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
      online: {
        url: 'https://www.gov.uk/guidance/contact-defra',
        text: 'Online contact form'
      }
    },
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author
  }

  it('should test online view model', () => {
    const result = onlineViewModel(formMetadata)
    expect(result.pageTitle).toBe('Contact link for support')
    expect(result.fields.url.id).toBe('url')
    expect(result.fields.url.name).toBe('url')
    expect(result.fields.url.value).toBe(
      'https://www.gov.uk/guidance/contact-defra'
    )
    expect(result.fields.text.id).toBe('text')
    expect(result.fields.text.name).toBe('text')
    expect(result.fields.text.value).toBe('Online contact form')
  })
})

/**
 * @import { FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 */
