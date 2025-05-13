import fs from 'fs'
import path from 'path'
import parse from 'joi-to-json'

import { schemasDir } from './schema-modules/constants.js'
import { ensureDirectoryExists, toTitleCase } from './schema-modules/utils.js'
import { addTitles } from './schema-modules/title-processors.js'
import { simplifyForDocs } from './schema-modules/schema-simplifiers.js'

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

    /** @type {import('./schema-modules/types.js').SchemaObject} */
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

/**
 * @import { SchemaObject } from './schema-modules/types.js'
 */
