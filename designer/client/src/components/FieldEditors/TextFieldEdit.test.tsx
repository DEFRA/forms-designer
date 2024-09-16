import {
  ComponentType,
  ComponentTypes,
  getComponentDefaults,
  type ComponentDef
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render, type RenderResult } from '@testing-library/react'
import React from 'react'

import { TextFieldEdit } from '~/src/components/FieldEditors/TextFieldEdit.jsx'
import { RenderComponent } from '~/test/helpers/renderers.jsx'

describe('Text field edit', () => {
  const supported = [
    ComponentType.TextField,
    ComponentType.MultilineTextField,
    ComponentType.EmailAddressField,
    ComponentType.TelephoneNumberField
  ]

  afterEach(cleanup)

  describe('Supported components', () => {
    it.each(ComponentTypes.filter(({ type }) => supported.includes(type)))(
      "should render supported component '%s'",
      (selectedComponent) => {
        const { container } = render(
          <RenderComponent defaults={selectedComponent}>
            <TextFieldEdit />
          </RenderComponent>
        )

        const $details = container.querySelector('details')
        expect($details).not.toBeNull()
      }
    )

    it.each(ComponentTypes.filter(({ type }) => !supported.includes(type)))(
      "should not render unsupported component '%s'",
      (selectedComponent) => {
        const { container } = render(
          <RenderComponent defaults={selectedComponent}>
            <TextFieldEdit />
          </RenderComponent>
        )

        const $details = container.querySelector('details')
        expect($details).toBeNull()
      }
    )
  })

  describe.each([
    [
      ComponentType.TextField,
      {
        minLength: true,
        maxLength: true,
        length: true,
        regex: true,
        classes: true,
        autocomplete: true
      }
    ],
    [
      ComponentType.MultilineTextField,
      {
        minLength: true,
        maxLength: true,
        length: true,
        regex: true,
        classes: true,
        autocomplete: false
      }
    ],
    [
      ComponentType.EmailAddressField,
      {
        minLength: false,
        maxLength: false,
        length: false,
        regex: false,
        classes: true,
        autocomplete: false
      }
    ],
    [
      ComponentType.TelephoneNumberField,
      {
        minLength: false,
        maxLength: false,
        length: false,
        regex: false,
        classes: true,
        autocomplete: false
      }
    ]
  ])('Settings: %s', (type, options) => {
    let selectedComponent: ComponentDef
    let result: RenderResult

    beforeEach(() => {
      selectedComponent = getComponentDefaults({ type })
      result = render(
        <RenderComponent defaults={selectedComponent}>
          <TextFieldEdit />
        </RenderComponent>
      )
    })

    it('should render additional settings', () => {
      const $summary = screen.getByText('Additional settings', {
        selector: 'details > summary .govuk-details__summary-text'
      })

      expect($summary).toBeInTheDocument()
    })

    if (options.minLength) {
      it("should render 'Min length' input", () => {
        const $input = screen.getByRole('spinbutton', {
          name: 'Min length',
          description:
            'Specifies the minimum number of characters users can enter'
        })

        expect($input).toBeInTheDocument()
        expect($input).toHaveValue(null)

        result.rerender(
          <RenderComponent
            defaults={selectedComponent}
            override={{
              schema: { min: 10 }
            }}
          >
            <TextFieldEdit />
          </RenderComponent>
        )

        render(
          <RenderComponent defaults={selectedComponent}>
            <TextFieldEdit />
          </RenderComponent>
        )

        expect($input).toHaveValue(10)
      })
    } else {
      it("should not render 'Min length' input", () => {
        const $input = screen.queryByRole('spinbutton', {
          name: 'Min length'
        })

        expect($input).not.toBeInTheDocument()
      })
    }

    if (options.maxLength) {
      it("should render 'Max length' input", () => {
        const $input = screen.getByRole('spinbutton', {
          name: 'Max length',
          description:
            'Specifies the maximum number of characters users can enter'
        })

        expect($input).toBeInTheDocument()
        expect($input).toHaveValue(null)

        result.rerender(
          <RenderComponent
            defaults={selectedComponent}
            override={{
              schema: { max: 10 }
            }}
          >
            <TextFieldEdit />
          </RenderComponent>
        )

        expect($input).toHaveValue(10)
      })
    } else {
      it("should not render 'Max length' input", () => {
        const $input = screen.queryByRole('spinbutton', {
          name: 'Max length'
        })

        expect($input).not.toBeInTheDocument()
      })
    }

    if (options.length) {
      it("should render 'Length' input", () => {
        const $input = screen.getByRole('spinbutton', {
          name: 'Length',
          description:
            'Specifies the exact character length users must enter. Using this setting negates any values you set for Min length or Max length.'
        })

        expect($input).toBeInTheDocument()
        expect($input).toHaveValue(null)

        result.rerender(
          <RenderComponent
            defaults={selectedComponent}
            override={{
              schema: { length: 10 }
            }}
          >
            <TextFieldEdit />
          </RenderComponent>
        )

        expect($input).toHaveValue(10)
      })
    } else {
      it("should not render 'Length' input", () => {
        const $input = screen.queryByRole('spinbutton', {
          name: 'Length'
        })

        expect($input).not.toBeInTheDocument()
      })
    }

    if (options.regex) {
      it("should render 'Regex' input", () => {
        const $input = screen.getByRole('textbox', {
          name: 'Regex',
          description:
            'Specifies a regular expression to validate users’ inputs. Use JavaScript syntax.'
        })

        expect($input).toBeInTheDocument()
        expect($input).toHaveValue('')

        result.rerender(
          <RenderComponent
            defaults={selectedComponent}
            override={{
              schema: { regex: 'example' }
            }}
          >
            <TextFieldEdit />
          </RenderComponent>
        )

        expect($input).toHaveValue('example')
      })
    } else {
      it("should not render 'Regex' input", () => {
        const $input = screen.queryByRole('textbox', {
          name: 'Regex'
        })

        expect($input).not.toBeInTheDocument()
      })
    }

    if (options.classes) {
      it("should render 'Classes' input", () => {
        const $input = screen.getByRole('textbox', {
          name: 'Classes',
          description:
            'Apply CSS classes to this field. For example, ‘govuk-input govuk-!-width-full’'
        })

        expect($input).toBeInTheDocument()
        expect($input).toHaveValue('')

        result.rerender(
          <RenderComponent
            defaults={selectedComponent}
            override={{
              options: { classes: 'example' }
            }}
          >
            <TextFieldEdit />
          </RenderComponent>
        )

        expect($input).toHaveValue('example')
      })
    } else {
      it("should not render 'Classes' input", () => {
        const $input = screen.queryByRole('textbox', {
          name: 'Classes'
        })

        expect($input).not.toBeInTheDocument()
      })
    }

    if (options.autocomplete) {
      it("should render 'Autocomplete' input", () => {
        const $input = screen.getByRole('textbox', {
          name: 'Autocomplete',
          description:
            'Add the autocomplete attribute to this field. For example, ‘on’ or ‘given-name’'
        })

        expect($input).toBeInTheDocument()
        expect($input).toHaveValue('')

        result.rerender(
          <RenderComponent
            defaults={selectedComponent}
            override={{
              options: { autocomplete: 'example' }
            }}
          >
            <TextFieldEdit />
          </RenderComponent>
        )

        expect($input).toHaveValue('example')
      })
    } else {
      it("should not render 'Autocomplete' input", () => {
        const $input = screen.queryByRole('textbox', {
          name: 'Autocomplete'
        })

        expect($input).not.toBeInTheDocument()
      })
    }

    it("should render 'Validation message' input", () => {
      const $input = screen.getByRole('textbox', {
        name: 'Validation message',
        description:
          'Enter the validation message to show when a validation error occurs'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue('')

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{
            options: { customValidationMessage: 'example' }
          }}
        >
          <TextFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue('example')
    })
  })
})
