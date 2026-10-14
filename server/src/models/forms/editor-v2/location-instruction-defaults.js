/**
 * Default instruction texts for precise location field types
 */

const defaultLocationInstructions = `Follow these instructions:

1. Search for a place or postcode.
2. Use the + and - icons to zoom in and out.
3. Use a mouse or keyboard to centre the point at the location.
4. Click to add the location to the map.`

export const locationInstructionDefaults = {
  EastingNorthingField: defaultLocationInstructions,
  OsGridRefField: defaultLocationInstructions,
  NationalGridFieldNumberField: defaultLocationInstructions,
  LatLongField: defaultLocationInstructions
}

/**
 * Gets the default instruction text for a given location field type
 * @param {string} fieldType - The component type
 * @returns {string} The default instruction text
 */
export function getDefaultLocationInstructions(fieldType) {
  return (
    locationInstructionDefaults[
      /** @type {keyof typeof locationInstructionDefaults} */ (fieldType)
    ] || ''
  )
}
