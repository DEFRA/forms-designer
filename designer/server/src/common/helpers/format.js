/**
 * Formats an array of items into a grammatically correct list
 * @param {string[]} items
 */
export function formatList(items) {
  if (items.length === 0) {
    return ''
  }

  if (items.length === 1) {
    return items[0]
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`
  }

  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}
