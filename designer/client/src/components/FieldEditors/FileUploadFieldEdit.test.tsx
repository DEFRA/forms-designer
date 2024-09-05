import { ComponentType } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { FileUploadFieldEdit } from '~/src/components/FieldEditors/FileUploadFieldEdit.jsx'
import {
  RenderWithContext,
  type RenderWithContextProps
} from '~/test/helpers/renderers.jsx'

describe('File upload field edit', () => {
  afterEach(cleanup)

  describe('File upload field edit fields', () => {
    let state: RenderWithContextProps['state']

    beforeEach(() => {
      state = {
        selectedComponent: {
          name: 'FileUploadFieldEditClass',
          title: 'File upload field edit class',
          hint: 'File upload field hint',
          type: ComponentType.FileUploadField,
          options: {},
          schema: {}
        }
      }

      render(
        <RenderWithContext state={state}>
          <FileUploadFieldEdit />
        </RenderWithContext>
      )
    })

    test('should display details link title', () => {
      const text = 'Additional settings'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display min file count title', () => {
      const text = 'Min file count'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display min file count help text', () => {
      const text = 'Specifies the minimum number of files users can upload'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display max file count title', () => {
      const text = 'Max file count'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display max file count help text', () => {
      const text = 'Specifies the maximum number of files users can upload'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display exact file count title', () => {
      const text = 'Exact file count'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display exact file count help text', () => {
      const text =
        'Specifies the exact number of files users can upload. Using this setting negates any values you set for Min or Max file count'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display allowed MIME types title', () => {
      const text = 'Allowed MIME types'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display allowed MIME types help text', () => {
      const text =
        "Specifies allowed file formats using a comma separated list of MIME types. For example 'image/jpeg, application/pdf'"
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })
})
