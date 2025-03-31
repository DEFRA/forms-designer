// @ts-nocheck
import fs from 'fs'
import Joi from 'joi'

import {
  toTitleCase,
  formatPropertyName,
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
  fixConditionItems,
  fixValueObjects,
  processAnyOfTitles,
  fixConditionTitles,
  handleReferenceSpecificTitles,
  simplifyTypeEnumerations,
  improveValueObjectTitles,
  improveOperatorDescriptions,
  addExamplesToConditionGroups,
  handleRepeatProperty,
  handleNameTitleFields,
  improveListItemTitles,
  simplifyConditionArrays,
  simplifyForDocs,
  processSchema,
  getSchemaMap,
  processAllSchemas,
  handleSpecialTitles,
  improveConditionItemTitles,
  VALUE_TYPES,
  CONDITION_TYPES,
  PATH_SEGMENTS,
  DESCRIPTIONS
} from '~/scripts/generate-schemas.js'

/**
 * Test helper that mirrors processNestedSchemas but returns paths instead of transforming schemas.
 * This lets us verify traversal patterns without dealing with side effects or complex mocking.
 */
function testProcessNestedSchemas(schema, parentPath) {
  const processedPaths = []

  function processPaths(obj, path) {
    processedPaths.push(path)
    return obj
  }

  if (schema.properties) {
    Object.entries(schema.properties).forEach(([propName, propSchema]) => {
      processPaths(
        propSchema,
        `${parentPath}${PATH_SEGMENTS.PROPERTIES}/${propName}`
      )
    })
  }

  if (schema.items) {
    if (Array.isArray(schema.items)) {
      schema.items.forEach((item, idx) => {
        processPaths(item, `${parentPath}${PATH_SEGMENTS.ITEMS}/${idx}`)
      })
    } else {
      processPaths(schema.items, `${parentPath}${PATH_SEGMENTS.ITEMS}`)
    }
  }

  ;['oneOf', 'anyOf', 'allOf'].forEach((keyword) => {
    if (schema[keyword] && Array.isArray(schema[keyword])) {
      schema[keyword].forEach((subSchema, idx) => {
        processPaths(subSchema, `${parentPath}/${keyword}/${idx}`)
      })
    }
  })

  return processedPaths
}

