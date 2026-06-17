/**
 * Mock for `@defra/interactive-map` and its subpath exports.
 *
 * The real package ships a UMD bundle that throws "Automatic publicPath is not
 * supported in this browser" when loaded under jsdom, so it cannot be imported
 * in tests. This stand-in covers every shape the forms-engine-plugin map
 * modules import:
 *  - the default `InteractiveMap` constructor (routed through `window.defra`
 *    so tests can supply their own instance)
 *  - the default plugin/provider factories (interact, map-styles, draw-ml,
 *    datasets, maplibre provider) as harmless stubs
 *  - the named `maplibreLayerAdapter` adapter export
 * @this {unknown}
 * @param {...any} args
 */
function interactiveMapMock(...args) {
  // Called as a plugin/provider factory (no `new`) - return a stub
  if (!(this instanceof interactiveMapMock)) {
    return {}
  }

  // Called as `new InteractiveMap(...)` - delegate to the test-provided mock
  const Mock = /** @type {any} */ (globalThis.window).defra?.InteractiveMap

  if (!Mock) {
    throw new Error('window.defra.InteractiveMap mock has not been configured')
  }

  return new Mock(...args)
}

interactiveMapMock.maplibreLayerAdapter = {}

module.exports = interactiveMapMock
