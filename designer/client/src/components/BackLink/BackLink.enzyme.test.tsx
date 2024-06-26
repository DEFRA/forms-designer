import { shallow } from 'enzyme'
import React from 'react'

import { BackLink } from '~/src/components/BackLink/BackLink.jsx'

describe('BackLink Component', () => {
  test('it renders correctly', () => {
    const wrapper = shallow(<BackLink>Go Back</BackLink>)
    expect(wrapper.text()).toBe('Go Back')
    expect(wrapper.props()).toEqual(
      expect.objectContaining({
        className: 'govuk-back-link'
      })
    )
  })

  test('it passes href prop', () => {
    const wrapper = shallow(<BackLink href="test">Go Back</BackLink>)
    expect(wrapper.text()).toBe('Go Back')
    expect(wrapper.prop('href')).toBe('test')
  })

  test('it passes onClick prop', () => {
    const onClick = jest.fn()
    const wrapper = shallow(<BackLink onClick={onClick}>Go Back</BackLink>)

    wrapper.simulate('click')
    expect(onClick).toHaveBeenCalled()
  })
})
