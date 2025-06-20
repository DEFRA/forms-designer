import { getErrorMessage, slugify } from '~/src/utils/helpers.js'

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

  describe('getErrorMessage', () => {
    it('returns message from Error objects', () => {
      const error = new Error('Test error message')
      expect(getErrorMessage(error)).toBe('Test error message')
    })

    it('returns message from custom Error subclasses', () => {
      const typeError = new TypeError('Type error message')
      const rangeError = new RangeError('Range error message')

      expect(getErrorMessage(typeError)).toBe('Type error message')
      expect(getErrorMessage(rangeError)).toBe('Range error message')
    })

    it('converts string values to string', () => {
      expect(getErrorMessage('string error')).toBe('string error')
      expect(getErrorMessage('')).toBe('')
    })

    it('converts number values to string', () => {
      expect(getErrorMessage(404)).toBe('404')
      expect(getErrorMessage(0)).toBe('0')
      expect(getErrorMessage(-1)).toBe('-1')
    })

    it('converts boolean values to string', () => {
      expect(getErrorMessage(true)).toBe('true')
      expect(getErrorMessage(false)).toBe('false')
    })

    it('converts null and undefined to string', () => {
      expect(getErrorMessage(null)).toBe('null')
      expect(getErrorMessage(undefined)).toBe('undefined')
    })

    it('converts object values to string', () => {
      const obj = { message: 'object error' }
      expect(getErrorMessage(obj)).toBe('[object Object]')
    })

    it('converts array values to string', () => {
      const arr = ['error', 'array']
      expect(getErrorMessage(arr)).toBe('error,array')
    })

    it('handles Error objects with empty messages', () => {
      const error = new Error('')
      expect(getErrorMessage(error)).toBe('')
    })

    it('handles Error objects with special characters in message', () => {
      const error = new Error(
        'Error with "quotes" and \'apostrophes\' and symbols: !@#$%'
      )
      expect(getErrorMessage(error)).toBe(
        'Error with "quotes" and \'apostrophes\' and symbols: !@#$%'
      )
    })
  })
})
