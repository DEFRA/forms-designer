import { ComponentType } from '@defra/forms-model'

import {
  getDefaultLocationHint,
  locationHintDefaults
} from '~/src/models/forms/editor-v2/location-hint-defaults.js'

describe('location-hint-defaults', () => {
  describe('locationHintDefaults', () => {
    it('should have hint defaults for all location field types', () => {
      expect(locationHintDefaults.EastingNorthingField).toBe(
        'For example. Easting: 248741, Northing: 63688'
      )
      expect(locationHintDefaults.OsGridRefField).toBe(
        'An OS grid reference number is made up of 2 letters followed by either 6, 8 or 10 numbers, for example, TQ123456'
      )
      expect(locationHintDefaults.NationalGridFieldNumberField).toBe(
        'A National Grid field number is made up of 2 letters and 8 numbers, for example, SO04188589'
      )
      expect(locationHintDefaults.LatLongField).toBe(
        'For Great Britain, the latitude will be a number between 49.850 and 60.859. The longitude will be a number between -13.687 and 1.767'
      )
    })
  })

  describe('getDefaultLocationHint', () => {
    it('should return correct hint for EastingNorthingField', () => {
      const hint = getDefaultLocationHint(ComponentType.EastingNorthingField)
      expect(hint).toBe('For example. Easting: 248741, Northing: 63688')
    })

    it('should return correct hint for OsGridRefField', () => {
      const hint = getDefaultLocationHint(ComponentType.OsGridRefField)
      expect(hint).toBe(
        'An OS grid reference number is made up of 2 letters followed by either 6, 8 or 10 numbers, for example, TQ123456'
      )
    })

    it('should return correct hint for NationalGridFieldNumberField', () => {
      const hint = getDefaultLocationHint(
        ComponentType.NationalGridFieldNumberField
      )
      expect(hint).toBe(
        'A National Grid field number is made up of 2 letters and 8 numbers, for example, SO04188589'
      )
    })

    it('should return correct hint for LatLongField', () => {
      const hint = getDefaultLocationHint(ComponentType.LatLongField)
      expect(hint).toBe(
        'For Great Britain, the latitude will be a number between 49.850 and 60.859. The longitude will be a number between -13.687 and 1.767'
      )
    })

    it('should handle invalid field type', () => {
      const hint = getDefaultLocationHint('InvalidFieldType')
      expect(hint).toBeUndefined()
    })
  })
})
