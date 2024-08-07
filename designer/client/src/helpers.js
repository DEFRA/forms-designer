/**
 * @param {string} [title]
 */
export function toUrl(title) {
  return `/${(title?.replace(/[^a-zA-Z0-9- ]/g, '') ?? '')
    .trim()
    .replace(/ +/g, '-')
    .toLowerCase()}`
}

/**
 * @param {string} str
 */
export function camelCase(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(
      /[\s-_]+(.)/g,

      /**
       * @param {string} m
       * @param {string} chr
       */
      (m, chr) => chr.toUpperCase()
    )
    .replace(/[^a-zA-Z0-9]/g, '')
}

/**
 * @param {string | number} [str]
 * @returns {str is '' | null | undefined}
 */
export function isEmpty(str = '') {
  return `${str}`.trim().length < 1
}

/**
 * @param {string} [str]
 */
export function hasSpaces(str = '') {
  return /\s/g.test(str)
}

/**
 * @template {unknown[]} ArrayType
 * @param {ArrayType} arr
 * @param {number} from
 * @param {number} to
 */
export function arrayMove(arr, from, to) {
  const elm = arr.splice(from, 1)[0]
  arr.splice(to, 0, elm)
  return arr
}
