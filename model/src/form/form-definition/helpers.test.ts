import { isFormDefinition } from '~/src/form/form-definition/helpers.js'
import { type FormDefinition } from '~/src/form/form-definition/types.js'

describe('helpers', () => {
  describe('isFormDefinition', () => {
    it('should return true if a FormDefinition', () => {
      const def = {
        name: 'form name',
        conditions: [],
        pages: []
      } as unknown as FormDefinition
      expect(isFormDefinition(def)).toBe(true)
    })

    it('should return false if undefined', () => {
      const def = undefined
      expect(isFormDefinition(def)).toBe(false)
    })

    it('should return false if not a form def', () => {
      const def = {
        conditions: [],
        pages: []
      } as unknown as FormDefinition
      expect(isFormDefinition(def)).toBe(false)
    })
  })
})

/**
 * @import { ComponentDef } from '~/src/components/types.js'
 */
