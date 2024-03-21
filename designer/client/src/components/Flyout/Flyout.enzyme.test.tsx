import { mount } from 'enzyme'
import React from 'react'

import { useFlyoutEffect } from '~/src/components/Flyout/Flyout.jsx'
import { FlyoutContext } from '~/src/context/index.js'

function HookWrapper(props) {
  const hook = props.hook ? props.hook() : undefined
  // @ts-ignore
  // eslint-disable-next-line react/no-unknown-property
  return <div hook={hook} />
}

describe('useFlyoutContext', () => {
  const increment = jest.fn()
  const decrement = jest.fn()
  let wrapper

  afterEach(() => {
    wrapper?.exists() && wrapper.unmount()
  })

  test('Increment is called on mount', () => {
    const flyoutContextProviderValue = { count: 0, increment, decrement }
    wrapper = mount(
      <FlyoutContext.Provider value={flyoutContextProviderValue}>
        <HookWrapper hook={() => useFlyoutEffect({ show: true })} />
      </FlyoutContext.Provider>
    )
    expect(increment).toHaveBeenCalledTimes(1)
    expect(decrement).not.toHaveBeenCalled()
  })

  test('Decrement is called on unmount', () => {
    const flyoutContextProviderValue = { count: 0, increment, decrement }
    wrapper = mount(
      <FlyoutContext.Provider value={flyoutContextProviderValue}>
        <HookWrapper hook={() => useFlyoutEffect({ show: true })} />
      </FlyoutContext.Provider>
    )

    wrapper.unmount()
    expect(increment).toHaveBeenCalledTimes(1)
    expect(decrement).toHaveBeenCalledTimes(1)
  })

  test('flyout is offset by correct amount', () => {
    const flyoutContextProviderValue = {
      count: 1,
      increment,
      decrement
    }
    expect(increment).not.toHaveBeenCalled()
    wrapper = mount(
      <FlyoutContext.Provider value={flyoutContextProviderValue}>
        <HookWrapper hook={() => useFlyoutEffect({ show: true })} />
      </FlyoutContext.Provider>
    )

    const { hook } = wrapper.find('div').props()
    wrapper.mount()
    const { style } = hook
    expect(increment).toHaveBeenCalledTimes(1)

    expect(style).toEqual({
      paddingLeft: '50px',
      transform: 'translateX(-50px)',
      position: 'relative'
    })
  })
})
