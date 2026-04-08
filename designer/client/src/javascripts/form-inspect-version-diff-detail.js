/**
 * @typedef {{ type: 'added' | 'removed' | 'unchanged', text: string }} DiffLine
 */

/**
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * @param {unknown} v
 * @returns {v is Record<string, unknown>}
 */
function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

/**
 * Renders a value (and all its children) with every line marked as the given type.
 * @param {unknown} val
 * @param {number} depth
 * @param {string | null} key
 * @param {boolean} isLast
 * @param {'added' | 'removed' | 'unchanged'} type
 * @param {DiffLine[]} lines
 */
function renderValue(val, depth, key, isLast, type, lines) {
  const indent = '  '.repeat(depth)
  const keyPart = key !== null ? `${JSON.stringify(key)}: ` : ''
  const comma = isLast ? '' : ','

  if (val === null || typeof val !== 'object') {
    lines.push({
      type,
      text: `${indent}${keyPart}${JSON.stringify(val)}${comma}`
    })
    return
  }

  if (Array.isArray(val)) {
    if (val.length === 0) {
      lines.push({ type, text: `${indent}${keyPart}[]${comma}` })
      return
    }
    lines.push({ type, text: `${indent}${keyPart}[` })
    for (let i = 0; i < val.length; i++) {
      renderValue(val[i], depth + 1, null, i === val.length - 1, type, lines)
    }
    lines.push({ type, text: `${indent}]${comma}` })
    return
  }

  const keys = Object.keys(/** @type {Record<string, unknown>} */ (val))
  if (keys.length === 0) {
    lines.push({ type, text: `${indent}${keyPart}{}${comma}` })
    return
  }
  lines.push({ type, text: `${indent}${keyPart}{` })
  for (let i = 0; i < keys.length; i++) {
    renderValue(
      /** @type {Record<string, unknown>} */ (val)[keys[i]],
      depth + 1,
      keys[i],
      i === keys.length - 1,
      type,
      lines
    )
  }
  lines.push({ type, text: `${indent}}${comma}` })
}

/**
 * Recursively computes a semantic diff between two JSON values and appends
 * DiffLine entries to `lines`.
 * @param {unknown} a
 * @param {unknown} b
 * @param {number} depth
 * @param {string | null} key
 * @param {boolean} isLast
 * @param {DiffLine[]} lines
 */
function diffNode(a, b, depth, key, isLast, lines) {
  const indent = '  '.repeat(depth)
  const keyPart = key !== null ? `${JSON.stringify(key)}: ` : ''
  const comma = isLast ? '' : ','

  if (deepEqual(a, b)) {
    renderValue(a, depth, key, isLast, 'unchanged', lines)
    return
  }

  if (a === undefined) {
    renderValue(b, depth, key, isLast, 'added', lines)
    return
  }

  if (b === undefined) {
    renderValue(a, depth, key, isLast, 'removed', lines)
    return
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const aObj = /** @type {Record<string, unknown>} */ (a)
    const bObj = /** @type {Record<string, unknown>} */ (b)
    const allKeys = [...new Set([...Object.keys(aObj), ...Object.keys(bObj)])]
    lines.push({ type: 'unchanged', text: `${indent}${keyPart}{` })
    for (let i = 0; i < allKeys.length; i++) {
      diffNode(
        aObj[allKeys[i]],
        bObj[allKeys[i]],
        depth + 1,
        allKeys[i],
        i === allKeys.length - 1,
        lines
      )
    }
    lines.push({ type: 'unchanged', text: `${indent}}${comma}` })
    return
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLen = Math.max(a.length, b.length)
    lines.push({ type: 'unchanged', text: `${indent}${keyPart}[` })
    for (let i = 0; i < maxLen; i++) {
      const isLastElem = i === maxLen - 1
      if (i >= a.length) {
        renderValue(b[i], depth + 1, null, isLastElem, 'added', lines)
      } else if (i >= b.length) {
        renderValue(a[i], depth + 1, null, isLastElem, 'removed', lines)
      } else {
        diffNode(a[i], b[i], depth + 1, null, isLastElem, lines)
      }
    }
    lines.push({ type: 'unchanged', text: `${indent}]${comma}` })
    return
  }

  // Different types or different primitives — show as remove then add
  renderValue(a, depth, key, false, 'removed', lines)
  renderValue(b, depth, key, isLast, 'added', lines)
}

/**
 * Computes the full diff between two JSON objects.
 * @param {unknown} a
 * @param {unknown} b
 * @returns {DiffLine[]}
 */
export function computeJsonDiff(a, b) {
  const lines = /** @type {DiffLine[]} */ ([])
  diffNode(a, b, 0, null, true, lines)
  return lines
}

/**
 * Renders the diff into a container element.
 * @param {Element | null} container
 * @param {unknown} objA
 * @param {unknown} objB
 */
export function renderVersionDiff(container, objA, objB) {
  if (!container) return

  const lines = computeJsonDiff(objA, objB)

  const added = lines.filter((l) => l.type === 'added').length
  const removed = lines.filter((l) => l.type === 'removed').length

  const summary = document.createElement('p')
  summary.className = 'govuk-body govuk-!-margin-bottom-2'
  summary.innerHTML =
    `<strong class="diff-summary-added">+${added} added</strong> &nbsp; ` +
    `<strong class="diff-summary-removed">-${removed} removed</strong>`
  container.appendChild(summary)

  const pre = document.createElement('pre')
  pre.className = 'json-diff-block'

  for (const line of lines) {
    const span = document.createElement('span')
    span.className = `diff-line diff-line--${line.type}`
    const prefix =
      line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '
    span.textContent = prefix + line.text
    pre.appendChild(span)
  }

  container.appendChild(pre)
}
