/**
 * Mock for `@defra/interactive-map/plugins/draw-ml`.
 *
 * The real package ships a UMD bundle that throws "Automatic publicPath is not
 * supported in this browser" when loaded under jsdom, so it cannot be imported
 * in tests. This stand-in routes the default draw-ml plugin factory through
 * `globalThis.interactiveMapMocks.drawMLPlugin` so tests can supply their own
 * plugin instance, mirroring how the `InteractiveMap` constructor is routed in
 * `interactive-map.cjs`.
 *
 * It needs to be a distinct mock (rather than the shared `interactive-map.cjs`)
 * so the draw-ml factory can be asserted independently of the other plugin and
 * provider factories the forms-engine-plugin map modules instantiate.
 * @param {...any} args
 */
function drawMLPluginMock(...args) {
  const factory = /** @type {any} */ (globalThis).interactiveMapMocks
    ?.drawMLPlugin

  if (!factory) {
    throw new Error(
      'globalThis.interactiveMapMocks.drawMLPlugin has not been configured'
    )
  }

  return factory(...args)
}

module.exports = drawMLPluginMock
