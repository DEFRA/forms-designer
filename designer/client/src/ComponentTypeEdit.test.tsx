import {
  ComponentType,
  ConditionType,
  getComponentDefaults,
  hasConditionSupport,
  hasHint,
  hasListField,
  OperatorName,
  type ComponentDef,
  type FormDefinition
} from '@defra/forms-model'
import { screen, waitFor } from '@testing-library/dom'
import { act, cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import lowerFirst from 'lodash/lowerFirst.js'
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
          next: [],
          components: []
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
      conditions: [
        {
          name: 'someCondition',
          displayName: 'My condition',
          value: {
            name: 'My condition',
            conditions: [
              {
                field: {
                  name: 'field1',
                  display: 'Something',
                  type: ComponentType.YesNoField
                },
                operator: OperatorName.Is,
                value: {
                  type: ConditionType.Value,
                  value: 'true',
                  display: 'Yes'
                }
              }
            ]
          }
        }
      ]
    }
  })

  afterEach(cleanup)

  describe.each([
    [
      ComponentType.AutocompleteField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        content: false,
        optional: true,
        selectList: true,
        selectCondition: true
      }
    ],
    [
      ComponentType.CheckboxesField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        content: false,
        optional: true,
        selectList: true,
        selectCondition: true
      }
    ],
    [
      ComponentType.DatePartsField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        content: false,
        optional: true,
        selectList: false,
        selectCondition: true
      }
    ],
    [
      ComponentType.Details,
      {
        name: false,
        hint: false,
        title: true,
        hideTitle: false,
        content: true,
        optional: false,
        selectList: false,
        selectCondition: true
      }
    ],
    [
      ComponentType.EmailAddressField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        content: false,
        optional: true,
        selectList: false,
        selectCondition: true
      }
    ],
    [
      ComponentType.Html,
      {
        name: false,
        hint: false,
        title: false,
        hideTitle: false,
        content: true,
        optional: false,
        selectList: false,
        selectCondition: true
      }
    ],
    [
      ComponentType.InsetText,
      {
        name: false,
        hint: false,
        title: false,
        hideTitle: false,
        content: true,
        optional: false,
        selectList: false,
        selectCondition: false
      }
    ],
    [
      ComponentType.List,
      {
        name: false,
        hint: true,
        title: true,
        hideTitle: true,
        content: false,
        optional: false,
        selectList: true,
        selectCondition: false
      }
    ],
    [
      ComponentType.MonthYearField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        content: false,
        optional: true,
        selectList: false,
        selectCondition: false
      }
    ],
    [
      ComponentType.MultilineTextField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        content: false,
        optional: true,
        selectList: false,
        selectCondition: true
      }
    ],
    [
      ComponentType.NumberField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        content: false,
        optional: true,
        selectList: false,
        selectCondition: true
      }
    ],
    [
      ComponentType.RadiosField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        content: false,
        optional: true,
        selectList: true,
        selectCondition: true
      }
    ],
    [
      ComponentType.SelectField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        content: false,
        optional: true,
        selectList: true,
        selectCondition: true
      }
    ],
    [
      ComponentType.TelephoneNumberField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        content: false,
        optional: true,
        selectList: false,
        selectCondition: true
      }
    ],
    [
      ComponentType.TextField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        content: false,
        optional: true,
        selectList: false,
        selectCondition: true
      }
    ],
    [
      ComponentType.UkAddressField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: true,
        content: false,
        optional: true,
        selectList: false,
        selectCondition: false
      }
    ],
    [
      ComponentType.YesNoField,
      {
        name: true,
        hint: true,
        title: true,
        hideTitle: false,
        content: false,
        optional: true,
        selectList: false,
        selectCondition: true
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
          hasHint(selectedComponent) ? (selectedComponent.hint ?? '') : ''
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

    if (options.content) {
      it("should render 'Content' textarea", () => {
        const $textarea = screen.queryByRole<HTMLTextAreaElement>('textbox', {
          name: 'Content'
        })

        expect($textarea).toBeInTheDocument()
      })
    } else {
      it("should not render 'Content' textarea", () => {
        const $textarea = screen.queryByRole('textbox', {
          name: 'Content'
        })

        expect($textarea).not.toBeInTheDocument()
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
          name: `Make ${lowerFirst(selectedComponent?.title)} optional`,
          description:
            'Tick this box if users do not need to complete this field to progress through the form'
        })

        expect($checkbox).toBeInTheDocument()
        expect($checkbox?.checked).toBe(false)
      })

      it('should render "Hide \'(optional)\' text" checkbox when optional', async () => {
        const $checkbox1 = screen.getByRole<HTMLInputElement>('checkbox', {
          name: `Make ${lowerFirst(selectedComponent?.title)} optional`
        })

        expect($checkbox1).toBeInTheDocument()
        expect($checkbox1.checked).toBe(false)

        // Mark field as optional
        await act(() => userEvent.click($checkbox1))
        expect($checkbox1.checked).toBe(true)

        const $checkbox2 = await waitFor(() =>
          screen.getByRole<HTMLInputElement>('checkbox', {
            name: "Hide '(optional)' text",
            description:
              'Tick this box if you do not want the title to indicate that this field is optional'
          })
        )

        expect($checkbox2).toBeInTheDocument()
        expect($checkbox2.checked).toBe(false)
      })

      it('should not render "Hide \'(optional)\' text" checkbox when required', () => {
        const $checkbox1 = screen.getByRole<HTMLInputElement>('checkbox', {
          name: `Make ${lowerFirst(selectedComponent?.title)} optional`
        })

        expect($checkbox1).toBeInTheDocument()
        expect($checkbox1.checked).toBe(false)

        const $checkbox2 = screen.queryByRole('checkbox', {
          name: "Hide '(optional)' text"
        })

        expect($checkbox2).not.toBeInTheDocument()
      })
    } else {
      it("should not render 'Make {{component}} optional' checkbox", () => {
        const $checkbox = screen.queryByRole('checkbox', {
          name: `Make ${lowerFirst(selectedComponent?.title)} optional`
        })

        expect($checkbox).not.toBeInTheDocument()
      })

      it('should not render "Hide \'(optional)\' text" checkbox', () => {
        const $checkbox = screen.queryByRole('checkbox', {
          name: "Hide '(optional)' text"
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
          hasListField(selectedComponent) ? selectedComponent.list : ''
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

    if (options.selectCondition) {
      it("should render 'Condition (optional)' options", () => {
        const $select = screen.queryByRole<HTMLSelectElement>('combobox', {
          name: 'Condition (optional)',
          description:
            'Select a condition that determines whether to show the contents of this component. You can create and edit conditions from the Conditions screen.'
        })

        expect($select).toBeInTheDocument()
        expect($select?.value).toBe(
          hasConditionSupport(selectedComponent)
            ? (selectedComponent.options.condition ?? '')
            : ''
        )
      })
    } else {
      it("should not render 'Condition (optional)' options", () => {
        const $select = screen.queryByRole('combobox', {
          name: 'Condition (optional)'
        })

        expect($select).not.toBeInTheDocument()
      })
    }
  })
})
