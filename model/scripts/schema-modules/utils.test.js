// @ts-nocheck
import fs from 'fs'
import {
  toTitleCase,
  formatPropertyName,
  ensureDirectoryExists
} from './utils.js'

describe('Utils', () => {
  describe('toTitleCase', () => {
    it('should convert kebab-case to Title Case', () => {
      expect(toTitleCase('test-schema')).toBe('Test Schema')
      expect(toTitleCase('component-schema-v2')).toBe('Component Schema V2')
      expect(toTitleCase('form-definition-v2-schema')).toBe(
        'Form Definition V2 Schema'
      )
    })
  })

  describe('formatPropertyName', () => {
    it('should format property names correctly', () => {
      expect(formatPropertyName('firstName')).toBe('First Name')
      expect(formatPropertyName('user_name')).toBe('User name')
      expect(formatPropertyName('simpleText')).toBe('Simple Text')
    })
  })

  describe('ensureDirectoryExists', () => {
    let mockMkdirSync
    let mockExistsSync

    beforeEach(() => {
      mockMkdirSync = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {})
      mockExistsSync = jest.spyOn(fs, 'existsSync')
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should create directory if it does not exist', () => {
      mockExistsSync.mockReturnValue(false)
      ensureDirectoryExists('/test/dir')
      expect(mockMkdirSync).toHaveBeenCalledWith('/test/dir', {
        recursive: true
      })
    })

    it('should not create directory if it already exists', () => {
      mockExistsSync.mockReturnValue(true)
      ensureDirectoryExists('/test/dir')
      expect(mockMkdirSync).not.toHaveBeenCalled()
    })
  })
})
