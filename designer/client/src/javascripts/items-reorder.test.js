import Sortable from 'sortablejs'

import {
  ItemReorder,
  focusIfExists,
  initItemReorder,
  querySelectorAllHelper,
  querySelectorHelper
} from '~/src/javascripts/items-reorder.js'
import * as ItemReorderModule from '~/src/javascripts/items-reorder.js'

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
  .spyOn(ItemReorderModule, 'focusIfExists')
  .mockImplementation(mockFocusIfExists)

describe('ItemReorder Class', () => {
  /**
   * @type {HTMLElement | null}
   */
  let container
  /**
   * @type {HTMLInputElement | null}
   */
  let itemOrderInput
  /**
   * @type {HTMLElement | null}
   */
  let announcementRegion
  /**
   * @type {ItemReorder | null}
   */
  let itemReorderInstance

  const setupHTML = (includeFixed = false) => {
    document.body.innerHTML = `
      <div class="govuk-visually-hidden" id="reorder-announcement" aria-live="polite" aria-atomic="true"></div>
      <form>
        <ol class="app-reorderable-list" id="items-container" data-module="items-reorder">
          <li class="app-reorderable-list__item" data-id="page1">
            <div class="govuk-summary-card reorder-panel">
              <div class="govuk-summary-card__title-wrapper">
                <span class="govuk-body item-number">Page 1</span>
                <h2 class="govuk-summary-card__title item-title">Page One Title</h2>
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
              <div class="govuk-summary-card reorder-panel">
                <div class="govuk-summary-card__title-wrapper">
                  <span class="govuk-body item-number">Page 2</span>
                  <h2 class="govuk-summary-card__title item-title">Page Two Title</h2>
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
              <div class="govuk-summary-card reorder-panel">
                <div class="govuk-summary-card__title-wrapper">
                  <span class="govuk-body item-number">Page 3</span>
                  <h2 class="govuk-summary-card__title item-title">Page Three Title</h2>
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
              <div class="govuk-summary-card reorder-panel">
                <div class="govuk-summary-card__title-wrapper">
                  <span class="govuk-body item-number">Page 4</span>
                  <h2 class="govuk-summary-card__title item-title">Check Answers</h2>
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
        <input type="hidden" name="itemOrder" id="itemOrder" value="page1,page2,page3${includeFixed ? ',fixedPage' : ''}" />
      </form>
    `
    container = document.getElementById('items-container')
    const foundItemOrderInput = document.getElementById('itemOrder')
    itemOrderInput =
      foundItemOrderInput instanceof HTMLInputElement
        ? foundItemOrderInput
        : null
    announcementRegion = document.getElementById('reorder-announcement')
  }

  beforeEach(() => {
    jest.clearAllMocks()
    setupHTML()
    container = document.getElementById('items-container')
    const foundItemOrderInput = document.getElementById('itemOrder')
    itemOrderInput =
      foundItemOrderInput instanceof HTMLInputElement
        ? foundItemOrderInput
        : null
    // Mock dispatchEvent to avoid error during unit test
    if (foundItemOrderInput) {
      foundItemOrderInput.dispatchEvent = jest.fn()
    }
    announcementRegion = document.getElementById('reorder-announcement')

    if (container instanceof HTMLOListElement) {
      itemReorderInstance = initItemReorder(container)
    } else {
      throw new Error()
    }
  })

  afterEach(() => {
    document.body.innerHTML = ''
    container = null
    itemOrderInput = null
    announcementRegion = null
    itemReorderInstance = null
  })

  test('constructor should initialize properties and call init', () => {
    expect(itemReorderInstance?.container).toBe(container)
    expect(itemReorderInstance?.itemOrderInput).toBe(itemOrderInput)
    expect(itemReorderInstance?.announcementRegion).toBe(announcementRegion)
    expect(container?.classList.contains('js-enabled')).toBe(true)
    expect(Sortable.create).toHaveBeenCalled()
  })

  test('constructor should return early if container is invalid', () => {
    document.body.innerHTML = '<div id="items-container"></div>'
    const invalidContainer = document.getElementById('items-container')
    expect(invalidContainer).not.toBeNull()
    const instance = new ItemReorder(/** @type {Element} */ (invalidContainer))
    expect(instance.container).toBeNull()
  })

  test('constructor should return early if required elements are missing', () => {
    document.body.innerHTML =
      '<ol id="items-container" data-module="items-reorder"></ol>'
    const validContainer = document.getElementById('items-container')

    expect(validContainer).not.toBeNull()

    const instance = new ItemReorder(/** @type {Element} */ (validContainer))
    expect(instance.itemOrderInput).toBeNull()
    expect(instance.announcementRegion).toBeNull()
  })

  test('constructor should return early if itemOrderInput is missing', () => {
    document.body.innerHTML = `
      <ol id="items-container" data-module="items-reorder"></ol>
      <div id="reorder-announcement"></div>`
    const validContainer = document.getElementById('items-container')
    const instance = new ItemReorder(/** @type {Element} */ (validContainer))

    const initButtonListenersSpy = jest.spyOn(
      ItemReorder.prototype,
      'initButtonListeners'
    )
    // eslint-disable-next-line no-new
    new ItemReorder(/** @type {Element} */ (validContainer))
    expect(instance.itemOrderInput).toBeNull()

    initButtonListenersSpy.mockRestore()
  })

  test('constructor should return early if announcementRegion is missing', () => {
    document.body.innerHTML = `
      <ol id="items-container" data-module="items-reorder"></ol>
      <input id="itemOrder" />`
    const validContainer = document.getElementById('items-container')
    const instance = new ItemReorder(/** @type {Element} */ (validContainer))
    expect(instance.announcementRegion).toBeNull()
    const initButtonListenersSpy = jest.spyOn(
      ItemReorder.prototype,
      'initButtonListeners'
    )
    // eslint-disable-next-line no-new
    new ItemReorder(/** @type {Element} */ (validContainer))
    expect(initButtonListenersSpy).not.toHaveBeenCalled()
    initButtonListenersSpy.mockRestore()
  })

  test('initSortable should call Sortable.create with correct options', () => {
    const createSpy = jest.spyOn(Sortable, 'create')
    itemReorderInstance?.initSortable()
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

  test('initSortable should return early if container is null', () => {
    if (!itemReorderInstance) throw new Error()

    // eslint-disable-next-line jest/unbound-method
    const createSpy = Sortable.create
    // @ts-expect-error TS doesn't recognise createSpy as a Jest mock here, but it is at runtime
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    createSpy.mockClear()

    const originalContainer = itemReorderInstance.container
    itemReorderInstance.container = null
    itemReorderInstance.initSortable()
    expect(createSpy).not.toHaveBeenCalled()

    itemReorderInstance.container = originalContainer
  })

  test('initFocusListeners should return early if container is null', () => {
    if (!itemReorderInstance) throw new Error()
    const addEventSpy = jest.spyOn(
      /** @type {HTMLOListElement} */ (itemReorderInstance.container),
      'addEventListener'
    )

    itemReorderInstance.container = null
    addEventSpy.mockClear()
    itemReorderInstance.initFocusListeners()
    expect(addEventSpy).not.toHaveBeenCalled()
  })

  describe('handleFocusOut', () => {
    test('should return early if container is null', () => {
      if (!itemReorderInstance) throw new Error()
      const originalContainer = itemReorderInstance.container
      itemReorderInstance.container = null

      const mockEvent = new FocusEvent('focusout')
      expect(() => itemReorderInstance?.handleFocusOut(mockEvent)).not.toThrow()

      itemReorderInstance.container = originalContainer
    })

    test('should return early if event target is not an HTMLElement', () => {
      if (!itemReorderInstance || !container) throw new Error()

      const listItem = container.querySelector('[data-id="page1"]')
      if (!listItem) throw new Error()

      listItem.classList.add('reorder-panel-focus')

      const mockEvent = /** @type {FocusEvent} */ (
        /** @type {any} */ ({
          target: document.createTextNode('text'),
          relatedTarget: null
        })
      )

      itemReorderInstance.handleFocusOut(mockEvent)
      expect(listItem.classList.contains('reorder-panel-focus')).toBe(true)
    })

    test('should return early if closest list item is not found', () => {
      if (!itemReorderInstance || !container) throw new Error()

      const orphanElement = document.createElement('span')
      container.appendChild(orphanElement)

      const mockEvent = /** @type {FocusEvent} */ (
        /** @type {any} */ ({
          target: orphanElement,
          relatedTarget: null
        })
      )

      expect(() => itemReorderInstance?.handleFocusOut(mockEvent)).not.toThrow()
    })

    test('should remove panelFocusClass when focus leaves the list item', () => {
      if (!itemReorderInstance || !container) throw new Error()

      const listItem = container.querySelector('[data-id="page1"]')
      if (!listItem) throw new Error()

      listItem.classList.add('reorder-panel-focus')

      const button = listItem.querySelector('.js-reorderable-list-up')
      if (!button) throw new Error()

      const outsideElement = container.querySelector('[data-id="page2"]')

      const mockEvent = /** @type {FocusEvent} */ (
        /** @type {any} */ ({
          target: button,
          relatedTarget: outsideElement
        })
      )

      itemReorderInstance.handleFocusOut(mockEvent)
      expect(listItem.classList.contains('reorder-panel-focus')).toBe(false)
    })

    test('should not remove panelFocusClass when focus stays within the list item', () => {
      if (!itemReorderInstance || !container) throw new Error()

      const listItem = container.querySelector('[data-id="page1"]')
      if (!listItem) throw new Error()

      listItem.classList.add('reorder-panel-focus')

      const upButton = listItem.querySelector('.js-reorderable-list-up')
      const downButton = listItem.querySelector('.js-reorderable-list-down')
      if (!upButton || !downButton) throw new Error()

      const mockEvent = /** @type {FocusEvent} */ (
        /** @type {any} */ ({
          target: upButton,
          relatedTarget: downButton
        })
      )

      itemReorderInstance.handleFocusOut(mockEvent)
      expect(listItem.classList.contains('reorder-panel-focus')).toBe(true)
    })

    test('should remove panelFocusClass when relatedTarget is null', () => {
      if (!itemReorderInstance || !container) throw new Error()

      const listItem = container.querySelector('[data-id="page1"]')
      if (!listItem) throw new Error()

      listItem.classList.add('reorder-panel-focus')

      const button = listItem.querySelector('.js-reorderable-list-up')
      if (!button) throw new Error()

      const mockEvent = /** @type {FocusEvent} */ (
        /** @type {any} */ ({
          target: button,
          relatedTarget: null
        })
      )

      itemReorderInstance.handleFocusOut(mockEvent)
      expect(listItem.classList.contains('reorder-panel-focus')).toBe(false)
    })

    test('should respond to focusout event dispatched on the container', () => {
      if (!itemReorderInstance || !container) throw new Error()

      const listItem = container.querySelector('[data-id="page2"]')
      if (!listItem) throw new Error()

      listItem.classList.add('reorder-panel-focus')

      const button = listItem.querySelector('.js-reorderable-list-down')
      if (!button) throw new Error()

      const focusOutEvent = new FocusEvent('focusout', {
        bubbles: true,
        relatedTarget: null
      })
      Object.defineProperty(focusOutEvent, 'target', {
        value: button,
        writable: false
      })

      container.dispatchEvent(focusOutEvent)
      expect(listItem.classList.contains('reorder-panel-focus')).toBe(false)
    })
  })

  test('initButtonListeners should return early if container is null', () => {
    if (!itemReorderInstance) throw new Error()
    const addEventSpy = jest.spyOn(
      /** @type {HTMLOListElement} */ (itemReorderInstance.container),
      'addEventListener'
    )
    const originalInstanceContainer = itemReorderInstance.container
    itemReorderInstance.container = null
    itemReorderInstance.initButtonListeners()
    expect(addEventSpy).not.toHaveBeenCalled()
    itemReorderInstance.container = originalInstanceContainer
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

      if (!itemReorderInstance) {
        throw new Error()
      }

      const updateVisualsSpy = jest.spyOn(itemReorderInstance, 'updateVisuals')
      const updateMoveButtonsSpy = jest.spyOn(
        itemReorderInstance,
        'updateMoveButtons'
      )
      const updateHiddenDataSpy = jest.spyOn(
        itemReorderInstance,
        'updateHiddenItemOrderData'
      )
      const announceReorderSpy = jest.spyOn(
        itemReorderInstance,
        'announceReorder'
      )
      if (!mockEvt.item) {
        throw new Error()
      }
      const focusSpy = jest.spyOn(
        /** @type {HTMLElement} */ (mockEvt.item),
        'focus'
      )
      const dispatchEventMock = jest.fn()
      if (itemReorderInstance.itemOrderInput) {
        itemReorderInstance.itemOrderInput.dispatchEvent = dispatchEventMock
      }
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
      expect(dispatchEventMock).toHaveBeenCalled()
    })

    test('should handle onEnd when newIndex is undefined (e.g. drag cancelled)', () => {
      const itemToInteractWith = container?.children[1]
      if (!(itemToInteractWith instanceof HTMLElement)) {
        throw new Error()
      }

      const mockEvt = {
        item: itemToInteractWith,
        newIndex: undefined,
        oldIndex: 1
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const mockInstance = /** @type {any} */ (Sortable)._getMockInstance()

      if (!itemReorderInstance) {
        throw new Error()
      }

      const updateVisualsSpy = jest.spyOn(itemReorderInstance, 'updateVisuals')
      const updateMoveButtonsSpy = jest.spyOn(
        itemReorderInstance,
        'updateMoveButtons'
      )
      const updateHiddenDataSpy = jest.spyOn(
        itemReorderInstance,
        'updateHiddenItemOrderData'
      )
      const announceReorderSpy = jest.spyOn(
        itemReorderInstance,
        'announceReorder'
      )
      const setAttributeSpy = jest.spyOn(itemToInteractWith, 'setAttribute')
      const itemFocusSpy = jest.spyOn(itemToInteractWith, 'focus')

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      mockInstance._onEndHandler(mockEvt)

      expect(updateVisualsSpy).toHaveBeenCalled()
      expect(updateMoveButtonsSpy).toHaveBeenCalled()
      expect(updateHiddenDataSpy).toHaveBeenCalled()
      expect(announceReorderSpy).not.toHaveBeenCalled()
      expect(setAttributeSpy).toHaveBeenCalledWith('tabindex', '-1')
      expect(itemFocusSpy).toHaveBeenCalled()

      expect(itemToInteractWith.classList.contains('reorder-panel-focus')).toBe(
        true
      )
    })

    test('should not throw if container is null during querySelectorAllHelper call', () => {
      if (!itemReorderInstance) throw new Error('Test setup')
      const mockEvt = { item: document.createElement('li'), newIndex: 0 }
      const originalContainer = itemReorderInstance.container
      itemReorderInstance.container = null
      const panelFocusClass = itemReorderInstance.panelFocusClass
      const item = mockEvt.item
      const addClassSpy = jest.spyOn(item.classList, 'add')

      expect(() =>
        itemReorderInstance?.handleSortableEnd(
          /** @type {Sortable.SortableEvent} */ (/** @type {any} */ (mockEvt))
        )
      ).not.toThrow()

      expect(addClassSpy).toHaveBeenCalledWith(panelFocusClass)
      itemReorderInstance.container = originalContainer
    })

    test('should not throw if container is null during querySelectorAll call in else block', () => {
      if (!itemReorderInstance) throw new Error('Test setup')
      const mockEvt = {
        item: document.createElement('li'),
        newIndex: undefined
      }
      const originalContainer = itemReorderInstance.container
      itemReorderInstance.container = null
      const panelFocusClass = itemReorderInstance.panelFocusClass
      const item = mockEvt.item
      const addClassSpy = jest.spyOn(item.classList, 'add')

      expect(() =>
        itemReorderInstance?.handleSortableEnd(
          /** @type {Sortable.SortableEvent} */ (/** @type {any} */ (mockEvt))
        )
      ).not.toThrow()

      expect(addClassSpy).toHaveBeenCalledWith(panelFocusClass)
      itemReorderInstance.container = originalContainer
    })

    test('should do nothing if movedItem is not an HTMLElement', () => {
      if (!itemReorderInstance) throw new Error('Test setup')
      const mockNode = document.createTextNode('text')
      const mockEvt = {
        item: mockNode,
        newIndex: 0,
        oldIndex: 1
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const mockSorteableInstance = /** @type {any} */ (
        Sortable
      )._getMockInstance()
      const updateVisualsSpy = jest.spyOn(itemReorderInstance, 'updateVisuals')

      const announceReorderSpy = jest
        .spyOn(itemReorderInstance, 'announceReorder')
        .mockImplementation(() => undefined)
      const focusIfExistsSpy = jest.spyOn(ItemReorderModule, 'focusIfExists')

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      mockSorteableInstance._onEndHandler(mockEvt)

      expect(updateVisualsSpy).toHaveBeenCalled()
      expect(announceReorderSpy).toHaveBeenCalled()
      expect(focusIfExistsSpy).not.toHaveBeenCalled()

      announceReorderSpy.mockRestore()
      focusIfExistsSpy.mockRestore()
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

      if (!itemReorderInstance) {
        throw new Error()
      }

      const announceReorderSpy = jest.spyOn(
        itemReorderInstance,
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

      if (!itemReorderInstance) {
        throw new Error()
      }

      const announceReorderSpy = jest.spyOn(
        itemReorderInstance,
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

    test('should do nothing if event target is not an Element', () => {
      if (!itemReorderInstance || !container) throw new Error('Setup fail')
      const moveItemInDomSpy = jest.spyOn(itemReorderInstance, 'moveItemInDom')
      const mockEvent = {
        target: document.createTextNode('text'), // Not an element
        preventDefault: jest.fn()
      }
      itemReorderInstance.handleButtonClick(
        /** @type {MouseEvent} */ (/** @type {any} */ (mockEvent))
      )
      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
      expect(moveItemInDomSpy).not.toHaveBeenCalled()
    })

    test('should do nothing if button is not an HTMLButtonElement (e.g., closest returns null)', () => {
      if (!itemReorderInstance || !container) throw new Error('Setup fail')
      const moveItemInDomSpy = jest.spyOn(itemReorderInstance, 'moveItemInDom')
      // Simulate a click on an element that won't find a button with .reorder-button-js
      const nonButtonTarget = container.querySelector('.item-title') // Click on title
      if (!(nonButtonTarget instanceof HTMLElement))
        throw new Error('Setup fail')

      const mockEvent = {
        target: nonButtonTarget,
        preventDefault: jest.fn()
      }
      itemReorderInstance.handleButtonClick(
        /** @type {MouseEvent} */ (/** @type {any} */ (mockEvent))
      )
      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
      expect(moveItemInDomSpy).not.toHaveBeenCalled()
    })

    test('should do nothing if itemToMove is not HTMLLIElement', () => {
      if (!itemReorderInstance || !container) throw new Error('Setup fail')
      const moveItemInDomSpy = jest.spyOn(itemReorderInstance, 'moveItemInDom')

      const buttonOutsideLi = document.createElement('button')
      buttonOutsideLi.classList.add('reorder-button-js')
      container.appendChild(buttonOutsideLi)

      const mockEvent = {
        target: buttonOutsideLi,
        preventDefault: jest.fn()
      }
      itemReorderInstance.handleButtonClick(
        /** @type {MouseEvent} */ (/** @type {any} */ (mockEvent))
      )
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(moveItemInDomSpy).not.toHaveBeenCalled()
      container.removeChild(buttonOutsideLi)
    })

    test('should do nothing if container is null when itemToMove is checked', () => {
      if (!itemReorderInstance || !container) throw new Error()
      const moveItemInDomSpy = jest.spyOn(itemReorderInstance, 'moveItemInDom')
      const upButton = container.querySelector(
        '[data-id="page2"] .js-reorderable-list-up'
      )
      if (!(upButton instanceof HTMLButtonElement)) throw new Error()

      const originalContainer = itemReorderInstance.container
      itemReorderInstance.container = null

      const mockEvent = { target: upButton, preventDefault: jest.fn() }
      itemReorderInstance.handleButtonClick(
        /** @type {MouseEvent} */ (/** @type {any} */ (mockEvent))
      )
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(moveItemInDomSpy).not.toHaveBeenCalled()
      itemReorderInstance.container = originalContainer
    })
  })

  describe('focusAfterMove scenarios via handleButtonClick', () => {
    beforeEach(() => {
      setupHTML()
      container = document.getElementById('items-container')
      if (container instanceof HTMLOListElement) {
        itemReorderInstance = initItemReorder(container)
      } else {
        throw new Error()
      }
      jest.clearAllMocks()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('Case 1: Up button clicked, Up button on moved item focusable', () => {
      if (!container || !itemReorderInstance) throw new Error()
      const itemToMove = /** @type {HTMLLIElement} */ (
        container.querySelector('[data-id="page3"]') // Item 3 moves to pos 2
      )
      const upButton = /** @type {HTMLButtonElement | null} */ (
        itemToMove.querySelector('.js-reorderable-list-up')
      )
      if (!upButton) throw new Error()

      const focusSpy = jest.spyOn(upButton, 'focus')

      upButton.click()

      expect(focusSpy).toHaveBeenCalledTimes(1)
    })

    test('Case 2: Up button clicked, Up button hidden, Down button focusable', () => {
      if (!container || !itemReorderInstance) throw new Error()
      const itemToMove = /** @type {HTMLLIElement} */ (
        container.querySelector('[data-id="page2"]') // Item 2 moves to pos 1
      )
      const upButton = /** @type {HTMLButtonElement | null} */ (
        itemToMove.querySelector('.js-reorderable-list-up')
      )
      const downButton = /** @type {HTMLButtonElement | null} */ (
        itemToMove.querySelector('.js-reorderable-list-down')
      )
      if (!upButton || !downButton) throw new Error()

      const focusSpy = jest.spyOn(downButton, 'focus')

      upButton.click()

      expect(focusSpy).toHaveBeenCalledTimes(1)
    })

    test('Case 3: Down button clicked, Down button on moved item focusable', () => {
      if (!container || !itemReorderInstance) throw new Error()
      const itemToMove = /** @type {HTMLLIElement} */ (
        container.querySelector('[data-id="page1"]') // Item 1 moves to pos 2
      )
      const downButton = /** @type {HTMLButtonElement | null} */ (
        itemToMove.querySelector('.js-reorderable-list-down')
      )
      if (!downButton) throw new Error()

      const focusSpy = jest.spyOn(downButton, 'focus')

      downButton.click()

      expect(focusSpy).toHaveBeenCalledTimes(1)
    })

    test('Case 4: Down button clicked, Down button hidden, Up button focusable', () => {
      if (!container || !itemReorderInstance) throw new Error()
      const itemToMove = /** @type {HTMLLIElement} */ (
        container.querySelector('[data-id="page2"]') // Item 2 moves to pos 3
      )
      const downButton = /** @type {HTMLButtonElement | null} */ (
        itemToMove.querySelector('.js-reorderable-list-down')
      )
      const upButton = /** @type {HTMLButtonElement | null} */ (
        itemToMove.querySelector('.js-reorderable-list-up')
      )
      if (!upButton || !downButton) throw new Error()

      const focusSpy = jest.spyOn(upButton, 'focus')

      downButton.click()

      expect(focusSpy).toHaveBeenCalledTimes(1)
    })

    test('Case 5 (Else): Moved item focused if its buttons are missing/unfocusable', () => {
      if (!itemReorderInstance) throw new Error()
      const movedItemWithNoButtons = document.createElement('li')
      movedItemWithNoButtons.dataset.id = 'special'
      movedItemWithNoButtons.setAttribute('tabindex', '-1')
      document.body.appendChild(movedItemWithNoButtons)

      const focusSpy = jest.spyOn(movedItemWithNoButtons, 'focus')

      itemReorderInstance.focusAfterMove(movedItemWithNoButtons, true)
      expect(focusSpy).toHaveBeenCalledTimes(1)

      focusSpy.mockClear()
      itemReorderInstance.focusAfterMove(movedItemWithNoButtons, false)
      expect(focusSpy).toHaveBeenCalledTimes(1)

      document.body.removeChild(movedItemWithNoButtons)
    })
  })

  test('updateVisuals should update item numbers and aria-labels', () => {
    itemReorderInstance?.updateVisuals()

    const items = container?.querySelectorAll('.app-reorderable-list__item')
    if (!items) {
      throw new Error()
    }
    const upButton1 = items[0].querySelector('.js-reorderable-list-up')
    const downButton1 = items[0].querySelector('.js-reorderable-list-down')
    const upButton2 = items[1].querySelector('.js-reorderable-list-up')
    const downButton2 = items[1].querySelector('.js-reorderable-list-down')

    expect(items[0].querySelector('.item-number')?.textContent).toBe('Page 1')
    expect(items[1].querySelector('.item-number')?.textContent).toBe('Page 2')
    expect(items[2].querySelector('.item-number')?.textContent).toBe('Page 3')

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

  test('updateVisuals should return early if container is null', () => {
    if (!itemReorderInstance) throw new Error('Setup fail')
    const querySelectorAllSpy = jest.spyOn(
      ItemReorderModule,
      'querySelectorAllHelper'
    )
    const originalContainer = itemReorderInstance.container
    itemReorderInstance.container = null
    itemReorderInstance.updateVisuals()
    expect(querySelectorAllSpy).not.toHaveBeenCalled()
    itemReorderInstance.container = originalContainer
    querySelectorAllSpy.mockRestore()
  })

  test('updateVisuals should handle item missing item-number element', () => {
    if (!itemReorderInstance || !container) throw new Error()
    const firstItem = /** @type {HTMLElement} */ (container.children[0])
    const numberElement = firstItem.querySelector('.item-number')
    const titleElement = firstItem.querySelector('.item-title')
    const originalTitle = titleElement?.textContent // Should be "Page One Title"

    if (numberElement) {
      numberElement.remove() // Remove the page number element
    }

    itemReorderInstance.updateVisuals() // Call the function

    // Check that it didn't throw and other things are still updated (e.g., aria-label for buttons)
    const upButton1 = firstItem.querySelector('.js-reorderable-list-up')
    expect(upButton1?.getAttribute('aria-label')).toContain(originalTitle)
    // Check that the (now non-existent) numberElement was not attempted to be updated
    // No direct assertion here, but lack of error is key.
    // And the page number in aria-label should still be correct based on index
    // Update the regex to match the actual title from setupHTML
    expect(upButton1?.getAttribute('aria-label')).toMatch(
      /Page 1 of \d+: Page One Title/ // Corrected Title
    )

    // Restore for other tests if necessary by re-running setupHTML or adding it back
    // Re-setting up HTML is cleaner than trying to add the element back perfectly
    setupHTML()
    container = document.getElementById('items-container')
    if (container instanceof HTMLOListElement) {
      itemReorderInstance = initItemReorder(container)
    } else {
      // Handle case where container might not be found after reset, maybe throw?
      throw new Error(
        'Failed to re-initialize container after setupHTML reset.'
      )
    }
  })

  test('updateMoveButtons should show/hide buttons correctly', () => {
    itemReorderInstance?.updateMoveButtons()

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

  test('updateMoveButtons should return early if container is null', () => {
    if (!itemReorderInstance) throw new Error('Setup fail')
    const querySelectorAllSpy = jest.spyOn(
      ItemReorderModule,
      'querySelectorAllHelper'
    )
    const originalContainer = itemReorderInstance.container
    itemReorderInstance.container = null
    itemReorderInstance.updateMoveButtons()
    expect(querySelectorAllSpy).not.toHaveBeenCalled()
    itemReorderInstance.container = originalContainer // Restore
    querySelectorAllSpy.mockRestore()
  })

  test('updateMoveButtons should hide buttons on fixed item', () => {
    setupHTML(true)

    const fixedContainer = document.getElementById('items-container')
    if (fixedContainer instanceof HTMLOListElement) {
      itemReorderInstance = initItemReorder(fixedContainer)
    } else {
      throw new Error()
    }

    if (!itemReorderInstance || !container) {
      throw new Error()
    }

    itemReorderInstance.updateMoveButtons()

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

  test('updateHiddenItemOrderData should set comma-separated IDs', () => {
    itemReorderInstance?.updateHiddenItemOrderData()
    if (!itemOrderInput) {
      throw new Error()
    }
    expect(itemOrderInput.value).toBe('page1,page2,page3')

    const item1 = container?.querySelector('[data-id="page1"]')
    const item2 = container?.querySelector('[data-id="page2"]')
    if (!item1 || !item2 || !container) {
      throw new Error()
    }
    container.insertBefore(item1, item2.nextSibling)

    itemReorderInstance?.updateHiddenItemOrderData()
    expect(itemOrderInput.value).toBe('page2,page1,page3')
  })

  test('updateHiddenItemOrderData should return early if container is null', () => {
    if (!itemReorderInstance || !itemOrderInput) throw new Error('Setup fail')
    const originalValue = itemOrderInput.value
    const originalContainer = itemReorderInstance.container
    itemReorderInstance.container = null
    itemReorderInstance.updateHiddenItemOrderData()
    expect(itemOrderInput.value).toBe(originalValue)
    itemReorderInstance.container = originalContainer
  })

  test('updateHiddenItemOrderData should return early if itemOrderInput is null', () => {
    if (!itemReorderInstance || !itemOrderInput) throw new Error('Setup fail')
    const originalContainer = itemReorderInstance.container
    const querySelectorAllSpy = jest.spyOn(
      ItemReorderModule,
      'querySelectorAllHelper'
    )

    const originalItemOrderInput = itemReorderInstance.itemOrderInput
    itemReorderInstance.itemOrderInput = null
    itemReorderInstance.updateHiddenItemOrderData()
    expect(querySelectorAllSpy).not.toHaveBeenCalled()
    itemReorderInstance.itemOrderInput = originalItemOrderInput
    itemReorderInstance.container = originalContainer
    querySelectorAllSpy.mockRestore()
  })

  test('announceReorder should update live region and clear it later', () => {
    const item = container?.querySelector('[data-id="page2"]')
    if (!item) {
      throw new Error()
    }
    itemReorderInstance?.announceReorder(/** @type {HTMLElement} */ (item), 1)

    jest.advanceTimersByTime(200)
    expect(announcementRegion?.textContent).toBe(
      'List reordered, Page Two Title is now page 1 of 3.'
    )

    jest.advanceTimersByTime(5100)
    expect(announcementRegion?.textContent).toBe('')
  })

  test('announceReorder should return early if announcementRegion is null', () => {
    if (!itemReorderInstance || !container || !announcementRegion)
      throw new Error('Setup fail')
    const item = container.querySelector('[data-id="page2"]')
    if (!item) throw new Error('Setup fail')

    const originalText = announcementRegion.textContent
    const originalRegion = itemReorderInstance.announcementRegion
    itemReorderInstance.announcementRegion = null

    jest.spyOn(global, 'clearTimeout')

    // @ts-expect-error TS doesn't recognise clearTimeout as a Jest mock here, but it is at runtime
    itemReorderInstance.announceReorder(item, 1)
    expect(announcementRegion.textContent).toBe(originalText)
    expect(clearTimeout).not.toHaveBeenCalled()

    itemReorderInstance.announcementRegion = originalRegion
    jest.restoreAllMocks()
  })

  test('announceReorder should return early if container is null', () => {
    if (!itemReorderInstance || !announcementRegion)
      throw new Error('Setup fail')
    const item = document.createElement('li')
    item.innerHTML = '<h2 class="item-title">Test</h2>'

    const originalText = announcementRegion.textContent
    const originalContainer = itemReorderInstance.container
    itemReorderInstance.container = null

    jest.spyOn(global, 'clearTimeout')

    itemReorderInstance.announceReorder(item, 1)
    expect(announcementRegion.textContent).toBe(originalText)
    expect(clearTimeout).not.toHaveBeenCalled()

    itemReorderInstance.container = originalContainer
    jest.restoreAllMocks()
  })

  describe('findMoveTarget', () => {
    test('should return null target and insertBeforeItem when trying to move first item up', () => {
      if (!container || !itemReorderInstance) throw new Error('Setup failed')
      const firstItem = /** @type {HTMLElement} */ (container.children[0])
      const { targetItem, insertBeforeItem } =
        itemReorderInstance.findMoveTarget(firstItem, true)
      expect(targetItem).toBeNull()
      expect(insertBeforeItem).toBeNull()
    })

    test('should return null target and insertBeforeItem when trying to move last item down', () => {
      if (!container || !itemReorderInstance) throw new Error('Setup failed')
      const items = container.children
      const lastItem = /** @type {HTMLElement} */ (items[items.length - 1])
      const { targetItem, insertBeforeItem } =
        itemReorderInstance.findMoveTarget(lastItem, false)
      expect(targetItem).toBeNull()
      expect(insertBeforeItem).toBeNull()
    })

    test('should correctly identify target and insertBeforeItem when moving item up', () => {
      if (!container || !itemReorderInstance) throw new Error('Setup failed')
      const secondItem = /** @type {HTMLElement} */ (container.children[1]) // page2
      const firstItem = /** @type {HTMLElement} */ (container.children[0]) // page1
      const { targetItem, insertBeforeItem } =
        itemReorderInstance.findMoveTarget(secondItem, true) // Move page2 up
      expect(targetItem).toBe(firstItem)
      expect(insertBeforeItem).toBe(firstItem)
    })

    test('should correctly identify target and insertBeforeItem when moving item down', () => {
      if (!container || !itemReorderInstance) throw new Error('Setup failed')
      const firstItem = /** @type {HTMLElement} */ (container.children[0]) // page1
      const secondItem = /** @type {HTMLElement} */ (container.children[1]) // page2
      const thirdItem = /** @type {HTMLElement} */ (container.children[2]) // page3
      const { targetItem, insertBeforeItem } =
        itemReorderInstance.findMoveTarget(firstItem, false) // Move page1 down
      expect(targetItem).toBe(secondItem)
      expect(insertBeforeItem).toBe(thirdItem)
    })

    describe('with fixed item at the end', () => {
      beforeEach(() => {
        setupHTML(true)
        container = document.getElementById('items-container')
        if (container instanceof HTMLOListElement) {
          itemReorderInstance = initItemReorder(container)
        } else {
          throw new Error()
        }
      })

      test('should return null when trying to move last movable item down (towards fixed item)', () => {
        if (!container || !itemReorderInstance) throw new Error()

        const lastMovableItem = /** @type {HTMLElement} */ (
          container.querySelector('[data-id="page3"]')
        )
        const { targetItem, insertBeforeItem } =
          itemReorderInstance.findMoveTarget(lastMovableItem, false)

        expect(targetItem).toBeNull()
        expect(insertBeforeItem).toBeNull()
      })

      test('should correctly find target when moving item up, skipping fixed item', () => {
        if (!container || !itemReorderInstance) throw new Error()

        const page2Item = /** @type {HTMLElement} */ (
          container.querySelector('[data-id="page2"]')
        )
        const page1Item = /** @type {HTMLElement} */ (
          container.querySelector('[data-id="page1"]')
        )

        const { targetItem, insertBeforeItem } =
          itemReorderInstance.findMoveTarget(page2Item, true)
        expect(targetItem).toBe(page1Item)
        expect(insertBeforeItem).toBe(page1Item)
      })

      test('should correctly find target when moving item down, with fixed item further down', () => {
        if (!container || !itemReorderInstance) throw new Error()

        const page1Item = /** @type {HTMLElement} */ (
          container.querySelector('[data-id="page1"]')
        )
        const page2Item = /** @type {HTMLElement} */ (
          container.querySelector('[data-id="page2"]')
        )
        const page3Item = /** @type {HTMLElement} */ (
          container.querySelector('[data-id="page3"]')
        )

        const { targetItem, insertBeforeItem } =
          itemReorderInstance.findMoveTarget(page1Item, false) // Moving page1 down
        expect(targetItem).toBe(page2Item) // The item to move past
        expect(insertBeforeItem).toBe(page3Item) // Insert before page3
      })
    })
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

describe('Module Initialisation', () => {
  /**
   * @type {jest.SpyInstance<ItemReorder | null, [container: Element], any>}
   */
  let initItemReorderSpy

  beforeEach(() => {
    initItemReorderSpy = jest.spyOn(ItemReorderModule, 'initItemReorder')
    document.body.innerHTML = ''
  })

  afterEach(() => {
    initItemReorderSpy.mockRestore()
  })

  test('initItemReorder (module) should not initialize if container is not HTMLElement', () => {
    const notAnElement = document.createTextNode('text')
    // @ts-expect-error testing invalid type
    const result = ItemReorderModule.initItemReorder(notAnElement)
    expect(result).toBeNull()
  })

  test('initItemReorder (module) should not initialize if data-module is incorrect', () => {
    const div = document.createElement('div')
    div.dataset.module = 'wrong-module'
    document.body.appendChild(div)
    const result = ItemReorderModule.initItemReorder(div)
    expect(result).toBeNull()
  })

  test('initItemReorder (module) should not initialize if data-module is missing', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const result = ItemReorderModule.initItemReorder(div)
    expect(result).toBeNull()
  })
})
