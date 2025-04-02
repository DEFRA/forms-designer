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

export {}
