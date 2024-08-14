import { slugify } from '~/src/utils/helpers.js'

describe('Helpers', () => {
  describe('slugify', () => {
    it.each([
      {
        title: 'This is a form title',
        slug: 'this-is-a-form-title'
      },
      {
        title: 'this-is-already-slugified-with-trailing-hyphen-',
        slug: 'this-is-already-slugified-with-trailing-hyphen'
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

    it('suports slug options', () => {
      const title = 'This is a form title with trailing spaces  '
      const slug = 'this-is-a-form-title-with-trailing-spaces-'

      // Skip trim, e.g. path formatting "as you type"
      expect(slugify(title, { trim: false })).toBe(slug)
    })
  })
})
