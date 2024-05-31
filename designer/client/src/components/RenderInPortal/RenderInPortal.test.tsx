import { describe, expect, test } from '@jest/globals'
import enzyme from 'enzyme'
import React from 'react'

import { RenderInPortal } from '~/src/components/RenderInPortal/index.js'

const { mount } = enzyme

describe('RenderInPortal component', () => {
  test('renders paragraph inside portal', () => {
    let portalRoot = document.getElementById('portal-root')

    expect(portalRoot?.innerHTML).toBe('')

    const wrapper = mount(
      <RenderInPortal>
        <p id="test-paragraph">Test</p>
      </RenderInPortal>
    )
    portalRoot = document.getElementById('portal-root')
    expect(portalRoot?.innerHTML).toBe(
      '<div><p id="test-paragraph">Test</p></div>'
    )

    wrapper.unmount()
    portalRoot = document.getElementById('portal-root')
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

    let portalRoot = document.getElementById('portal-root')
    expect(portalRoot?.innerHTML).toBe(
      '<div><p id="test-paragraph1">Test 1</p></div><div><p id="test-paragraph2">Test 2</p></div>'
    )

    wrapper1.unmount()
    portalRoot = document.getElementById('portal-root')
    expect(portalRoot?.innerHTML).toBe(
      '<div><p id="test-paragraph2">Test 2</p></div>'
    )

    wrapper2.unmount()
    portalRoot = document.getElementById('portal-root')
    expect(portalRoot?.innerHTML).toBe('')
  })
})
