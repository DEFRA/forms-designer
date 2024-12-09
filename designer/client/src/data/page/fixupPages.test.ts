import {
  ComponentType,
  ControllerPath,
  ControllerType,
  type FormDefinition,
  type PageQuestion
} from '@defra/forms-model'

import { fixupPages } from '~/src/data/page/fixupPages.js'

describe('fixupPages', () => {
  let data: FormDefinition

  beforeEach(() => {
    data = {
      startPage: '/first-page',
      pages: [
        {
          title: 'First page',
          path: '/first-page',
          next: [{ path: '/second-page' }],
          components: [
            {
              name: 'ukPassport',
              title: 'Do you have a UK passport?',
              type: ComponentType.YesNoField,
              options: {
                required: true
              }
            }
          ]
        },
        {
          title: 'Second page',
          path: '/second-page',
          next: [{ path: ControllerPath.Summary }],
          components: []
        },
        {
          title: 'Summary',
          path: ControllerPath.Summary,
          controller: ControllerType.Summary
        }
      ],
      lists: [],
      sections: [],
      conditions: []
    }
  })

  it('should fix empty start page using page with start controller', () => {
    // Empty start page
    data.startPage = ''

    // Add page with start controller
    data.pages.unshift({
      title: 'Start page',
      path: ControllerPath.Start,
      controller: ControllerType.Start,
      next: [{ path: '/first-page' }],
      components: []
    })

    const returned = fixupPages(data)

    expect(returned.pages).toEqual(data.pages)
    expect(returned.startPage).toBe(ControllerPath.Start)
  })

  it('should fix empty start page using pages array', () => {
    // Empty start page
    data.startPage = ''

    const returned = fixupPages(data)

    expect(returned.pages).toEqual(data.pages)
    expect(returned.startPage).toBe('/first-page')
  })

  it('should fix incorrect start page using page with start controller', () => {
    // Incorrect start page
    data.startPage = '/404'

    // Add page with start controller
    data.pages.unshift({
      title: 'Start page',
      path: ControllerPath.Start,
      controller: ControllerType.Start,
      next: [{ path: '/first-page' }],
      components: []
    })

    const returned = fixupPages(data)

    expect(returned.pages).toEqual(data.pages)
    expect(returned.startPage).toBe(ControllerPath.Start)
  })

  it('should fix incorrect start page using pages array', () => {
    // Incorrect start page
    data.startPage = '/404'

    const returned = fixupPages(data)

    expect(returned.pages).toEqual(data.pages)
    expect(returned.startPage).toBe('/first-page')
  })

  it('should fix incorrect start page when pages are deleted', () => {
    // Remove first page
    data.pages = data.pages.slice(1)

    const returned = fixupPages(data)

    expect(returned.pages).toEqual(data.pages)
    expect(returned.startPage).toBe('/second-page')
  })

  it('should remove start page with empty pages', () => {
    // Remove all pages
    data.pages = []

    const returned = fixupPages(data)

    expect(returned.pages).toEqual(data.pages)
    expect(returned.startPage).toBeUndefined()
  })

  it('should remove start page when multiple journeys are possible', () => {
    const pages = structuredClone(data.pages) as PageQuestion[]

    pages[0].next = [{ path: pages[2].path }]
    pages[1].next = [{ path: pages[2].path }]
    pages[2].next = [{ path: pages[2].path }]

    // Update all page links
    data.pages = pages

    const returned = fixupPages(data)

    expect(returned.pages).toEqual(data.pages)
    expect(returned.startPage).toBeUndefined()
  })

  it('should remove start page when no journeys are possible', () => {
    const pages = structuredClone(data.pages) as PageQuestion[]

    pages[0].next = []
    pages[1].next = []
    pages[2].next = []

    // Remove all page links
    data.pages = pages

    const returned = fixupPages(data)

    expect(returned.pages).toEqual(data.pages)
    expect(returned.startPage).toBeUndefined()
  })

  it('should skip start page update without changes', () => {
    const returned = fixupPages(data)

    expect(returned).toEqual(data)
    expect(returned).toStrictEqual(data)
  })
})
