import { ControllerType, getPageDefaults } from '@defra/forms-model'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { ComponentCreateList } from '~/src/components/ComponentCreate/ComponentCreateList.jsx'

describe('ComponentCreateList', () => {
  const page = getPageDefaults({
    controller: ControllerType.Page
  })

  const onSelectComponent = jest.fn()

  afterEach(cleanup)

  test('should match snapshot', () => {
    const { asFragment } = render(
      <ComponentCreateList page={page} onSelectComponent={onSelectComponent} />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
