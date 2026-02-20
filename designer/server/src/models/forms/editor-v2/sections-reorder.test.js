import { mapSectionData } from '~/src/models/forms/editor-v2/sections-reorder.js'

describe('editor-v2 - sections-reorder model', () => {
  describe('mapSectionData', () => {
    const emptyDefinition = {
      pages: [],
      conditions: [],
      lists: [],
      sections: []
    }
    test('handles zero sections', () => {
      const res = mapSectionData(emptyDefinition, '1,2,3', undefined)
      expect(res).toEqual(emptyDefinition)
    })
  })
})
