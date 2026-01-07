import { buildPaginationPages } from '~/src/common/pagination/index.js'

describe('buildPaginationPages', () => {
  const createHref = (pageNumber: number) => `/test?page=${pageNumber}`

  it('returns single page when totalPages is 1', () => {
    const result = buildPaginationPages(1, 1, createHref)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      number: '1',
      href: '/test?page=1',
      current: true
    })
  })

  it('returns first and last pages for 2 pages total', () => {
    const result = buildPaginationPages(1, 2, createHref)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      number: '1',
      href: '/test?page=1',
      current: true
    })
    expect(result[1]).toEqual({
      number: '2',
      href: '/test?page=2',
      current: false
    })
  })

  it('marks the correct page as current', () => {
    const result = buildPaginationPages(3, 5, createHref)

    const page3 = result.find((p) => p.number === '3')
    expect(page3?.current).toBe(true)

    const page1 = result.find((p) => p.number === '1')
    expect(page1?.current).toBe(false)
  })

  it('shows adjacent pages around current page', () => {
    const result = buildPaginationPages(5, 10, createHref)

    const pageNumbers = result
      .filter((p) => p.number)
      .map((p) => parseInt(p.number ?? '0', 10))

    expect(pageNumbers).toContain(4) // one before current
    expect(pageNumbers).toContain(5) // current
    expect(pageNumbers).toContain(6) // one after current
  })

  it('always includes first page', () => {
    const result = buildPaginationPages(8, 10, createHref)

    const page1 = result.find((p) => p.number === '1')
    expect(page1).toBeDefined()
  })

  it('always includes last page when totalPages > 1', () => {
    const result = buildPaginationPages(2, 10, createHref)

    const page10 = result.find((p) => p.number === '10')
    expect(page10).toBeDefined()
  })

  it('includes ellipsis when there are gaps after first page', () => {
    const result = buildPaginationPages(7, 10, createHref)

    // First page, then ellipsis
    expect(result[0].number).toBe('1')
    expect(result[1].ellipsis).toBe(true)
  })

  it('includes ellipsis when there are gaps before last page', () => {
    const result = buildPaginationPages(3, 10, createHref)

    // Find the index of page 10 (last page)
    const lastPageIndex = result.findIndex((p) => p.number === '10')
    // The item before the last page should be an ellipsis
    expect(result[lastPageIndex - 1].ellipsis).toBe(true)
  })

  it('does not add ellipsis when pages are adjacent', () => {
    const result = buildPaginationPages(2, 3, createHref)

    const hasEllipsis = result.some((p) => p.ellipsis === true)
    expect(hasEllipsis).toBe(false)
  })

  it('does not add ellipsis for small page counts', () => {
    const result = buildPaginationPages(2, 4, createHref)

    const hasEllipsis = result.some((p) => p.ellipsis === true)
    expect(hasEllipsis).toBe(false)
  })

  it('adds both ellipses when current page is in the middle', () => {
    const result = buildPaginationPages(5, 10, createHref)

    const ellipsisCount = result.filter((p) => p.ellipsis === true).length
    expect(ellipsisCount).toBe(2)
  })

  it('uses the provided createHref function', () => {
    const customHref = (pageNumber: number) =>
      `/custom/path?p=${pageNumber}&size=10`
    const result = buildPaginationPages(1, 3, customHref)

    expect(result[0].href).toBe('/custom/path?p=1&size=10')
    expect(result[2].href).toBe('/custom/path?p=3&size=10')
  })
})
