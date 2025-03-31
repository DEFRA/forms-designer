import { CONDITION_TYPES, DESCRIPTIONS, VALUE_TYPES } from './constants.js'

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
 * @import { SchemaObject } from './types.js'
 */
