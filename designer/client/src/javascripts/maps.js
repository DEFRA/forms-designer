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

export function processMapPreview() {
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
          /**
           * Callback function which fires when the draw plugin is ready
           */
          function () {
            const { features } = geojson

            // Add all features to the map
            features.forEach((feature) =>
              addFeatureToMap(feature, drawPlugin, map)
            )

            // Create the list (in readonly mode)
            listEl.innerHTML = createFeaturesHTML(features, mapId, true)

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
        )
      }
    )
  })
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
