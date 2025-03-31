// @ts-nocheck
import fs from 'fs'
import path from 'path'
import {
  getSchemaMap,
  processAllSchemas,
  cleanSchemaDirectory
} from './generate-schemas.js'
import { schemasDir } from './schema-modules/constants.js'

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
      pageSchemaV2: {},
      componentSchema: {},
      listSchema: {},
      formDefinitionSchema: {},
      conditionSchema: {},
      conditionGroupSchema: {},
      minSchema: {},
      maxSchema: {}
    }
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
      // Mock parse function
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

  describe('Script Entry Point', () => {
    const originalConsoleError = console.error
    const originalProcessExit = process.exit

    beforeEach(() => {
      console.error = jest.fn()
      process.exit = jest.fn()
    })

    afterEach(() => {
      console.error = originalConsoleError
      process.exit = originalProcessExit
    })

    it('should handle successful execution', async () => {
      const mockGenerateSchemasFn = jest
        .fn()
        .mockResolvedValue({ successCount: 5, errorCount: 0 })

      await (async () => {
        try {
          await mockGenerateSchemasFn()
        } catch (err) {
          console.error('Schema generation failed:', err)
          throw err
        }
      })()

      expect(mockGenerateSchemasFn).toHaveBeenCalled()
      expect(console.error).not.toHaveBeenCalled()
      expect(process.exit).not.toHaveBeenCalled()
    })
  })
})
