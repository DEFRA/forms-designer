import { LocationPreviewElements } from '~/src/form/form-editor/__stubs__/preview.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import {
  createFieldClasses,
  createLocationFieldModel
} from '~/src/form/form-editor/preview/location-helpers.js'

describe('location-helpers', () => {
  describe('createLocationFieldModel', () => {
    it('should create location field model with all properties', () => {
      const baseModel = {
        id: 'test-field',
        name: 'testField',
        classes: ''
      }

      const htmlElements = new LocationPreviewElements({
        question: 'What is your location?',
        userClasses: 'custom-class',
        hintText: '',
        optional: false,
        shortDesc: '',
        content: '',
        instructionText: 'Enter your precise location',
        items: []
      })

      const highlight = 'question'
      const instructionText = 'Enter your precise location'

      const result = createLocationFieldModel(
        baseModel,
        htmlElements,
        highlight,
        instructionText
      )

      expect(result).toEqual({
        id: 'test-field',
        name: 'testField',
        classes: '',
        userClasses: 'custom-class',
        fieldset: {
          legend: {
            text: 'What is your location?',
            classes: HIGHLIGHT_CLASS
          }
        },
        instructionText: 'Enter your precise location',
        details: {
          classes: ''
        }
      })
    })

    it('should use default question text when not provided', () => {
      const baseModel = {
        id: 'test-field',
        name: 'testField',
        classes: ''
      }

      const htmlElements = new LocationPreviewElements({
        question: '',
        userClasses: '',
        hintText: '',
        optional: false,
        shortDesc: '',
        content: '',
        instructionText: 'Instruction',
        items: []
      })

      const result = createLocationFieldModel(
        baseModel,
        htmlElements,
        null,
        'Instruction'
      )

      expect(result.fieldset.legend.text).toBe('Question')
    })

    it('should highlight instructionText when specified', () => {
      const baseModel = {
        id: 'test-field',
        name: 'testField',
        classes: ''
      }

      const htmlElements = new LocationPreviewElements({
        question: 'Location question',
        userClasses: '',
        hintText: '',
        optional: false,
        shortDesc: '',
        content: '',
        instructionText: 'Instructions here',
        items: []
      })

      const result = createLocationFieldModel(
        baseModel,
        htmlElements,
        'instructionText',
        'Instructions here'
      )

      expect(result.details.classes).toBe(HIGHLIGHT_CLASS)
      expect(result.fieldset.legend.classes).toBe('')
    })

    it('should not highlight when highlight is null', () => {
      const baseModel = {
        id: 'test-field',
        name: 'testField',
        classes: ''
      }

      const htmlElements = new LocationPreviewElements({
        question: 'Location question',
        userClasses: '',
        hintText: '',
        optional: false,
        shortDesc: '',
        content: '',
        instructionText: 'Instructions',
        items: []
      })

      const result = createLocationFieldModel(
        baseModel,
        htmlElements,
        null,
        'Instructions'
      )

      expect(result.fieldset.legend.classes).toBe('')
      expect(result.details.classes).toBe('')
    })
  })

  describe('createFieldClasses', () => {
    it('should return highlight class when field matches highlight', () => {
      const result = createFieldClasses('easting', 'easting')
      expect(result).toEqual({
        classes: HIGHLIGHT_CLASS
      })
    })

    it('should return empty class when field does not match highlight', () => {
      const result = createFieldClasses('easting', 'northing')
      expect(result).toEqual({
        classes: ''
      })
    })

    it('should return empty class when highlight is null', () => {
      const result = createFieldClasses('latitude', null)
      expect(result).toEqual({
        classes: ''
      })
    })

    it('should work with different field names', () => {
      expect(createFieldClasses('latitude', 'latitude')).toEqual({
        classes: HIGHLIGHT_CLASS
      })
      expect(createFieldClasses('longitude', 'longitude')).toEqual({
        classes: HIGHLIGHT_CLASS
      })
      expect(createFieldClasses('northing', 'northing')).toEqual({
        classes: HIGHLIGHT_CLASS
      })
    })
  })
})
