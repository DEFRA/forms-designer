import { mapPageData } from '~/src/models/forms/editor-v2/pages-reorder.js'

describe('editor-v2 - pages-reorder model', () => {
  describe('mapPageData', () => {
    const emptyDefinition = {
      pages: [],
      conditions: [],
      lists: [],
      sections: []
    }
    test('handles zero pages', () => {
      const res = mapPageData(emptyDefinition, '1,2,3', undefined)
      expect(res).toEqual(emptyDefinition)
    })
  })
})
