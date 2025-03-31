import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import parse from 'joi-to-json'

export const currentDirname = path.dirname(fileURLToPath(import.meta.url))
export const schemasDir = path.resolve(currentDirname, '../schemas')

/**
 * @typedef {{[key: string]: any}} StringIndexedObject
 * @typedef {object & StringIndexedObject} SchemaObject
 * @property {string} [title] - Schema title
 * @property {string} [description] - Schema description
 * @property {string} [type] - Schema type
 * @property {{[key: string]: SchemaObject}} [properties] - Schema properties
 * @property {SchemaObject|SchemaObject[]} [items] - Array items schema
 * @property {SchemaObject[]} [oneOf] - OneOf array of schemas
 * @property {SchemaObject[]} [anyOf] - AnyOf array of schemas
 * @property {SchemaObject[]} [allOf] - AllOf array of schemas
 * @property {object} [additionalProperties] - Additional properties schema
 * @property {object} [patternProperties] - Pattern properties schemas
 * @property {object} [components] - OpenAPI components
 * @property {object} [schemas] - OpenAPI schemas
 * @property {object} [$defs] - JSON Schema definitions
 * @property {string} [$ref] - JSON Schema reference
 * @property {*} [x] - Any additional properties with string keys
 */

/**
 * Condition type constants
 */
export const CONDITION_TYPES = {
  DEFINITION: 'Condition Definition',
  REFERENCE: 'Condition Reference',
  NESTED_GROUP: 'Nested Condition Group'
}

/**
 * Value type constants
 */
export const VALUE_TYPES = {
  STATIC: 'Static Value',
  RELATIVE_DATE: 'Relative Date Value'
}

/**
 * Common description constants
 */
export const DESCRIPTIONS = {
  NESTED_CONDITION_GROUP:
    'A nested group of conditions that allows building complex logical expressions with multiple levels.'
}

/**
 * Path segment constants
 */
export const PATH_SEGMENTS = {
  CONDITIONS: 'conditions',
  ITEMS: 'items',
  PROPERTIES: 'properties'
}

/**
 * Ensures a directory exists
 * @param {string} dir Directory path
 */
export function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * Formats a kebab-case string to Title Case
 * @param {string} str String to format
 * @returns {string} Formatted string
 */
export function toTitleCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Format camelCase or snake_case to Title Case
 * @param {string} str String to format
 * @returns {string} Formatted string
 */
export function formatPropertyName(str) {
  return (
    str
      // camelCase to space-separated
      .replace(/([A-Z])/g, ' $1')
      // snake_case to space-separated
      .replace(/_/g, ' ')
      // Capitalize first letter
      .replace(/^./, (first) => first.toUpperCase())
      .trim()
  )
}

/**
 * Sets a title on schema object if missing
 * @param {SchemaObject} schema - Schema object to update
 * @param {string} parentName - Parent object name for context
 */
export function setSchemaTitle(schema, parentName) {
  if (schema.title) {
    return
  } else if (schema.description && typeof schema.description === 'string') {
    schema.title = schema.description.split('.')[0].trim()
  } else if (parentName) {
    schema.title = formatPropertyName(parentName)
  } else if (schema.type) {
    schema.title = formatPropertyName(String(schema.type))
  } else {
    schema.title = 'Unknown Schema'
  }
}

/**
 * Sets titles for repeat-related schemas
 * @param {SchemaObject} subSchema - Schema to update
 * @param {number} index - Index in array
 */
export function setRepeatTitles(subSchema, index) {
  if (index === 0) {
    subSchema.title = 'Repeat Configuration'
    subSchema.description =
      'Configuration for repeatable pages, used with RepeatPageController. ' +
      'Defines how repeatable sections behave including min/max repetitions and display options.'
  } else {
    subSchema.title = 'Alternative Validation'
    subSchema.description =
      'Alternative validation schema used internally. Not typically configured directly.'
  }
}

/**
 * Sets titles for component name schemas
 * @param {SchemaObject} subSchema - Schema to update
 * @param {number} index - Index in array
 */
