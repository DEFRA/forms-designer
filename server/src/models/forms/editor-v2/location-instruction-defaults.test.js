import { ComponentType } from '@defra/forms-model'

import {
  getDefaultLocationInstructions,
  locationInstructionDefaults
} from '~/src/models/forms/editor-v2/location-instruction-defaults.js'

describe('location-instruction-defaults', () => {
  describe('locationInstructionDefaults', () => {
    const expectedSteps = [
      '1. Search for a place or postcode.',
      '2. Use the + and - icons to zoom in and out.',
      '3. Use a mouse or keyboard to centre the point at the location.',
      '4. Click to add the location to the map.'
    ]

    it.each([
      ['EastingNorthingField'],
      ['OsGridRefField'],
      ['NationalGridFieldNumberField'],
      ['LatLongField']
    ])('should have the 4-step map instructions for %s', (fieldType) => {
      const instructions =
        locationInstructionDefaults[
          /** @type {keyof typeof locationInstructionDefaults} */ (fieldType)
        ]

      for (const step of expectedSteps) {
        expect(instructions).toContain(step)
      }
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
