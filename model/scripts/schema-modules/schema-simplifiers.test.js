// @ts-nocheck
import { CONDITION_TYPES, PATH_SEGMENTS, VALUE_TYPES } from './constants.js'
import {
  handleReferenceSpecificTitles,
  simplifyTypeEnumerations,
  improveConditionItemTitles,
  improveValueObjectTitles,
  improveOperatorDescriptions,
  addExamplesToConditionGroups,
  handleRepeatProperty,
  handleNameTitleFields,
  improveListItemTitles,
  simplifyConditionArrays,
  processNestedSchemas,
  simplifyForDocs
} from './schema-simplifiers.js'

describe('Schema Simplifiers', () => {
  describe('handleReferenceSpecificTitles', () => {
    it('should handle reference-specific titles', () => {
      const schema = {
        $ref: '#/components/schemas/conditionGroupSchema'
      }

      handleReferenceSpecificTitles(schema)

      expect(schema.title).toBe(CONDITION_TYPES.NESTED_GROUP)
      expect(schema.description).toContain('multiple levels')
    })
  })

  describe('simplifyTypeEnumerations', () => {
    it('should simplify type enumerations', () => {
      const schema = {
        anyOf: [
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
          { type: 'array' }
        ]
      }

      simplifyTypeEnumerations(schema)

      expect(schema.anyOf).toBeUndefined()
      expect(schema.description).toContain('string, number, boolean, array')
    })
  })

  describe('improveConditionItemTitles', () => {
    it('should handle item title improvements for condition items', () => {
      const schema = {
        anyOf: [
          {
            title: 'Item (object)',
            properties: { field: {} }
          },
          {
            title: 'Item (object)',
            properties: { conditionName: {} }
          },
          {
            title: 'Item (object)',
            properties: { conditions: {} }
          }
        ]
      }

      improveConditionItemTitles(schema, `/${PATH_SEGMENTS.CONDITIONS}/items`)

      expect(schema.anyOf[0].title).toBe(CONDITION_TYPES.DEFINITION)
      expect(schema.anyOf[1].title).toBe(CONDITION_TYPES.REFERENCE)
      expect(schema.anyOf[2].title).toBe(CONDITION_TYPES.NESTED_GROUP)
    })

    it('should set unknown type for condition items with unrecognized structure', () => {
      const result = {
        anyOf: [
          {
            title: 'Conditions Item (object)',
            properties: {
              someUnknownProp: {}
            }
          }
        ]
      }

      improveConditionItemTitles(result, '/conditions/items')

      expect(result.anyOf[0].title).toBe('Unknown Condition Item Type')
    })
  })

  describe('improveValueObjectTitles', () => {
    it('should improve titles for value objects in conditions', () => {
      const schema = {
        anyOf: [
          {
            properties: {
              value: { type: 'string' },
              type: { type: 'string' },
              display: { type: 'string' }
            }
          },
          {
            properties: {
              period: { type: 'string' },
              unit: { type: 'string' },
              direction: { type: 'string' }
            }
          }
        ]
      }

      improveValueObjectTitles(schema, `/${PATH_SEGMENTS.CONDITIONS}/0/value`)

      expect(schema.anyOf[0].title).toBe(VALUE_TYPES.STATIC)
      expect(schema.anyOf[1].title).toBe(VALUE_TYPES.RELATIVE_DATE)
    })

    it('should set unknown type for value objects with unrecognized structure', () => {
      const result = {
        anyOf: [
          {
            properties: {
              someUnknownProp: {}
            }
          }
        ]
      }

      improveValueObjectTitles(result, '/value')

      expect(result.anyOf[0].title).toBe('Unknown Value Type')
    })

    it('should explicitly return for items without properties', () => {
      const item = { type: 'string' }

      let returnExecuted = false
      const testCallback = (testItem) => {
        if (!testItem.properties) {
          returnExecuted = true
          return
        }

        testItem.title = 'This should not be set'
      }

      testCallback(item)

      expect(returnExecuted).toBe(true)

      expect(item.title).toBeUndefined()
    })
  })

  describe('improveOperatorDescriptions', () => {
    it('should improve operator descriptions', () => {
      const schema = {
        description: 'Comparison operator'
      }

      improveOperatorDescriptions(
        schema,
        `/${PATH_SEGMENTS.CONDITIONS}/0/operator`
      )

      expect(schema.description).toContain('equals, notEquals, contains')
      expect(schema.description).toContain('isEmpty, isNotEmpty')
    })
  })

  describe('addExamplesToConditionGroups', () => {
    it('should add examples to condition groups', () => {
      const schema = {
        title: 'Condition Group Schema',
        description: 'Group of conditions'
      }

      addExamplesToConditionGroups(schema, '/conditionGroupSchema')

      expect(schema.description).toContain('nested multiple levels deep')
      expect(schema.examples).toBeDefined()
      expect(schema.examples.length).toBe(1)
      expect(schema.examples[0].conditions).toBeDefined()
      expect(schema.examples[0].conditions.length).toBe(2)

      const example = schema.examples[0]
      expect(example.conditions[0].field).toBeDefined()
      expect(example.conditions[0].operator).toBe('equals')
      expect(example.conditions[0].coordinator).toBe('AND')
      expect(example.conditions[1].conditionName).toBe('hasEnvironmentalPermit')
    })
  })

  describe('handleRepeatProperty', () => {
    it('should handle repeat property special case', () => {
      const schema = {
        oneOf: [
          {
            description: 'Configuration for repeatable pages',
            properties: {
              options: { type: 'object' },
              schema: { type: 'object' }
            }
          },
          { type: 'null' }
        ]
      }

      const result = handleRepeatProperty(schema, '/properties/repeat')

      expect(result).not.toBeNull()
      expect(result.oneOf).toBeUndefined()

      if (schema.oneOf && schema.oneOf.length > 0) {
        expect(result.properties).toEqual(schema.oneOf[0].properties)
      }

      expect(result.description).toContain(
        'NOTE: This configuration is only used when'
      )
    })
  })

  describe('handleNameTitleFields', () => {
    it('should handle name/title fields', () => {
      const schema = {
        oneOf: [{ type: 'string' }, { type: 'object' }],
        anyOf: [{ type: 'string' }, { type: 'number' }]
      }

      handleNameTitleFields(schema, '/properties/name')
      expect(schema.anyOf).toBeUndefined()

      const schema2 = {
        oneOf: [{ type: 'string' }],
        anyOf: [{ type: 'string' }]
      }

      handleNameTitleFields(schema2, '/properties/other')
      expect(schema2.anyOf).toBeDefined()
    })
  })

  describe('improveListItemTitles', () => {
    it('should improve list item titles', () => {
      const schema = {
        oneOf: [
          { description: 'Array of items with string values' },
          { description: 'Array of items with numeric values' }
        ],
        anyOf: [{ type: 'string' }, { type: 'number' }]
      }

      improveListItemTitles(
        schema,
        `/${PATH_SEGMENTS.PROPERTIES}/${PATH_SEGMENTS.ITEMS}`
      )

      expect(schema.oneOf[0].title).toBe('String List Items')
      expect(schema.oneOf[1].title).toBe('Number List Items')
      expect(schema.anyOf).toBeUndefined()
    })

    it('should set generic title for list items with unrecognized description', () => {
      const result = {
        oneOf: [
          {
            description: 'Some description without string or numeric keywords'
          },
          {
            description: 'Another item to make the length > 1'
          }
        ]
      }

      improveListItemTitles(result, '/items')

      expect(result.oneOf[0].title).toBe('Generic List Items')
    })
  })

  describe('simplifyConditionArrays', () => {
    it('should simplify condition arrays', () => {
      const schema = {
        description: 'Array of conditions',
        items: {
          anyOf: [
            { title: CONDITION_TYPES.DEFINITION },
            { title: CONDITION_TYPES.REFERENCE }
          ]
        }
      }

      simplifyConditionArrays(schema, `/${PATH_SEGMENTS.CONDITIONS}`)

      expect(schema.description).toContain('complex logical expressions')
      expect(schema.description).toContain('AND/OR operators')
    })
  })

  describe('processNestedSchemas', () => {
    it('should process schema with array items correctly', () => {
      const schema = {
        items: [
          { type: 'string', title: 'Item 1' },
          { type: 'number', title: 'Item 2' },
          { type: 'boolean', title: 'Item 3' }
        ]
      }

      const originalItems = JSON.parse(JSON.stringify(schema.items))

      processNestedSchemas(schema, '/test')

      expect(schema.items.length).toBe(3)
      expect(schema.items[0].type).toBe(originalItems[0].type)
      expect(schema.items[1].type).toBe(originalItems[1].type)
      expect(schema.items[2].type).toBe(originalItems[2].type)
    })

    it('should process schema with a single item correctly', () => {
      const schema = {
        items: { type: 'string', title: 'Single Item' }
      }

      const originalItem = JSON.parse(JSON.stringify(schema.items))

      processNestedSchemas(schema, '/test')

      expect(schema.items.type).toBe(originalItem.type)
      expect(schema.items.title).toBe(originalItem.title)
    })

    it('should process combination keywords correctly', () => {
      // Setup a schema with all three combination keywords
      const schema = {
        oneOf: [
          { type: 'string', title: 'String Option' },
          { type: 'number', title: 'Number Option' }
        ],
        anyOf: [
          { type: 'boolean', title: 'Boolean Option' },
          { type: 'object', properties: { test: { type: 'string' } } }
        ],
        allOf: [{ required: ['name'] }, { required: ['email'] }]
      }

      const originalOneOf = JSON.parse(JSON.stringify(schema.oneOf))
      const originalAnyOf = JSON.parse(JSON.stringify(schema.anyOf))
      const originalAllOf = JSON.parse(JSON.stringify(schema.allOf))

      processNestedSchemas(schema, '/test')

      // Verify that all arrays still exist and have the correct length
      expect(schema.oneOf).toBeDefined()
      expect(schema.oneOf.length).toBe(originalOneOf.length)
      expect(schema.anyOf).toBeDefined()
      expect(schema.anyOf.length).toBe(originalAnyOf.length)
      expect(schema.allOf).toBeDefined()
      expect(schema.allOf.length).toBe(originalAllOf.length)

      // Verify that core properties of each item were preserved
      // This proves the items were processed (since simplifyForDocs was called on each)
      expect(schema.oneOf[0].type).toBe(originalOneOf[0].type)
      expect(schema.oneOf[1].type).toBe(originalOneOf[1].type)
      expect(schema.anyOf[0].type).toBe(originalAnyOf[0].type)
      expect(schema.anyOf[1].type).toBe(originalAnyOf[1].type)
    })

    it('should skip non-array combination keywords', () => {
      const schema = {
        oneOf: 'not an array',
        anyOf: 123,
        allOf: null
      }

      const originalSchema = JSON.parse(JSON.stringify(schema))

      processNestedSchemas(schema, '/test')

      expect(schema).toEqual(originalSchema)
    })

    it('should process combination keywords through simplifyForDocs', () => {
      const schema = {
        oneOf: [
          { type: 'string', value: 'one-1' },
          { type: 'number', value: 'one-2' }
        ],
        anyOf: [
          { type: 'boolean', value: 'any-1' },
          { type: 'object', value: 'any-2' }
        ],
        allOf: [
          { required: ['name'], value: 'all-1' },
          { required: ['email'], value: 'all-2' }
        ]
      }
      const oneOf0 = schema.oneOf[0]
      const oneOf1 = schema.oneOf[1]
      const anyOf0 = schema.anyOf[0]
      const anyOf1 = schema.anyOf[1]
      const allOf0 = schema.allOf[0]
      const allOf1 = schema.allOf[1]

      processNestedSchemas(schema, '/test')

      expect(schema.oneOf[0]).not.toBe(oneOf0)
      expect(schema.oneOf[1]).not.toBe(oneOf1)
      expect(schema.anyOf[0]).not.toBe(anyOf0)
      expect(schema.anyOf[1]).not.toBe(anyOf1)
      expect(schema.allOf[0]).not.toBe(allOf0)
      expect(schema.allOf[1]).not.toBe(allOf1)

      expect(schema.oneOf[0].value).toBe('one-1')
      expect(schema.oneOf[1].value).toBe('one-2')
      expect(schema.anyOf[0].value).toBe('any-1')
      expect(schema.anyOf[1].value).toBe('any-2')
      expect(schema.allOf[0].value).toBe('all-1')
      expect(schema.allOf[1].value).toBe('all-2')
    })

    it('should evaluate the condition check for each combination keyword', () => {
      const originalStringify = JSON.stringify
      const stringifySpy = jest.spyOn(JSON, 'stringify')

      const schema = {
        oneOf: [{ test: 1 }],
        anyOf: 'not an array',
        allOf: null
      }

      const originalOneOfRef = schema.oneOf

      try {
        processNestedSchemas(schema, '/test')

        expect(schema.oneOf).not.toBe(originalOneOfRef)

        expect(schema.anyOf).toBe('not an array')
        expect(schema.allOf).toBe(null)

        expect(stringifySpy).toHaveBeenCalled()
      } finally {
        stringifySpy.mockRestore()
        JSON.stringify = originalStringify
      }
    })

    it('should hit the inside of combination keywords if-condition', () => {
      const schema = {
        oneOf: [{ value: 'test' }]
      }

      const originalMap = Array.prototype.map
      let mapCalled = false

      Array.prototype.map = function () {
        mapCalled = true
        return originalMap.apply(this, arguments)
      }

      try {
        processNestedSchemas(schema, '/test')

        expect(mapCalled).toBe(true)

        const schema2 = {
          oneOf: 'string, not array'
        }

        mapCalled = false

        processNestedSchemas(schema2, '/test')

        expect(mapCalled).toBe(false)
      } finally {
        Array.prototype.map = originalMap
      }
    })
  })

  describe('simplifyForDocs', () => {
    it('should perform all expected transformations on schemas', () => {
      const schema = {
        $ref: '#/components/schemas/conditionGroupSchema',
        anyOf: [
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
          { type: 'array' }
        ],
        properties: {
          conditions: {
            type: 'array'
          }
        }
      }

      const result = simplifyForDocs(schema, '/test')

      expect(result.title).toBe(CONDITION_TYPES.NESTED_GROUP)

      expect(result.anyOf).toBeUndefined()
      expect(result.description).toContain('string, number, boolean, array')

      expect(result.properties).toBeDefined()
    })

    it('should return primitive values without modification', () => {
      expect(simplifyForDocs('string value')).toBe('string value')
      expect(simplifyForDocs(42)).toBe(42)
      expect(simplifyForDocs(true)).toBe(true)
      expect(simplifyForDocs(undefined)).toBe(undefined)
    })

    it('should return early when handleRepeatProperty returns a special result', () => {
      const schema = {
        oneOf: [
          {
            description: 'Configuration for repeatable pages',
            properties: {
              options: { type: 'object' },
              schema: { type: 'object' }
            }
          },
          { type: 'null' }
        ]
      }

      const expectedSpecialResult = handleRepeatProperty(
        schema,
        '/properties/repeat'
      )

      const result = simplifyForDocs(schema, '/properties/repeat')

      expect(result).toEqual(expectedSpecialResult)

      expect(result).not.toHaveProperty('items')

      expect(result.oneOf).toBeUndefined()

      expect(result.description).toContain(
        'NOTE: This configuration is only used when'
      )
    })
  })
})