export function setNameTitles(subSchema, index) {
  if (index === 0) {
    subSchema.title = 'Display Component Name'
    subSchema.description =
      'Name format for display-only components like HTML, Markdown, etc.'
  } else {
    subSchema.title = 'Input Component Name'
    subSchema.description =
      'Name format for input components that collect user data.'
  }
}

/**
 * Sets titles for title-related schemas
 * @param {SchemaObject} subSchema - Schema to update
 * @param {number} index - Index in array
 */
export function setTitleTitles(subSchema, index) {
  if (index === 0) {
    subSchema.title = 'Display Component Title'
    subSchema.description = 'Title format for display-only components.'
  } else {
    subSchema.title = 'Input Component Title'
    subSchema.description = 'Title displayed above input components.'
  }
}

/**
 * Sets titles for pages schemas
 * @param {SchemaObject} subSchema - Schema to update
 * @param {number} index - Index in array
 */
export function setPagesTitles(subSchema, index) {
  if (index === 0) {
    subSchema.title = 'V2 Pages'
    subSchema.description =
      'Pages definition for forms using engine version V2.'
  } else {
    subSchema.title = 'V1 Pages'
    subSchema.description =
      'Pages definition for forms using engine version V1.'
  }
}

/**
 * Handles specialized title setting for oneOf/anyOf cases
 * @param {SchemaObject} subSchema - The schema to process
 * @param {string} parentName - Parent name
 * @param {string} keyword - oneOf, anyOf, or allOf
 * @param {number} index - Index in the array
 */
export function handleSpecialTitles(subSchema, parentName, keyword, index) {
  if (subSchema.title) {
    return
  }

  if (!setSpecificTitle(subSchema, parentName, keyword, index)) {
    if (subSchema.type) {
      subSchema.title = `${formatPropertyName(parentName)} (${subSchema.type})`
    } else {
      subSchema.title = `${formatPropertyName(parentName)} Variant ${index + 1}`
    }
  }

  setAlternativeValidationTitle(subSchema, parentName, keyword)
}

/**
 * Sets specific titles based on parent name and keyword
 * @param {SchemaObject} subSchema - The schema to process
 * @param {string} parentName - Parent name
 * @param {string} keyword - oneOf, anyOf, or allOf
 * @param {number} index - Index in the array
 * @returns {boolean} Whether a specific title was set
 */
export function setSpecificTitle(subSchema, parentName, keyword, index) {
  if (parentName === 'repeat' && keyword === 'oneOf') {
    setRepeatTitles(subSchema, index)
    return true
  }

  if (parentName === 'name' && keyword === 'oneOf') {
    setNameTitles(subSchema, index)
    return true
  }

  if (parentName === 'title' && keyword === 'oneOf') {
    setTitleTitles(subSchema, index)
    return true
  }

  if (parentName === 'pages' && keyword === 'oneOf') {
    setPagesTitles(subSchema, index)
    return true
  }

  return false
}

/**
 * Sets title for alternative validation schemas
 * @param {SchemaObject} subSchema - The schema to process
 * @param {string} parentName - Parent name
 * @param {string} keyword - oneOf, anyOf, or allOf
 */
export function setAlternativeValidationTitle(subSchema, parentName, keyword) {
  if (
    keyword === 'anyOf' &&
    parentName.includes('Alternative Validation') &&
    subSchema.type
  ) {
    subSchema.title = `${subSchema.type} Type`
    subSchema.description = `**INTERNAL VALIDATION ONLY** - This is an internal schema structure used for validation purposes.
                            When using the ${parentName} property, you should only configure the Repeat Configuration structure
                            when controller is set to "RepeatPageController".`
  }
}

/**
 * Process schema properties
 * @param {SchemaObject} schema - Schema to process
 */
