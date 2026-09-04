import { buildList, buildListItem } from '~/src/__stubs__/components.js'
import { listSchema } from '~/src/form/form-definition/index.js'
import {
  ExtensionType,
  type AdditionalQuestion,
  type Exclusive,
  type Extension,
  type Item
} from '~/src/form/form-definition/types.js'

const exclusive: Exclusive = { type: ExtensionType.Exclusive }

const additionalQuestion: AdditionalQuestion = {
  type: ExtensionType.AdditionalQuestion,
  id: '4d7c8e2a-1f3b-4a5c-9d6e-7f8a9b0c1d2e',
  name: 'reason',
  title: 'Give a reason',
  options: { required: true },
  schema: {}
}

function item(text: string, extensions?: Extension[]): Item {
  return buildListItem({
    text,
    value: text.toLowerCase(),
    ...(extensions ? { extensions } : {})
  })
}

function validateItems(items: Item[]) {
  return listSchema.validate(buildList({ items }), { abortEarly: false })
}

describe('list item extensions', () => {
  it('accepts a list with no extensions at all', () => {
    const { error } = validateItems([item('Javascript'), item('TypeScript')])

    expect(error).toBeUndefined()
  })

  it('accepts the exclusive item as the first item', () => {
    const { error } = validateItems([
      item('None of the above', [exclusive]),
      item('Javascript'),
      item('TypeScript')
    ])

    expect(error).toBeUndefined()
  })

  it('accepts the exclusive item as the last item', () => {
    const { error } = validateItems([
      item('Javascript'),
      item('TypeScript'),
      item('None of the above', [exclusive])
    ])

    expect(error).toBeUndefined()
  })

  it('accepts an additional question on the exclusive item', () => {
    const { error } = validateItems([
      item('Javascript'),
      item('None of the above', [exclusive, additionalQuestion])
    ])

    expect(error).toBeUndefined()
  })

  it('rejects an exclusive item in the middle of the list', () => {
    const { error } = validateItems([
      item('Javascript'),
      item('None of the above', [exclusive]),
      item('TypeScript')
    ])

    expect(error?.message).toBe(
      'The exclusive option must be the first or the last item in the list'
    )
  })

  it('rejects more than one exclusive item', () => {
    const { error } = validateItems([
      item('None of the above', [exclusive]),
      item('Javascript'),
      item('Prefer not to say', [exclusive])
    ])

    expect(error?.message).toBe(
      'Only one item in a list can be the exclusive option'
    )
  })

  it('rejects an additional question on an item that is not exclusive', () => {
    const { error } = validateItems([
      item('Javascript'),
      item('None of the above', [additionalQuestion])
    ])

    expect(error?.message).toBe(
      'Only the exclusive item can have an additional question'
    )
  })

  it('rejects a repeated extension type on one item', () => {
    const { error } = validateItems([
      item('Javascript'),
      item('None of the above', [exclusive, exclusive])
    ])

    expect(error?.message).toContain('contains a duplicate value')
  })

  it('rejects an unknown extension type', () => {
    const { error } = validateItems([
      item('Javascript'),
      item('None of the above', [
        { type: 'something-else' } as unknown as Extension
      ])
    ])

    expect(error).toBeDefined()
  })

  it('rejects an additional question with no title', () => {
    const { title, ...withoutTitle } = additionalQuestion

    const { error } = validateItems([
      item('Javascript'),
      item('None of the above', [
        exclusive,
        withoutTitle as unknown as Extension
      ])
    ])

    expect(error).toBeDefined()
  })
})
