import { type Page } from '~/src/form/form-definition/types.js'
import { ControllerPath, ControllerType } from '~/src/pages/enums.js'

/**
 * Defaults for creating new pages
 */
export const PageTypes: readonly Partial<Page>[] = Object.freeze([
  {
    title: 'Start page',
    path: ControllerPath.Start,
    controller: ControllerType.Start,
    components: []
  },
  {
    title: 'Question page',
    path: '/question-page',
    controller: ControllerType.Page,
    components: []
  },
  {
    title: 'Add another',
    path: '/add-another-page',
    controller: ControllerType.Repeat,
    repeat: {
      options: { name: '', title: '' },
      schema: { min: 1, max: 25 }
    },
    components: []
  },
  {
    title: 'File upload page',
    path: '/file-upload-page',
    controller: ControllerType.FileUpload,
    components: []
  },
  {
    title: 'Summary page',
    path: ControllerPath.Summary,
    controller: ControllerType.Summary
  },
  {
    title: 'Status page',
    path: ControllerPath.Status,
    controller: ControllerType.Status
  }
])