export function processProperties(schema) {
  if (!schema.properties || typeof schema.properties !== 'object') {
    return
  }

  const entries = Object.entries(schema.properties)

  entries.forEach(([propName, propSchema]) => {
    if (!propSchema.title) {
      propSchema.title = formatPropertyName(propName)
    }

    if (!propSchema.description && propSchema.title) {
      propSchema.description = `The ${propSchema.title.toLowerCase()} value.`
    }

    addTitles(propSchema, propName)
  })
}

/**
 * Process array items in schema
 * @param {SchemaObject} schema - Schema to process
 * @param {string} parentName - Parent object name
 */
export function processArrayItems(schema, parentName) {
  if (!schema.items) {
    return
  }

  if (Array.isArray(schema.items)) {
    schema.items.forEach((item, index) => {
      if (!item.title) {
        item.title = `${formatPropertyName(parentName)} Item ${index + 1}`
      }
      addTitles(item, item.title)
    })
  } else {
    if (!schema.items.title) {
      schema.items.title = `${formatPropertyName(parentName)} Item`
    }
    addTitles(schema.items, schema.items.title)
  }
}

/**
 * Process combination keywords (oneOf, anyOf, allOf)
 * @param {SchemaObject} schema - Schema to process
 * @param {string} parentName - Parent object name
 */
export function processCombinationKeywords(schema, parentName) {
  ;['oneOf', 'anyOf', 'allOf'].forEach((keyword) => {
    if (!schema[keyword] || !Array.isArray(schema[keyword])) {
      return
    }

    schema[`${keyword}Titles`] = []

    schema[keyword].forEach((subSchema, index) => {
      handleSpecialTitles(subSchema, parentName, keyword, index)

      schema[`${keyword}Titles`][index] = subSchema.title
      addTitles(subSchema, subSchema.title || parentName)
    })
  })
}

/**
 * Process schema references and definitions
 * @param {SchemaObject} schema - Schema to process
 */
export function processReferences(schema) {
  if (schema.schemas) {
    Object.entries(schema.schemas).forEach(([schemaName, schemaObj]) => {
      if (!schemaObj.title) {
        schemaObj.title = formatPropertyName(schemaName)
      }
      addTitles(schemaObj, schemaName)
    })
  }

  if (schema.components?.schemas) {
    Object.entries(schema.components.schemas).forEach(
      ([schemaName, schemaObj]) => {
        if (!schemaObj.title) {
          schemaObj.title = formatPropertyName(schemaName)
        }
        addTitles(schemaObj, schemaName)
      }
    )
  }

  if (schema.$defs) {
    Object.entries(schema.$defs).forEach(([defName, defSchema]) => {
      if (!defSchema.title) {
        defSchema.title = formatPropertyName(defName)
      }
      addTitles(defSchema, defName)
    })
  }
}

/**
 * Process additional and pattern properties
 * @param {SchemaObject} schema - Schema to process
 * @param {string} parentName - Parent object name
 */
export function processAdditionalProperties(schema, parentName) {
  if (
    schema.additionalProperties &&
    typeof schema.additionalProperties === 'object'
  ) {
    if (!schema.additionalProperties.title) {
      schema.additionalProperties.title = `Additional Properties (${parentName})`
    }
    addTitles(schema.additionalProperties, `Additional ${parentName}`)
  }

  if (schema.patternProperties) {
    Object.entries(schema.patternProperties).forEach(
      ([pattern, patternSchema]) => {
        if (!patternSchema.title) {
          patternSchema.title = `Pattern Property (${pattern})`
        }
        addTitles(patternSchema, `Pattern ${parentName}`)
      }
    )
  }
}

/**
 * Recursively enhances schemas with descriptive titles and descriptions
 * for better documentation output
 * @param {SchemaObject} schema - The schema object to enhance
 * @param {string} parentName - Name of the parent object for context
 * @returns {SchemaObject} The enhanced schema
 */
export function addTitles(schema, parentName = '') {
  if (!schema || typeof schema !== 'object') {
    return schema
  }

  setSchemaTitle(schema, parentName)

  // process oneOf, anyOf, allOf with improved titles
  processCombinationKeywords(schema, parentName)

  processProperties(schema)

  processArrayItems(schema, parentName)

  processReferences(schema)

  processAdditionalProperties(schema, parentName)

  return schema
}

