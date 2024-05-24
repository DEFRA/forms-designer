export function toUrl(title) {
  return `/${(title?.replace(/[^a-zA-Z0-9- ]/g, '') ?? '')
    .trim()
    .replace(/ +/g, '-')
    .toLowerCase()}`
}

export function camelCase(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[\s-_]+(.)/g, (m, chr) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')
}

/**
 * @param {string | number} [str]
 */
export function isEmpty(str = '') {
  return `${str}`.trim().length < 1
}

export function arrayMove(arr, from, to) {
  const elm = arr.splice(from, 1)[0]
  arr.splice(to, 0, elm)
  return arr
}
