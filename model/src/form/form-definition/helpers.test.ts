import { type ConditionListItemRefValueDataV2 } from '~/src/conditions/types.js'
import {
  isConditionListItemRefValueData,
  isFormDefinition
} from '~/src/form/form-definition/helpers.js'
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

    it('should return false if primitive string', () => {
      const def = ''
      expect(isFormDefinition(def)).toBe(false)
    })

    it('should return false if primitive number', () => {
      const def = 1
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

  describe('isConditionListItemRefValueData', () => {
    it('should return true if a ConditionListItemRefValueDataV2', () => {
      const data = {
        itemId: 'b3a5030c-57f1-4d2e-8db9-6adeeba43c07',
        listId: '58dfa64d-7b14-4b48-b8b1-48128ecf1f60'
      } as ConditionListItemRefValueDataV2
      expect(isConditionListItemRefValueData(data)).toBe(true)
    })

    it('should return false if undefined', () => {
      const def = undefined
      expect(isConditionListItemRefValueData(def)).toBe(false)
    })

    it('should return false if primitive string', () => {
      const def = ''
      expect(isConditionListItemRefValueData(def)).toBe(false)
    })

    it('should return false if primitive number', () => {
      const def = 1
      expect(isConditionListItemRefValueData(def)).toBe(false)
    })

    it('should return false if not a ConditionListItemRefValueDataV2', () => {
      const data = {
        itemId: 'b3a5030c-57f1-4d2e-8db9-6adeeba43c07'
      } as ConditionListItemRefValueDataV2
      expect(isConditionListItemRefValueData(data)).toBe(false)
    })
  })
})

/**
 * @import { ComponentDef } from '~/src/components/types.js'
 */
