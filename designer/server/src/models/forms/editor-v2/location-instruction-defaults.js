/**
 * Default instruction texts for precise location field types
 */

export const locationInstructionDefaults = {
  EastingNorthingField: `Use the [MAGIC map tool](https://magic.defra.gov.uk/) to find the Easting and Northing for your land or buildings. Follow these instructions:

  1. Select 'Get Started'.
  2. Search for a postcode or place.
  3. Using the map, locate the land or building. Use the +/- icons to zoom in and out.
  4. In the top toolbar, select the fourth icon along ('Where am I?') - it looks like a target.
  5. Click on the land or building.
  6. A pop-up box will appear showing the land details for this location. Easting and Northing appear at the top of the list. Easting can be up to 6 digits (0-700000) and Northing up to 7 digits (0-1300000), for example, 248741 and 63688.`,

  OsGridRefField: `Use the [Ordnance Survey](https://explore.osmaps.com/). Follow these instructions:

1. Search for a county, place or postcode.
2. Using the map, locate the field or building. Use the +/- icons to zoom in and out.
3. Right click on each individual building or field to find the OS grid reference.`,

  NationalGridFieldNumberField: `Use the [MAGIC map tool](https://magic.defra.gov.uk/) to find the National Grid field number for your land or buildings. Follow these instructions:

  1. Select 'Get Started'.
  2. Search for a postcode or place.
  3. Using the map, locate the land or building. Use the +/- icons to zoom in and out.
  4. In the top toolbar, select the fourth icon along ('Where am I?') - it looks like a target.
  5. Click on the land or building.
  6. A pop-up box will appear showing the land details for this location. The National Grid field number is the third number from the top of the list. It is made up of 2 letters and 8 numbers, for example, SO04188589.`,

  LatLongField: `Use the [MAGIC map tool](https://magic.defra.gov.uk/) to find the latitude and longitude for your land or buildings. Follow these instructions:

  1. Select 'Get Started'.
  2. Search for a postcode or place.
  3. Using the map, locate the land or building. Use the +/- icons to zoom in and out.
  4. In the top toolbar, select the fourth icon along ('Where am I?') - it looks like a target.
  5. Click on the land or building.
  6. A pop-up box will appear showing the land details for this location. The latitude and longitude are four numbers down from the top of the list.`
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