/**
 * Fixes titles for condition items in anyOfTitles
 * @param {SchemaObject} obj - Schema to process
 * @returns {boolean} True if changes were made
 */
export function fixConditionItems(obj) {
  if (!obj.anyOfTitles?.includes('Conditions  Item Variant 3')) {
    return false
  }

  const EXPECTED_CONDITION_TYPES_COUNT = 3

  obj.anyOfTitles = [
    CONDITION_TYPES.DEFINITION,
    CONDITION_TYPES.REFERENCE,
    CONDITION_TYPES.NESTED_GROUP
  ]

  if (obj.anyOf?.length === EXPECTED_CONDITION_TYPES_COUNT) {
    if (obj.anyOf[0].properties?.field) {
      obj.anyOf[0].title = CONDITION_TYPES.DEFINITION
    }
    if (obj.anyOf[1].properties?.conditionName) {
      obj.anyOf[1].title = CONDITION_TYPES.REFERENCE
    }
    if (obj.anyOf[2].$ref?.includes('conditionGroupSchema')) {
      obj.anyOf[2].title = CONDITION_TYPES.NESTED_GROUP
      obj.anyOf[2].description = DESCRIPTIONS.NESTED_CONDITION_GROUP
    }
  }
  return true
}

/**
 * Fixes titles for value objects in anyOfTitles
 * @param {SchemaObject} obj - Schema to process
 * @returns {boolean} True if changes were made
 */
export function fixValueObjects(obj) {
  if (
    obj.anyOfTitles?.length !== 2 ||
    obj.anyOfTitles[0] !== 'Value (object)' ||
    obj.anyOfTitles[1] !== 'Value (object)'
  ) {
    return false
  }

  obj.anyOfTitles = [VALUE_TYPES.STATIC, VALUE_TYPES.RELATIVE_DATE]

  if (obj.anyOf?.length === 2) {
    if (obj.anyOf[0].properties?.value) {
      obj.anyOf[0].title = VALUE_TYPES.STATIC
    }
    if (obj.anyOf[1].properties?.period) {
      obj.anyOf[1].title = VALUE_TYPES.RELATIVE_DATE
    }
  }

  return true
}

/**
 * Processes the anyOfTitles array in an object
 * @param {SchemaObject} obj - Schema to process
 */
export function processAnyOfTitles(obj) {
  if (!obj || typeof obj !== 'object') {
    return
  }

  if (!Array.isArray(obj.anyOfTitles)) {
    return
  }

  if (!fixConditionItems(obj)) {
    fixValueObjects(obj)
  }
}

/**
 * Recursively fixes all condition titles and anyOfTitles throughout the schema
 * regardless of their nesting level
 * @param {SchemaObject} obj - The schema or subschema to fix
 */
export function fixConditionTitles(obj) {
  if (!obj || typeof obj !== 'object') {
    return
  }

  processAnyOfTitles(obj)

  if (obj.title === 'Conditions  Item Variant 3') {
    obj.title = CONDITION_TYPES.NESTED_GROUP
    obj.description = DESCRIPTIONS.NESTED_CONDITION_GROUP
  }

  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    if (value && typeof value === 'object') {
      fixConditionTitles(value)
    }
  })
}

/**
 * Handles reference-specific titles
 * @param {SchemaObject} result - Schema to process
 */
export function handleReferenceSpecificTitles(result) {
  if (result.$ref?.includes('conditionGroupSchema')) {
    result.title = CONDITION_TYPES.NESTED_GROUP
    result.description = DESCRIPTIONS.NESTED_CONDITION_GROUP
  }
}

/**
 * Simplifies anyOf validations that just enumerate types
 * @param {SchemaObject} result - Schema to process
 */
