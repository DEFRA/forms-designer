import { ComponentType, ControllerType } from '@defra/forms-model'

import {
  constructReorderPage,
  excludeEndPages,
  getFocus,
  orderPages,
  repositionPage,
  withConditionSupport,
  withPageNumbers
} from '~/src/models/forms/editor-v2/pages-helper.js'

describe('editor-v2 - page-helper', () => {
  describe('repositionPage', () => {
    const pageIdListTest1 = ['page1', 'page2', 'page3', 'page4', 'page5']

    test('should return page list unchanged if id not found', () => {
      const res = repositionPage(pageIdListTest1, 'up', 'bad-page')
      expect(res).toEqual(pageIdListTest1)
    })

    test('should return page list unchanged if direction not found', () => {
      const res = repositionPage(pageIdListTest1, 'left', 'page2')
      expect(res).toEqual(pageIdListTest1)
    })

    test('should move page down one position - page 1', () => {
      const res = repositionPage(pageIdListTest1, 'down', 'page1')
      expect(res).toEqual(['page2', 'page1', 'page3', 'page4', 'page5'])
    })

    test('should move page down one position - page 2', () => {
      const res = repositionPage(pageIdListTest1, 'down', 'page2')
      expect(res).toEqual(['page1', 'page3', 'page2', 'page4', 'page5'])
    })

    test('should move page up one position - page 3', () => {
      const res = repositionPage(pageIdListTest1, 'up', 'page3')
      expect(res).toEqual(['page1', 'page3', 'page2', 'page4', 'page5'])
    })

    test('should move page down one position - page 3', () => {
      const res = repositionPage(pageIdListTest1, 'down', 'page3')
      expect(res).toEqual(['page1', 'page2', 'page4', 'page3', 'page5'])
    })

    test('should remain unchanged if move page down one position if already in last position', () => {
      const res = repositionPage(pageIdListTest1, 'down', 'page5')
      expect(res).toEqual(pageIdListTest1)
    })

    test('should remain unchanged if move page up one position if already in first position', () => {
      const res = repositionPage(pageIdListTest1, 'up', 'page1')
      expect(res).toEqual(pageIdListTest1)
    })
  })

  describe('orderPages', () => {
    const pageList = /** @type {Page[]} */ ([
      {
        id: 'page1',
        controller: ControllerType.Page
      },
      {
        id: 'page2',
        controller: ControllerType.Page
      },
      {
        id: 'page3',
        controller: ControllerType.Page
      },
      {
        id: 'page4',
        controller: ControllerType.Page
      },
      {
        id: 'page5',
        controller: ControllerType.Page
      }
    ])

    test('should return page list unchanged if id list is same as current order', () => {
      const res = orderPages(pageList, 'page1,page2,page3,page4,page5')
      expect(res).toEqual(pageList)
    })

    test('should return page list ordered - variation 1', () => {
      const res = orderPages(pageList, 'page2,page1,page3,page4,page5')
      expect(res).toHaveLength(5)
      expect(res[0].id).toBe('page2')
      expect(res[1].id).toBe('page1')
      expect(res[2].id).toBe('page3')
      expect(res[3].id).toBe('page4')
      expect(res[4].id).toBe('page5')
    })

    test('should return page list ordered - variation 2', () => {
      const res = orderPages(pageList, 'page5,page4,page1,page3,page2')
      expect(res).toHaveLength(5)
      expect(res[0].id).toBe('page5')
      expect(res[1].id).toBe('page4')
      expect(res[2].id).toBe('page1')
      expect(res[3].id).toBe('page3')
      expect(res[4].id).toBe('page2')
    })

    test('should handle invalid ids', () => {
      const res = orderPages(pageList, 'page5,bad-page,page1,page3,bad-page2')
      expect(res).toHaveLength(3)
      expect(res[0].id).toBe('page5')
      expect(res[1].id).toBe('page1')
      expect(res[2].id).toBe('page3')
    })
  })

  describe('excludeEndPages', () => {
    const allSummaryPages = /** @type {Page[]} */ ([
      {
        id: 'page1',
        controller: ControllerType.Summary
      },
      {
        id: 'page2',
        controller: ControllerType.Summary
      },
      {
        id: 'page3',
        controller: ControllerType.Summary
      }
    ])

    const oneSummaryPage = /** @type {Page[]} */ ([
      {
        id: 'page1',
        controller: ControllerType.Page
      },
      {
        id: 'page2',
        controller: ControllerType.Summary
      },
      {
        id: 'page3',
        controller: ControllerType.Page
      }
    ])

    test('should handle no pages', () => {
      const res = excludeEndPages([])
      expect(res).toHaveLength(0)
    })

    test('should handle all summary pages', () => {
      const res = excludeEndPages(allSummaryPages)
      expect(res).toHaveLength(0)
    })

    test('should handle one summary page', () => {
      const res = excludeEndPages(oneSummaryPage)
      expect(res).toHaveLength(2)
      expect(res[0].id).toBe('page1')
      expect(res[1].id).toBe('page3')
    })
  })

  describe('constructReorderPage', () => {
    const page2 = /** @type {PageQuestion} */ ({
      id: 'page2',
      controller: ControllerType.Page,
      components: [
        {
          id: 'q1',
          title: 'My first question'
        }
      ]
    })

    test('should handle a page with no title', () => {
      const page2Clone = { ...page2 }
      page2Clone.title = ''
      page2Clone.next = /** @type {Link[]} */ ([{ path: '/summary' }])
      const res = constructReorderPage(page2Clone, undefined)
      expect(res.title).toBe('My first question')
    })
  })

  describe('getFocus', () => {
    test('should split into direction and pageId', () => {
      const res = getFocus('dir|pageId')
      expect(res).toEqual({
        pageId: 'pageId',
        button: 'dir'
      })
    })

    test('should handle blank imput', () => {
      const res = getFocus('')
      expect(res).toBeUndefined()
    })

    test('should return undefined if first param missing', () => {
      const res = getFocus('|pageId')
      expect(res).toBeUndefined()
    })

    test('should return undefined if second param missing', () => {
      const res = getFocus('dir')
      expect(res).toBeUndefined()
    })
  })

  describe('withPageNumbers', () => {
    test('should add page number', () => {
      const page = /** @type {Page} */ ({
        id: 'page1',
        controller: ControllerType.Page
      })
      expect(withPageNumbers(page, 2)).toEqual({ page, number: 3 })
    })
  })

  describe('withConditionSupport', () => {
    test('should return true if condition support', () => {
      const page = /** @type {Page} */ ({
        id: 'page1',
        controller: ControllerType.Page,
        components: [
          {
            id: 'q1',
            title: 'My first question',
            type: ComponentType.TextField
          }
        ]
      })
      expect(withConditionSupport(page)).toBeTruthy()
    })

    test('should return false if no components', () => {
      const page = /** @type {Page} */ ({
        id: 'page1',
        controller: ControllerType.Summary,
        components: [],
        path: '/path',
        title: 'title'
      })
      expect(withConditionSupport(page)).toBeFalsy()
    })

    test('should return false if no condition support', () => {
      const page = /** @type {Page} */ ({
        id: 'page1',
        controller: ControllerType.Page,
        components: [
          {
            id: 'q1',
            title: 'My first question',
            type: ComponentType.InsetText
          }
        ]
      })
      expect(withConditionSupport(page)).toBeFalsy()
    })
  })
})

/**
 * @import { Link, Page, PageQuestion } from '@defra/forms-model'
 */
