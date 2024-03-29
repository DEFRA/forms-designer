import React from 'react'
import { cleanup, render } from '@testing-library/react'
import { ComponentCreateList } from './ComponentCreateList'

describe('ComponentCreateList', () => {
  afterEach(cleanup)

  test('should match snapshot', async () => {
    const onSelectComponent = jest.fn()
    const { asFragment } = render(
      <ComponentCreateList onSelectComponent={onSelectComponent} />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