export function simplifyTypeEnumerations(result) {
  if (!result.anyOf || !Array.isArray(result.anyOf)) {
    return
  }

  /** @type {Array<string>} */
  const types = result.anyOf
    .map(
      /**
       * @param {SchemaObject} item
       * @returns {string|undefined}
       */
      (item) => {
        return item.type
      }
    )
    .filter(/** @returns {val is string} */ (val) => Boolean(val))

  const MIN_TYPES_FOR_ENUMERATION = 3

  const isTypeEnumeration =
    types.length >= MIN_TYPES_FOR_ENUMERATION &&
    types.some((t) =>
      ['string', 'number', 'boolean', 'array', 'object'].includes(t)
    )

  if (isTypeEnumeration) {
    delete result.anyOf
    if (
      !result.description ||
      result.description.indexOf('value type') === -1
    ) {
      result.description = `${String(result.description || '')}${result.description ? '\n\n' : ''}Value can be of various types (${types.join(', ')}).`
    }
  }
}

/**
 * Improves titles for condition items
 * @param {SchemaObject} result - Schema to process
 * @param {string} parentPath - Path to current schema
 */
export function improveConditionItemTitles(result, parentPath) {
  if (!parentPath.includes(`/${PATH_SEGMENTS.CONDITIONS}`) || !result.anyOf) {
    return
  }

  result.anyOf.forEach(
    /** @param {SchemaObject} item */ (item) => {
      if (item.title?.includes('Item (object)') && item.properties) {
        if (item.properties.field) {
          item.title = CONDITION_TYPES.DEFINITION
        } else if (item.properties.conditionName) {
          item.title = CONDITION_TYPES.REFERENCE
        } else if (item.properties.conditions) {
          item.title = CONDITION_TYPES.NESTED_GROUP
        } else {
          item.title = `Unknown Condition Item Type`
        }
      }
    }
  )
}

/**
 * Improves titles for value objects in conditions
 * @param {SchemaObject} result - Schema to process
 * @param {string} parentPath - Path to current schema
 */
export function improveValueObjectTitles(result, parentPath) {
  if (!parentPath.includes('/value') || !result.anyOf) {
    return
  }

  result.anyOf.forEach(
    /** @param {SchemaObject} item */ (item) => {
      if (!item.properties) {
        return
      }

      if (
        item.properties.period &&
        item.properties.unit &&
        item.properties.direction
      ) {
        item.title = VALUE_TYPES.RELATIVE_DATE
      } else if (
        item.properties.value &&
        item.properties.type &&
        item.properties.display
      ) {
        item.title = VALUE_TYPES.STATIC
      } else {
        item.title = 'Unknown Value Type'
      }
    }
  )
}

/**
 * Improves descriptions for condition operators
 * @param {SchemaObject} result - Schema to process
 * @param {string} parentPath - Path to current schema
 */
export function improveOperatorDescriptions(result, parentPath) {
  if (
    parentPath.endsWith('/operator') &&
    parentPath.includes(`/${PATH_SEGMENTS.CONDITIONS}`)
  ) {
    result.description =
      'Comparison operator: equals, notEquals, contains, notContains, greaterThan, lessThan, isEmpty, isNotEmpty'
  }
}

/**
 * Adds examples to recursive condition groups
 * @param {SchemaObject} result - Schema to process
 * @param {string} parentPath - Path to current schema
 */
export function addExamplesToConditionGroups(result, parentPath) {
  if (
    result.title !== 'Condition Group Schema' &&
    !parentPath.includes('conditionGroupSchema')
  ) {
    return
  }

  if (result.description) {
    result.description = `${result.description} Note: This structure can be nested multiple levels deep for complex condition logic.`
  }

  result.examples = [
    {
      conditions: [
        {
          field: {
            name: 'farmType',
            type: 'string',
            display: 'Type of farm'
          },
          operator: 'equals',
          value: {
            type: 'string',
            value: 'livestock',
            display: 'Livestock farm'
          },
          coordinator: 'AND'
        },
        {
          conditionName: 'hasEnvironmentalPermit',
          conditionDisplayName: 'Has an environmental permit',
          coordinator: 'OR'
        }
      ]
    }
  ]
}

