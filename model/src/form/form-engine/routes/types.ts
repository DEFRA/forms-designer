import { type ReqRefDefaults, type Request } from '@hapi/hapi'

import { type FormPayload } from '~/src/form/form-engine/types.js'

export interface FormQuery extends Partial<Record<string, string>> {
  /**
   * Allow preview URL direct access without relevant page checks
   */
  force?: string

  /**
   * Redirect location after 'continue' form action
   */
  returnUrl?: string
}

export interface FormParams extends Partial<Record<string, string>> {
  path: string
  slug: string
  state?: FormStatus
}

export interface FormRequestRefs
  extends Omit<ReqRefDefaults, 'Params' | 'Payload' | 'Query'> {
  Params: FormParams
  Payload: object | undefined
  Query: FormQuery
}

export interface FormRequestPayloadRefs extends FormRequestRefs {
  Payload: FormPayload
}

export type FormRequest = Request<FormRequestRefs>
export type FormRequestPayload = Request<FormRequestPayloadRefs>

export enum FormAction {
  Continue = 'continue',
  Validate = 'validate',
  Delete = 'delete',
  AddAnother = 'add-another',
  Send = 'send',
  SaveAndReturn = 'save-and-return'
}

export enum FormStatus {
  Draft = 'draft',
  Live = 'live'
}
