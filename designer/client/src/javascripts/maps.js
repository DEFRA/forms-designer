import {
  geospatialMap,
  locationMap,
  map as mapImports,
  sssiDataset
} from '@defra/forms-engine-plugin/maps'
// @ts-expect-error - no types
import createDatasetsPlugin from '@defra/interactive-map/plugins/datasets'
// @ts-expect-error - no types
import createDrawMLPlugin from '@defra/interactive-map/plugins/draw-ml'

const {
  createMap,
  defaultConfig: defaultMapConfig,
  getMapLayers,
  getMapCountryLayers
} = mapImports
const {
  addFeatureToMap,
  createFeaturesHTML,
  getBoundingBox,
  getGeoJSON,
  focusFeature
} = geospatialMap
const { getInitMapConfig } = locationMap

const mapsEnvConfig = {
  assetPath: '/assets',
  apiPath: '/maps/api',
  data: {
    VTS_OUTDOOR_URL: '/maps/api/maps/vts/OS_VTS_3857_Outdoor.json',
    VTS_DARK_URL: '/maps/api/maps/vts/OS_VTS_3857_Dark.json',
    VTS_BLACK_AND_WHITE_URL:
      '/maps/api/maps/vts/OS_VTS_3857_Black_and_White.json',
    VTS_AERIAL_URL: '/maps/api/maps/vts/esri-aerial.json'
  }
}

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
 * @param {HTMLDivElement} preview
 * @param {number} index
 */
function processGeospatialPreview(preview, index) {
  const mapId = `map_${index}`
  const geospatialInput = /** @type {HTMLTextAreaElement} */ (
    preview.querySelector('.govuk-textarea')
  )
  const listEl = /** @type {HTMLDivElement} */ (
    preview.querySelector(`#list_${index}`)
  )

  /**
   * @type {GeoJSON}
   */
  const geojson = getGeoJSON(geospatialInput)
  const bounds = geojson.features.length ? getBoundingBox(geojson) : undefined
  const drawPlugin = createDrawMLPlugin()
  const plugins = [drawPlugin]
  const mapLayers = getMapLayers(geospatialInput.dataset.maplayers)
  const datasets = []

  if (mapLayers.includes('sssi')) {
    datasets.push(...sssiDataset.default)
  }

  if (datasets.length) {
    plugins.push(createDatasetsPlugin({ datasets }))
  }

  const initConfig = {
    ...defaultMapConfig,
    bounds,
    plugins
  }

  const result = createMap(mapId, initConfig, mapsEnvConfig)
  const { map } = result

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

  return result
}

/**
 * Process a location component preview by rendering the map
 * @param {HTMLDivElement} preview
 * @param {number} index
 */
function processLocationPreview(preview, index) {
  const mapId = `map_${index}`
  const initConfig = getInitMapConfig(preview) ?? defaultMapConfig
  const country = preview.dataset.country
  const mapLayers = getMapLayers(preview.dataset.maplayers)
  const datasets = getMapCountryLayers('/maps/api', country)

  if (mapLayers.includes('sssi')) {
    datasets.push(...sssiDataset.default)
  }

  // Create a map dataset plugin if there are any present
  if (datasets.length) {
    initConfig.plugins = [createDatasetsPlugin({ datasets })]
  }

  return createMap(mapId, initConfig, mapsEnvConfig)
}

/**
 * Processes all geospatial component previews on the page by rendering maps and features, and setting up event listeners
 */
export function processMapPreview() {
  /**
   * @type {NodeListOf<HTMLDivElement>} - the geospatial field previews
   */
  const geospatialPreviews = document.querySelectorAll(
    '.app-geospatial-field--preview'
  )
  /**
   * @type {{ map: mapImports.InteractiveMap; interactPlugin: any }[]} - the geospatial field preview results
   */
  const geospatialResults = []
  geospatialPreviews.forEach((preview, index) => {
    geospatialResults.push(processGeospatialPreview(preview, index))
  })

  /**
   * @type {NodeListOf<HTMLDivElement>} - the location field previews
   */
  const locationPreviews = document.querySelectorAll(
    '.app-location-field--preview'
  )
  /**
   * @type {{ map: mapImports.InteractiveMap; interactPlugin: any }[]} - the location field preview results
   */
  const locationResults = []
  locationPreviews.forEach((preview, index) => {
    locationResults.push(processLocationPreview(preview, index))
  })

  return {
    geospatial: { geospatialPreviews, geospatialResults },
    location: { locationPreviews, locationResults }
  }
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
