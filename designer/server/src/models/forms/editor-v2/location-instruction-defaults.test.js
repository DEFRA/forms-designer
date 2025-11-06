import { ComponentType } from '@defra/forms-model'

import {
  getDefaultLocationInstructions,
  locationInstructionDefaults
} from '~/src/models/forms/editor-v2/location-instruction-defaults.js'

describe('location-instruction-defaults', () => {
  describe('locationInstructionDefaults', () => {
    it('should have instruction defaults for EastingNorthingField', () => {
      expect(locationInstructionDefaults.EastingNorthingField).toContain(
        'Use the [MAGIC map tool](https://magic.defra.gov.uk/)'
      )
      expect(locationInstructionDefaults.EastingNorthingField).toContain(
        'Easting and Northing'
      )
    })

    it('should have instruction defaults for OsGridRefField', () => {
      expect(locationInstructionDefaults.OsGridRefField).toContain(
        'Use the [Ordnance Survey](https://explore.osmaps.com/)'
      )
      expect(locationInstructionDefaults.OsGridRefField).toContain(
        'OS grid reference'
      )
    })

    it('should have instruction defaults for NationalGridFieldNumberField', () => {
      expect(
        locationInstructionDefaults.NationalGridFieldNumberField
      ).toContain('Use the [MAGIC map tool](https://magic.defra.gov.uk/)')
      expect(
        locationInstructionDefaults.NationalGridFieldNumberField
      ).toContain('National Grid field number')
    })

    it('should have instruction defaults for LatLongField', () => {
      expect(locationInstructionDefaults.LatLongField).toContain(
        'Use the [MAGIC map tool](https://magic.defra.gov.uk/)'
      )
      expect(locationInstructionDefaults.LatLongField).toContain(
        'latitude and longitude'
      )
    })
  })

  describe('getDefaultLocationInstructions', () => {
    it('should return correct instructions for EastingNorthingField', () => {
      const instructions = getDefaultLocationInstructions(
        ComponentType.EastingNorthingField
      )
      expect(instructions).toBe(
        locationInstructionDefaults.EastingNorthingField
      )
    })

    it('should return correct instructions for OsGridRefField', () => {
      const instructions = getDefaultLocationInstructions(
        ComponentType.OsGridRefField
      )
      expect(instructions).toBe(locationInstructionDefaults.OsGridRefField)
    })

    it('should return correct instructions for NationalGridFieldNumberField', () => {
      const instructions = getDefaultLocationInstructions(
        ComponentType.NationalGridFieldNumberField
      )
      expect(instructions).toBe(
        locationInstructionDefaults.NationalGridFieldNumberField
      )
    })

    it('should return correct instructions for LatLongField', () => {
      const instructions = getDefaultLocationInstructions(
        ComponentType.LatLongField
      )
      expect(instructions).toBe(locationInstructionDefaults.LatLongField)
    })

    it('should return empty string for invalid field type', () => {
      const instructions = getDefaultLocationInstructions('InvalidFieldType')
      expect(instructions).toBe('')
    })

    it('should return empty string for undefined field type', () => {
      const instructions = getDefaultLocationInstructions(
        /** @type {string} */ (/** @type {unknown} */ (undefined))
      )
      expect(instructions).toBe('')
    })
  })
})
