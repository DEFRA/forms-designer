import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { ComponentCreateList } from '~/src/components/ComponentCreate/ComponentCreateList.jsx'

describe('ComponentCreateList', () => {
  afterEach(cleanup)

  test('should match snapshot', () => {
    const onSelectComponent = jest.fn()
    const { asFragment } = render(
      <ComponentCreateList onSelectComponent={onSelectComponent} />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
