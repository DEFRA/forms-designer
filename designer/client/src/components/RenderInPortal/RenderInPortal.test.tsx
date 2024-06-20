import { mount } from 'enzyme'
import React from 'react'

import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'

describe('RenderInPortal component', () => {
  let portalRoot: HTMLElement | null

  beforeEach(() => {
    portalRoot = document.getElementById('portal-root')
  })

  test('renders paragraph inside portal', () => {
    expect(portalRoot?.innerHTML).toBe('')

    const wrapper = mount(
      <RenderInPortal>
        <p id="test-paragraph">Test</p>
      </RenderInPortal>
    )

    expect(portalRoot?.innerHTML).toBe(
      '<div><p id="test-paragraph">Test</p></div>'
    )

    wrapper.unmount()

    expect(portalRoot?.innerHTML).toBe('')
  })

  test('renders multiple portals in parallel', () => {
    const wrapper1 = mount(
      <RenderInPortal>
        <p id="test-paragraph1">Test 1</p>
      </RenderInPortal>
    )

    const wrapper2 = mount(
      <RenderInPortal>
        <p id="test-paragraph2">Test 2</p>
      </RenderInPortal>
    )

    expect(portalRoot?.innerHTML).toBe(
      '<div><p id="test-paragraph1">Test 1</p></div><div><p id="test-paragraph2">Test 2</p></div>'
    )

    wrapper1.unmount()

    expect(portalRoot?.innerHTML).toBe(
      '<div><p id="test-paragraph2">Test 2</p></div>'
    )

    wrapper2.unmount()

    expect(portalRoot?.innerHTML).toBe('')
  })
})
