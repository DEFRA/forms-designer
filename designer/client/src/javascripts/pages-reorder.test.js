import Sortable from 'sortablejs'

import {
  PageReorder,
  focusIfExists,
  initPageReorder,
  querySelectorAllHelper,
  querySelectorHelper
} from '~/src/javascripts/pages-reorder.js'
import * as PageReorderModule from '~/src/javascripts/pages-reorder.js'

jest.mock('sortablejs', () => {
  /**
   * @typedef {{ onEnd?: (evt: any) => void }} SortableMockOptions
   */

  /**
   * @typedef {{
   *   options:  SortableMockOptions
   *   el:       HTMLElement
   *   destroy:  jest.Mock<void, []>
   *   _onEndHandler?: (evt: any) => void
   * }} SortableMockInstance
   */

  /** @type {SortableMockInstance | null} */
  let mockInstance = null

  /**
   * @param {HTMLElement} element
   * @param {SortableMockOptions} options
   * @returns {SortableMockInstance}
   */
  const create = jest.fn((element, options) => {
    mockInstance = {
      options,
      el: element,
      destroy: jest.fn()
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (options.onEnd) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      mockInstance._onEndHandler = options.onEnd
    }
    return mockInstance
  })

  return {
    __esModule: true,
    default: {
      create,
      /** @type {() => SortableMockInstance | null} */
      _getMockInstance: () => mockInstance
    }
  }
})

jest.useFakeTimers()

const mockFocusIfExists = jest.fn()
jest
  .spyOn(PageReorderModule, 'focusIfExists')
  .mockImplementation(mockFocusIfExists)

