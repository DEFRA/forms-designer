import {
  computeJsonDiff,
  renderVersionDiff
} from '~/src/javascripts/form-inspect-version-diff-detail'

describe('computeJsonDiff', () => {
  test('returns all unchanged lines for identical objects', () => {
    const obj = { name: 'Test', pages: [] }
    const lines = computeJsonDiff(obj, obj)
    expect(lines.every((l) => l.type === 'unchanged')).toBe(true)
  })

  test('marks a changed primitive value as removed then added', () => {
    const a = { name: 'Old' }
    const b = { name: 'New' }
    const lines = computeJsonDiff(a, b)
    const removed = lines.filter((l) => l.type === 'removed')
    const added = lines.filter((l) => l.type === 'added')
    expect(removed.some((l) => l.text.includes('"Old"'))).toBe(true)
    expect(added.some((l) => l.text.includes('"New"'))).toBe(true)
  })

  test('marks a new key as added', () => {
    const a = { name: 'Test' }
    const b = { name: 'Test', extra: 'value' }
    const lines = computeJsonDiff(a, b)
    const added = lines.filter((l) => l.type === 'added')
    expect(added.some((l) => l.text.includes('"extra"'))).toBe(true)
  })

  test('marks a removed key as removed', () => {
    const a = { name: 'Test', extra: 'value' }
    const b = { name: 'Test' }
    const lines = computeJsonDiff(a, b)
    const removed = lines.filter((l) => l.type === 'removed')
    expect(removed.some((l) => l.text.includes('"extra"'))).toBe(true)
  })

  test('recurses into nested objects', () => {
    const a = { meta: { title: 'Old title' } }
    const b = { meta: { title: 'New title' } }
    const lines = computeJsonDiff(a, b)
    const removed = lines.filter((l) => l.type === 'removed')
    const added = lines.filter((l) => l.type === 'added')
    expect(removed.some((l) => l.text.includes('"Old title"'))).toBe(true)
    expect(added.some((l) => l.text.includes('"New title"'))).toBe(true)
    // The outer key "meta" should appear as unchanged context
    expect(
      lines.some((l) => l.type === 'unchanged' && l.text.includes('"meta"'))
    ).toBe(true)
  })

  test('handles added array elements', () => {
    const a = { pages: [{ path: '/a' }] }
    const b = { pages: [{ path: '/a' }, { path: '/b' }] }
    const lines = computeJsonDiff(a, b)
    const added = lines.filter((l) => l.type === 'added')
    expect(added.some((l) => l.text.includes('"/b"'))).toBe(true)
  })

  test('handles removed array elements', () => {
    const a = { pages: [{ path: '/a' }, { path: '/b' }] }
    const b = { pages: [{ path: '/a' }] }
    const lines = computeJsonDiff(a, b)
    const removed = lines.filter((l) => l.type === 'removed')
    expect(removed.some((l) => l.text.includes('"/b"'))).toBe(true)
  })

  test('handles null values', () => {
    const a = { value: null }
    const b = { value: null }
    const lines = computeJsonDiff(a, b)
    expect(lines.every((l) => l.type === 'unchanged')).toBe(true)
  })

  test('handles type changes (object to primitive)', () => {
    const a = { value: { nested: true } }
    const b = { value: 'string now' }
    const lines = computeJsonDiff(a, b)
    const removed = lines.filter((l) => l.type === 'removed')
    const added = lines.filter((l) => l.type === 'added')
    expect(removed.length).toBeGreaterThan(0)
    expect(added.some((l) => l.text.includes('"string now"'))).toBe(true)
  })
})

describe('renderVersionDiff', () => {
  test('renders a pre element into the container', () => {
    document.body.innerHTML = '<div id="output"></div>'
    const container = document.getElementById('output')
    renderVersionDiff(container, { name: 'v1' }, { name: 'v2' })
    expect(container?.querySelector('pre.json-diff-block')).not.toBeNull()
  })

  test('renders added/removed summary counts', () => {
    document.body.innerHTML = '<div id="output"></div>'
    const container = document.getElementById('output')
    renderVersionDiff(container, { name: 'v1' }, { name: 'v2' })
    const summary = container?.querySelector('p')
    expect(summary?.textContent).toContain('+')
    expect(summary?.textContent).toContain('-')
  })

  test('does nothing when container is null', () => {
    expect(() => renderVersionDiff(null, {}, {})).not.toThrow()
  })

  test('diff lines have correct class names', () => {
    document.body.innerHTML = '<div id="output"></div>'
    const container = document.getElementById('output')
    renderVersionDiff(container, { a: 1 }, { a: 2 })
    const pre = container?.querySelector('pre')
    expect(pre?.querySelector('.diff-line--removed')).not.toBeNull()
    expect(pre?.querySelector('.diff-line--added')).not.toBeNull()
  })
})
