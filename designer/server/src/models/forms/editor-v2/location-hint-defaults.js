/**
 * Default hint texts for precise location field types
 */

export const locationHintDefaults = {
  EastingNorthingField: 'For example. Easting: 248741, Northing: 63688',

  OsGridRefField:
    'An OS grid reference number is made up of 2 letters and 6 numbers, for example, SO041885',

  NationalGridFieldNumberField:
    'A National Grid field number is made up of 2 letters followed by 8 numbers or 10 numbers, for example, SO7394301364',

  LatLongField:
    'For Great Britain, the latitude will be a number between 49.850 and 60.859. The longitude will be a number between -13.687 and 1.767'
}

/**
 * Gets the default hint text for a given location field type
 * @param {string} fieldType - The component type
 * @returns {string} The default hint text
 */
export function getDefaultLocationHint(fieldType) {
  return locationHintDefaults[
    /** @type {keyof typeof locationHintDefaults} */ (fieldType)
  ]
}
