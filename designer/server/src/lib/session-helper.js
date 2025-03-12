/**
 * @param {Yar} yar
 * @param {string} key
 */
export function getFlashFromSession(yar, key) {
  const sessionVal = /** @type { string[] | undefined } */ (yar.flash(key))
  return /** @type { string | undefined } */ (sessionVal?.at(0))
}

/**
 * @param {Yar} yar
 * @param {string} key
 * @param {string} value
 */
export function setFlashInSession(yar, key, value) {
  yar.flash(key, value)
}

/**
 * @import { Yar } from '@hapi/yar'
 */