/**
 * Handles repeat property special case
 * @param {SchemaObject} result - Schema to process
 * @param {string} parentPath - Path to current schema
 * @returns {SchemaObject|null} Processed schema or null if no special handling needed
 */
export function handleRepeatProperty(result, parentPath) {
  if (
    !parentPath.endsWith('/repeat') ||
    !result.oneOf ||
    result.oneOf.length <= 1
  ) {
    return null
  }

  const mainOption = result.oneOf[0]

  mainOption.description = `${mainOption.description || ''}\n\nNOTE: This configuration is only used when the 'controller' property is set to 'RepeatPageController'. Otherwise, this property should not be specified.`

  delete result.oneOf
  delete result.anyOf

  Object.assign(result, mainOption)
  return result
}

/**
 * Handles name/title fields
 * @param {SchemaObject} result - Schema to process
 * @param {string} parentPath - Path to current schema
 */
export function handleNameTitleFields(result, parentPath) {
  if (
    (parentPath.endsWith('/name') || parentPath.endsWith('/title')) &&
    result.oneOf &&
    result.oneOf.length > 1 &&
    result.anyOf
  ) {
    delete result.anyOf
  }
}

/**
 * Improves titles for list items
 * @param {SchemaObject} result - Schema to process
 * @param {string} parentPath - Path to current schema
 */
export function improveListItemTitles(result, parentPath) {
  if (
    !parentPath.endsWith(`/${PATH_SEGMENTS.ITEMS}`) ||
    !result.oneOf ||
    result.oneOf.length <= 1
  ) {
    return
  }

  result.oneOf.forEach(
    /** @param {SchemaObject} option */ (option) => {
      if (option.description?.includes('string values')) {
        option.title = 'String List Items'
      } else if (option.description?.includes('numeric values')) {
        option.title = 'Number List Items'
      } else {
        option.title = 'Generic List Items'
      }
    }
  )

  if (result.anyOf) {
    delete result.anyOf
  }
}

/**
 * Simplifies documentation for condition items in arrays
 * @param {SchemaObject} result - Schema to process
 * @param {string} parentPath - Path to current schema
 */
export function simplifyConditionArrays(result, parentPath) {
  if (
    !parentPath.includes(
      `${PATH_SEGMENTS.CONDITIONS}/${PATH_SEGMENTS.ITEMS}`
    ) &&
    !parentPath.endsWith(`/${PATH_SEGMENTS.CONDITIONS}`)
  ) {
    return
  }

  if (result.items?.anyOf) {
    result.description = `${result.description || ''}\n\nElements can be direct conditions, references to named conditions, or nested condition groups. This structure allows building complex logical expressions with AND/OR operators.`
  }
}

/**
 * Recursively processes properties of a schema
 * @param {SchemaObject} result - Schema to process
 * @param {string} parentPath - Path to current schema
 */
export function processNestedSchemas(result, parentPath) {
  if (result.properties) {
    Object.entries(result.properties).forEach(([propName, propSchema]) => {
      result.properties[propName] = simplifyForDocs(
        propSchema,
        `${parentPath}/${PATH_SEGMENTS.PROPERTIES}/${propName}`
      )
    })
  }

  if (result.items) {
    if (Array.isArray(result.items)) {
      result.items = result.items.map((item, idx) =>
        simplifyForDocs(item, `${parentPath}/${PATH_SEGMENTS.ITEMS}/${idx}`)
      )
    } else {
      result.items = simplifyForDocs(
        result.items,
        `${parentPath}/${PATH_SEGMENTS.ITEMS}`
      )
    }
  }

  ;['oneOf', 'anyOf', 'allOf'].forEach((keyword) => {
    if (result[keyword] && Array.isArray(result[keyword])) {
      result[keyword] = result[keyword].map((subSchema, idx) =>
        simplifyForDocs(subSchema, `${parentPath}/${keyword}/${idx}`)
      )
    }
  })
}

