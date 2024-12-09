import {
  ComponentType,
  ControllerType,
  PageTypes,
  getPageDefaults
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { ComponentCreateList } from '~/src/components/ComponentCreate/ComponentCreateList.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'

describe('Component create list: Supported page types', () => {
  const supported = [
    ControllerType.Content,
    ControllerType.Start,
    ControllerType.Page,
    ControllerType.FileUpload,
    ControllerType.Repeat
  ]

  it.each(
    PageTypes.filter(({ controller }) => {
      return !!controller && supported.includes(controller)
    })
  )("should render supported page type '$controller'", (page) => {
    const { container } = render(
      <ComponentCreateList page={page} onSelectComponent={jest.fn()} />
    )

    const $list = container.querySelector('ol')
    expect($list).toBeInTheDocument()
  })

  it.each(
    PageTypes.filter(({ controller }) => {
      return !!controller && !supported.includes(controller)
    })
  )("should not render unsupported page type '$controller'", (page) => {
    const { container } = render(
      <ComponentCreateList page={page} onSelectComponent={jest.fn()} />
    )

    const $list = container.querySelector('ol')
    expect($list).not.toBeInTheDocument()
  })
})

describe.each([
  [
    ControllerType.Content,
    {
      content: [
        ComponentType.Details,
        ComponentType.Html,
        ComponentType.InsetText,
        ComponentType.List
      ],
      selection: undefined,
      input: undefined
    }
  ],
  [
    ControllerType.Start,
    {
      content: [
        ComponentType.Details,
        ComponentType.Html,
        ComponentType.InsetText,
        ComponentType.List
      ],
      selection: undefined,
      input: undefined
    }
  ],
  [
    ControllerType.Page,
    {
      content: [
        ComponentType.Details,
        ComponentType.Html,
        ComponentType.InsetText,
        ComponentType.List
      ],
      selection: [
        ComponentType.AutocompleteField,
        ComponentType.CheckboxesField,
        ComponentType.RadiosField,
        ComponentType.SelectField,
        ComponentType.YesNoField
      ],
      input: [
        ComponentType.DatePartsField,
        ComponentType.EmailAddressField,
        ComponentType.MonthYearField,
        ComponentType.MultilineTextField,
        ComponentType.NumberField,
        ComponentType.TelephoneNumberField,
        ComponentType.TextField,
        ComponentType.UkAddressField
      ]
    }
  ],
  [
    ControllerType.FileUpload,
    {
      content: [
        ComponentType.Details,
        ComponentType.Html,
        ComponentType.InsetText,
        ComponentType.List
      ],
      selection: [],
      input: [ComponentType.FileUploadField]
    }
  ],
  [ControllerType.Summary, null],
  [ControllerType.Status, null]
])('Component create list: %s', (controller, options) => {
  const onSelectComponent = jest.fn()

  beforeEach(() => {
    const page = getPageDefaults({ controller })

    render(
      <ComponentCreateList page={page} onSelectComponent={onSelectComponent} />
    )
  })

  describe.each([
    {
      name: 'Content',
      components: options?.content
    },
    {
      name: 'Selection',
      components: options?.selection
    },
    {
      name: 'Input',
      components: options?.input
    }
  ])('$name', ({ name, components }) => {
    if (components?.length) {
      it(`should render '${name}' components`, () => {
        const $heading = screen.getByRole('heading', {
          name: 'Content'
        })

        const $list = $heading.parentElement?.querySelector('ol')
        expect($list).toBeInTheDocument()
      })

      describe.each(components)('%s component', (type) => {
        it('should render link to create component', () => {
          const $heading = screen.getByRole('heading', { name })

          const $list = $heading.parentElement?.querySelector('ol')
          const $link = screen.getByRole('link', {
            name: i18n(`fieldTypeToName.${type}`)
          })

          expect($list).toContainElement($link)
        })

        it('should run onSelectComponent callback on link click', async () => {
          const $link = screen.getByRole('link', {
            name: i18n(`fieldTypeToName.${type}`)
          })

          await userEvent.click($link)
          expect(onSelectComponent).toHaveBeenCalledWith(
            expect.objectContaining({
              type
            })
          )
        })
      })
    } else if (components) {
      it(`should render '${name}' components unavailable`, () => {
        const $heading = screen.getByRole('heading', { name })

        const $list = $heading.parentElement?.querySelector('ol')
        const $hint = $heading.parentElement?.querySelector('.govuk-hint')

        expect($list).not.toBeInTheDocument()
        expect($hint).toHaveTextContent(
          `No ${name.toLowerCase()} components available`
        )
      })
    } else {
      it(`should not render '${name}' components`, () => {
        expect(screen.queryByRole('heading', { name })).not.toBeInTheDocument()
      })
    }
  })
})
