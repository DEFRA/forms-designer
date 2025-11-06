import {
  allowedParentFileTypes,
  getSelectedFileTypesFromCSVMimeTypes,
  mapExtensionsToMimeTypes,
  mapPayloadToFileMimeTypes
} from '~/src/models/forms/editor-v2/file-type-utils.js'

describe('file-type-utils', () => {
  describe('allowedParentFileTypes', () => {
    it('should export the correct parent file types', () => {
      expect(allowedParentFileTypes).toEqual([
        { value: 'documents', text: 'Documents' },
        { value: 'images', text: 'Images' },
        { value: 'tabular-data', text: 'Tabular data' }
      ])
    })
  })

  describe('mapExtensionsToMimeTypes', () => {
    it('should map document extensions to mime types', () => {
      const result = mapExtensionsToMimeTypes(['doc', 'docx'])
      expect(result).toEqual([
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ])
    })

    it('should map image extensions to mime types', () => {
      const result = mapExtensionsToMimeTypes(['jpg', 'png'])
      expect(result).toEqual(['image/jpeg', 'image/png'])
    })

    it('should map tabular data extensions to mime types', () => {
      const result = mapExtensionsToMimeTypes(['csv'])
      expect(result).toEqual(['text/csv'])
    })

    it('should handle mixed file types', () => {
      const result = mapExtensionsToMimeTypes(['doc', 'jpg', 'csv'])
      expect(result).toEqual(['application/msword', 'image/jpeg', 'text/csv'])
    })

    it('should return undefined for unknown extensions', () => {
      const result = mapExtensionsToMimeTypes(['unknown'])
      expect(result).toEqual([undefined])
    })
  })

  describe('mapPayloadToFileMimeTypes', () => {
    it('should combine all types into one list', () => {
      expect(
        mapPayloadToFileMimeTypes({
          fileTypes: ['documents', 'images', 'tabular-data'],
          documentTypes: ['doc', 'docx'],
          imageTypes: ['jpg', 'png'],
          tabularDataTypes: ['csv']
        }).accept
      ).toBe(
        'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,text/csv'
      )
    })

    it('should remove sub-types if parent type not selected', () => {
      expect(
        mapPayloadToFileMimeTypes({
          fileTypes: ['documents', 'tabular-data'],
          documentTypes: ['doc', 'docx'],
          imageTypes: ['jpg', 'png'],
          tabularDataTypes: ['csv']
        }).accept
      ).toBe(
        'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/csv'
      )
    })

    it('should remove sub-types even if no sub-types, if parent type not selected', () => {
      expect(
        mapPayloadToFileMimeTypes({
          fileTypes: ['documents', 'tabular-data'],
          documentTypes: ['doc', 'docx'],
          imageTypes: undefined,
          tabularDataTypes: ['csv']
        }).accept
      ).toBe(
        'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/csv'
      )
    })

    it('should handle undefined lists', () => {
      expect(
        mapPayloadToFileMimeTypes({
          fileTypes: [],
          documentTypes: undefined,
          imageTypes: undefined,
          tabularDataTypes: undefined
        })
      ).toEqual({})
    })

    it('should handle undefined lists even when parent selected', () => {
      expect(
        mapPayloadToFileMimeTypes({
          fileTypes: ['documents', 'images', 'tabular-data'],
          documentTypes: undefined,
          imageTypes: undefined,
          tabularDataTypes: undefined
        })
      ).toEqual({})
    })

    it('should return empty object when no combined types', () => {
      expect(
        mapPayloadToFileMimeTypes({
          fileTypes: ['documents'],
          documentTypes: [],
          imageTypes: [],
          tabularDataTypes: []
        })
      ).toEqual({})
    })
  })

  describe('getSelectedFileTypesFromCSVMimeTypes', () => {
    it('should parse CSV mime types into file type categories', () => {
      const question = {
        type: 'FileUploadField',
        options: {
          accept: 'application/msword,image/jpeg,text/csv'
        }
      }

      const result = getSelectedFileTypesFromCSVMimeTypes(
        /** @type {ComponentDef} */ (question)
      )
      expect(result).toEqual({
        fileTypes: ['documents', 'images', 'tabular-data'],
        documentTypes: ['doc'],
        imageTypes: ['jpg'],
        tabularDataTypes: ['csv']
      })
    })

    it('should handle multiple mime types in same category', () => {
      const question = {
        type: 'FileUploadField',
        options: {
          accept:
            'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      }

      const result = getSelectedFileTypesFromCSVMimeTypes(
        /** @type {ComponentDef} */ (question)
      )
      expect(result).toEqual({
        fileTypes: ['documents'],
        documentTypes: ['doc', 'docx'],
        imageTypes: [],
        tabularDataTypes: []
      })
    })

    it('should return empty object for non-file upload component', () => {
      const question = {
        type: 'TextField',
        options: {}
      }

      const result = getSelectedFileTypesFromCSVMimeTypes(
        /** @type {ComponentDef} */ (question)
      )
      expect(result).toEqual({})
    })

    it('should return empty arrays when no accept string provided', () => {
      const question = {
        type: 'FileUploadField',
        options: {}
      }

      const result = getSelectedFileTypesFromCSVMimeTypes(
        /** @type {ComponentDef} */ (question)
      )
      expect(result).toEqual({
        fileTypes: [],
        documentTypes: [],
        imageTypes: [],
        tabularDataTypes: []
      })
    })

    it('should handle undefined question', () => {
      const result = getSelectedFileTypesFromCSVMimeTypes(undefined)
      expect(result).toEqual({})
    })

    it('should filter out unknown mime types', () => {
      const question = {
        type: 'FileUploadField',
        options: {
          accept: 'application/msword,unknown/mime-type,image/jpeg'
        }
      }

      const result = getSelectedFileTypesFromCSVMimeTypes(
        /** @type {ComponentDef} */ (question)
      )
      expect(result).toEqual({
        fileTypes: ['documents', 'images'],
        documentTypes: ['doc'],
        imageTypes: ['jpg'],
        tabularDataTypes: []
      })
    })
  })
})

/**
 * @import { ComponentDef } from '@defra/forms-model'
 */
