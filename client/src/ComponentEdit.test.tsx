import {
  ComponentType,
  ConditionType,
  OperatorName,
  getComponentDefaults,
  hasConditionSupport,
  hasHint,
  hasListField,
  type ComponentDef,
  type FormDefinition,
  type Page
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import lowerFirst from 'lodash/lowerFirst.js'

import { ComponentEdit } from '~/src/ComponentEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('ComponentEdit', () => {
  let page: Page
  let data: FormDefinition

  beforeEach(() => {
    page = {
      title: 'First page',
      path: '/first-page',
      next: [],
      components: []
    }

    data = {
      pages: [page],
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

  describe.each([
    [
      ComponentType.AutocompleteField,
      {
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
        hint: false,
        title: true,
        hideTitle: false,
        content: true,
        optional: false,
        selectList: false,
        selectCondition: false
      }
    ],
    [
      ComponentType.EmailAddressField,
      {
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
      ComponentType.InsetText,
      {
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
      ComponentType.Markdown,
      {
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
      ComponentType.MonthYearField,
      {
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
        hint: true,
        title: true,
        hideTitle: false,
        content: false,
        optional: true,
        selectList: false,
        selectCondition: true
      }
    ]
  ])('Component edit: %s', (type, options) => {
    let selectedComponent: ComponentDef

    beforeEach(() => {
      selectedComponent = getComponentDefaults({ type })

      render(
        <RenderWithContext data={data} state={{ selectedComponent }}>
          <ComponentEdit page={page} onSave={jest.fn()} />
        </RenderWithContext>
      )
    })

    if (options.title) {
      it("should render 'Title' input", () => {
        const $input = screen.getByRole<HTMLInputElement>('textbox', {
          name: 'Title',
          description: 'Enter the name to show for this field'
        })

        expect($input).toBeInTheDocument()
        expect($input).toHaveValue(selectedComponent.title)
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
        const $textarea = screen.getByRole<HTMLTextAreaElement>('textbox', {
          name: 'Help text (optional)',
          description: 'Enter the description to show for this field'
        })

        expect($textarea).toBeInTheDocument()
        expect($textarea).toHaveValue(
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
        const $checkbox = screen.getByRole<HTMLInputElement>('checkbox', {
          name: 'Hide title',
          description:
            'Tick this box if you do not want the title to show on the page'
        })

        expect($checkbox).toBeInTheDocument()
        expect($checkbox.checked).toBe(false)
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
        const $textarea = screen.getByRole<HTMLTextAreaElement>('textbox', {
          name: 'Content',
          description:
            selectedComponent.type === ComponentType.Details
              ? 'Enter the text you want to show when users expand the title. You can apply basic HTML, such as text formatting and hyperlinks.'
              : 'Enter the text you want to show. You can apply basic HTML, such as text formatting and hyperlinks.'
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

    if (options.optional) {
      it("should render 'Make {{component}} optional' checkbox", () => {
        const $checkbox = screen.getByRole<HTMLInputElement>('checkbox', {
          name: `Make ${lowerFirst(selectedComponent.title)} optional`,
          description:
            'Tick this box if users do not need to complete this field to progress through the form'
        })

        expect($checkbox).toBeInTheDocument()
        expect($checkbox.checked).toBe(false)
      })

      it('should render "Hide \'(optional)\' text" checkbox when optional', async () => {
        const $checkbox1 = screen.getByRole<HTMLInputElement>('checkbox', {
          name: `Make ${lowerFirst(selectedComponent.title)} optional`
        })

        expect($checkbox1).toBeInTheDocument()
        expect($checkbox1.checked).toBe(false)

        // Mark field as optional
        await userEvent.click($checkbox1)
        expect($checkbox1.checked).toBe(true)

        const $checkbox2 = screen.getByRole<HTMLInputElement>('checkbox', {
          name: 'Hide ‘(optional)’ text',
          description:
            'Tick this box if you do not want the title to indicate that this field is optional'
        })

        expect($checkbox2).toBeInTheDocument()
        expect($checkbox2.checked).toBe(false)
      })

      it('should not render "Hide \'(optional)\' text" checkbox when required', () => {
        const $checkbox1 = screen.getByRole<HTMLInputElement>('checkbox', {
          name: `Make ${lowerFirst(selectedComponent.title)} optional`
        })

        expect($checkbox1).toBeInTheDocument()
        expect($checkbox1.checked).toBe(false)

        const $checkbox2 = screen.queryByRole('checkbox', {
          name: 'Hide ‘(optional)’ text'
        })

        expect($checkbox2).not.toBeInTheDocument()
      })
    } else {
      it("should not render 'Make {{component}} optional' checkbox", () => {
        const $checkbox = screen.queryByRole('checkbox', {
          name: `Make ${lowerFirst(selectedComponent.title)} optional`
        })

        expect($checkbox).not.toBeInTheDocument()
      })

      it('should not render "Hide \'(optional)\' text" checkbox', () => {
        const $checkbox = screen.queryByRole('checkbox', {
          name: 'Hide ‘(optional)’ text'
        })

        expect($checkbox).not.toBeInTheDocument()
      })
    }

    if (options.selectList) {
      it("should render 'Select list' options", () => {
        const $select = screen.getByRole<HTMLSelectElement>('combobox', {
          name: 'Select list',
          description:
            'Select an existing list to show in this field or add a new list'
        })

        expect($select).toBeInTheDocument()
        expect($select).toHaveValue(
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
        const $select = screen.getByRole<HTMLSelectElement>('combobox', {
          name: 'Condition (optional)',
          description:
            'Select a condition that determines whether to show the contents of this component. You can create and edit conditions from the Conditions screen.'
        })

        expect($select).toBeInTheDocument()
        expect($select).toHaveValue(
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
