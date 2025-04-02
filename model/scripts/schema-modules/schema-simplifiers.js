import {
  CONDITION_TYPES,
  DESCRIPTIONS,
  PATH_SEGMENTS,
  VALUE_TYPES
} from './constants.js'
import { fixConditionTitles } from './schema-processors.js'

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
 * @import { SchemaObject } from './types.js'
 */