/**
 * Simplifies a schema for documentation purposes by removing unnecessary internal validation structures
 * @param {SchemaObject} schema - The schema to simplify
 * @param {string} parentPath - Path to the current schema location
 * @returns {SchemaObject} Simplified schema
 */
export function simplifyForDocs(schema, parentPath = '') {
  if (typeof schema !== 'object') {
    return schema
  }

  /** @type {SchemaObject} */
  const result = JSON.parse(JSON.stringify(schema))

  handleReferenceSpecificTitles(result)
  simplifyTypeEnumerations(result)
  improveConditionItemTitles(result, parentPath)
  improveValueObjectTitles(result, parentPath)
  improveOperatorDescriptions(result, parentPath)
  addExamplesToConditionGroups(result, parentPath)

  const specialResult = handleRepeatProperty(result, parentPath)
  if (specialResult) {
    return specialResult
  }

  handleNameTitleFields(result, parentPath)
  improveListItemTitles(result, parentPath)
  simplifyConditionArrays(result, parentPath)

  fixConditionTitles(result)

  processNestedSchemas(result, parentPath)

  return result
}

/**
 * Cleans the schemas directory by removing all existing JSON files
 * @returns {number} Number of files cleaned
 */
export function cleanSchemaDirectory() {
  console.log('Cleaning existing schema files...')
  const existingFiles = fs
    .readdirSync(schemasDir)
    .filter((file) => file.endsWith('.json'))

  for (const file of existingFiles) {
    fs.unlinkSync(path.join(schemasDir, file))
  }

  console.log(`Cleaned ${existingFiles.length} existing schema files`)
  return existingFiles.length
}

/**
 * Gets the schema map that defines which files should be generated
 * @returns {Record<string, string>} Schema map with filename-to-schema-export mapping
 */
export function getSchemaMap() {
  return {
    // Form definition schemas
    'form-definition-schema': 'formDefinitionSchema',
    'form-definition-v2-payload-schema': 'formDefinitionV2PayloadSchema',

    // Component schemas
    'component-schema': 'componentSchema',
    'component-schema-v2': 'componentSchemaV2',

    // Page schemas
    'page-schema': 'pageSchema',
    'page-schema-v2': 'pageSchemaV2',
    'page-schema-payload-v2': 'pageSchemaPayloadV2',

    // List schemas
    'list-schema': 'listSchema',
    'list-schema-v2': 'listSchemaV2',

    // Form metadata schemas
    'form-metadata-schema': 'formMetadataSchema',
    'form-metadata-author-schema': 'formMetadataAuthorSchema',
    'form-metadata-input-schema': 'formMetadataInputSchema',
    'form-metadata-state-schema': 'formMetadataStateSchema',

    // Form metadata field schemas
    'form-metadata-contact-schema': 'contactSchema',
    'form-metadata-email-schema': 'emailSchema',
    'form-metadata-online-schema': 'onlineSchema',

    // Form editor schemas
    'form-editor-input-page-schema': 'formEditorInputPageSchema',
    'form-editor-input-check-answers-setting-schema':
      'formEditorInputCheckAnswersSettingSchema',
    'form-editor-input-question-schema': 'formEditorInputQuestionSchema',
    'form-editor-input-page-settings-schema':
      'formEditorInputPageSettingsSchema',

    // Form editor field schemas
    'page-type-schema': 'pageTypeSchema',
    'question-type-schema': 'questionTypeSchema',
    'question-type-full-schema': 'questionTypeFullSchema',
    'written-answer-sub-schema': 'writtenAnswerSubSchema',
    'date-sub-schema': 'dateSubSchema',

    // Form submission schemas
    'form-submit-payload-schema': 'formSubmitPayloadSchema',
    'form-submit-record-schema': 'formSubmitRecordSchema',
    'form-submit-recordset-schema': 'formSubmitRecordsetSchema',

    // Form manager schemas
    'patch-page-schema': 'patchPageSchema',

    // Section schemas
    'question-schema': 'questionSchema',

    // Validation schemas
    'min-schema': 'minSchema',
    'max-schema': 'maxSchema',
    'min-length-schema': 'minLengthSchema',
    'max-length-schema': 'maxLengthSchema',
    'max-future-schema': 'maxFutureSchema',
    'max-past-schema': 'maxPastSchema',

    // Common schemas
    'search-options-schema': 'searchOptionsSchema',
    'query-options-schema': 'queryOptionsSchema',
    'pagination-options-schema': 'paginationOptionsSchema',
    'sorting-options-schema': 'sortingOptionsSchema'
  }
}

