import { type Page } from '~/src/form/form-definition/types.js'
import { ControllerPath, ControllerType } from '~/src/pages/enums.js'

/**
 * Defaults for creating new pages
 */
export const PageTypes: readonly Page[] = Object.freeze([
  {
    title: 'Content page',
    path: '/content-page',
    controller: ControllerType.Content,
    section: undefined,
    components: []
  },
  {
    title: 'Start page',
    path: ControllerPath.Start,
    controller: ControllerType.Start,
    section: undefined,
    next: [],
    components: []
  },
  {
    title: 'Question page',
    path: '/question-page',
    controller: ControllerType.Page,
    section: undefined,
    next: [],
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
    section: undefined,
    next: [],
    components: []
  },
  {
    title: 'File upload page',
    path: '/file-upload-page',
    controller: ControllerType.FileUpload,
    section: undefined,
    next: [],
    components: []
  },
  {
    title: 'Summary page',
    path: ControllerPath.Summary,
    controller: ControllerType.Summary,
    section: undefined
  },
  {
    title: 'Status page',
    path: ControllerPath.Status,
    controller: ControllerType.Status,
    section: undefined
  }
])
