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
    test.each([
      ComponentType.EastingNorthingField,
      ComponentType.OsGridRefField,
      ComponentType.NationalGridFieldNumberField,
      ComponentType.LatLongField
    ])('should return true for %s', (componentType) => {
      expect(isLocationFieldType(componentType)).toBe(true)
    })

    test.each([
      ComponentType.TextField,
      ComponentType.NumberField,
      ComponentType.UkAddressField
    ])('should return false for %s', (componentType) => {
      expect(isLocationFieldType(componentType)).toBe(false)
    })

    test.each([
      ['undefined', undefined],
      [
        'null',
        /** @type {ComponentType | undefined} */ (/** @type {unknown} */ (null))
      ],
      [
        'empty string',
        /** @type {ComponentType | undefined} */ (/** @type {unknown} */ (''))
      ],
      [
        'invalid component type',
        /** @type {ComponentType | undefined} */ (
          /** @type {unknown} */ ('InvalidType')
        )
      ]
    ])('should return false for %s', (_, value) => {
      expect(isLocationFieldType(value)).toBe(false)
    })
  })
})
