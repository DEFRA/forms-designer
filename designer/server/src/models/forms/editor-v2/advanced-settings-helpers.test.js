import { ComponentType } from '@defra/forms-model'

import {
  getAdditionalOptions,
  getAdditionalSchema,
  isValueOrZero,
  mapExtraRootFields
} from '~/src/models/forms/editor-v2/advanced-settings-helpers.js'

describe('advanced-settings-helpers', () => {
  describe('getAdditionalOptions', () => {
    it('should return empty object when no options provided', () => {
      const result = getAdditionalOptions({})
      expect(result).toEqual({})
    })

    it('should include classes when provided', () => {
      const result = getAdditionalOptions({ classes: 'custom-class' })
      expect(result).toEqual({ classes: 'custom-class' })
    })

    it('should include rows when provided', () => {
      const result = getAdditionalOptions({ rows: '10' })
      expect(result).toEqual({ rows: '10' })
    })

    it('should include prefix when provided', () => {
      const result = getAdditionalOptions({ prefix: '£' })
      expect(result).toEqual({ prefix: '£' })
    })

    it('should include suffix when provided', () => {
      const result = getAdditionalOptions({ suffix: ' per item' })
      expect(result).toEqual({ suffix: ' per item' })
    })

    it('should map maxFuture to maxDaysInFuture', () => {
      const result = getAdditionalOptions({ maxFuture: '30' })
      expect(result).toEqual({ maxDaysInFuture: '30' })
    })

    it('should map maxPast to maxDaysInPast', () => {
      const result = getAdditionalOptions({ maxPast: '60' })
      expect(result).toEqual({ maxDaysInPast: '60' })
    })

    it('should convert usePostcodeLookup to boolean', () => {
      const result = getAdditionalOptions({ usePostcodeLookup: 'true' })
      expect(result).toEqual({ usePostcodeLookup: true })
    })

    it('should include instructionText when giveInstructions is checked and text provided', () => {
      const result = getAdditionalOptions({
        giveInstructions: 'true',
        instructionText: 'Follow these steps'
      })
      expect(result).toEqual({ instructionText: 'Follow these steps' })
    })

    it('should not include instructionText when giveInstructions is not checked', () => {
      const result = getAdditionalOptions({
        giveInstructions: 'false',
        instructionText: 'Follow these steps'
      })
      expect(result).toEqual({})
    })

    it('should not include instructionText when giveInstructions is checked but text not provided', () => {
      const result = getAdditionalOptions({
        giveInstructions: 'true',
        instructionText: ''
      })
      expect(result).toEqual({})
    })

    it('should not include instructionText when giveInstructions is not provided', () => {
      const result = getAdditionalOptions({
        instructionText: 'Follow these steps'
      })
      expect(result).toEqual({})
    })

    it('should combine multiple options', () => {
      const result = getAdditionalOptions({
        classes: 'custom-class',
        prefix: '£',
        suffix: ' per item',
        maxFuture: '30',
        maxPast: '60',
        usePostcodeLookup: 'true',
        giveInstructions: 'true',
        instructionText: 'Follow these steps'
      })

      expect(result).toEqual({
        classes: 'custom-class',
        prefix: '£',
        suffix: ' per item',
        maxDaysInFuture: '30',
        maxDaysInPast: '60',
        usePostcodeLookup: true,
        instructionText: 'Follow these steps'
      })
    })

    it('should not include instruction text when switching from OsGridRefField to EastingNorthingField with default instruction', () => {
      const result = getAdditionalOptions({
        questionType: ComponentType.EastingNorthingField,
        giveInstructions: 'true',
        instructionText:
          "Use the [MAGIC map tool](https://magic.defra.gov.uk/) to find the Easting and Northing for your land or buildings. Follow these instructions:\n\n  1. Select 'Get Started'.\n  2. Search for a postcode or place.\n  3. Using the map, locate the land or building. Use the +/- icons to zoom in and out.\n  4. In the top toolbar, select the fourth icon along ('Where am I?') - it looks like a target.\n  5. Click on the land or building.\n  6. A pop-up box will appear showing the land details for this location. Easting and Northing appear at the top of the list. They are made up of 6 digits each, for example, 248741 and 63688."
      })

      // Should not include instructionText as it matches EastingNorthingField default
      expect(result).toEqual({})
    })

    it('should not include instruction text when switching between location fields with default instruction', () => {
      const result = getAdditionalOptions({
        questionType: ComponentType.LatLongField,
        giveInstructions: 'true',
        instructionText:
          "Use the [MAGIC map tool](https://magic.defra.gov.uk/) to find the latitude and longitude for your land or buildings. Follow these instructions:\n\n  1. Select 'Get Started'.\n  2. Search for a postcode or place.\n  3. Using the map, locate the land or building. Use the +/- icons to zoom in and out.\n  4. In the top toolbar, select the fourth icon along ('Where am I?') - it looks like a target.\n  5. Click on the land or building.\n  6. A pop-up box will appear showing the land details for this location. The latitude and longitude are four numbers down from the top of the list."
      })

      // Should not include instructionText as it matches LatLongField default
      expect(result).toEqual({})
    })

    it('should include custom instruction text for location fields', () => {
      const result = getAdditionalOptions({
        questionType: ComponentType.EastingNorthingField,
        giveInstructions: 'true',
        instructionText: 'Custom location instructions that user wrote'
      })

      expect(result).toEqual({
        instructionText: 'Custom location instructions that user wrote'
      })
    })

    it('should include instruction text for non-location fields even if it matches a location default', () => {
      const result = getAdditionalOptions({
        questionType: ComponentType.TextField,
        giveInstructions: 'true',
        instructionText:
          'Use the [MAGIC map tool](https://magic.defra.gov.uk/) to find the OS grid reference for your land or buildings. Follow these instructions:'
      })

      // For non-location fields, always include the instruction text
      expect(result).toEqual({
        instructionText:
          'Use the [MAGIC map tool](https://magic.defra.gov.uk/) to find the OS grid reference for your land or buildings. Follow these instructions:'
      })
    })
  })

  describe('isValueOrZero', () => {
    it('should return undefined for undefined value', () => {
      expect(isValueOrZero(undefined)).toBeUndefined()
    })

    it('should return has-value for zero string', () => {
      expect(isValueOrZero('0')).toBe('has-value')
    })

    it('should return has-value for positive number string', () => {
      expect(isValueOrZero('1')).toBe('has-value')
    })

    it('should return has-value for negative number string', () => {
      expect(isValueOrZero('-1')).toBe('has-value')
    })

    it('should return has-value for empty string', () => {
      expect(isValueOrZero('')).toBe('has-value')
    })
  })

  describe('getAdditionalSchema', () => {
    it('should return empty object when no schema properties provided', () => {
      const result = getAdditionalSchema({})
      expect(result).toEqual({})
    })

    it('should map minLength to min', () => {
      const result = getAdditionalSchema({ minLength: '5' })
      expect(result).toEqual({ min: '5' })
    })

    it('should map maxLength to max', () => {
      const result = getAdditionalSchema({ maxLength: '100' })
      expect(result).toEqual({ max: '100' })
    })

    it('should map min/max for numbers', () => {
      const result = getAdditionalSchema({ min: '0', max: '10' })
      expect(result).toEqual({ min: '0', max: '10' })
    })

    it('should map minFiles to min', () => {
      const result = getAdditionalSchema({ minFiles: '1' })
      expect(result).toEqual({ min: '1' })
    })

    it('should map maxFiles to max', () => {
      const result = getAdditionalSchema({ maxFiles: '5' })
      expect(result).toEqual({ max: '5' })
    })

    it('should map exactFiles to length', () => {
      const result = getAdditionalSchema({ exactFiles: '3' })
      expect(result).toEqual({ length: '3' })
    })

    it('should include regex when provided', () => {
      const result = getAdditionalSchema({ regex: '^[A-Z]{2}[0-9]{4}$' })
      expect(result).toEqual({ regex: '^[A-Z]{2}[0-9]{4}$' })
    })

    it('should include precision when provided', () => {
      const result = getAdditionalSchema({ precision: '2' })
      expect(result).toEqual({ precision: '2' })
    })

    it('should handle zero precision', () => {
      const result = getAdditionalSchema({ precision: '0' })
      expect(result).toEqual({ precision: '0' })
    })

    it('should prioritize minLength over min', () => {
      const result = getAdditionalSchema({ minLength: '5', min: '1' })
      expect(/** @type {{ min?: string }} */ (result).min).toBe('5')
    })

    it('should prioritize maxLength over max', () => {
      const result = getAdditionalSchema({ maxLength: '100', max: '50' })
      expect(/** @type {{ max?: string }} */ (result).max).toBe('100')
    })

    it('should combine multiple schema properties', () => {
      const result = getAdditionalSchema({
        minLength: '5',
        maxLength: '100',
        regex: '^[A-Z]+$',
        precision: '2'
      })

      expect(result).toEqual({
        min: '5',
        max: '100',
        regex: '^[A-Z]+$',
        precision: '2'
      })
    })
  })

  describe('mapExtraRootFields', () => {
    it('should return empty object when no list provided', () => {
      const result = mapExtraRootFields({})
      expect(result).toEqual({})
    })

    it('should include list when provided', () => {
      const result = mapExtraRootFields({ list: 'myList' })
      expect(result).toEqual({ list: 'myList' })
    })

    it('should include content when declaration', () => {
      const result = mapExtraRootFields({
        declarationText: 'My declaration text'
      })
      expect(result).toEqual({ content: 'My declaration text' })
    })

    it('should not include other properties', () => {
      const result = mapExtraRootFields({
        list: 'myList',
        name: 'test',
        question: 'Test question'
      })
      expect(result).toEqual({ list: 'myList' })
    })
  })
})
