import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test
} from '@jest/globals'
import enzyme from 'enzyme'
import React from 'react'

import { PageLinkage } from '~/src/components/PageLinkage/index.js'
import { addLink } from '~/src/data/index.js'

jest.mock('~/src/data/page/addLink')

const { shallow } = enzyme

describe('Page Linkage', () => {
  let page
  let data
  let layout
  let props
  let event

  beforeAll(() => {
    window.pageYOffset = 10
  })

  beforeEach(() => {
    page = {
      path: '/home',
      title: 'Home'
    }

    data = {
      pages: [{ path: '/1' }, { path: '/2' }],
      sections: []
    }

    layout = {
      node: {
        label: '/summary',
        width: 240,
        height: 141,
        x: 170,
        y: 411.5
      },
      top: '341px',
      left: '50px'
    }

    event = {
      clientX: 100,
      clientY: 100,
      preventDefault: jest.fn(),
      dataTransfer: {
        setData: jest.fn(),
        getData: jest.fn(() => JSON.stringify(page))
      }
    }

    props = { page, data, layout }
  })

  afterAll(() => {
    window.pageYOffset = 0
  })

  test('Drag area is rendered', () => {
    const wrapper = shallow(<PageLinkage {...props} />)
    const dragArea = wrapper.find('.page-linkage__drag-area').first()
    expect(dragArea.exists()).toBe(true)
  })

  test('Highlight area is not rendered', () => {
    const wrapper = shallow(<PageLinkage {...props} />)
    const highlightArea = wrapper.find('.page-linkage__highlight-area').first()
    expect(highlightArea.exists()).toBe(false)
  })

  test('Highlight area is rendered on drag start', () => {
    const wrapper = shallow(<PageLinkage {...props} />)
    const dragArea = wrapper.find('.page-linkage__drag-area').first()
    let highlightArea = wrapper.find('.page-linkage__highlight-area').first()

    expect(highlightArea.exists()).toBe(false)

    dragArea.prop('onDragStart')(event)
    highlightArea = wrapper.find('.page-linkage__highlight-area').first()
    expect(highlightArea.exists()).toBe(true)
  })

  test('Highlight area is rendered on drag over', () => {
    const wrapper = shallow(<PageLinkage {...props} />)
    const dragArea = wrapper.find('.page-linkage__drag-area').first()
    let highlightArea = wrapper.find('.page-linkage__highlight-area').first()

    expect(highlightArea.exists()).toBe(false)

    dragArea.prop('onDragOver')(event)
    highlightArea = wrapper.find('.page-linkage__highlight-area').first()
    expect(highlightArea.exists()).toBe(true)
    expect(event.preventDefault).toHaveBeenCalled()
  })

  test('Highlight area is removed on drop', async () => {
    const wrapper = shallow(<PageLinkage {...props} />)
    const dragArea = wrapper.find('.page-linkage__drag-area').first()
    let highlightArea = wrapper.find('.page-linkage__highlight-area').first()

    expect(highlightArea.exists()).toBe(false)

    dragArea.prop('onDragOver')(event)
    highlightArea = wrapper.find('.page-linkage__highlight-area').first()
    expect(highlightArea.exists()).toBe(true)
    expect(event.preventDefault).toHaveBeenCalled()

    await dragArea.prop('onDrop')(event)
    highlightArea = wrapper.find('.page-linkage__highlight-area').first()
    expect(highlightArea.exists()).toBe(false)
  })

  test('Highlight area is removed on drag end', () => {
    const wrapper = shallow(<PageLinkage {...props} />)
    const dragArea = wrapper.find('.page-linkage__drag-area').first()
    let highlightArea = wrapper.find('.page-linkage__highlight-area').first()

    expect(highlightArea.exists()).toBe(false)

    dragArea.prop('onDragOver')(event)
    highlightArea = wrapper.find('.page-linkage__highlight-area').first()
    expect(highlightArea.exists()).toBe(true)
    expect(event.preventDefault).toHaveBeenCalled()

    dragArea.prop('onDragEnd')(event)
    highlightArea = wrapper.find('.page-linkage__highlight-area').first()
    expect(highlightArea.exists()).toBe(false)
  })

  test('Arrow svg renders correctly on drag', () => {
    const wrapper = shallow(<PageLinkage {...props} />)
    const dragArea = wrapper.find('.page-linkage__drag-area').first()
    dragArea.prop('onDragStart')(event)

    const svg = wrapper.find('RenderInPortal').first().children()
    const line = svg.find('line').first()

    expect(line.props()).toEqual(
      expect.objectContaining({
        x1: event.pageX,
        y1: event.pageY,
        x2: event.pageX,
        y2: event.pageY
      })
    )
  })

  test('Arrow svg updates correctly on drag move', () => {
    const wrapper = shallow(<PageLinkage {...props} />)
    const dragArea = wrapper.find('.page-linkage__drag-area').first()
    dragArea.prop('onDragStart')(event)

    let svg = wrapper.find('RenderInPortal').first().children()
    let line = svg.find('line').first()

    expect(line.props()).toEqual(
      expect.objectContaining({
        x1: event.pageX,
        y1: event.pageY,
        x2: event.pageX,
        y2: event.pageY
      })
    )

    dragArea.prop('onDrag')({ pageX: 200, pageY: 200 })
    svg = wrapper.find('RenderInPortal').first().children()
    line = svg.find('line').first()

    expect(line.props()).toEqual(
      expect.objectContaining({
        x1: event.pageX,
        y1: event.pageY,
        x2: 200,
        y2: 200
      })
    )
  })

  test('Arrow svg is removed on drop', async () => {
    const wrapper = shallow(<PageLinkage {...props} />)
    const dragArea = wrapper.find('.page-linkage__drag-area').first()
    dragArea.prop('onDragStart')(event)

    let svg = wrapper.find('RenderInPortal').first().children()
    expect(svg.exists()).toBe(true)

    await dragArea.prop('onDrop')(event)
    svg = wrapper.find('RenderInPortal').first().children()
    expect(svg.exists()).toBe(false)
  })

  test('Arrow svg is removed on drag end', () => {
    const wrapper = shallow(<PageLinkage {...props} />)
    const dragArea = wrapper.find('.page-linkage__drag-area').first()
    dragArea.prop('onDragStart')(event)

    let svg = wrapper.find('RenderInPortal').first().children()
    expect(svg.exists()).toBe(true)

    dragArea.prop('onDragEnd')(event)
    svg = wrapper.find('RenderInPortal').first().children()
    expect(svg.exists()).toBe(false)
  })

  test('DragStart event correctly sets page data for transfer', () => {
    const wrapper = shallow(<PageLinkage {...props} />)
    const dragArea = wrapper.find('.page-linkage__drag-area').first()
    dragArea.prop('onDragStart')(event)
    expect(jest.mocked(event.dataTransfer.setData).mock.calls[0]).toEqual([
      'linkingPage',
      JSON.stringify(page)
    ])
  })

  test('Pages is not linked to itself', async () => {
    const draggedPage = JSON.parse(event.dataTransfer.getData())
    const wrapper = shallow(<PageLinkage {...props} page={draggedPage} />)
    const dragArea = wrapper.find('.page-linkage__drag-area').first()

    await dragArea.prop('onDrop')(event)
    expect(addLink).not.toHaveBeenCalled()
  })
})
