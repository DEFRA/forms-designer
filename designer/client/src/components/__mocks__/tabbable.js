const lib = jest.requireActual('tabbable')

/**
 * @type {typeof import('tabbable')["tabbable"]}
 */
export const tabbable = (node, options) =>
  lib.tabbable(node, { ...options, displayCheck: 'none' })

/**
 * @type {typeof import('tabbable')["focusable"]}
 */
export const focusable = (node, options) =>
  lib.focusable(node, { ...options, displayCheck: 'none' })

/**
 * @type {typeof import('tabbable')["isFocusable"]}
 */
export const isFocusable = (node, options) =>
  lib.isFocusable(node, { ...options, displayCheck: 'none' })

/**
 * @type {typeof import('tabbable')["isTabbable"]}
 */
export const isTabbable = (node, options) =>
  lib.isTabbable(node, { ...options, displayCheck: 'none' })

export default tabbable
