import { type ReactWrapper, mount } from 'enzyme'
import React from 'react'

import { useFlyoutEffect } from '~/src/components/Flyout/Flyout.jsx'
import { FlyoutContext } from '~/src/context/FlyoutContext.js'

function HookWrapper(
  props: Readonly<{
    hook: () => ReturnType<typeof useFlyoutEffect>
  }>
) {
  return <div style={props.hook().style} />
}

describe('useFlyoutContext', () => {
  const increment = jest.fn()
  const decrement = jest.fn()
  let wrapper: ReactWrapper | undefined

  afterEach(() => {
    if (!wrapper?.exists()) {
      return
    }

    wrapper.unmount()
  })

  test('Increment is called on mount', () => {
    wrapper = mount(
      <FlyoutContext.Provider value={{ count: 0, increment, decrement }}>
        <HookWrapper hook={() => useFlyoutEffect()} />
      </FlyoutContext.Provider>
    )

    expect(increment).toHaveBeenCalledTimes(1)
    expect(decrement).not.toHaveBeenCalled()
  })

  test('Decrement is called on unmount', () => {
    wrapper = mount(
      <FlyoutContext.Provider value={{ count: 0, increment, decrement }}>
        <HookWrapper hook={() => useFlyoutEffect()} />
      </FlyoutContext.Provider>
    )

    wrapper.unmount()
    expect(increment).toHaveBeenCalledTimes(1)
    expect(decrement).toHaveBeenCalledTimes(1)
  })

  test('flyout is offset by correct amount', () => {
    expect(increment).not.toHaveBeenCalled()

    wrapper = mount(
      <FlyoutContext.Provider value={{ count: 1, increment, decrement }}>
        <HookWrapper hook={() => useFlyoutEffect()} />
      </FlyoutContext.Provider>
    )

    expect(increment).toHaveBeenCalledTimes(1)
    expect(wrapper.find('div').props().style).toEqual({
      paddingLeft: '50px',
      transform: 'translateX(-50px)',
      position: 'relative'
    })
  })
})
