import { getSortOptions } from '~/src/lib/sort.js'

describe('Sort helper functions', () => {
  describe('getSortOptions', () => {
    describe('when sort parameter is undefined', () => {
      it('should return empty object', () => {
        const result = getSortOptions(undefined)
        expect(result).toEqual({})
      })
    })

    describe('when sort parameter starts with "updated"', () => {
      it('should handle updatedDesc correctly', () => {
        const result = getSortOptions('updatedDesc')
        expect(result).toEqual({
          sortBy: 'updatedAt',
          order: 'desc'
        })
      })

      it('should handle updatedAsc correctly', () => {
        const result = getSortOptions('updatedAsc')
        expect(result).toEqual({
          sortBy: 'updatedAt',
          order: 'asc'
        })
      })
    })

    describe('when sort parameter starts with "title"', () => {
      it('should handle titleAsc correctly', () => {
        const result = getSortOptions('titleAsc')
        expect(result).toEqual({
          sortBy: 'title',
          order: 'asc'
        })
      })

      it('should handle titleDesc correctly', () => {
        const result = getSortOptions('titleDesc')
        expect(result).toEqual({
          sortBy: 'title',
          order: 'desc'
        })
      })
    })
  })
})