describe('PageReorder Class', () => {
  /**
   * @type {HTMLElement | null}
   */
  let container
  /**
   * @type {HTMLInputElement | null}
   */
  let pageOrderInput
  /**
   * @type {HTMLElement | null}
   */
  let announcementRegion
  /**
   * @type {PageReorder | null}
   */
  let pageReorderInstance

  const setupHTML = (includeFixed = false) => {
    document.body.innerHTML = `
      <div class="govuk-visually-hidden" id="reorder-announcement" aria-live="polite" aria-atomic="true"></div>
      <form>
        <ol class="app-reorderable-list" id="pages-container" data-module="pages-reorder">
          <li class="app-reorderable-list__item" data-id="page1">
            <div class="govuk-summary-card pages-reorder-panel">
              <div class="govuk-summary-card__title-wrapper">
                <span class="govuk-body page-number">Page 1</span>
                <h2 class="govuk-summary-card__title page-title">Page One Title</h2>
                <div class="govuk-button-group">
                  <button type="submit" name="movement" class="reorder-button-no-js">Up</button>
                  <button type="submit" name="movement" class="reorder-button-no-js">Down</button>
                  <button class="app-button govuk-button govuk-button--secondary js-reorderable-list-up reorder-button-js" type="button" style="display: none;">Up</button>
                  <button class="app-button govuk-button govuk-button--secondary js-reorderable-list-down reorder-button-js" type="button" style="display: none;">Down</button>
                </div>
              </div>
            </div>
          </li>
          <li class="app-reorderable-list__item" data-id="page2">
             <div class="govuk-summary-card pages-reorder-panel">
               <div class="govuk-summary-card__title-wrapper">
                 <span class="govuk-body page-number">Page 2</span>
                 <h2 class="govuk-summary-card__title page-title">Page Two Title</h2>
                 <div class="govuk-button-group">
                   <button type="submit" name="movement" class="reorder-button-no-js">Up</button>
                   <button type="submit" name="movement" class="reorder-button-no-js">Down</button>
                   <button class="app-button govuk-button govuk-button--secondary js-reorderable-list-up reorder-button-js" type="button" style="display: none;">Up</button>
                   <button class="app-button govuk-button govuk-button--secondary js-reorderable-list-down reorder-button-js" type="button" style="display: none;">Down</button>
                 </div>
               </div>
             </div>
          </li>
          <li class="app-reorderable-list__item" data-id="page3">
             <div class="govuk-summary-card pages-reorder-panel">
               <div class="govuk-summary-card__title-wrapper">
                 <span class="govuk-body page-number">Page 3</span>
                 <h2 class="govuk-summary-card__title page-title">Page Three Title</h2>
                 <div class="govuk-button-group">
                   <button type="submit" name="movement" class="reorder-button-no-js">Up</button>
                   <button type="submit" name="movement" class="reorder-button-no-js">Down</button>
                   <button class="app-button govuk-button govuk-button--secondary js-reorderable-list-up reorder-button-js" type="button" style="display: none;">Up</button>
                   <button class="app-button govuk-button govuk-button--secondary js-reorderable-list-down reorder-button-js" type="button" style="display: none;">Down</button>
                 </div>
               </div>
             </div>
          </li>
          ${
            includeFixed
              ? `
          <li class="app-reorderable-list__item check-answers-item" data-id="fixedPage">
             <div class="govuk-summary-card pages-reorder-panel">
               <div class="govuk-summary-card__title-wrapper">
                 <span class="govuk-body page-number">Page 4</span>
                 <h2 class="govuk-summary-card__title page-title">Check Answers</h2>
                 <div class="govuk-button-group">
                    <button type="submit" name="movement" class="reorder-button-no-js" style="visibility: hidden;">Up</button>
                    <button type="submit" name="movement" class="reorder-button-no-js" style="visibility: hidden;">Down</button>
                    <button class="app-button govuk-button govuk-button--secondary js-reorderable-list-up reorder-button-js" type="button" style="display: none;">Up</button>
                    <button class="app-button govuk-button govuk-button--secondary js-reorderable-list-down reorder-button-js" type="button" style="display: none;">Down</button>
                 </div>
               </div>
             </div>
          </li>
          `
              : ''
          }
        </ol>
        <input type="hidden" name="pageOrder" id="pageOrder" value="page1,page2,page3${includeFixed ? ',fixedPage' : ''}" />
      </form>
    `
    container = document.getElementById('pages-container')
    const foundPageOrderInput = document.getElementById('pageOrder')
    pageOrderInput =
      foundPageOrderInput instanceof HTMLInputElement
        ? foundPageOrderInput
        : null
    announcementRegion = document.getElementById('reorder-announcement')
  }

  beforeEach(() => {
    jest.clearAllMocks()
    setupHTML()
    container = document.getElementById('pages-container')
    const foundPageOrderInput = document.getElementById('pageOrder')
    pageOrderInput =
      foundPageOrderInput instanceof HTMLInputElement
        ? foundPageOrderInput
        : null
    announcementRegion = document.getElementById('reorder-announcement')

    if (container instanceof HTMLOListElement) {
      pageReorderInstance = initPageReorder(container)
    } else {
      throw new Error()
    }
  })

  afterEach(() => {
    document.body.innerHTML = ''
    container = null
    pageOrderInput = null
    announcementRegion = null
    pageReorderInstance = null
  })

  test('constructor should initialize properties and call init', () => {
    expect(pageReorderInstance?.container).toBe(container)
    expect(pageReorderInstance?.pageOrderInput).toBe(pageOrderInput)
    expect(pageReorderInstance?.announcementRegion).toBe(announcementRegion)
    expect(container?.classList.contains('js-enabled')).toBe(true)
    expect(Sortable.create).toHaveBeenCalled()
  })

  test('constructor should return early if container is invalid', () => {
    document.body.innerHTML = '<div id="pages-container"></div>'
    const invalidContainer = document.getElementById('pages-container')
    expect(invalidContainer).not.toBeNull()
    const instance = new PageReorder(/** @type {Element} */ (invalidContainer))
    expect(instance.container).toBeNull()
  })

  test('constructor should return early if required elements are missing', () => {
    document.body.innerHTML =
      '<ol id="pages-container" data-module="pages-reorder"></ol>'
    const validContainer = document.getElementById('pages-container')

    expect(validContainer).not.toBeNull()

    const instance = new PageReorder(/** @type {Element} */ (validContainer))
    expect(instance.pageOrderInput).toBeNull()
    expect(instance.announcementRegion).toBeNull()
  })

  test('initSortable should call Sortable.create with correct options', () => {
    const createSpy = jest.spyOn(Sortable, 'create')
    pageReorderInstance?.initSortable()
    expect(createSpy).toHaveBeenCalledWith(
      container,
      expect.objectContaining({
        animation: 150,
        filter: '.check-answers-item',
        disabled: false,
        onEnd: expect.any(Function)
      })
    )
  })

  describe('handleSortableEnd', () => {
    test('should update visuals, buttons, hidden data, announce, and focus onEnd', () => {
      const mockEvt = {
        item: container?.children[1],
        newIndex: 0,
        oldIndex: 1
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const mockInstance = /** @type {any} */ (Sortable)._getMockInstance()

      if (!pageReorderInstance) {
        throw new Error()
      }

      const updateVisualsSpy = jest.spyOn(pageReorderInstance, 'updateVisuals')
      const updateMoveButtonsSpy = jest.spyOn(
        pageReorderInstance,
        'updateMoveButtons'
      )
      const updateHiddenDataSpy = jest.spyOn(
        pageReorderInstance,
        'updateHiddenPageOrderData'
      )
      const announceReorderSpy = jest.spyOn(
        pageReorderInstance,
        'announceReorder'
      )
      if (!mockEvt.item) {
        throw new Error()
      }
      const focusSpy = jest.spyOn(
        /** @type {HTMLElement} */ (mockEvt.item),
        'focus'
      )
      mockEvt.item.setAttribute = jest.fn()

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      mockInstance._onEndHandler(mockEvt)

      expect(updateVisualsSpy).toHaveBeenCalled()
      expect(updateMoveButtonsSpy).toHaveBeenCalled()
      expect(updateHiddenDataSpy).toHaveBeenCalled()
      expect(announceReorderSpy).toHaveBeenCalledWith(
        mockEvt.item,
        mockEvt.newIndex + 1
      )
      expect(mockEvt.item.setAttribute).toHaveBeenCalledWith('tabindex', '-1')
      expect(focusSpy).toHaveBeenCalled()
    })
  })

  describe('handleButtonClick', () => {
    test('should not move first item up', () => {
      if (!container) {
        throw new Error()
      }

      const upButton = container.querySelector(
        '[data-id="page1"] .js-reorderable-list-up'
      )

      const initialOrder = Array.from(container.children).map(
        (li) => /** @type {HTMLElement} */ (li).dataset.id
      )

      if (!pageReorderInstance) {
        throw new Error()
      }

      const announceReorderSpy = jest.spyOn(
        pageReorderInstance,
        'announceReorder'
      )
      mockFocusIfExists.mockClear()

      if (!upButton) {
        throw new Error()
      }

      const htmlUpButton = /** @type {HTMLElement} */ (upButton)
      htmlUpButton.click()

      const finalOrder = Array.from(container.children).map(
        (li) => /** @type {HTMLElement} */ (li).dataset.id
      )
      expect(finalOrder).toEqual(initialOrder)
      expect(announceReorderSpy).not.toHaveBeenCalled()
      expect(mockFocusIfExists).not.toHaveBeenCalled()
    })

    test('should not move last item down', () => {
      if (!container) {
        throw new Error()
      }

      const downButton = container.querySelector(
        '[data-id="page3"] .js-reorderable-list-down'
      )
      const initialOrder = Array.from(container.children).map(
        (li) => /** @type {HTMLElement} */ (li).dataset.id
      )

      if (!pageReorderInstance) {
        throw new Error()
      }

      const announceReorderSpy = jest.spyOn(
        pageReorderInstance,
        'announceReorder'
      )
      mockFocusIfExists.mockClear()

      if (!downButton) {
        throw new Error()
      }

      const htmlDownButton = /** @type {HTMLElement} */ (downButton)
      htmlDownButton.click()

      const finalOrder = Array.from(container.children).map(
        (li) => /** @type {HTMLElement} */ (li).dataset.id
      )
      expect(finalOrder).toEqual(initialOrder)
      expect(announceReorderSpy).not.toHaveBeenCalled()
      expect(mockFocusIfExists).not.toHaveBeenCalled()
    })
  })

  test('updateVisuals should update page numbers and aria-labels', () => {
    pageReorderInstance?.updateVisuals()

    const items = container?.querySelectorAll('.app-reorderable-list__item')
    if (!items) {
      throw new Error()
    }
    const upButton1 = items[0].querySelector('.js-reorderable-list-up')
    const downButton1 = items[0].querySelector('.js-reorderable-list-down')
    const upButton2 = items[1].querySelector('.js-reorderable-list-up')
    const downButton2 = items[1].querySelector('.js-reorderable-list-down')

    expect(items[0].querySelector('.page-number')?.textContent).toBe('Page 1')
    expect(items[1].querySelector('.page-number')?.textContent).toBe('Page 2')
    expect(items[2].querySelector('.page-number')?.textContent).toBe('Page 3')

    expect(upButton1?.getAttribute('aria-label')).toBe(
      'Button, Move page: Up, Page 1 of 3: Page One Title'
    )
    expect(downButton1?.getAttribute('aria-label')).toBe(
      'Button, Move page: Down, Page 1 of 3: Page One Title'
    )
    expect(upButton2?.getAttribute('aria-label')).toBe(
      'Button, Move page: Up, Page 2 of 3: Page Two Title'
    )
    expect(downButton2?.getAttribute('aria-label')).toBe(
      'Button, Move page: Down, Page 2 of 3: Page Two Title'
    )
  })

  test('updateMoveButtons should show/hide buttons correctly', () => {
    pageReorderInstance?.updateMoveButtons()

    const item1Up = container?.querySelector(
      '[data-id="page1"] .js-reorderable-list-up'
    )
    const item1Down = container?.querySelector(
      '[data-id="page1"] .js-reorderable-list-down'
    )
    const item2Up = container?.querySelector(
      '[data-id="page2"] .js-reorderable-list-up'
    )
    const item2Down = container?.querySelector(
      '[data-id="page2"] .js-reorderable-list-down'
    )
    const item3Up = container?.querySelector(
      '[data-id="page3"] .js-reorderable-list-up'
    )
    const item3Down = container?.querySelector(
      '[data-id="page3"] .js-reorderable-list-down'
    )

    expect(/** @type {HTMLElement} */ (item1Up)?.style.display).toBe('none')
    expect(/** @type {HTMLElement} */ (item1Down)?.style.display).toBe(
      'inline-block'
    )
    expect(/** @type {HTMLElement} */ (item2Up)?.style.display).toBe(
      'inline-block'
    )
    expect(/** @type {HTMLElement} */ (item2Down)?.style.display).toBe(
      'inline-block'
    )
    expect(/** @type {HTMLElement} */ (item3Up)?.style.display).toBe(
      'inline-block'
    )
    expect(/** @type {HTMLElement} */ (item3Down)?.style.display).toBe('none')
  })

  test('updateMoveButtons should hide buttons on fixed item', () => {
    setupHTML(true)

    const fixedContainer = document.getElementById('pages-container')
    if (fixedContainer instanceof HTMLOListElement) {
      pageReorderInstance = initPageReorder(fixedContainer)
    } else {
      throw new Error()
    }

    if (!pageReorderInstance || !container) {
      throw new Error()
    }

    pageReorderInstance.updateMoveButtons()

    const fixedItemUp = container.querySelector(
      '.check-answers-item .js-reorderable-list-up'
    )
    const fixedItemDown = container.querySelector(
      '.check-answers-item .js-reorderable-list-down'
    )

    if (!fixedItemUp || !fixedItemDown) {
      throw new Error('Test setup failed: Fixed items not found')
    }

    expect(/** @type {HTMLElement} */ (fixedItemUp).style.display).toBe('none')
    expect(/** @type {HTMLElement} */ (fixedItemDown).style.display).toBe(
      'none'
    )
  })

  test('updateHiddenPageOrderData should set comma-separated IDs', () => {
    pageReorderInstance?.updateHiddenPageOrderData()
    if (!pageOrderInput) {
      throw new Error()
    }
    expect(pageOrderInput.value).toBe('page1,page2,page3')

    const item1 = container?.querySelector('[data-id="page1"]')
    const item2 = container?.querySelector('[data-id="page2"]')
    if (!item1 || !item2 || !container) {
      throw new Error()
    }
    container.insertBefore(item1, item2.nextSibling)

    pageReorderInstance?.updateHiddenPageOrderData()
    expect(pageOrderInput.value).toBe('page2,page1,page3')
  })

  test('announceReorder should update live region and clear it later', () => {
    const item = container?.querySelector('[data-id="page2"]')
    if (!item) {
      throw new Error()
    }
    pageReorderInstance?.announceReorder(/** @type {HTMLElement} */ (item), 1)

    jest.advanceTimersByTime(200)
    expect(announcementRegion?.textContent).toBe(
      'List reordered, Page Two Title is now page 1 of 3.'
    )

    jest.advanceTimersByTime(5100)
    expect(announcementRegion?.textContent).toBe('')
  })
})

describe('Helper Functions', () => {
  describe('querySelectorHelper', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="parent">
          <span class="child">Child Span</span>
          <button class="child-button">Click Me</button>
        </div>
        <div id="other-parent"></div>
      `
    })

    test('should return the first matching element', () => {
      const parent = document.getElementById('parent')
      if (!parent) {
        throw new Error()
      }
      const childSpan = querySelectorHelper(parent, '.child')
      expect(childSpan).not.toBeNull()
      if (!childSpan) {
        throw new Error()
      }
      expect(childSpan.tagName).toBe('SPAN')
      expect(childSpan.textContent).toBe('Child Span')
    })

    test('should return null if no element matches', () => {
      const parent = document.getElementById('parent')
      if (!parent) {
        throw new Error()
      }
      const nonExistent = querySelectorHelper(parent, '.non-existent')
      expect(nonExistent).toBeNull()
    })

    test('should work with document as root', () => {
      const parentFromDoc = querySelectorHelper(document, '#parent')
      if (!parentFromDoc) {
        throw new Error()
      }
      expect(parentFromDoc.id).toBe('parent')
    })
  })

  describe('querySelectorAllHelper', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul id="list">
          <li class="item">Item 1</li>
          <li class="item special">Item 2</li>
          <li>Item 3 (no class)</li>
          <li class="item">Item 4</li>
        </ul>
      `
    })

    test('should return a NodeListOf all matching elements', () => {
      const list = document.getElementById('list')
      if (!list) {
        throw new Error()
      }
      const items = querySelectorAllHelper(list, '.item')
      expect(items).toBeInstanceOf(NodeList)
      expect(items).toHaveLength(3)
      expect(items[0].textContent).toBe('Item 1')
      expect(items[1].textContent).toBe('Item 2')
      expect(items[2].textContent).toBe('Item 4')
    })

    test('should return an empty NodeList if no elements match', () => {
      const list = document.getElementById('list')
      if (!list) {
        throw new Error()
      }
      const nonExistent = querySelectorAllHelper(list, '.non-existent')
      expect(nonExistent).toBeInstanceOf(NodeList)
      expect(nonExistent).toHaveLength(0)
    })
  })

  describe('focusIfExists', () => {
    /**
     * @type {Element | null}
     */
    let focusableElement
    let nonFocusableElement
    /**
     * @type {Element | null}
     */
    let hiddenElement

    beforeEach(() => {
      document.body.innerHTML = `
        <button id="focusableBtn">Focus Me</button>
        <div id="nonFocusableDiv">Not Focusable</div>
        <button id="hiddenBtn" style="display: none;">Hidden</button>
      `
      focusableElement = document.getElementById('focusableBtn')
      if (!focusableElement) {
        throw new Error()
      }

      nonFocusableElement = document.getElementById('nonFocusableDiv')
      hiddenElement = document.getElementById('hiddenBtn')

      jest.spyOn(/** @type {HTMLElement} */ (focusableElement), 'focus')
      if (
        nonFocusableElement &&
        typeof nonFocusableElement.focus === 'function'
      ) {
        jest.spyOn(nonFocusableElement, 'focus')
      }
      if (
        hiddenElement &&
        typeof (/** @type {HTMLElement} */ (hiddenElement).focus) === 'function'
      ) {
        jest.spyOn(/** @type {HTMLElement} */ (hiddenElement), 'focus')
      }
    })

    test('should call focus on a visible, focusable HTMLElement', () => {
      focusIfExists(focusableElement)
      expect(
        jest.spyOn(/** @type {HTMLElement} */ (focusableElement), 'focus')
      ).toHaveBeenCalledTimes(1)
    })

    test('should not call focus if element is null', () => {
      focusIfExists(null)
      expect(
        jest.spyOn(/** @type {HTMLElement} */ (focusableElement), 'focus')
      ).not.toHaveBeenCalled()
    })

    test('should not call focus if element is not an HTMLElement', () => {
      const notAnElement = document.createTextNode('text')
      focusIfExists(/** @type {any} */ (notAnElement))
      expect(
        jest.spyOn(/** @type {HTMLElement} */ (focusableElement), 'focus')
      ).not.toHaveBeenCalled()
    })

    test('should not call focus on a hidden element', () => {
      focusIfExists(hiddenElement)
      expect(
        jest.spyOn(/** @type {HTMLElement} */ (focusableElement), 'focus')
      ).not.toHaveBeenCalled()
    })

    test('should not call focus if element is not focusable (no focus method)', () => {
      const divWithoutFocus = document.createElement('div')
      Object.defineProperty(divWithoutFocus, 'focus', {
        value: undefined,
        configurable: true
      })

      focusIfExists(divWithoutFocus)
      expect(
        jest.spyOn(/** @type {HTMLElement} */ (focusableElement), 'focus')
      ).not.toHaveBeenCalled()
    })

    test('should not throw if elem.focus is not a function (e.g. SVGElement)', () => {
      document.body.innerHTML = '<svg id="mySvg"></svg>'
      const svgElement = document.getElementById('mySvg')
      expect(() => focusIfExists(svgElement)).not.toThrow()
    })
  })
})