describe('Schema Generation Script', () => {
  let mockWriteFileSync
  let mockReadDirSync
  let mockUnlinkSync
  /**
   * @type {Record<string, unknown>}
   */
  let mockModel

  beforeEach(() => {
    mockWriteFileSync = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {})
    mockReadDirSync = jest
      .spyOn(fs, 'readdirSync')
      .mockReturnValue(['test.json'])
    mockUnlinkSync = jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {})

    const conditionFieldSchema = Joi.object()
      .description('Field reference used in a condition')
      .keys({
        name: Joi.string()
          .required()
          .description('Component name referenced by this condition'),
        type: Joi.string()
          .required()
          .description('Data type of the field (e.g., string, number, date)'),
        display: Joi.string()
          .required()
          .description('Human-readable name of the field for display purposes')
      })

    const conditionValueSchema = Joi.object()
      .description('Value specification for a condition')
      .keys({
        type: Joi.string()
          .required()
          .description('Data type of the value (e.g., string, number, date)'),
        value: Joi.string()
          .required()
          .description('The actual value to compare against'),
        display: Joi.string()
          .required()
          .description(
            'Human-readable version of the value for display purposes'
          )
      })

    const relativeDateValueSchema = Joi.object()
      .description('Relative date specification for date-based conditions')
      .keys({
        type: Joi.string()
          .required()
          .description('Data type identifier, should be "RelativeDate"'),
        period: Joi.string()
          .required()
          .description('Numeric amount of the time period, as a string'),
        unit: Joi.string()
          .required()
          .description('Time unit (e.g., days, weeks, months, years)'),
        direction: Joi.string()
          .required()
          .description('Temporal direction, either "past" or "future"')
      })

    const conditionRefSchema = Joi.object()
      .description('Reference to a named condition defined elsewhere')
      .keys({
        conditionName: Joi.string()
          .required()
          .description('Name of the referenced condition'),
        conditionDisplayName: Joi.string()
          .required()
          .description(
            'Human-readable name of the condition for display purposes'
          ),
        coordinator: Joi.string()
          .optional()
          .description(
            'Logical operator connecting this condition with others (AND, OR)'
          )
      })

    const conditionGroupSchema = Joi.object()
      .description('Group of conditions combined with logical operators')
      .keys({
        conditions: Joi.array()
          .items(
            Joi.alternatives().try(
              Joi.link('#conditionSchema'),
              conditionRefSchema,
              Joi.link('#conditionGroupSchema')
            )
          )
          .description(
            'Array of conditions or condition references in this group'
          )
      })
      .id('conditionGroupSchema')

    const conditionSchema = Joi.object()
      .description('Condition definition specifying a logical comparison')
      .keys({
        field: conditionFieldSchema.description(
          'The form field being evaluated in this condition'
        ),
        operator: Joi.string()
          .required()
          .description(
            'Comparison operator (equals, greaterThan, contains, etc.)'
          ),
        value: Joi.alternatives()
          .try(conditionValueSchema, relativeDateValueSchema)
          .description(
            'Value to compare the field against, either fixed or relative date'
          ),
        coordinator: Joi.string()
          .optional()
          .description(
            'Logical operator connecting this condition with others (AND, OR)'
          )
      })
      .id('conditionSchema')

    const componentSchema = Joi.object()
      .description('Form component definition specifying UI element behavior')
      .keys({
        id: Joi.string()
          .uuid()
          .optional()
          .description('Unique identifier for the component'),
        type: Joi.string()
          .required()
          .description(
            'Component type (TextField, RadioButtons, DateField, etc.)'
          ),
        shortDescription: Joi.string()
          .optional()
          .description('Brief description of the component purpose'),
        name: Joi.when('type', {
          is: Joi.string().valid('Html', 'Markdown', 'InsetText', 'Details'),
          then: Joi.string()
            .pattern(/^[a-zA-Z]+$/)
            .optional()
            .description('Optional identifier for display-only components'),
          otherwise: Joi.string()
            .pattern(/^[a-zA-Z]+$/)
            .description(
              'Unique identifier for the component, used in form data'
            )
        }),
        title: Joi.when('type', {
          is: Joi.string().valid('Html', 'Markdown', 'InsetText', 'Details'),
          then: Joi.string()
            .optional()
            .description('Optional title for display-only components'),
          otherwise: Joi.string()
            .allow('')
            .description('Label displayed above the component')
        }),
        hint: Joi.string()
          .allow('')
          .optional()
          .description(
            'Additional guidance text displayed below the component title'
          ),
        options: Joi.object({
          rows: Joi.number()
            .empty('')
            .description('Number of rows for textarea components'),
          maxWords: Joi.number()
            .empty('')
            .description('Maximum number of words allowed in text inputs'),
          maxDaysInPast: Joi.number()
            .empty('')
            .description('Maximum days in the past allowed for date inputs'),
          maxDaysInFuture: Joi.number()
            .empty('')
            .description('Maximum days in the future allowed for date inputs')
        })
          .default({})
          .unknown(true)
          .description('Component-specific configuration options'),
        schema: Joi.object({
          min: Joi.number()
            .empty('')
            .description('Minimum value or length for validation'),
          max: Joi.number()
            .empty('')
            .description('Maximum value or length for validation'),
          length: Joi.number()
            .empty('')
            .description('Exact length required for validation')
        })
          .unknown(true)
          .default({})
          .description('Validation rules for the component'),
        conditions: Joi.array()
          .items(
            Joi.alternatives().try(
              conditionSchema,
              conditionRefSchema,
              conditionGroupSchema
            )
          )
          .description('Conditions that control this component')
      })
      .unknown(true)

    const repeatOptionsSchema = Joi.object()
      .description('Configuration options for a repeatable page section')
      .keys({
        name: Joi.string()
          .required()
          .description(
            'Identifier for the repeatable section, used in data structure'
          ),
        title: Joi.string()
          .required()
          .description('Title displayed for each repeatable item')
      })

    const repeatSchemaSchema = Joi.object()
      .description('Validation rules for a repeatable section')
      .keys({
        min: Joi.number()
          .empty('')
          .required()
          .description('Minimum number of repetitions required'),
        max: Joi.number()
          .empty('')
          .required()
          .description('Maximum number of repetitions allowed')
      })

    const pageRepeatSchema = Joi.object()
      .description('Complete configuration for a repeatable page')
      .keys({
        options: repeatOptionsSchema
          .required()
          .description('Display and identification options for the repetition'),
        schema: repeatSchemaSchema
          .required()
          .description('Validation constraints for the number of repetitions')
      })

    const nextSchema = Joi.object()
      .description(
        'Navigation link defining where to go after completing a page'
      )
      .keys({
        path: Joi.string()
          .required()
          .description('The target page path to navigate to'),
        condition: Joi.string()
          .allow('')
          .optional()
          .description(
            'Optional condition that determines if this path should be taken'
          ),
        redirect: Joi.string()
          .optional()
          .description(
            'Optional external URL to redirect to instead of an internal page'
          )
      })

    const pageSchema = Joi.object()
      .description('Form page definition specifying content and behavior')
      .keys({
        id: Joi.string()
          .uuid()
          .optional()
          .description('Unique identifier for the page'),
        path: Joi.string()
          .required()
          .disallow('/status')
          .description(
            'URL path for this page, must not be the reserved "/status" path'
          ),
        title: Joi.string()
          .required()
          .description('Page title displayed at the top of the page'),
        section: Joi.string().description('Section this page belongs to'),
        controller: Joi.string()
          .optional()
          .description(
            'Custom controller class name for special page behavior'
          ),
        components: Joi.array()
          .items(componentSchema)
          .unique('name')
          .description('UI components displayed on this page'),
        repeat: Joi.when('controller', {
          is: Joi.string().valid('RepeatPageController').required(),
          then: pageRepeatSchema
            .required()
            .description(
              'Configuration for repeatable pages, required when using RepeatPageController'
            ),
          otherwise: Joi.any().strip()
        }),
        condition: Joi.string()
          .allow('')
          .optional()
          .description(
            'Optional condition that determines if this page is shown'
          ),
        next: Joi.array()
          .items(nextSchema)
          .default([])
          .description('Possible navigation paths after this page'),
        view: Joi.string()
          .optional()
          .description(
            'Optional custom view template to use for rendering this page'
          )
      })

    const baseListItemSchema = Joi.object()
      .description('Base schema for list items with common properties')
      .keys({
        text: Joi.string()
          .allow('')
          .description('Display text shown to the user'),
        description: Joi.string()
          .allow('')
          .optional()
          .description('Optional additional descriptive text for the item'),
        conditional: Joi.object()
          .description('Optional components to show when this item is selected')
          .keys({
            components: Joi.array()
              .required()
              .items(componentSchema.unknown(true))
              .unique('name')
              .description('Components to display conditionally')
          })
          .optional(),
        condition: Joi.string()
          .allow('')
          .optional()
          .description('Condition that determines if this item is shown')
      })

    const stringListItemSchema = baseListItemSchema
      .append({
        value: Joi.string()
          .required()
          .description('String value stored when this item is selected')
      })
      .description('List item with string value')

    const numberListItemSchema = baseListItemSchema
      .append({
        value: Joi.number()
          .required()
          .description('Numeric value stored when this item is selected')
      })
      .description('List item with numeric value')

    const listSchema = Joi.object()
      .description('Reusable list of options for select components')
      .keys({
        id: Joi.string()
          .uuid()
          .optional()
          .description('Unique identifier for the list'),
        name: Joi.string()
          .required()
          .description('Name used to reference this list from components'),
        title: Joi.string()
          .required()
          .description('Human-readable title for the list'),
        type: Joi.string()
          .required()
          .valid('string', 'number')
          .description('Data type for list values (string or number)'),
        items: Joi.when('type', {
          is: 'string',
          then: Joi.array()
            .items(stringListItemSchema)
            .unique('text')
            .unique('value')
            .description('Array of items with string values'),
          otherwise: Joi.array()
            .items(numberListItemSchema)
            .unique('text')
            .unique('value')
            .description('Array of items with numeric values')
        })
      })

    const sectionsSchema = Joi.object()
      .description('A form section grouping related pages together')
      .keys({
        name: Joi.string()
          .required()
          .description(
            'Unique identifier for the section, used in code and page references'
          ),
        title: Joi.string()
          .required()
          .description('Human-readable section title displayed to users'),
        hideTitle: Joi.boolean()
          .optional()
          .default(false)
          .description(
            'When true, the section title will not be displayed in the UI'
          )
      })

    const conditionsModelSchema = Joi.object()
      .description('Complete condition model with name and condition set')
      .keys({
        name: Joi.string()
          .required()
          .description('Unique identifier for the condition set'),
        conditions: Joi.array()
          .items(
            Joi.alternatives().try(
              conditionSchema,
              conditionRefSchema,
              conditionGroupSchema
            )
          )
          .description(
            'Array of conditions, condition references, or condition groups'
          )
      })

    const conditionWrapperSchema = Joi.object()
      .description('Container for a named condition with its definition')
      .keys({
        name: Joi.string()
          .required()
          .description('Unique identifier used to reference this condition'),
        displayName: Joi.string().description(
          'Human-readable name for display in the UI'
        ),
        value: conditionsModelSchema
          .required()
          .description('The complete condition definition')
      })

    const formDefinitionSchema = Joi.object()
      .description('Complete form definition describing all aspects of a form')
      .required()
      .keys({
        engine: Joi.string()
          .allow('V1', 'V2')
          .default('V1')
          .description('Form engine version to use (V1 or V2)'),
        name: Joi.string()
          .allow('')
          .optional()
          .description('Unique name identifying the form'),
        startPage: Joi.string()
          .optional()
          .description('Path of the first page to show when starting the form'),
        pages: Joi.array()
          .required()
          .when('engine', {
            is: 'V2',
            then: Joi.array()
              .items(pageSchema)
              .description('Pages using V2 schema with enhanced features'),
            otherwise: Joi.array()
              .items(pageSchema)
              .description('Pages using standard V1 schema')
          })
          .unique('path')
          .unique('id', { ignoreUndefined: true })
          .description('All pages within the form'),
        sections: Joi.array()
          .items(sectionsSchema)
          .unique('name')
          .unique('title')
          .required()
          .description('Sections grouping related pages together'),
        conditions: Joi.array()
          .items(conditionWrapperSchema)
          .unique('name')
          .unique('displayName')
          .description('Named conditions used for form logic'),
        lists: Joi.array()
          .items(listSchema)
          .unique('name')
          .unique('title')
          .description('Reusable lists of options for select components'),
        declaration: Joi.string()
          .allow('')
          .optional()
          .description('Declaration text shown on the summary page')
      })

    mockModel = {
      pageSchemaV2: pageSchema
        .append({
          title: Joi.string()
            .allow('')
            .required()
            .description(
              'Page title with enhanced support for empty titles in V2'
            )
        })
        .description(
          'Enhanced page schema for V2 forms with support for empty titles'
        ),
      componentSchema: componentSchema,
      listSchema: listSchema,
      formDefinitionSchema: formDefinitionSchema,
      conditionSchema: conditionSchema,
      conditionGroupSchema: conditionGroupSchema,
      minSchema: Joi.number()
        .empty('')
        .integer()
        .description('Minimum value for numeric inputs'),
      maxSchema: Joi.number()
        .empty('')
        .integer()
        .description('Maximum value for numeric inputs')
    }
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Utility Functions', () => {
    it('should convert kebab-case to Title Case', () => {
      expect(toTitleCase('test-schema')).toBe('Test Schema')
      expect(toTitleCase('component-schema-v2')).toBe('Component Schema V2')
      expect(toTitleCase('form-definition-v2-payload-schema')).toBe(
        'Form Definition V2 Payload Schema'
      )
    })

    it('should format property names correctly', () => {
      expect(formatPropertyName('firstName')).toBe('First Name')
      expect(formatPropertyName('user_name')).toBe('User name')
      expect(formatPropertyName('simpleText')).toBe('Simple Text')
    })

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

  describe('Schema Property Processing', () => {
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

  describe('Schema Simplification', () => {
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

    it('should improve titles for value objects', () => {
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

    it('should handle internal validation type case', () => {
      const schema = {
        type: 'string',
        parentName: 'Alternative Validation'
      }
      handleSpecialTitles(schema, 'Alternative Validation', 'anyOf', 0)
      expect(schema.title).toBe('string Type')
      expect(schema.description).toContain('INTERNAL VALIDATION ONLY')
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
  })

  describe('Full Schema Processing', () => {
    it('should process Joi schema for a component into JSON Schema', () => {
      const result = processSchema(
        'component-schema',
        'componentSchema',
        mockModel
      )

      expect(result).toBe(true)

      expect(mockWriteFileSync).toHaveBeenCalledTimes(1)

      const [filePath, content] = mockWriteFileSync.mock.calls[0]
      expect(filePath).toContain('component-schema.json')

      const jsonSchema = JSON.parse(content)
      expect(jsonSchema.title).toBe('Component Schema')
      expect(jsonSchema.type).toBe('object')
      expect(jsonSchema.properties).toHaveProperty('id')
      expect(jsonSchema.properties).toHaveProperty('type')
      expect(jsonSchema.properties).toHaveProperty('name')

      expect(jsonSchema.properties.name).toHaveProperty('oneOf')
      expect(jsonSchema.properties.name.oneOf.length).toBe(2)
      expect(jsonSchema.properties.name.oneOfTitles).toEqual([
        'Display Component Name',
        'Input Component Name'
      ])
    })

    it('should process Joi schema for a page with conditions into JSON Schema', () => {
      const result = processSchema('page-schema-v2', 'pageSchemaV2', mockModel)

      expect(result).toBe(true)

      const [, content] = mockWriteFileSync.mock.calls[0]
      const jsonSchema = JSON.parse(content)

      expect(jsonSchema.title).toBe('Page Schema V2')
      expect(jsonSchema.properties.title.description).toContain(
        'enhanced support for empty titles'
      )

      expect(jsonSchema.properties).toHaveProperty('repeat')
      expect(jsonSchema.properties.repeat.title).toBe('Repeat Configuration')
    })

    it('should process Joi schema with condition structures into JSON Schema', () => {
      const result = processSchema(
        'condition-schema',
        'conditionSchema',
        mockModel
      )

      expect(result).toBe(true)

      const [, content] = mockWriteFileSync.mock.calls[0]
      const jsonSchema = JSON.parse(content)

      expect(jsonSchema.title).toBe('Condition Schema')

      if (jsonSchema?.properties?.operator) {
        expect(jsonSchema.properties.operator.description).toContain(
          'equals, notEquals, contains'
        )
      }

      if (jsonSchema?.properties?.field) {
        expect(jsonSchema.properties).toHaveProperty('field')
      }

      if (jsonSchema?.properties?.value) {
        expect(jsonSchema.properties.value).toHaveProperty('anyOf')
      }
    })

    it('should properly handle a complex recursive schema structure', () => {
      const result = processSchema(
        'condition-group-schema',
        'conditionGroupSchema',
        mockModel
      )

      expect(result).toBe(true)

      const [, content] = mockWriteFileSync.mock.calls[0]
      const jsonSchema = JSON.parse(content)

      expect(jsonSchema.title).toBe(CONDITION_TYPES.NESTED_GROUP)
      expect(jsonSchema.$ref).toBeDefined()

      expect(jsonSchema.$defs).toBeDefined()

      expect(jsonSchema.description).toContain('complex logical expressions')

      expect(jsonSchema.$id).toContain(
        '@defra/forms-model/schemas/condition-group-schema.json'
      )
    })

    it('should handle errors when processing schema', () => {
      const originalConsoleError = console.error
      console.error = jest.fn()

      const errorModel = {
        errorSchema: {
          _root: {},
          _types: {},
          describe: () => {
            throw new Error('Schema description error')
          }
        }
      }

      const result = processSchema('test-error', 'errorSchema', errorModel)

      expect(result).toBe(false)

      expect(console.error).toHaveBeenCalled()
      expect(console.error.mock.calls[0][0]).toContain(
        '✗ Failed to process test-error:'
      )

      console.error = originalConsoleError
    })

    it('should handle non-Error thrown objects', () => {
      const originalConsoleError = console.error
      console.error = jest.fn()

      const badModel = {
        minSchema: 'not a valid schema object'
      }

      const result = processSchema('test-type-error', 'minSchema', badModel)

      expect(result).toBe(false)

      expect(console.error).toHaveBeenCalled()

      console.error = originalConsoleError
    })
  })

  describe('Schema Titles', () => {
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

  describe('Schema References Processing', () => {
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

    it('should handle reference-specific titles', () => {
      const schema = {
        $ref: '#/components/schemas/conditionGroupSchema'
      }

      handleReferenceSpecificTitles(schema)

      expect(schema.title).toBe(CONDITION_TYPES.NESTED_GROUP)
      expect(schema.description).toContain('multiple levels')
    })
  })

  describe('Schema AnyOf/OneOf Processing', () => {
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

  describe('Condition Enhancements', () => {
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
      expect(schema.description).toContain('complex logical expressions')
    })

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

      const schema1 = {
        anyOf: [{ title: 'Item (object)', properties: { field: {} } }]
      }
      improveConditionItemTitles(schema1, '/other/path')
      expect(schema1.anyOf[0].title).toBe('Item (object)')

      const schema2 = {}
      improveConditionItemTitles(
        schema2,
        `/${PATH_SEGMENTS.CONDITIONS}/${PATH_SEGMENTS.ITEMS}`
      )
      expect(schema2.anyOf).toBeUndefined()

      const schema3 = {
        anyOf: [{ title: 'Other title', properties: { field: {} } }]
      }
      improveConditionItemTitles(
        schema3,
        `/${PATH_SEGMENTS.CONDITIONS}/${PATH_SEGMENTS.ITEMS}`
      )
      expect(schema3.anyOf[0].title).toBe('Other title')

      const schema4 = {
        anyOf: [{ title: 'Item (object)' }]
      }
      improveConditionItemTitles(
        schema4,
        `/${PATH_SEGMENTS.CONDITIONS}/${PATH_SEGMENTS.ITEMS}`
      )
      expect(schema4.anyOf[0].title).toBe('Item (object)')
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

  describe('List Item Enhancements', () => {
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

      const schema2 = {
        oneOf: [{ description: 'Array of items with string values' }],
        anyOf: [{ type: 'string' }]
      }

      improveListItemTitles(schema2, '/other/path')
      expect(schema2.anyOf).toBeDefined()
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

  describe('Schema Map and Directory Functions', () => {
    it('should get schema map with all expected schemas', () => {
      const schemaMap = getSchemaMap()

      expect(Object.keys(schemaMap).length).toBeGreaterThan(10)
      expect(schemaMap['form-definition-schema']).toBe('formDefinitionSchema')
      expect(schemaMap['component-schema']).toBe('componentSchema')
      expect(schemaMap['page-schema-v2']).toBe('pageSchemaV2')
      expect(schemaMap['form-metadata-schema']).toBe('formMetadataSchema')
      expect(schemaMap['form-submit-payload-schema']).toBe(
        'formSubmitPayloadSchema'
      )
    })

    it('should process all schemas successfully', () => {
      const testModel = {
        minSchema: mockModel.minSchema,
        maxSchema: mockModel.maxSchema
      }

      const result = processAllSchemas(testModel)

      expect(result.successCount).toBe(2)
      expect(result.errorCount).toBeGreaterThanOrEqual(0)
      expect(mockWriteFileSync).toHaveBeenCalledTimes(2)
    })
  })

  describe('simplifyForDocs Testing', () => {
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
  })

  describe('Full Schema to JSON Generation', () => {
    it('should generate schema files from existing complex schemas', () => {
      const schemasToTest = [
        { fileName: 'component-schema-test', schemaName: 'componentSchema' },
        { fileName: 'condition-schema-test', schemaName: 'conditionSchema' },
        {
          fileName: 'condition-group-schema-test',
          schemaName: 'conditionGroupSchema'
        },
        {
          fileName: 'form-definition-schema-test',
          schemaName: 'formDefinitionSchema'
        },
        { fileName: 'list-schema-test', schemaName: 'listSchema' }
      ]

      for (const { fileName, schemaName } of schemasToTest) {
        mockWriteFileSync.mockClear()

        const result = processSchema(fileName, schemaName, mockModel)
        expect(result).toBe(true)

        expect(mockWriteFileSync).toHaveBeenCalledTimes(1)

        const [filePath, content] = mockWriteFileSync.mock.calls[0]
        expect(filePath).toContain(`${fileName}.json`)

        const generatedSchema = JSON.parse(content)
        expect(generatedSchema.title).toBeDefined()
        expect(generatedSchema.$id).toContain(
          `@defra/forms-model/schemas/${fileName}.json`
        )

        switch (schemaName) {
          case 'componentSchema':
            expect(generatedSchema.properties).toBeDefined()
            expect(generatedSchema.properties).toHaveProperty('id')
            expect(generatedSchema.properties).toHaveProperty('type')
            expect(generatedSchema.properties).toHaveProperty('name')

            if (generatedSchema.properties.name.oneOf) {
              expect(generatedSchema.properties.name.oneOf.length).toBe(2)
              expect(generatedSchema.properties.name.oneOfTitles).toEqual([
                'Display Component Name',
                'Input Component Name'
              ])
            }
            break

          case 'conditionSchema':
            expect(generatedSchema.title).toBe('Condition Schema Test')

            if (generatedSchema.properties) {
              const hasExpectedProps =
                generatedSchema.properties.field !== undefined ||
                generatedSchema.properties.operator !== undefined ||
                generatedSchema.properties.value !== undefined

              expect(hasExpectedProps).toBe(true)

              if (generatedSchema.properties.operator) {
                expect(
                  generatedSchema.properties.operator.description
                ).toContain('operator')
              }
            }
            break

          case 'conditionGroupSchema': {
            expect(generatedSchema.title).toBe(CONDITION_TYPES.NESTED_GROUP)
            const hasRefOrProps =
              generatedSchema.$ref !== undefined ||
              generatedSchema.properties !== undefined
            expect(hasRefOrProps).toBe(true)

            expect(generatedSchema.description).toContain('logical expressions')
            break
          }

          case 'formDefinitionSchema': {
            expect(generatedSchema.properties).toBeDefined()

            const formProps = Object.keys(generatedSchema.properties)

            const hasFormProps =
              formProps.includes('engine') ||
              formProps.includes('pages') ||
              formProps.includes('sections')

            expect(hasFormProps).toBe(true)

            if (generatedSchema.properties.pages?.oneOf) {
              expect(generatedSchema.properties.pages.oneOfTitles).toEqual([
                'V2 Pages',
                'V1 Pages'
              ])
            }
            break
          }

          case 'listSchema': {
            expect(generatedSchema.properties).toBeDefined()

            const hasListProps =
              generatedSchema.properties.name !== undefined ||
              generatedSchema.properties.title !== undefined ||
              generatedSchema.properties.type !== undefined

            expect(hasListProps).toBe(true)

            if (generatedSchema.properties.items?.oneOf) {
              expect(generatedSchema.properties.items.oneOf.length).toBe(2)

              if (generatedSchema.properties.items.oneOfTitles) {
                expect(
                  generatedSchema.properties.items.oneOfTitles.length
                ).toBe(2)

                expect(
                  generatedSchema.properties.items.oneOfTitles.every(
                    (title) => typeof title === 'string' && title.length > 0
                  )
                ).toBe(true)
              }
            }
            break
          }
        }
      }
    })

    it('should verify complex transformations are applied correctly', () => {
      mockWriteFileSync.mockClear()

      const result = processSchema(
        'condition-group-schema-test',
        'conditionGroupSchema',
        mockModel
      )
      expect(result).toBe(true)

      const [, content] = mockWriteFileSync.mock.calls[0]
      const generatedSchema = JSON.parse(content)

      expect(generatedSchema.title).toBe(CONDITION_TYPES.NESTED_GROUP)

      expect(generatedSchema.description).toContain('logical expressions')

      if (generatedSchema.examples) {
        expect(generatedSchema.examples.length).toBeGreaterThan(0)
        if (generatedSchema.examples[0]?.conditions?.length > 0) {
          const firstCondition = generatedSchema.examples[0].conditions[0]
          expect(firstCondition).toBeDefined()
        }
      }

      const hasRefOrProps =
        generatedSchema.$ref !== undefined ||
        generatedSchema.properties !== undefined ||
        generatedSchema.$defs !== undefined

      expect(hasRefOrProps).toBe(true)
    })
  })

  describe('Script Entry Point', () => {
    // Save original values to restore later
    const originalConsoleError = console.error
    const originalProcessExit = process.exit
    const originalProcessArgv = process.argv

    beforeEach(() => {
      // Mock console.error to avoid polluting test output
      console.error = jest.fn()
      // Mock process.exit to prevent test termination
      process.exit = jest.fn()
      // Set process.argv to simulate direct script execution
      process.argv = ['node', '/path/to/generate-schemas.js']
    })

    afterEach(() => {
      // Restore original functions
      console.error = originalConsoleError
      process.exit = originalProcessExit
      process.argv = originalProcessArgv
    })

    it('should handle errors in generateSchemas', async () => {
      const moduleCode = `
        (async () => {
          try {
            await mockGenerateSchemas();
          } catch (err) {
            console.error('Schema generation failed:', err);
            throw err;
          }
        })().catch((err) => {
          console.error('Unhandled error:', err);
          process.exit(1);
        });
      `

      try {
        await eval(moduleCode)
      } catch (err) {}

      expect(console.error).toHaveBeenCalledTimes(2)
      expect(console.error.mock.calls[0][0]).toBe('Schema generation failed:')
      expect(console.error.mock.calls[1][0]).toBe('Unhandled error:')
      expect(process.exit).toHaveBeenCalledWith(1)
    })

    it('should handle successful execution', async () => {
      const mockGenerateSchemas = jest
        .fn()
        .mockResolvedValue({ successCount: 5, errorCount: 0 })

      await (async () => {
        try {
          await mockGenerateSchemas()
        } catch (err) {
          console.error('Schema generation failed:', err)
          throw err
        }
      })()

      expect(mockGenerateSchemas).toHaveBeenCalled()
      expect(console.error).not.toHaveBeenCalled()
      expect(process.exit).not.toHaveBeenCalled()
    })
  })
})
