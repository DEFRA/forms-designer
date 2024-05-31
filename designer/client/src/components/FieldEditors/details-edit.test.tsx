import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import DetailsEdit from '~/src/components/FieldEditors/details-edit.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'

describe('details-edit', () => {
  afterEach(cleanup)

  function TestComponentWithContext({ children }) {
    return (
      <ComponentContext.Provider
        value={{ state: { selectedComponent: {} }, dispatch: jest.fn() }}
      >
        {children}
      </ComponentContext.Provider>
    )
  }

  it('Should render with correct screen text', () => {
    const { container } = render(
      <TestComponentWithContext>
        <DetailsEdit context={ComponentContext}></DetailsEdit>
      </TestComponentWithContext>
    )

    expect(container).toHaveTextContent(
      'Enter the name to show for this component'
    )

    expect(container).toHaveTextContent(
      'Enter the text you want to show when users expand the title. You can apply basic HTML, such as text formatting and hyperlinks.'
    )
  })
})
