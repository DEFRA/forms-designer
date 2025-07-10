import fs from 'fs'
import path from 'path'

import { createLogger } from '~/src/common/helpers/logging/logger.js'

const logger = createLogger()

/**
 * Schema Manager - Handles schema loading, caching, and optimization
 * Reduces token usage by providing minimal schemas and examples
 */
export class SchemaManager {
  constructor() {
    this.schemaCache = new Map()
    this.minimalSchemaCache = new Map()
    this.examplesCache = new Map()
  }

  /**
   * Load and cache a schema file
   * @param {string} schemaFileName
   * @returns {object} Full schema
   */
  loadSchema(schemaFileName) {
    if (this.schemaCache.has(schemaFileName)) {
      return this.schemaCache.get(schemaFileName)
    }

    try {
      const schemaPath = path.resolve(
        process.cwd(),
        `../../../model/schemas/${schemaFileName}`
      )

      if (!fs.existsSync(schemaPath)) {
        throw new Error(`Schema file not found: ${schemaFileName}`)
      }

      const schemaContent = fs.readFileSync(schemaPath, 'utf8')
      const parsedSchema = JSON.parse(schemaContent)

      this.schemaCache.set(schemaFileName, parsedSchema)
      logger.info(`Schema cached: ${schemaFileName}`)

      return parsedSchema
    } catch (error) {
      logger.error(error, `Failed to load schema: ${schemaFileName}`)
      throw error
    }
  }

  /**
   * Load all V2 schemas needed for form generation
   * @returns {object} Object containing all schemas
   */
  loadAllV2Schemas() {
    return {
      // TODO- use the full build a unicorn v2 schema
      formDefinition: {
        type: 'object',
        required: ['engine', 'schema', 'pages', 'sections'],
        properties: {
          engine: { enum: ['V2'] },
          schema: { const: 2 },
          name: { type: 'string' },
          title: { type: 'string' },
          pages: { type: 'array' },
          sections: { type: 'array' },
          lists: { type: 'array' },
          conditions: { type: 'array' }
        }
      },
      // Load smaller schemas
      component: this.loadSchema('component-schema-v2.json'),
      page: this.loadSchema('page-schema-v2.json'),
      list: this.loadSchema('list-schema-v2.json'),
      condition: this.loadSchema('condition-schema-v2.json'),
      section: this.loadSchema('section-schema-v2.json')
    }
  }

  /**
   * Get minimal schema for prompt usage (reduces tokens)
   * @param {string} schemaType - 'form' | 'component' | 'page' | 'list'
   * @returns {object} Minimal schema with key properties only
   */
  getMinimalSchema(schemaType) {
    if (this.minimalSchemaCache.has(schemaType)) {
      return this.minimalSchemaCache.get(schemaType)
    }

    const minimal = this.createMinimalSchema(schemaType)
    this.minimalSchemaCache.set(schemaType, minimal)
    return minimal
  }

