import {
  ComponentType,
  getComponentDefaults,
  type ComponentDef,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { ComponentTypeEdit } from '~/src/ComponentTypeEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('ComponentTypeEdit', () => {
  let data: FormDefinition

  beforeEach(() => {
    data = {
      pages: [
        {
          title: 'First page',
          path: '/first-page',
          components: [],
          controller: './pages/summary.js',
          section: 'home'
        }
      ],
      lists: [
        {
          name: 'myList',
          title: 'My list',
          type: 'string',
          items: [
            { text: 'text a', description: 'desc a', value: 'value a' },
            { text: 'text b', description: 'desc b', value: 'value b' }
          ]
        }
      ],
      sections: [],
      conditions: []
    }
  })

  afterEach(cleanup)

  describe.each([
    [
      ComponentType.CheckboxesField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        optional: true,
        selectList: true
      }
    ],
    [
      ComponentType.RadiosField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        optional: true,
        selectList: true
      }
    ],
    [
      ComponentType.SelectField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        optional: true,
        selectList: true
      }
    ],
    [
      ComponentType.UkAddressField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: true,
        optional: true,
        selectList: false
      }
    ],
    [
      ComponentType.YesNoField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        optional: true,
        selectList: false
      }
    ]
  ])('Component type edit: %s', (type, options) => {
    let selectedComponent: ComponentDef | undefined

    beforeEach(() => {
      selectedComponent = getComponentDefaults({ type })

      render(
        <RenderWithContext data={data} state={{ selectedComponent }}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )
    })

    if (options.title) {
      it("should render 'Title' input", () => {
        const $input = screen.queryByRole<HTMLInputElement>('textbox', {
          name: 'Title',
          description: 'Enter the name to show for this field'
        })

        expect($input).toBeInTheDocument()
        expect($input?.value).toBe(selectedComponent?.title)
      })
    } else {
      it("should not render 'Title' input", () => {
        const $input = screen.queryByRole('textbox', {
          name: 'Title'
        })

        expect($input).not.toBeInTheDocument()
      })
    }

    if (options.hint) {
      it("should render 'Help text (optional)' textarea", () => {
        const $textarea = screen.queryByRole<HTMLTextAreaElement>('textbox', {
          name: 'Help text (optional)',
          description: 'Enter the description to show for this field'
        })

        expect($textarea).toBeInTheDocument()
        expect($textarea?.value).toBe(
          selectedComponent && 'hint' in selectedComponent
            ? selectedComponent.hint
            : ''
        )
      })
    } else {
      it("should not render 'Help text (optional)' textarea", () => {
        const $textarea = screen.queryByRole('textbox', {
          name: 'Help text (optional)'
        })

        expect($textarea).not.toBeInTheDocument()
      })
    }

    if (options.hideTitle) {
      it("should render 'Hide title' checkbox", () => {
        const $checkbox = screen.queryByRole<HTMLInputElement>('checkbox', {
          name: 'Hide title',
          description:
            'Tick this box if you do not want the title to show on the page'
        })

        expect($checkbox).toBeInTheDocument()
        expect($checkbox?.checked).toBe(false)
      })
    } else {
      it("should not render 'Hide title' checkbox", () => {
        const $checkbox = screen.queryByRole('checkbox', {
          name: 'Hide title'
        })

        expect($checkbox).not.toBeInTheDocument()
      })
    }

    if (options.name) {
      it("should render 'Component name' input", () => {
        const $input = screen.queryByRole<HTMLInputElement>('textbox', {
          name: 'Component name',
          description:
            'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
        })

        expect($input).toBeInTheDocument()
        expect($input?.value).toBe(selectedComponent?.name)
      })
    } else {
      it("should not render 'Component name' input", () => {
        const $input = screen.queryByRole('textbox', {
          name: 'Component name'
        })

        expect($input).not.toBeInTheDocument()
      })
    }

    if (options.optional) {
      it("should render 'Make {{component}} optional' checkbox", () => {
        const $checkbox = screen.queryByRole<HTMLInputElement>('checkbox', {
          name: `Make ${selectedComponent?.title} optional`,
          description:
            'Tick this box if users do not need to complete this field to progress through the form'
        })

        expect($checkbox).toBeInTheDocument()
        expect($checkbox?.checked).toBe(false)
      })
    } else {
      it("should not render 'Make {{component}} optional' checkbox", () => {
        const $checkbox = screen.queryByRole('checkbox', {
          name: `Make ${selectedComponent?.title} optional`
        })

        expect($checkbox).not.toBeInTheDocument()
      })
    }

    if (options.selectList) {
      it("should render 'Select list' options", () => {
        const $select = screen.queryByRole<HTMLSelectElement>('combobox', {
          name: 'Select list',
          description:
            'Select an existing list to show in this field or add a new list'
        })

        expect($select).toBeInTheDocument()
        expect($select?.value).toBe(
          selectedComponent && 'list' in selectedComponent
            ? selectedComponent.list
            : ''
        )
      })
    } else {
      it("should not render 'Select list' options", () => {
        const $select = screen.queryByRole('combobox', {
          name: 'Select list'
        })

        expect($select).not.toBeInTheDocument()
      })
    }
  })
})
