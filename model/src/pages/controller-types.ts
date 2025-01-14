import { ControllerType } from '~/src/pages/enums.js'

export const ControllerTypes = [
  {
    name: ControllerType.Start,
    path: './pages/start.js'
  },
  {
    name: ControllerType.Page,
    path: './pages/page.js'
  },
  {
    name: ControllerType.Terminal,
    path: './pages/terminal.js'
  },
  {
    name: ControllerType.Repeat,
    path: './pages/repeat.js'
  },
  {
    name: ControllerType.FileUpload,
    path: './pages/file-upload.js'
  },
  {
    name: ControllerType.Summary,
    path: './pages/summary.js'
  },
  {
    name: ControllerType.Status,
    path: './pages/status.js'
  }
]

export const ControllerNames = ControllerTypes.map(({ name }) => name)
