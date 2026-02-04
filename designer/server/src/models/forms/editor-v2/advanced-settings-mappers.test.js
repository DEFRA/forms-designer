import { ComponentType } from '@defra/forms-model'

import {
  mapBaseQuestionDetails,
  mapFileUploadQuestionDetails,
  mapListComponentFromPayload,
  mapQuestionDetails
} from '~/src/models/forms/editor-v2/advanced-settings-mappers.js'

describe('advanced-settings-mappers', () => {
  describe('mapBaseQuestionDetails', () => {
    it('should map basic payload to component details', () => {
      const payload = {
        questionType: ComponentType.TextField,
        question: 'Test question',
        name: 'testField',
        shortDescription: 'Test description',
        hintText: 'Test hint',
        questionOptional: 'true'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(result).toEqual({
        type: ComponentType.TextField,
        title: 'Test question',
        name: 'testField',
        shortDescription: 'Test description',
        hint: 'Test hint',
        options: {
          required: false
        },
        schema: {}
      })
    })

    it('should not apply default hint for EastingNorthingField when no hint provided', () => {
      const payload = {
        questionType: ComponentType.EastingNorthingField,
        question: 'Location',
        name: 'location'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ hint?: string }} */ (result).hint).toBeUndefined()
    })

    it('should update default hint for EastingNorthingField when changing location component type', () => {
      const payload = {
        questionType: ComponentType.EastingNorthingField,
        question: 'Location',
        name: 'location',
        hintText:
          'An OS grid reference number is made up of 2 letters followed by either 6, 8 or 10 numbers, for example, TQ123456'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ hint?: string }} */ (result).hint).toBe(
        'For example. Easting: 248741, Northing: 63688'
      )
    })

    it('should not apply default hint for OsGridRefField when no hint provided', () => {
      const payload = {
        questionType: ComponentType.OsGridRefField,
        question: 'Grid reference',
        name: 'gridRef'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ hint?: string }} */ (result).hint).toBeUndefined()
    })

    it('should update default hint for OsGridRefField when changing location component type', () => {
      const payload = {
        questionType: ComponentType.OsGridRefField,
        question: 'Location',
        name: 'location',
        hintText:
          'For Great Britain, the latitude will be a number between 49.850 and 60.859. The longitude will be a number between -13.687 and 1.767'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ hint?: string }} */ (result).hint).toBe(
        'An OS grid reference number is made up of 2 letters followed by either 6, 8 or 10 numbers, for example, TQ123456'
      )
    })

    it('should not apply default hint for NationalGridFieldNumberField when no hint provided', () => {
      const payload = {
        questionType: ComponentType.NationalGridFieldNumberField,
        question: 'Grid number',
        name: 'gridNumber'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ hint?: string }} */ (result).hint).toBeUndefined()
    })

    it('should update default hint for NationalGridFieldNumberField when changing location component type', () => {
      const payload = {
        questionType: ComponentType.NationalGridFieldNumberField,
        question: 'Location',
        name: 'location',
        hintText:
          'For Great Britain, the latitude will be a number between 49.850 and 60.859. The longitude will be a number between -13.687 and 1.767'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ hint?: string }} */ (result).hint).toBe(
        'A National Grid field number is made up of 2 letters and 8 numbers, for example, NG 1234 5678'
      )
    })

    it('should not apply default hint for LatLongField when no hint provided', () => {
      const payload = {
        questionType: ComponentType.LatLongField,
        question: 'Coordinates',
        name: 'coordinates'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ hint?: string }} */ (result).hint).toBeUndefined()
    })

    it('should update default hint for LatLongField when changing location component type', () => {
      const payload = {
        questionType: ComponentType.LatLongField,
        question: 'Location',
        name: 'location',
        hintText:
          'An OS grid reference number is made up of 2 letters followed by either 6, 8 or 10 numbers, for example, TQ123456'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ hint?: string }} */ (result).hint).toBe(
        'For Great Britain, the latitude will be a number between 49.850 and 60.859. The longitude will be a number between -13.687 and 1.767'
      )
    })

    it('should not override existing hint text for location fields', () => {
      const payload = {
        questionType: ComponentType.EastingNorthingField,
        question: 'Location',
        name: 'location',
        hintText: 'Custom hint text'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ hint?: string }} */ (result).hint).toBe(
        'Custom hint text'
      )
    })

    it('should replace hint text when switching from OsGridRefField to EastingNorthingField', () => {
      const payload = {
        questionType: ComponentType.EastingNorthingField,
        question: 'Location',
        name: 'location',
        hintText:
          'An OS grid reference number is made up of 2 letters followed by either 6, 8 or 10 numbers, for example, TQ123456'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ hint?: string }} */ (result).hint).toBe(
        'For example. Easting: 248741, Northing: 63688'
      )
    })

    it('should replace hint text when switching from LatLongField to NationalGridFieldNumberField', () => {
      const payload = {
        questionType: ComponentType.NationalGridFieldNumberField,
        question: 'Grid number',
        name: 'gridNumber',
        hintText:
          'For Great Britain, the latitude will be a number between 49.850 and 60.859. The longitude will be a number between -13.687 and 1.767'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ hint?: string }} */ (result).hint).toBe(
        'A National Grid field number is made up of 2 letters and 8 numbers, for example, NG 1234 5678'
      )
    })

    it('should replace hint text when switching between any location field types', () => {
      const payload = {
        questionType: ComponentType.LatLongField,
        question: 'Coordinates',
        name: 'coordinates',
        hintText: 'For example. Easting: 248741, Northing: 63688'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ hint?: string }} */ (result).hint).toBe(
        'For Great Britain, the latitude will be a number between 49.850 and 60.859. The longitude will be a number between -13.687 and 1.767'
      )
    })

    it('should not apply default hint for non-location fields', () => {
      const payload = {
        questionType: ComponentType.TextField,
        question: 'Name',
        name: 'name'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ hint?: string }} */ (result).hint).toBeUndefined()
    })

    it('should include additional options when provided', () => {
      const payload = {
        questionType: ComponentType.TextField,
        question: 'Test',
        name: 'test',
        classes: 'custom-class',
        prefix: '£',
        suffix: 'per item'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(result.options).toEqual({
        required: true,
        classes: 'custom-class',
        prefix: '£',
        suffix: 'per item'
      })
    })

    it('should include additional schema when provided', () => {
      const payload = {
        questionType: ComponentType.TextField,
        question: 'Test',
        name: 'test',
        minLength: '5',
        maxLength: '100'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ schema?: object }} */ (result).schema).toEqual({
        min: '5',
        max: '100'
      })
    })

    it('should include list when provided', () => {
      const payload = {
        questionType: ComponentType.AutocompleteField,
        question: 'Test',
        name: 'test',
        list: 'myList'
      }

      const result = mapBaseQuestionDetails(payload)

      expect(/** @type {{ list?: string }} */ (result).list).toBe('myList')
    })
  })

  describe('mapFileUploadQuestionDetails', () => {
    it('should map file upload payload correctly', () => {
      const result = mapFileUploadQuestionDetails({
        questionType: ComponentType.FileUploadField,
        question: 'Upload document',
        name: 'document'
      })

      expect(result.type).toBe(ComponentType.FileUploadField)
      expect(result.title).toBe('Upload document')
      expect(result.name).toBe('document')
    })
  })

  describe('mapListComponentFromPayload', () => {
    it('should map list component with list property', () => {
      const payload = {
        questionType: ComponentType.AutocompleteField,
        question: 'Select option',
        name: 'option',
        list: 'optionList'
      }

      const result = mapListComponentFromPayload(payload)

      expect(/** @type {{ list?: string }} */ (result).list).toBe('optionList')
      expect(result.title).toBe('Select option')
    })

    it('should default list to empty string if not provided', () => {
      const payload = {
        questionType: ComponentType.AutocompleteField,
        question: 'Select option',
        name: 'option'
      }

      const result = mapListComponentFromPayload(payload)

      expect(/** @type {{ list?: string }} */ (result).list).toBe('')
    })
  })

  describe('mapQuestionDetails', () => {
    it('should use mapFileUploadQuestionDetails for FileUploadField', () => {
      const payload = {
        questionType: ComponentType.FileUploadField,
        question: 'Upload',
        name: 'upload'
      }

      const result = mapQuestionDetails(payload)

      expect(result.type).toBe(ComponentType.FileUploadField)
    })

    it('should use mapListComponentFromPayload for list component types', () => {
      const payload = {
        questionType: ComponentType.AutocompleteField,
        question: 'Select',
        name: 'select',
        list: 'myList'
      }

      const result = mapQuestionDetails(payload)

      expect(/** @type {{ list?: string }} */ (result).list).toBe('myList')
    })

    it('should use mapBaseQuestionDetails for other component types', () => {
      const payload = {
        questionType: ComponentType.TextField,
        question: 'Name',
        name: 'name'
      }

      const result = mapQuestionDetails(payload)

      expect(result.type).toBe(ComponentType.TextField)
      expect(result.title).toBe('Name')
    })

    it('should use mapBaseQuestionDetails for location fields', () => {
      const payload = {
        questionType: ComponentType.EastingNorthingField,
        question: 'Location',
        name: 'location'
      }

      const result = mapQuestionDetails(payload)

      expect(result.type).toBe(ComponentType.EastingNorthingField)
      expect(/** @type {{ hint?: string }} */ (result).hint).toBeUndefined()
    })
  })
})
