import { type Page } from '~/src/form/form-definition/types.js'
import { ControllerType, ControllerPath } from '~/src/pages/enums.js'

/**
 * Defaults for creating new pages
 */
export const PageTypes: Page[] = [
  {
    title: 'Start page',
    path: ControllerPath.Start,
    controller: ControllerType.Start,
    next: [],
    components: []
  },
  {
    title: 'Question page',
    path: '/question-page',
    controller: ControllerType.Page,
    next: [],
    components: []
  },
  {
    title: 'File upload page',
    path: '/file-upload-page',
    controller: ControllerType.FileUpload,
    next: [],
    components: []
  },
  {
    title: 'File upload page',
    path: '/file-upload-page',
    controller: ControllerType.FileUpload,
    next: [],
    components: []
  },
  {
    title: 'Check your answers',
    path: ControllerPath.Summary,
    controller: ControllerType.Summary
  },
  {
    title: 'Form submitted',
    path: ControllerPath.Status,
    controller: ControllerType.Status
  }
]
