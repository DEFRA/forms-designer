import {
  type ContentComponentsDef,
  type InputFieldsComponentsDef
} from '@defra/forms-model'

import { isNotContentType } from '~/src/data/index.js'

test('isNotContentType type guard catches content types', () => {
  const contentBase = {
    options: {},
    content: '',
    name: '',
    schema: {},
    subType: 'content',
    title: ''
  } satisfies Partial<ContentComponentsDef>

  const inputBase: InputFieldsComponentsDef = {
    hint: '',
    name: '',
    options: {},
    schema: {},
    title: '',
    type: 'TextField'
  }

  expect(isNotContentType({ ...contentBase, type: 'Details' })).toBe(false)
  expect(isNotContentType({ ...contentBase, type: 'InsetText' })).toBe(false)
  expect(isNotContentType({ ...contentBase, type: 'Html' })).toBe(false)
  expect(isNotContentType(inputBase)).toBe(true)
  expect(isNotContentType({ ...inputBase, type: 'TelephoneNumberField' })).toBe(
    true
  )
  expect(
    isNotContentType({
      list: '',
      ...inputBase,
      type: 'RadiosField'
    })
  ).toBe(true)
})
