import { processMapPreview } from '~/src/javascripts/maps.js'

describe('Maps Client JS', () => {
  /** @type {jest.Mock} */
  let onMock

  /** @type {jest.Mock} */
  let addMarkerMock

  /** @type {jest.Mock} */
  let interactPlugin

  /** @type {jest.Mock} */
  let drawMLPlugin

  /** @type {jest.Mock} */
  let drawPluginAddFeature

  /** @type {jest.Mock} */
  let fitBoundsMock

  /** @type {any} */
  let mapProvider

  beforeEach(() => {
    jest.resetAllMocks()

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noop = () => {}
    onMock = jest.fn()
    addMarkerMock = jest.fn()
    fitBoundsMock = jest.fn()
    mapProvider = {
      fitBounds: fitBoundsMock
    }
    drawPluginAddFeature = jest.fn()
    interactPlugin = jest.fn()
    drawMLPlugin = jest.fn(() => ({
      addFeature: drawPluginAddFeature
    }))

    class MockInteractiveMap {
      on = onMock
      addMarker = addMarkerMock
    }

    // @ts-expect-error - loaded via UMD
    window.defra = {
      InteractiveMap: MockInteractiveMap,
      maplibreProvider: noop,
      openNamesProvider: noop,
      mapStylesPlugin: noop,
      interactPlugin,
      searchPlugin: noop,
      zoomControlsPlugin: noop,
      scaleBarPlugin: noop,
      drawMLPlugin
    }
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('Geospatial component', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="app-geospatial-field--preview">
          <div id="map_0">
            <textarea class="govuk-textarea" id="data_0" readonly>[{"id":"5e7fb59c-e9bf-49df-a1fc-46833aa6ff4b","type":"Feature","properties":{"description":"s","coordinateGridReference":"SK 07539 43333","centroidGridReference":"SK 22238 54636"},"geometry":{"coordinates":[[[-1.8891381,52.987284],[-1.4386986,53.0797763],[-1.6803979,53.1984038],[-1.8891381,52.987284]]],"type":"Polygon"}},{"type":"Feature","properties":{"description":"p","coordinateGridReference":"SE 05990 03286","centroidGridReference":"SE 05990 03286"},"geometry":{"type":"Point","coordinates":[-1.9111107,53.5262079]},"id":"ae717bbb-011c-4d73-a60d-a73399c8475c"},{"id":"2ea88bee-73da-43c3-9fc7-e75d07615020","type":"Feature","properties":{"description":"l","coordinateGridReference":"SK 83223 60207","centroidGridReference":"SK 83476 87718"},"geometry":{"coordinates":[[-0.7575463,53.1325401],[-0.5707787,53.4739286],[-0.9113549,53.5327382]],"type":"LineString"}}]</textarea>
          </div>
          <div id="list_0">
          </div>
        </div>
      `
    })

    /**
     * Initialise geospatial maps preview helper
     */
    function initialiseGeospatialMapsPreview() {
      expect(() => processMapPreview()).not.toThrow()
      expect(drawMLPlugin).toHaveBeenCalledTimes(1)
      expect(onMock).toHaveBeenCalledTimes(1)
      expect(onMock).toHaveBeenNthCalledWith(
        1,
        'map:ready',
        expect.any(Function)
      )

      const onMapReady = onMock.mock.calls[0][1]
      expect(typeof onMapReady).toBe('function')

      // Manually invoke onMapReady callback
      onMapReady({ map: mapProvider })

      expect(onMock).toHaveBeenCalledTimes(2)
      expect(onMock).toHaveBeenNthCalledWith(
        2,
        'draw:ready',
        expect.any(Function)
      )

      const onDrawReady = onMock.mock.calls[1][1]
      expect(typeof onDrawReady).toBe('function')

      // Manually invoke onDrawReady callback
      onDrawReady()

      const listContainer = document.body.querySelector('#list_0')

      if (listContainer === null) {
        throw new Error('Unexpected null found for listContainer')
      }

      expect(listContainer).toBeDefined()

      return {
        listContainer: /** @type {HTMLDivElement} */ (listContainer)
      }
    }

    describe('Map preview initialisation', () => {
      test('processMapPreview initializes without errors when DOM elements are present', () => {
        const { listContainer } = initialiseGeospatialMapsPreview()
        expect(listContainer).toBeDefined()
      })

      test('click on show link focuses the correct feature', () => {
        const { listContainer } = initialiseGeospatialMapsPreview()
        expect(listContainer).toBeDefined()

        const showLinks = listContainer.querySelectorAll(
          '.govuk-link.govuk-link--no-visited-state[data-action="focus"]'
        )
        expect(showLinks).toHaveLength(3)

        // Simulate click on the first "Show" link
        showLinks[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))

        expect(fitBoundsMock).toHaveBeenCalledTimes(1)
      })
    })
  })
})
