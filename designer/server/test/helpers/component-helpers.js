import { JSDOM } from 'jsdom'

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
  const { result } = await serverResponse(server, options)
  return renderDOM(result)
}

/**
 * HTTP response
 * @param {Server} server
 * @param {ServerInjectOptions} options
 * @returns {Promise<ServerInjectResponse>}
 */
export async function serverResponse(server, options) {
  return await server.inject(options)
}

/**
 * Render DOM
 * @param {string | Buffer} [html]
 */
export function renderDOM(html) {
  return new JSDOM(html).window
}

/**
 * @typedef {import('@hapi/hapi').Server} Server
 * @typedef {import('@hapi/hapi').ServerInjectOptions} ServerInjectOptions
 * @typedef {import('@hapi/hapi').ServerInjectResponse<string>} ServerInjectResponse
 */
