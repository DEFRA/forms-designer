import React from 'react'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import { FileUploadFieldEdit } from '~/src/file-upload-field-edit'
import { RenderWithContext } from '~/test/helpers/renderers'

describe('File upload', () => {
  const { getByText } = screen

  describe('File upload Field', () => {
    let stateProps

    beforeEach(() => {
      stateProps = {
        component: {
          type: 'FileUploadField',
          name: 'TestFileUpload',
          options: {}
        }
      }

      render(
        <RenderWithContext stateProps={stateProps}>
          <FileUploadFieldEdit />
        </RenderWithContext>
      )
    })

    afterEach(cleanup)

    test('should display display correct title', () => {
      const text = 'Allow multiple file upload'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display display correct help text', () => {
      const text = 'Tick this box to enable users to upload multiple files'
      expect(getByText(text)).toBeInTheDocument()
    })
  })
})