/**
 * Process a single schema and create its JSON Schema file
 * @param {string} fileName - Output file name
 * @param {string} schemaName - Schema export name in the model
 * @param {Record<string, unknown>} model - The loaded model containing schemas
 * @returns {boolean} Whether processing was successful
 */
export function processSchema(fileName, schemaName, model) {
  try {
    /** @type {unknown} */
    const joiSchema = model[schemaName]

    if (!joiSchema) {
      return false
    }

    /** @type {SchemaObject} */
    let jsonSchema = parse(
      /** @type {Schema} */ (joiSchema),
      'json',
      {},
      {
        includeSchemaDialect: true,
        includeDescriptions: true
      }
    )

    const title = toTitleCase(fileName)
    if (!jsonSchema.title) {
      jsonSchema.title = title
    }
    if (!jsonSchema.description) {
      jsonSchema.description = `JSON Schema for validating ${title} in Defra forms`
    }

    if (!jsonSchema.$id) {
      jsonSchema.$id = `@defra/forms-model/schemas/${fileName}.json`
    }

    addTitles(jsonSchema, '')

    jsonSchema = simplifyForDocs(jsonSchema, '')

    const outputPath = path.join(schemasDir, `${fileName}.json`)
    fs.writeFileSync(outputPath, JSON.stringify(jsonSchema, null, 2))
    return true
  } catch (/** @type {unknown} */ err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error(`✗ Failed to process ${fileName}: ${error.message}`)
    return false
  }
}

/**
 * Loads the model with all schemas
 * @returns {Promise<Record<string, unknown>>} Loaded model
 */
async function loadModelSchemas() {
  console.log('Loading model schemas...')
  return import('../dist/module/index.js')
}

/**
 * Processes all schemas and generates JSON Schema files
 * @param {Record<string, unknown>} model - The loaded model containing schemas
 * @returns {{ successCount: number, errorCount: number }} Object containing success and error counts
 */
export function processAllSchemas(model) {
  const schemaMap = getSchemaMap()
  let successCount = 0
  let errorCount = 0

  for (const [fileName, schemaName] of Object.entries(schemaMap)) {
    const success = processSchema(fileName, schemaName, model)

    if (success) {
      successCount++
    } else {
      errorCount++
    }
  }

  return { successCount, errorCount }
}

/**
 * Generates schema files from Joi schemas
 */
export async function generateSchemas() {
  try {
    const model = await loadModelSchemas()

    ensureDirectoryExists(schemasDir)

    cleanSchemaDirectory()

    const { successCount, errorCount } = processAllSchemas(model)

    console.log('\nSchema generation complete!')
    console.log(`✓ Successfully generated ${successCount} schemas`)
    if (errorCount > 0) {
      console.log(`✗ Failed to generate ${errorCount} schemas`)
    }

    return { successCount, errorCount }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error(`\n✗ Schema generation failed: ${error.message}`)
    throw error
  }
}

// Only run when executed directly, not when imported as a module
if (import.meta.url === `file://${process.argv[1]}`) {
  ;(async () => {
    try {
      await generateSchemas()
    } catch (err) {
      console.error('Schema generation failed:', err)
      throw err
    }
  })().catch((err) => {
    console.error('Unhandled error:', err)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  })
}

/**
 * @import { Schema } from 'joi'
 */
