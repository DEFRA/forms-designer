// @ts-nocheck
import { CONDITION_TYPES, DESCRIPTIONS, VALUE_TYPES } from './constants.js'
import {
  fixConditionItems,
  fixValueObjects,
  processAnyOfTitles,
  fixConditionTitles
} from './schema-processors.js'

describe('Schema Processors', () => {
  describe('fixConditionItems', () => {
    it('should fix condition titles', () => {
      const schema = {
        anyOfTitles: [
          'Conditions  Item Variant 1',
          'Conditions  Item Variant 2',
          'Conditions  Item Variant 3'
        ],
        anyOf: [
          { properties: { field: {} } },
          { properties: { conditionName: {} } },
          { $ref: '#/conditionGroupSchema' }
        ]
      }

      fixConditionItems(schema)

      expect(schema.anyOfTitles).toEqual([
        CONDITION_TYPES.DEFINITION,
        CONDITION_TYPES.REFERENCE,
        CONDITION_TYPES.NESTED_GROUP
      ])

      expect(schema.anyOf[0].title).toBe(CONDITION_TYPES.DEFINITION)
      expect(schema.anyOf[1].title).toBe(CONDITION_TYPES.REFERENCE)
      expect(schema.anyOf[2].title).toBe(CONDITION_TYPES.NESTED_GROUP)
      expect(schema.anyOf[2].description).toBe(
        DESCRIPTIONS.NESTED_CONDITION_GROUP
      )
    })

    it('should return false when no matching anyOfTitles', () => {
      const schema = {
        anyOfTitles: ['Other Title 1', 'Other Title 2']
      }
      expect(fixConditionItems(schema)).toBe(false)
    })
  })

  describe('fixValueObjects', () => {
    it('should fix value objects in anyOfTitles', () => {
      const schema = {
        anyOfTitles: ['Value (object)', 'Value (object)'],
        anyOf: [{ properties: { value: {} } }, { properties: { period: {} } }]
      }

      const result = fixValueObjects(schema)

      expect(result).toBe(true)
      expect(schema.anyOfTitles).toEqual([
        VALUE_TYPES.STATIC,
        VALUE_TYPES.RELATIVE_DATE
      ])
      expect(schema.anyOf[0].title).toBe(VALUE_TYPES.STATIC)
      expect(schema.anyOf[1].title).toBe(VALUE_TYPES.RELATIVE_DATE)
    })

    it('should return false when no matching anyOfTitles', () => {
      const schema = {
        anyOfTitles: ['Other Title 1', 'Other Title 2']
      }
      expect(fixValueObjects(schema)).toBe(false)
    })
  })

  describe('processAnyOfTitles', () => {
    it('should process anyOfTitles for different types of schemas', () => {
      const conditionSchema = {
        anyOfTitles: [
          'Conditions  Item Variant 1',
          'Conditions  Item Variant 2',
          'Conditions  Item Variant 3'
        ],
        anyOf: [
          { properties: { field: {} } },
          { properties: { conditionName: {} } },
          { $ref: '#/conditionGroupSchema' }
        ]
      }

      processAnyOfTitles(conditionSchema)
      expect(conditionSchema.anyOfTitles).toEqual([
        CONDITION_TYPES.DEFINITION,
        CONDITION_TYPES.REFERENCE,
        CONDITION_TYPES.NESTED_GROUP
      ])

      const valueSchema = {
        anyOfTitles: ['Value (object)', 'Value (object)'],
        anyOf: [{ properties: { value: {} } }, { properties: { period: {} } }]
      }

      processAnyOfTitles(valueSchema)
      expect(valueSchema.anyOfTitles).toEqual([
        VALUE_TYPES.STATIC,
        VALUE_TYPES.RELATIVE_DATE
      ])

      const otherSchema = {
        anyOfTitles: ['Option A', 'Option B']
      }

      processAnyOfTitles(otherSchema)
      expect(otherSchema.anyOfTitles).toEqual(['Option A', 'Option B'])
    })

    it('should handle falsy values by returning early', () => {
      expect(() => processAnyOfTitles(null)).not.toThrow()
      expect(() => processAnyOfTitles(undefined)).not.toThrow()
      expect(() => processAnyOfTitles(false)).not.toThrow()
      expect(() => processAnyOfTitles(0)).not.toThrow()
      expect(() => processAnyOfTitles('')).not.toThrow()
    })

    it('should handle non-object values by returning early', () => {
      expect(() => processAnyOfTitles('hello')).not.toThrow()
      expect(() => processAnyOfTitles(42)).not.toThrow()
      expect(() => processAnyOfTitles(true)).not.toThrow()
      expect(() => processAnyOfTitles(Symbol())).not.toThrow()
      expect(() => processAnyOfTitles(() => {})).not.toThrow()
    })

    it('should process valid objects but return if anyOfTitles is not an array', () => {
      const testObj = { someProperty: 'value' }
      expect(() => processAnyOfTitles(testObj)).not.toThrow()
      const testObj2 = { anyOfTitles: 'not an array' }
      expect(() => processAnyOfTitles(testObj2)).not.toThrow()
    })
  })

  describe('fixConditionTitles', () => {
    it('should recursively fix condition titles', () => {
      const schema = {
        title: 'Conditions  Item Variant 3',
        description: 'Some description',
        properties: {
          nestedCondition: {
            anyOfTitles: ['Value (object)', 'Value (object)']
          }
        }
      }

      fixConditionTitles(schema)

      expect(schema.title).toBe(CONDITION_TYPES.NESTED_GROUP)
      expect(schema.description).toBe(DESCRIPTIONS.NESTED_CONDITION_GROUP)
    })

    it('should handle non-object inputs by returning early', () => {
      expect(() => fixConditionTitles('string value')).not.toThrow()
      expect(() => fixConditionTitles(42)).not.toThrow()
      expect(() => fixConditionTitles(null)).not.toThrow()
      expect(() => fixConditionTitles(undefined)).not.toThrow()
    })
  })
})
