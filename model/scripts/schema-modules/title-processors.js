import { formatPropertyName } from './utils.js'

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
 * @import { SchemaObject } from './types.js'
 */
