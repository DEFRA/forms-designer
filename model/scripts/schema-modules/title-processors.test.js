// @ts-nocheck
import {
  setSchemaTitle,
  setRepeatTitles,
  setNameTitles,
  setTitleTitles,
  setPagesTitles,
  processProperties,
  processArrayItems,
  processCombinationKeywords,
  processReferences,
  processAdditionalProperties,
  handleSpecialTitles,
  addTitles
} from './title-processors.js'

describe('Title Processors', () => {
  describe('setSchemaTitle', () => {
    it('should set schema title based on context', () => {
      const schema = { type: 'string' }
      setSchemaTitle(schema, 'fieldName')
      expect(schema.title).toBe('Field Name')

      const schemaWithDescription = {
        type: 'object',
        description: 'User profile information. Contains personal details.'
      }
      setSchemaTitle(schemaWithDescription, '')
      expect(schemaWithDescription.title).toBe('User profile information')

      const schemaWithTitle = { title: 'Existing' }
      setSchemaTitle(schemaWithTitle, 'test')
      expect(schemaWithTitle.title).toBe('Existing')
    })

    it('should use type as fallback or assign unknown schema', () => {
      const schemaWithType = { type: 'array' }
      setSchemaTitle(schemaWithType, '')
      expect(schemaWithType.title).toBe('Array')

      const schemaWithoutTypeOrDesc = {}
      setSchemaTitle(schemaWithoutTypeOrDesc, '')
      expect(schemaWithoutTypeOrDesc.title).toBe('Unknown Schema')
    })
  })

  describe('setRepeatTitles', () => {
    it('should set specialized titles for repeat schemas', () => {
      const schema = {}
      setRepeatTitles(schema, 0)
      expect(schema.title).toBe('Repeat Configuration')
      expect(schema.description).toContain('Configuration for repeatable pages')

      const schema2 = {}
      setRepeatTitles(schema2, 1)
      expect(schema2.title).toBe('Alternative Validation')
    })
  })

  describe('setNameTitles', () => {
    it('should set name titles correctly', () => {
      const display = {}
      const input = {}

      setNameTitles(display, 0)
      setNameTitles(input, 1)

      expect(display.title).toBe('Display Component Name')
      expect(display.description).toContain('display-only components')

      expect(input.title).toBe('Input Component Name')
      expect(input.description).toContain('collect user data')
    })
  })

  describe('setTitleTitles', () => {
    it('should set title titles correctly', () => {
      const display = {}
      const input = {}

      setTitleTitles(display, 0)
      setTitleTitles(input, 1)

      expect(display.title).toBe('Display Component Title')
      expect(display.description).toContain('display-only components')

      expect(input.title).toBe('Input Component Title')
      expect(input.description).toContain('above input components')
    })
  })

  describe('setPagesTitles', () => {
    it('should set pages titles correctly', () => {
      const v2 = {}
      const v1 = {}

      setPagesTitles(v2, 0)
      setPagesTitles(v1, 1)

      expect(v2.title).toBe('V2 Pages')
      expect(v2.description).toContain('engine version V2')

      expect(v1.title).toBe('V1 Pages')
      expect(v1.description).toContain('engine version V1')
    })
  })

  describe('processProperties', () => {
    it('should process properties and add titles', () => {
      const schema = {
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
          address: {
            type: 'object',
            properties: {
              street: { type: 'string' },
              city: { type: 'string' }
            }
          }
        }
      }

      processProperties(schema)

      expect(schema.properties.name.title).toBe('Name')
      expect(schema.properties.age.title).toBe('Age')
      expect(schema.properties.address.properties.street.title).toBe('Street')
    })
  })

  describe('processArrayItems', () => {
    it('should process array items', () => {
      const schema = {
        type: 'array',
        items: { type: 'string' }
      }

      processArrayItems(schema, 'tags')

      expect(schema.items.title).toBe('Tags Item')

      const arrayWithMultipleItems = {
        type: 'array',
        items: [{ type: 'string' }, { type: 'number' }]
      }

      processArrayItems(arrayWithMultipleItems, 'coordinates')

      expect(arrayWithMultipleItems.items[0].title).toBe('Coordinates Item 1')
      expect(arrayWithMultipleItems.items[1].title).toBe('Coordinates Item 2')
    })
  })

  describe('processCombinationKeywords', () => {
    it('should process oneOf/anyOf combinations', () => {
      const schema = {
        oneOf: [{ type: 'string' }, { type: 'number' }]
      }

      processCombinationKeywords(schema, 'value')

      expect(schema.oneOfTitles).toEqual(['Value (string)', 'Value (number)'])
      expect(schema.oneOf[0].title).toBe('Value (string)')
      expect(schema.oneOf[1].title).toBe('Value (number)')

      const repeatSchema = {
        oneOf: [{ type: 'object' }, { type: 'string' }]
      }

      processCombinationKeywords(repeatSchema, 'repeat')

      expect(repeatSchema.oneOf[0].title).toBe('Repeat Configuration')
    })
  })

  describe('processReferences', () => {
    it('should process schema references correctly', () => {
      const schema = {
        schemas: {
          userSchema: { type: 'object' }
        },
        components: {
          schemas: {
            errorSchema: { type: 'object' }
          }
        },
        $defs: {
          addressSchema: { type: 'object' }
        }
      }

      processReferences(schema)

      expect(schema.schemas.userSchema.title).toBe('User Schema')
      expect(schema.components.schemas.errorSchema.title).toBe('Error Schema')
      expect(schema.$defs.addressSchema.title).toBe('Address Schema')
    })
  })

  describe('processAdditionalProperties', () => {
    it('should process additional and pattern properties', () => {
      const schema = {
        additionalProperties: { type: 'string' },
        patternProperties: {
          '^[a-z]+$': { type: 'number' }
        }
      }

      processAdditionalProperties(schema, 'field')

      expect(schema.additionalProperties.title).toBe(
        'Additional Properties (field)'
      )
      expect(schema.patternProperties['^[a-z]+$'].title).toBe(
        'Pattern Property (^[a-z]+$)'
      )
    })
  })

  describe('handleSpecialTitles', () => {
    it('should handle internal validation type case', () => {
      const schema = {
        type: 'string',
        parentName: 'Alternative Validation'
      }
      handleSpecialTitles(schema, 'Alternative Validation', 'anyOf', 0)
      expect(schema.title).toBe('string Type')
      expect(schema.description).toContain('INTERNAL VALIDATION ONLY')
    })

    it('should set title based on type when available', () => {
      const schema = {
        type: 'number'
      }
      handleSpecialTitles(schema, 'testField', 'oneOf', 0)
      expect(schema.title).toBe('Test Field (number)')
    })

    it('should set variant title when type is not available', () => {
      const schema = {}
      handleSpecialTitles(schema, 'testField', 'oneOf', 2)
      expect(schema.title).toBe('Test Field Variant 3')
    })

    it('should not modify schema if title already exists', () => {
      const schema = {
        title: 'Existing title',
        type: 'string'
      }
      handleSpecialTitles(schema, 'testField', 'oneOf', 0)
      expect(schema.title).toBe('Existing title')
    })
  })

  describe('addTitles', () => {
    it('should return non-object schemas without modification', () => {
      expect(addTitles('string value')).toBe('string value')
      expect(addTitles(42)).toBe(42)
      expect(addTitles(true)).toBe(true)
      expect(addTitles(null)).toBe(null)
      expect(addTitles(undefined)).toBe(undefined)
    })

    it('should enhance object schemas with titles', () => {
      const schema = { type: 'string' }
      const result = addTitles(schema, 'testProperty')

      expect(result).toBe(schema)
      expect(result.title).toBe('Test Property')
    })
  })
})
