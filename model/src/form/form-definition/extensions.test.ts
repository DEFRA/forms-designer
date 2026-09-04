import {
  ADDITIONAL_QUESTION_SEPARATOR,
  clearExclusiveExtensions,
  findAdditionalQuestion,
  findExclusiveItem,
  findExclusiveItemIndex,
  getAdditionalQuestion,
  getAdditionalQuestionName,
  getExclusiveExtension,
  getExclusivePosition,
  getItemExtensions,
  hasAdditionalQuestion,
  hasExclusiveItem,
  isExclusiveItem,
  withExtensions
} from '~/src/form/form-definition/extensions.js'
import {
  ExtensionType,
  type AdditionalQuestion,
  type Exclusive,
  type Item
} from '~/src/form/form-definition/types.js'

const exclusive: Exclusive = { type: ExtensionType.Exclusive }

const additionalQuestion: AdditionalQuestion = {
  type: ExtensionType.AdditionalQuestion,
  id: '4d7c8e2a-1f3b-4a5c-9d6e-7f8a9b0c1d2e',
  name: 'reason',
  title: 'Why not?',
  schema: {}
}

/**
 * @param text - the item text, used as its id and value too
 * @param extensions - the extensions to attach to the item
 */
function item(text: string, extensions?: Item['extensions']): Item {
  return {
    id: text,
    text,
    value: text,
    ...(extensions ? { extensions } : {})
  }
}

const plainItems = [item('One'), item('Two'), item('Three')]

describe('list item extensions', () => {
  describe('getItemExtensions', () => {
    it('returns an empty array for an item written before extensions existed', () => {
      expect(getItemExtensions(item('One'))).toEqual([])
      expect(getItemExtensions(undefined)).toEqual([])
    })

    it('returns the extensions attached to an item', () => {
      expect(getItemExtensions(item('One', [exclusive]))).toEqual([exclusive])
    })
  })

  describe('isExclusiveItem', () => {
    it('is false without the exclusive extension', () => {
      expect(isExclusiveItem(item('One'))).toBe(false)
      expect(isExclusiveItem(undefined)).toBe(false)
    })

    it('is true with the exclusive extension', () => {
      expect(isExclusiveItem(item('None', [exclusive]))).toBe(true)
    })
  })

  describe('getExclusiveExtension', () => {
    it('returns the exclusive extension', () => {
      expect(getExclusiveExtension(item('None', [exclusive]))).toBe(exclusive)
    })

    it('returns undefined when there is none', () => {
      expect(getExclusiveExtension(item('One'))).toBeUndefined()
    })
  })

  describe('getAdditionalQuestion', () => {
    it('returns the additional question', () => {
      expect(
        getAdditionalQuestion(item('None', [exclusive, additionalQuestion]))
      ).toBe(additionalQuestion)
    })

    it('returns undefined when the item only carries the exclusive extension', () => {
      expect(getAdditionalQuestion(item('None', [exclusive]))).toBeUndefined()
    })
  })

  describe('hasAdditionalQuestion', () => {
    it('reports whether the item reveals a question', () => {
      expect(
        hasAdditionalQuestion(item('None', [exclusive, additionalQuestion]))
      ).toBe(true)
      expect(hasAdditionalQuestion(item('None', [exclusive]))).toBe(false)
    })
  })

  describe('findExclusiveItem', () => {
    it('finds the exclusive item wherever it sits', () => {
      const items = [...plainItems, item('None', [exclusive])]
      expect(findExclusiveItem(items)?.text).toBe('None')
    })

    it('returns undefined for a list without one', () => {
      expect(findExclusiveItem(plainItems)).toBeUndefined()
      expect(findExclusiveItem(undefined)).toBeUndefined()
    })
  })

  describe('findExclusiveItemIndex', () => {
    it('returns the index of the exclusive item', () => {
      expect(
        findExclusiveItemIndex([item('None', [exclusive]), ...plainItems])
      ).toBe(0)
    })

    it('returns -1 when there is none', () => {
      expect(findExclusiveItemIndex(plainItems)).toBe(-1)
      expect(findExclusiveItemIndex(undefined)).toBe(-1)
    })
  })

  describe('getExclusivePosition', () => {
    it('reports first', () => {
      expect(
        getExclusivePosition([item('None', [exclusive]), ...plainItems])
      ).toBe('first')
    })

    it('reports last', () => {
      expect(
        getExclusivePosition([...plainItems, item('None', [exclusive])])
      ).toBe('last')
    })

    it('reports undefined for a list without one', () => {
      expect(getExclusivePosition(plainItems)).toBeUndefined()
      expect(getExclusivePosition([])).toBeUndefined()
    })
  })

  describe('findAdditionalQuestion', () => {
    it('returns the question attached to the exclusive item', () => {
      const items = [
        ...plainItems,
        item('None', [exclusive, additionalQuestion])
      ]
      expect(findAdditionalQuestion(items)).toBe(additionalQuestion)
    })

    it('returns undefined for a list without one', () => {
      expect(findAdditionalQuestion(plainItems)).toBeUndefined()
    })
  })

  describe('getAdditionalQuestionName', () => {
    it('prefixes the component name', () => {
      expect(getAdditionalQuestionName('myField', additionalQuestion)).toBe(
        `myField${ADDITIONAL_QUESTION_SEPARATOR}reason`
      )
    })

    it('accepts a bare name', () => {
      expect(getAdditionalQuestionName('myField', 'reason')).toBe(
        'myField__reason'
      )
    })
  })

  describe('withExtensions', () => {
    it('drops the property when there are no extensions', () => {
      expect(withExtensions(item('None', [exclusive]), [])).not.toHaveProperty(
        'extensions'
      )
    })

    it('replaces the extensions', () => {
      expect(withExtensions(item('None'), [exclusive]).extensions).toEqual([
        exclusive
      ])
    })
  })

  describe('clearExclusiveExtensions', () => {
    it('removes the exclusive option and its question', () => {
      const items = [
        ...plainItems,
        item('None', [exclusive, additionalQuestion])
      ]

      const cleared = clearExclusiveExtensions(items)

      expect(cleared.some((x) => 'extensions' in x)).toBe(false)
      expect(items[3].extensions).toHaveLength(2)
    })
  })

  describe('hasExclusiveItem', () => {
    it('reports whether the list has an exclusive item', () => {
      expect(hasExclusiveItem({ items: plainItems })).toBe(false)
      expect(
        hasExclusiveItem({ items: [...plainItems, item('None', [exclusive])] })
      ).toBe(true)
      expect(hasExclusiveItem(undefined)).toBe(false)
    })
  })
})
