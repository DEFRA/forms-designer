import path from 'path'
import { fileURLToPath } from 'url'

export const currentDirname = path.dirname(fileURLToPath(import.meta.url))
export const schemasDir = path.resolve(currentDirname, '../../schemas')

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
