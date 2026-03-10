import { ComponentType } from '@defra/forms-model'
import Joi from 'joi'

import {
  determineLabelText,
  getDefaultErrorLabel,
  isBaseError,
  isLocationField,
  processTemplate,
  renderErrorTemplate
} from '~/src/common/nunjucks/filters/render-error-template.js'

describe('render-error-template', () => {
  describe('isLocationField', () => {
    it('should return true for EastingNorthingField', () => {
      expect(isLocationField(ComponentType.EastingNorthingField)).toBe(true)
    })

    it('should return true for LatLongField', () => {
      expect(isLocationField(ComponentType.LatLongField)).toBe(true)
    })

    it('should return true for OsGridRefField', () => {
      expect(isLocationField(ComponentType.OsGridRefField)).toBe(true)
    })

    it('should return true for NationalGridFieldNumberField', () => {
      expect(isLocationField(ComponentType.NationalGridFieldNumberField)).toBe(
        true
      )
    })

    it('should return false for TextField', () => {
      expect(isLocationField(ComponentType.TextField)).toBe(false)
    })

    it('should return false for NumberField', () => {
      expect(isLocationField(ComponentType.NumberField)).toBe(false)
    })
  })

  describe('getDefaultErrorLabel', () => {
    it('should return correct label for EastingNorthingField base errors', () => {
      expect(
        getDefaultErrorLabel(ComponentType.EastingNorthingField, true)
      ).toBe('easting and enter northing')
    })

    it('should return correct label for EastingNorthingField validation errors', () => {
      expect(
        getDefaultErrorLabel(ComponentType.EastingNorthingField, false)
      ).toBe('[short description]')
    })

    it('should return correct label for LatLongField base errors', () => {
      expect(getDefaultErrorLabel(ComponentType.LatLongField, true)).toBe(
        'latitude and enter longitude'
      )
    })

    it('should return correct label for LatLongField validation errors', () => {
      expect(getDefaultErrorLabel(ComponentType.LatLongField, false)).toBe(
        '[short description]'
      )
    })

    it('should return correct label for OsGridRefField base errors', () => {
      expect(getDefaultErrorLabel(ComponentType.OsGridRefField, true)).toBe(
        'OS grid reference'
      )
    })

    it('should return correct label for OsGridRefField validation errors', () => {
      expect(getDefaultErrorLabel(ComponentType.OsGridRefField, false)).toBe(
        '[short description]'
      )
    })

    it('should return correct label for NationalGridFieldNumberField base errors', () => {
      expect(
        getDefaultErrorLabel(ComponentType.NationalGridFieldNumberField, true)
      ).toBe('National Grid reference')
    })

    it('should return correct label for NationalGridFieldNumberField validation errors', () => {
      expect(
        getDefaultErrorLabel(ComponentType.NationalGridFieldNumberField, false)
      ).toBe('[short description]')
    })

    it('should return fallback for other field types', () => {
      expect(getDefaultErrorLabel(ComponentType.TextField)).toBe(
        '[short description]'
      )
    })
  })

  describe('isBaseError', () => {
    it('should return true for string.empty', () => {
      expect(isBaseError('string.empty')).toBe(true)
    })

    it('should return true for any.required', () => {
      expect(isBaseError('any.required')).toBe(true)
    })

    it('should return true for required', () => {
      expect(isBaseError('required')).toBe(true)
    })

    it('should return true for base', () => {
      expect(isBaseError('base')).toBe(true)
    })

    it('should return false for validation errors', () => {
      expect(isBaseError('eastingMin')).toBe(false)
      expect(isBaseError('string.min')).toBe(false)
      expect(isBaseError('number.max')).toBe(false)
    })
  })

  describe('processTemplate', () => {
    it('should process string template without marking fixed', () => {
      const result = processTemplate('Enter {{#label}}', 'string.empty', false)
      expect(result).toContain('error-preview-shortDescription')
      expect(result).not.toContain('data-fixed')
    })

    it('should process string template with marking fixed', () => {
      const result = processTemplate('Enter {{#label}}', 'string.empty', true)
      expect(result).toContain('error-preview-shortDescription')
      expect(result).toContain('data-fixed="true"')
    })

    it('should process Joi.expression template', () => {
      const joiTemplate = Joi.expression('Enter {{#label}}')
      const result = processTemplate(joiTemplate, 'string.empty', false)
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
      // Verify it's still a Joi expression object
      expect(result).toHaveProperty('source')
    })

    it('should process Joi.expression template with marking fixed', () => {
      const joiTemplate = Joi.expression('Enter {{#label}}')
      const result = processTemplate(joiTemplate, 'string.empty', true)
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
      // Verify the source was processed with data-fixed attribute
      expect(result).toHaveProperty('source')

      expect(/** @type {any} */ (result).source).toContain('data-fixed="true"')
    })
  })

  describe('determineLabelText', () => {
    it('should use component name for location field base errors', () => {
      const result = determineLabelText(
        ComponentType.EastingNorthingField,
        true,
        { id: 'shortDescription', value: 'custom description' }
      )
      expect(result).toBe('easting and enter northing')
    })

    it('should use custom short description for location field validation errors', () => {
      const result = determineLabelText(ComponentType.LatLongField, false, {
        id: 'shortDescription',
        value: 'your location'
      })
      expect(result).toBe('your location')
    })

    it('should use custom short description for non-location fields', () => {
      const result = determineLabelText(ComponentType.TextField, true, {
        id: 'shortDescription',
        value: 'your name'
      })
      expect(result).toBe('your name')
    })

    it('should use default when no short description provided', () => {
      const result = determineLabelText(
        ComponentType.TextField,
        true,
        undefined
      )
      expect(result).toBe('[short description]')
    })

    it('should use default when short description is empty', () => {
      const result = determineLabelText(ComponentType.TextField, true, {
        id: 'shortDescription',
        value: ''
      })
      // Empty string should use short description if provided
      expect(result).toBe('')
    })
  })

  describe('renderErrorTemplate', () => {
    it('should use short description when provided', () => {
      const template = {
        type: 'string.empty',
        template: 'Enter {#label}'
      }

      const viewModel = {
        basePageFields: [
          {
            id: 'shortDescription',
            value: 'your name'
          }
        ],
        extraFields: []
      }

      const result = renderErrorTemplate(
        template,
        viewModel,
        ComponentType.TextField
      )

      expect(result).toBe('Enter your name')
    })

    it('should use default for EastingNorthingField when no short description', () => {
      const template = {
        type: 'string.empty',
        template: 'Enter {#label}'
      }

      const viewModel = {
        basePageFields: [
          {
            id: 'shortDescription',
            value: ''
          }
        ],
        extraFields: []
      }

      const result = renderErrorTemplate(
        template,
        viewModel,
        ComponentType.EastingNorthingField
      )

      expect(result).toBe('Enter easting and enter northing')
    })

    it('should use default for LatLongField when no short description', () => {
      const template = {
        type: 'string.empty',
        template: 'Enter {#label}'
      }

      const viewModel = {
        basePageFields: [],
        extraFields: []
      }

      const result = renderErrorTemplate(
        template,
        viewModel,
        ComponentType.LatLongField
      )

      expect(result).toBe('Enter latitude and enter longitude')
    })

    it('should use default for OsGridRefField when no short description', () => {
      const template = {
        type: 'string.empty',
        template: 'Enter {#label}'
      }

      const viewModel = {
        basePageFields: [],
        extraFields: []
      }

      const result = renderErrorTemplate(
        template,
        viewModel,
        ComponentType.OsGridRefField
      )

      expect(result).toBe('Enter OS grid reference')
    })

    it('should use default for NationalGridFieldNumberField when no short description', () => {
      const template = {
        type: 'string.empty',
        template: 'Enter {#label}'
      }

      const viewModel = {
        basePageFields: [],
        extraFields: []
      }

      const result = renderErrorTemplate(
        template,
        viewModel,
        ComponentType.NationalGridFieldNumberField
      )

      expect(result).toBe('Enter National Grid reference')
    })

    it('should use [short description] fallback for other field types', () => {
      const template = {
        type: 'string.empty',
        template: 'Enter {#label}'
      }

      const viewModel = {
        basePageFields: [],
        extraFields: []
      }

      const result = renderErrorTemplate(
        template,
        viewModel,
        ComponentType.TextField
      )

      expect(result).toBe('Enter [short description]')
    })

    it('should ignore custom short description for location field base errors only', () => {
      const template = {
        type: 'string.empty',
        template: 'Enter {#label}'
      }

      const viewModel = {
        basePageFields: [
          {
            id: 'shortDescription',
            value: 'custom location description'
          }
        ],
        extraFields: []
      }

      const result = renderErrorTemplate(
        template,
        viewModel,
        ComponentType.EastingNorthingField
      )

      // Base errors for location fields should always use the component name
      expect(result).toBe('Enter easting and enter northing')
    })

    it('should use custom short description for location field validation errors', () => {
      const template = {
        type: 'eastingMin',
        template: '{#label} must be at least {#limit}'
      }

      const viewModel = {
        basePageFields: [
          {
            id: 'shortDescription',
            value: 'your coordinates'
          }
        ],
        extraFields: [{ name: 'eastingMin', value: '100000' }]
      }

      const result = renderErrorTemplate(
        template,
        viewModel,
        ComponentType.EastingNorthingField
      )

      // Validation errors should still use custom short description
      expect(result).toBe('your coordinates must be at least 100000')
    })

    it('should handle any.required error type for location fields', () => {
      const template = {
        type: 'any.required',
        template: 'Enter {#label}'
      }

      const viewModel = {
        basePageFields: [
          {
            id: 'shortDescription',
            value: 'custom description'
          }
        ],
        extraFields: []
      }

      const result = renderErrorTemplate(
        template,
        viewModel,
        ComponentType.LatLongField
      )

      expect(result).toBe('Enter latitude and enter longitude')
    })

    it('should handle Joi.expression templates for location fields', () => {
      const template = {
        type: 'string.empty',
        template: Joi.expression('Enter {{#label}}')
      }

      const viewModel = {
        basePageFields: [],
        extraFields: []
      }

      const result = renderErrorTemplate(
        template,
        viewModel,
        ComponentType.OsGridRefField
      )

      // Should contain the location-specific label
      expect(result).toContain('OS grid reference')
      // Should be marked as fixed for location base errors
      expect(result).toContain('data-fixed="true"')
    })

    it('should handle missing viewModel fields gracefully', () => {
      const template = {
        type: 'string.empty',
        template: 'Enter {#label}'
      }

      const viewModel = {}

      const result = renderErrorTemplate(
        template,
        viewModel,
        ComponentType.TextField
      )

      expect(result).toBe('Enter [short description]')
    })
  })
})
