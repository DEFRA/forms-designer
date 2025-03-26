import { getFieldComponentType } from '~/src/models/forms/editor-v2/page-fields.js'

describe('page-fields', () => {
  describe('getFieldComponentType', () => {
    it('should throw an error if field name is missing', () => {
      expect(() => getFieldComponentType({})).toThrow(
        new Error(`Field name missing`)
      )
    })
  })
})
