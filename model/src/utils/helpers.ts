import slug from 'slug'

import { type CheckboxOrRadioItem } from '~/src/common/types.js'

const blankOptionId = '__0__'

/**
 * Replace whitespace, en-dashes and em-dashes with spaces
 * before running through the slug package
 */
export function slugify(input = '', options?: slug.Options) {
  const string = input.trimStart().replace(/[\s–—]/g, ' ')

  return slug(string, {
    fallback: false,
    lower: true,
    trim: true,
    ...options
  })
}

export function addBlankSelectOption(elem: { items?: CheckboxOrRadioItem[] }) {
  if (!elem.items?.length) {
    return elem
  }

  if (elem.items[0].id !== blankOptionId) {
    elem.items.unshift({ id: blankOptionId, text: '', value: '' })
  }

  return elem
}
