const lib = /** @type {tabbableActual} */ (jest.requireActual('tabbable'))

/**
 * @type {typeof lib["tabbable"]}
 */
export const tabbable = (node, options) =>
  lib.tabbable(node, { ...options, displayCheck: 'none' })

/**
 * @type {typeof lib["focusable"]}
 */
export const focusable = (node, options) =>
  lib.focusable(node, { ...options, displayCheck: 'none' })

/**
 * @type {typeof lib["isFocusable"]}
 */
export const isFocusable = (node, options) =>
  lib.isFocusable(node, { ...options, displayCheck: 'none' })

/**
 * @type {typeof lib["isTabbable"]}
 */
export const isTabbable = (node, options) =>
  lib.isTabbable(node, { ...options, displayCheck: 'none' })

export default tabbable

/**
 * @import tabbableActual from 'tabbable'
 */
