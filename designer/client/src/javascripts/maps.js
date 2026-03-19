import { geospatialMap, map } from '@defra/forms-engine-plugin/shared.js'

const { createMap, defaultMapConfig } = map
const { addFeatureToMap, createFeaturesHTML, getBoundingBox, getGeoJSON } =
  geospatialMap
const previews = document.querySelectorAll('.app-geospatial-field--preview')

// @ts-expect-error - Defra namespace currently comes from UMD support files
const defra = window.defra

previews.forEach((preview, index) => {
  const mapId = `map_${index}`
  const geospatialInput = preview.querySelector('.govuk-textarea')

  if (!(geospatialInput instanceof HTMLTextAreaElement)) {
    return
  }

  const listEl = preview.querySelector(`#list_${index}`)
  if (!(listEl instanceof HTMLDivElement)) {
    return
  }

  /**
   * @type {GeoJSON}
   */
  const geojson = getGeoJSON(geospatialInput)
  const bounds = geojson.features.length ? getBoundingBox(geojson) : undefined
  const drawPlugin = defra.drawMLPlugin()

  const initConfig = {
    ...defaultMapConfig,
    bounds,
    plugins: [drawPlugin]
  }

  const { map } = createMap(mapId, initConfig, {
    assetPath: '/assets',
    apiPath: '/maps/api',
    data: {
      VTS_OUTDOOR_URL: '/maps/api/maps/vts/OS_VTS_3857_Outdoor.json',
      VTS_DARK_URL: '/maps/api/maps/vts/OS_VTS_3857_Dark.json',
      VTS_BLACK_AND_WHITE_URL:
        '/maps/api/maps/vts/OS_VTS_3857_Black_and_White.json'
    }
  })

  map.on('draw:ready', function () {
    const { features } = geojson
    features.forEach((feature) => addFeatureToMap(feature, drawPlugin, map))
    listEl.innerHTML = createFeaturesHTML(features, mapId, true)
  })
})

/**
 * @import { FeatureCollection } from '@defra/forms-engine-plugin/engine/types.js'
 */

/**
 * @typedef {object} GeoJSON
 * @property {'FeatureCollection'} type - the GeoJSON type string
 * @property {FeatureCollection} features - the features
 */
