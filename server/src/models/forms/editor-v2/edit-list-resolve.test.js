import { cannotResolveAllItems } from '~/src/models/forms/editor-v2/edit-list-resolve.js'

describe('edit-list-resolve', () => {
  describe('cannotResolveAllItems', () => {
    test('should return false if conflicts missing', () => {
      expect(cannotResolveAllItems(undefined)).toBe(true)
    })

    test('should return false if empty conflicts', () => {
      expect(cannotResolveAllItems([])).toBe(false)
    })

    test('should return false if one conflict with no rsolvable items', () => {
      expect(cannotResolveAllItems([])).toBe(false)
    })
  })
})
