import {
  ComponentType,
  ComponentTypes,
  getComponentDefaults,
  type ComponentDef
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render, type RenderResult } from '@testing-library/react'
import React from 'react'

import { FileUploadFieldEdit } from '~/src/components/FieldEditors/FileUploadFieldEdit.jsx'
import { RenderComponent } from '~/test/helpers/renderers.jsx'

describe('File upload field edit', () => {
  const supported = [ComponentType.FileUploadField]

  describe('Supported components', () => {
    it.each(ComponentTypes.filter(({ type }) => supported.includes(type)))(
      "should render supported component '%s'",
      (selectedComponent) => {
        const { container } = render(
          <RenderComponent defaults={selectedComponent}>
            <FileUploadFieldEdit />
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
            <FileUploadFieldEdit />
          </RenderComponent>
        )

        const $details = container.querySelector('details')
        expect($details).toBeNull()
      }
    )
  })

  describe.each(supported)('Settings: %s', (type) => {
    let selectedComponent: ComponentDef
    let result: RenderResult

    beforeEach(() => {
      selectedComponent = getComponentDefaults({ type })

      result = render(
        <RenderComponent defaults={selectedComponent}>
          <FileUploadFieldEdit />
        </RenderComponent>
      )
    })

    it('should render additional settings', () => {
      const $summary = screen.getByText('Additional settings', {
        selector: 'details > summary .govuk-details__summary-text'
      })

      expect($summary).toBeInTheDocument()
    })

    it("should render 'Min file count' input", () => {
      const $input = screen.getByRole('spinbutton', {
        name: 'Min file count',
        description: 'Specifies the minimum number of files users can upload'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue(null)

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ schema: { min: 10 } }}
        >
          <FileUploadFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue(10)
    })

    it("should render 'Max file count' input", () => {
      const $input = screen.getByRole('spinbutton', {
        name: 'Max file count',
        description: 'Specifies the maximum number of files users can upload'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue(null)

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ schema: { max: 10 } }}
        >
          <FileUploadFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue(10)
    })

    it("should render 'Exact file count' input", () => {
      const $input = screen.getByRole('spinbutton', {
        name: 'Exact file count',
        description:
          'Specifies the exact number of files users can upload. Using this setting negates any values you set for Min or Max file count'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue(null)

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ schema: { length: 10 } }}
        >
          <FileUploadFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue(10)
    })

    it("should render 'Allowed MIME types' textarea", () => {
      const $input = screen.getByRole('textbox', {
        name: 'Allowed MIME types',
        description:
          "Specifies allowed file formats using a comma separated list of MIME types. For example 'image/jpeg, application/pdf'"
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue('')

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ options: { accept: 'image/jpeg' } }}
        >
          <FileUploadFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue('image/jpeg')
    })

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
          override={{ options: { classes: 'example' } }}
        >
          <FileUploadFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue('example')
    })
  })
})
