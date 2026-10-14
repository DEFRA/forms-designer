import { ComponentType } from '@defra/forms-model'

/**
 * Location field component types
 * @type {ComponentType[]}
 */
export const LOCATION_FIELD_TYPES = [
  ComponentType.EastingNorthingField,
  ComponentType.OsGridRefField,
  ComponentType.NationalGridFieldNumberField,
  ComponentType.LatLongField
]

/**
 * Check if a component type is a location field
 * @param {ComponentType | undefined} componentType
 * @returns {boolean}
 */
export function isLocationFieldType(componentType) {
  if (!componentType) {
    return false
  }
  return LOCATION_FIELD_TYPES.includes(componentType)
}
