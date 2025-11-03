import { ComponentType } from '@defra/forms-model'
import { describe, expect, test } from '@jest/globals'

import {
  LOCATION_FIELD_TYPES,
  isLocationFieldType
} from '~/src/common/constants/component-types.js'

describe('component-types constants', () => {
  describe('LOCATION_FIELD_TYPES', () => {
    test('should contain all location field types', () => {
      expect(LOCATION_FIELD_TYPES).toEqual([
        ComponentType.EastingNorthingField,
        ComponentType.OsGridRefField,
        ComponentType.NationalGridFieldNumberField,
        ComponentType.LatLongField
      ])
    })

    test('should have exactly 4 location types', () => {
      expect(LOCATION_FIELD_TYPES).toHaveLength(4)
    })
  })

  describe('isLocationFieldType', () => {
    test('should return true for EastingNorthingField', () => {
      expect(isLocationFieldType(ComponentType.EastingNorthingField)).toBe(true)
    })

    test('should return true for OsGridRefField', () => {
      expect(isLocationFieldType(ComponentType.OsGridRefField)).toBe(true)
    })

    test('should return true for NationalGridFieldNumberField', () => {
      expect(
        isLocationFieldType(ComponentType.NationalGridFieldNumberField)
      ).toBe(true)
    })

    test('should return true for LatLongField', () => {
      expect(isLocationFieldType(ComponentType.LatLongField)).toBe(true)
    })

    test('should return false for TextField', () => {
      expect(isLocationFieldType(ComponentType.TextField)).toBe(false)
    })

    test('should return false for NumberField', () => {
      expect(isLocationFieldType(ComponentType.NumberField)).toBe(false)
    })

    test('should return false for UkAddressField', () => {
      expect(isLocationFieldType(ComponentType.UkAddressField)).toBe(false)
    })

    test('should return false for undefined', () => {
      expect(isLocationFieldType(undefined)).toBe(false)
    })

    test('should return false for null', () => {
      expect(
        isLocationFieldType(
          /** @type {ComponentType | undefined} */ (
            /** @type {unknown} */ (null)
          )
        )
      ).toBe(false)
    })

    test('should return false for empty string', () => {
      expect(
        isLocationFieldType(
          /** @type {ComponentType | undefined} */ (/** @type {unknown} */ (''))
        )
      ).toBe(false)
    })

    test('should return false for invalid component type', () => {
      expect(
        isLocationFieldType(
          /** @type {ComponentType | undefined} */ (
            /** @type {unknown} */ ('InvalidType')
          )
        )
      ).toBe(false)
    })
  })
})
