import {
  ComponentType,
  ComponentSubType,
  type ComponentDef
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { FileUploadFieldEdit } from '~/src/FileUploadFieldEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('File upload', () => {
  const { getByText } = screen

  describe('File upload Field', () => {
    let stateProps

    beforeEach(() => {
      stateProps = {
        component: {
          name: 'TestFileUpload',
          title: 'Test file upload',
          hint: 'Text file upload hint',
          type: ComponentType.FileUploadField,
          subType: ComponentSubType.Field,
          options: {},
          schema: {}
        } satisfies ComponentDef
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
