import { render } from '~/src/common/nunjucks/index.js'

/**
 * Render Nunjucks macro into DOM
 * @param {Parameters<typeof render.macro>} args
 */
export function renderMacro(...args) {
  return renderDOM(render.macro(...args))
}

/**
 * Render Nunjucks view into DOM
 * @param {Parameters<typeof render.view>} args
 */
export function renderView(...args) {
  return renderDOM(render.view(...args))
}

/**
 * Render HTTP response
 * @param {Server} server
 * @param {ServerInjectOptions} options
 */
export async function renderResponse(server, options) {
  const response = /** @type {ServerInjectResponse<string>} */ (
    await server.inject(options)
  )

  const { document } = renderDOM(response.result)

  return { response, document }
}

/**
 * Render DOM
 * @param {string} [html]
 */
export function renderDOM(html = '') {
  const { window } = globalThis.$jsdom

  // Update the document body
  window.document.body.innerHTML = html

  return window
}

/**
 * @import { Server, ServerInjectOptions, ServerInjectResponse } from '@hapi/hapi'
 */
