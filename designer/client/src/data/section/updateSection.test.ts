import {
  type FormDefinition,
  type Page,
  type Section
} from '@defra/forms-model'

import { updateSection } from '~/src/data/section/updateSection.js'

describe('updateSection', () => {
  let sections: Section[]
  let pages: Page[]
  let data: FormDefinition

  beforeEach(() => {
    sections = [
      {
        name: 'section1',
        title: 'Section 1'
      },
      {
        name: 'section2',
        title: 'Section 2'
      },
      {
        name: 'section3',
        title: 'Section 3'
      }
    ]

    pages = [
      {
        title: 'page1',
        path: '/1',
        section: 'section1',
        next: [{ path: '/2' }],
        components: []
      },

      {
        title: 'page2',
        path: '/2',
        section: 'section2',
        next: [{ path: '/3' }],
        components: []
      },

      {
        title: 'page3',
        path: '/3',
        next: [],
        section: 'section2',
        components: []
      }
    ]

    data = {
      pages,
      lists: [],
      sections,
      conditions: []
    }
  })

  it('throws if no section could be found', () => {
    expect(() =>
      updateSection(data, 'sectionUnknown', {
        name: 'section 4',
        title: 'Section 4'
      })
    ).toThrow()
  })

  it('successfully updates a section title', () => {
    const sectionsBefore = structuredClone(sections)

    const { sections: sectionsAfter } = updateSection(data, 'section1', {
      name: 'section1',
      title: 'Section updated'
    })

    expect(sectionsBefore).toEqual(sections)
    expect(sectionsAfter).toEqual([
      {
        name: 'section1',
        title: 'Section updated'
      },
      {
        name: 'section2',
        title: 'Section 2'
      },
      {
        name: 'section3',
        title: 'Section 3'
      }
    ])
  })

  it('successfully updates a section name', () => {
    const sectionsBefore = structuredClone(sections)

    const { sections: sectionsAfter } = updateSection(data, 'section1', {
      name: 'sectionUpdated',
      title: 'Section 1'
    })

    expect(sectionsBefore).toEqual(sections)
    expect(sectionsAfter).toEqual([
      {
        name: 'sectionUpdated',
        title: 'Section 1'
      },
      {
        name: 'section2',
        title: 'Section 2'
      },
      {
        name: 'section3',
        title: 'Section 3'
      }
    ])
  })

  it('successfully updates a section name in pages that use it', () => {
    const pagesBefore = structuredClone(pages)

    const { pages: pagesAfter } = updateSection(data, 'section1', {
      name: 'sectionUpdated',
      title: 'Section updated'
    })

    expect(pagesBefore).toEqual(pages)
    expect(pagesAfter).toEqual([
      expect.objectContaining({
        title: 'page1',
        section: 'sectionUpdated'
      }),
      expect.objectContaining({
        title: 'page2',
        section: 'section2'
      }),
      expect.objectContaining({
        title: 'page3',
        section: 'section2'
      })
    ])
  })

  it('successfully updates a section name when not used by pages', () => {
    const pagesBefore = structuredClone(pages)

    const { pages: pagesAfter } = updateSection(data, 'section3', {
      name: 'sectionUpdated',
      title: 'Section updated'
    })

    expect(pagesBefore).toEqual(pages)
    expect(pagesAfter).toEqual(pages)
  })
})
