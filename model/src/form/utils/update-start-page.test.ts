import { ComponentType } from '~/src/components/enums.js'
import {
  type FormDefinition,
  type PageQuestion
} from '~/src/form/form-definition/types.js'
import { updateStartPage } from '~/src/form/utils/update-start-page.js'
import { ControllerPath, ControllerType } from '~/src/pages/enums.js'

describe('updateStartPage', () => {
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

  it('should fix empty start page using pages array', () => {
    const updated = {
      ...data,

      // Empty start page
      startPage: ''
    }

    const returned = updateStartPage(updated)

    expect(returned.pages).toEqual(updated.pages)
    expect(returned.startPage).toBe('/first-page')
  })

  it('should fix incorrect start page using pages array', () => {
    const updated = {
      ...data,

      // Incorrect start page
      startPage: '/404'
    }

    const returned = updateStartPage(updated)

    expect(returned.pages).toEqual(updated.pages)
    expect(returned.startPage).toBe('/first-page')
  })

  it('should fix incorrect start page when pages are deleted', () => {
    const updated = {
      ...data,

      // Remove first page
      pages: data.pages.slice(1)
    }

    const returned = updateStartPage(updated)

    expect(returned.pages).toEqual(updated.pages)
    expect(returned.startPage).toBe('/second-page')
  })

  it('should remove start page with empty pages', () => {
    const updated = {
      ...data,
      pages: []
    }

    const returned = updateStartPage(updated)

    expect(returned.pages).toEqual(updated.pages)
    expect(returned.startPage).toBeUndefined()
  })

  it('should remove start page update when multiple journeys are possible', () => {
    const pages = structuredClone(data.pages) as PageQuestion[]

    pages[0].next = [{ path: pages[2].path }]
    pages[1].next = [{ path: pages[2].path }]
    pages[2].next = [{ path: pages[2].path }]

    const updated = {
      ...data,
      pages
    }

    const returned = updateStartPage(updated)

    expect(returned.pages).toEqual(updated.pages)
    expect(returned.startPage).toBeUndefined()
  })

  it('should remove start page when no journeys are possible', () => {
    const pages = structuredClone(data.pages) as PageQuestion[]

    pages[0].next = []
    pages[1].next = []
    pages[2].next = []

    const updated = {
      ...data,
      pages
    }

    const returned = updateStartPage(updated)

    expect(returned.pages).toEqual(updated.pages)
    expect(returned.startPage).toBeUndefined()
  })

  it('should skip start page update without changes', () => {
    const returned = updateStartPage(data)

    expect(returned).toEqual(data)
    expect(returned).toStrictEqual(data)
  })
})
