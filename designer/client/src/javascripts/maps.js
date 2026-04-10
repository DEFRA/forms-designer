import {
  geospatialMap,
  map as mapImports
} from '@defra/forms-engine-plugin/shared.js'

const { createMap, defaultMapConfig } = mapImports
const {
  addFeatureToMap,
  createFeaturesHTML,
  getBoundingBox,
  getGeoJSON,
  focusFeature
} = geospatialMap

/**
 * Factory clousure to create the map ready callback with access to the map provider, geojson and list element
 * @param {any} mapProvider - the map provider instance
 * @param {GeoJSON} geojson - the geojson data
 * @param {HTMLDivElement} listEl - the list element to render the features list into
 * @param {any} drawPlugin - the map draw plugin instance
 * @param {any} map - the initialised map instance
 * @param {string} mapId - the map id string
 */
function onMapReadyFactory(
  mapProvider,
  geojson,
  listEl,
  drawPlugin,
  map,
  mapId
) {
  /**
   * Callback function which fires when the draw plugin is ready
   */
  return function () {
    const { features } = geojson

    // Add all features to the map
    features.forEach((feature) => addFeatureToMap(feature, drawPlugin, map))

    // Create the list (in readonly mode)
    listEl.innerHTML = createFeaturesHTML(features, mapId, false, true)

    // Listen to anchor click events to focus features
    listEl.addEventListener(
      'click',
      function (e) {
        const target = e.target

        if (!(target instanceof HTMLElement)) {
          return
        }

        if (
          target.tagName === 'A' &&
          target.dataset.action &&
          target.dataset.id
        ) {
          const { action, id } = target.dataset
          const feature = geojson.features.find((f) => f.id === id)

          if (action === 'focus' && feature) {
            focusFeature(feature, mapProvider)
          }
        }
      },
      false
    )
  }
}

/**
 * Process a geospatial component preview by rendering the map and features, and setting up event listeners
 * @param {Element} preview
 * @param {number} index
 */
function processPreview(preview, index) {
  // @ts-expect-error - Defra namespace currently comes from UMD support files
  const defra = window.defra

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

  map.on(
    'map:ready',
    /**
     * Callback function which fires when the map is ready
     * @param {object} e - the event
     * @param {any} e.map - the map provider instance
     */
    function onMapReady({ map: mapProvider }) {
      map.on(
        'draw:ready',
        onMapReadyFactory(mapProvider, geojson, listEl, drawPlugin, map, mapId)
      )
    }
  )
}

/**
 * Processes all geospatial component previews on the page by rendering maps and features, and setting up event listeners
 */
export function processMapPreview() {
  const previews = document.querySelectorAll('.app-geospatial-field--preview')

  previews.forEach(processPreview)
}

processMapPreview()

/**
 * @import { FeatureCollection } from '@defra/forms-engine-plugin/engine/types.js'
 */

/**
 * @typedef {object} GeoJSON
 * @property {'FeatureCollection'} type - the GeoJSON type string
 * @property {FeatureCollection} features - the features
 */
