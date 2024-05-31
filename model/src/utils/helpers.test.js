import { describe, expect, it } from '@jest/globals'

import { slugify } from '~/src/utils/helpers.js'

describe('Helpers', () => {
  describe('Slugify', () => {
    it.each([
      {
        title: 'This is a form title',
        slug: 'this-is-a-form-title'
      },
      {
        title: 'This is a form’s—really—punctuated: title',
        slug: 'this-is-a-forms-really-punctuated-title'
      },
      {
        title: '  This is a form title with leading spaces',
        slug: 'this-is-a-form-title-with-leading-spaces'
      },
      {
        title: 'This is a form title with trailing spaces  ',
        slug: 'this-is-a-form-title-with-trailing-spaces'
      },
      {
        title: 'This is a   heavily   spaced  form title',
        slug: 'this-is-a-heavily-spaced-form-title'
      },
      {
        title: 'With a prefix: This is a form title',
        slug: 'with-a-prefix-this-is-a-form-title'
      },
      {
        title: 'With something in brackets (surprise)',
        slug: 'with-something-in-brackets-surprise'
      }
    ])("formats '$title' to '$slug'", ({ title, slug }) => {
      expect(slugify(title)).toBe(slug)
    })
  })
})