  /**
   * Create minimal schema with only essential properties
   * @param {string} schemaType
   * @returns {object}
   */
  createMinimalSchema(schemaType) {
    switch (schemaType) {
      case 'form':
        return {
          type: 'object',
          required: ['engine', 'schema', 'pages', 'sections'],
          properties: {
            engine: { enum: ['V2'] },
            schema: { const: 2 },
            pages: { type: 'array' },
            sections: { type: 'array' },
            lists: { type: 'array' },
            conditions: { type: 'array' }
          }
        }

      case 'component':
        return {
          type: 'object',
          required: ['id', 'type', 'name', 'title', 'options', 'schema'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            type: { type: 'string' },
            name: { type: 'string', pattern: '^[a-zA-Z][a-zA-Z0-9]*$' },
            title: { type: 'string', minLength: 1 },
            hint: { type: 'string' },
            list: { type: 'string', format: 'uuid' },
            options: { type: 'object' },
            schema: { type: 'object' }
          }
        }

      case 'page':
        return {
          type: 'object',
          required: ['id', 'title', 'path', 'section', 'components', 'next'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string', minLength: 1 },
            path: { type: 'string', pattern: '^/[a-z0-9-]+$' },
            section: { type: 'string' },
            controller: { type: 'string' },
            condition: { type: 'string', format: 'uuid' },
            components: { type: 'array' },
            next: { type: 'array' }
          }
        }

      case 'list':
        return {
          type: 'object',
          required: ['id', 'name', 'title', 'type', 'items'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            title: { type: 'string' },
            type: { enum: ['string', 'number'] },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'text', 'value'],
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  text: { type: 'string' },
                  value: { type: 'string' }
                }
              }
            }
          }
        }

      default:
        throw new Error(`Unknown schema type: ${schemaType}`)
    }
  }

  /**
   * Get component examples grouped by category
   * @returns {object} Component examples
   */
  getComponentExamples() {
    if (this.examplesCache.has('components')) {
      return this.examplesCache.get('components')
    }

    const examples = {
      input: {
        TextField: {
          id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
          type: 'TextField',
          name: 'fullName',
          title: 'What is your full name?',
          hint: 'Enter your first name and surname',
          options: { required: true },
          schema: {}
        },
        EmailAddressField: {
          id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
          type: 'EmailAddressField',
          name: 'emailAddress',
          title: 'What is your email address?',
          options: { required: true },
          schema: {}
        }
      },
      selection: {
        YesNoField: {
          id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
          type: 'YesNoField',
          name: 'hasExperience',
          title: 'Do you have previous experience?',
          options: { required: true },
          schema: {}
        },
        RadiosField: {
          id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
          type: 'RadiosField',
          name: 'country',
          title: 'What country do you live in?',
          list: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
          options: { required: true },
          schema: {}
        }
      },
      address: {
        UkAddressField: {
          id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
          type: 'UkAddressField',
          name: 'homeAddress',
          title: 'What is your address?',
          options: { required: true },
          schema: {}
        }
      }
    }

    this.examplesCache.set('components', examples)
    return examples
  }

  /**
   * Get condition structure examples
   * @returns {object} Condition examples
   */
  getConditionExamples() {
    if (this.examplesCache.has('conditions')) {
      return this.examplesCache.get('conditions')
    }

    const examples = {
      BooleanValue: {
        id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
        componentId: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
        operator: 'is',
        type: 'BooleanValue',
        value: true
      },
      ListItemRef: {
        id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
        componentId: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
        operator: 'is',
        type: 'ListItemRef',
        value: {
          listId: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
          itemId: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c'
        }
      }
    }

    this.examplesCache.set('conditions', examples)
    return examples
  }

  /**
   * Get prompt-friendly schema information
   * @returns {string} Formatted schema information for prompts
   */
  getPromptSchemaInfo() {
    return `
## FORM STRUCTURE (V2 Schema):
- engine: "V2" (required)
- schema: 2 (required number)
- pages: array of page objects
- sections: array of section objects
- lists: array of list objects (optional)
- conditions: array of condition wrappers (optional)

## KEY VALIDATION RULES:
- ALL IDs must be valid UUID v4 format (8-4-4-4-12 hex only: 0-9,a-f)
- Component names: valid JS identifiers (letters/numbers, start with letter)
- List-based components MUST reference existing list IDs
- FileUploadField requires FileUploadPageController
- Conditions with 2+ items need "coordinator": "and"|"or"
- Every page must reference an existing section name

## COMPONENT ESSENTIALS:
- Required: id (UUID), type, name, title, options, schema
- List components need: list (UUID reference)
- Content components: no name field, but need content field

## COMMON PATTERNS:
- One question per page (GDS standard)
- Question-based page titles: "What is...?" not "Details"
- Path format: /lowercase-with-hyphens
- Clean titles without asterisks (use options.required)
`
  }
}
