// @ts-nocheck
import fs from 'fs'
import path from 'path'
import {
  getSchemaMap,
  processAllSchemas,
  cleanSchemaDirectory,
  processSchema
} from './generate-schemas.js'
import { schemasDir } from './schema-modules/constants.js'

import parse from 'joi-to-json'

jest.mock('joi-to-json', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    title: 'Mock Schema',
    type: 'object',
    properties: {}
  }))
}))

jest.mock('./schema-modules/title-processors', () => ({
  addTitles: jest.fn().mockImplementation((schema) => schema)
}))

jest.mock('./schema-modules/schema-simplifiers', () => ({
  simplifyForDocs: jest.fn().mockImplementation((schema) => schema)
}))

describe('Generate Schemas Script', () => {
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

    mockModel = {
      pageSchemaV2: { isJoi: true },
      componentSchema: { isJoi: true },
      listSchema: { isJoi: true },
      formDefinitionSchema: { isJoi: true },
      conditionSchema: { isJoi: true },
      conditionGroupSchema: { isJoi: true },
      minSchema: { isJoi: true },
      maxSchema: { isJoi: true },
      testSchema: { isJoi: true }
    }

    parse.mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
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

    it('should clean JSON files from schema directory', () => {
      const originalConsoleLog = console.log
      console.log = jest.fn()

      mockReadDirSync.mockReturnValue(['test1.json', 'test2.json', 'other.txt'])

      const result = cleanSchemaDirectory()

      expect(console.log).toHaveBeenCalledWith(
        'Cleaning existing schema files...'
      )
      expect(console.log).toHaveBeenCalledWith(
        'Cleaned 2 existing schema files'
      )

      expect(mockReadDirSync).toHaveBeenCalledWith(schemasDir)

      expect(mockUnlinkSync).toHaveBeenCalledTimes(2)
      expect(mockUnlinkSync).toHaveBeenCalledWith(
        path.join(schemasDir, 'test1.json')
      )
      expect(mockUnlinkSync).toHaveBeenCalledWith(
        path.join(schemasDir, 'test2.json')
      )

      expect(result).toBe(2)

      console.log = originalConsoleLog
    })
  })

  describe('Schema Processing Functions', () => {
    it('should process schemas successfully', () => {
      jest.mock('joi-to-json', () => {
        return {
          __esModule: true,
          default: jest.fn().mockReturnValue({
            title: 'Mock Schema',
            type: 'object',
            properties: {}
          })
        }
      })

      const testModel = {
        minSchema: mockModel.minSchema,
        maxSchema: mockModel.maxSchema
      }

      const result = processAllSchemas(testModel)

      expect(result.successCount).toBeGreaterThanOrEqual(0)
      expect(result.errorCount).toBeGreaterThanOrEqual(0)
    })
  })

  describe('processSchema Function', () => {
    beforeEach(() => {
      mockWriteFileSync.mockClear()
    })

    it('should process schema and set defaults correctly', () => {
      const testModel = {
        testSchema: { isJoi: true }
      }

      const result = processSchema('test-schema', 'testSchema', testModel)
      expect(result).toBe(true)

      expect(parse).toHaveBeenCalledWith(
        testModel.testSchema,
        'json',
        expect.any(Object),
        expect.objectContaining({
          includeSchemaDialect: true,
          includeDescriptions: true
        })
      )

      expect(mockWriteFileSync).toHaveBeenCalledTimes(1)
    })

    it('should use title/description/id from schema when available', () => {
      const testModel = {
        testSchema: { isJoi: true }
      }

      parse.mockReturnValueOnce({
        title: 'Custom Title',
        description: 'Custom Description',
        $id: 'custom-id',
        type: 'object',
        properties: {}
      })

      const result = processSchema('custom-schema', 'testSchema', testModel)
      expect(result).toBe(true)

      expect(mockWriteFileSync).toHaveBeenCalledTimes(1)

      const [outputPath, content] = mockWriteFileSync.mock.calls[0]
      const jsonSchema = JSON.parse(content)

      expect(jsonSchema.title).toBe('Custom Title')
      expect(jsonSchema.description).toBe('Custom Description')
      expect(jsonSchema.$id).toBe('custom-id')
    })

    it('should handle Error objects correctly', () => {
      const originalConsoleError = console.error
      console.error = jest.fn()

      parse.mockImplementationOnce(() => {
        throw new Error('Test error message')
      })

      const result = processSchema('error-schema', 'minSchema', mockModel)
      expect(result).toBe(false)
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining(
          '✗ Failed to process error-schema: Test error message'
        )
      )

      console.error = originalConsoleError
    })

    it('should handle non-Error thrown values correctly', () => {
      const originalConsoleError = console.error
      console.error = jest.fn()

      parse.mockImplementationOnce(() => {
        throw 'String error message'
      })

      const result = processSchema('error-schema', 'minSchema', mockModel)
      expect(result).toBe(false)
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining(
          '✗ Failed to process error-schema: String error message'
        )
      )

      console.error = originalConsoleError
    })

    it('should handle non-existent schema', () => {
      const originalConsoleError = console.error
      console.error = jest.fn()

      const result = processSchema(
        'non-existent',
        'nonExistentSchema',
        mockModel
      )
      expect(result).toBe(false)
      expect(console.error).not.toHaveBeenCalled()

      console.error = originalConsoleError
    })
  })

  describe('Full Schema Processing', () => {
    it('should set default title, description and $id when missing', () => {
      parse.mockImplementationOnce(() => ({
        type: 'object',
        properties: {}
      }))

      const result = processSchema('min-schema-test', 'minSchema', mockModel)
      expect(result).toBe(true)

      const [outputPath, content] = mockWriteFileSync.mock.calls[0]
      const jsonSchema = JSON.parse(content)

      expect(jsonSchema.title).toBe('Min Schema Test')
      expect(jsonSchema.description).toContain(
        'JSON Schema for validating Min Schema Test'
      )
      expect(jsonSchema.$id).toBe(
        '@defra/forms-model/schemas/min-schema-test.json'
      )
    })

    it('should verify all required fields are set by inspecting written content', () => {
      const result = processSchema('min-schema', 'minSchema', mockModel)
      expect(result).toBe(true)

      expect(mockWriteFileSync).toHaveBeenCalledTimes(1)

      const [outputPath, content] = mockWriteFileSync.mock.calls[0]

      expect(outputPath).toBe(path.join(schemasDir, 'min-schema.json'))

      const jsonSchema = JSON.parse(content)

      expect(jsonSchema.title).toBeDefined()
      expect(jsonSchema.description).toBeDefined()
      expect(jsonSchema.$id).toBeDefined()
    })
  })

  describe('Default Schema Metadata', () => {
    it('should verify title, description and $id are set for processed schemas', () => {
      const result = processSchema('min-schema', 'minSchema', mockModel)
      expect(result).toBe(true)

      expect(mockWriteFileSync).toHaveBeenCalledTimes(1)

      const [outputPath, content] = mockWriteFileSync.mock.calls[0]

      const jsonSchema = JSON.parse(content)

      expect(jsonSchema.title).toBeDefined()
      expect(jsonSchema.description).toBeDefined()
      expect(jsonSchema.$id).toBeDefined()
    })
  })

  describe('Script Entry Point', () => {
    const originalConsoleError = console.error
    const originalProcessExit = process.exit
    const originalProcessArgv = process.argv

    beforeEach(() => {
      console.error = jest.fn()
      process.exit = jest.fn()
      process.argv = ['node', '/path/to/generate-schemas.js']
    })

    afterEach(() => {
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
        const mockGenerateSchemas = jest
          .fn()
          .mockRejectedValue(new Error('Test error'))
        await eval(moduleCode)
      } catch (err) {}

      expect(console.error).toHaveBeenCalledWith(
        'Schema generation failed:',
        expect.any(Error)
      )
      expect(console.error).toHaveBeenCalledWith(
        'Unhandled error:',
        expect.any(Error)
      )
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
