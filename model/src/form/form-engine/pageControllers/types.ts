import {
  type FormRequest,
  type FormRequestPayload
} from '~/src/form/form-engine/routes/types.js'
import { type FormContext } from '~/src/form/form-engine/types.js'

// TODO: Replace with actual PageController classes from forms-engine
export interface PageControllerBase {
  path: string
  model: unknown
  definition: unknown
  render(context: FormContext): Promise<unknown>
  getFormDataFromState(state: unknown): unknown
  getViewModel(formModel: unknown, context: FormContext): unknown
}

export type PageControllerClass = PageControllerBase
export type PageControllerType = new (...args: unknown[]) => PageControllerBase
export type PageController = PageControllerClass

// TODO: Replace with actual Component classes from forms-engine
export interface ComponentBase {
  name: string
  type: string
  model: unknown
  getFormDataFromState(state: unknown): unknown
  getViewModel(formModel: unknown): unknown
}

export type Component = ComponentBase
export type ComponentType = new (...args: unknown[]) => ComponentBase

export interface ViewContext {
  baseLayoutPath?: string
  crumb?: string
  cspNonce?: string
  currentPath?: string
  previewMode?: string
  slug: string
  context?: FormContext
}

export type RequestType = Request | FormRequest | FormRequestPayload
