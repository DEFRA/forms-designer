import {
  type ConditionSessionState,
  type FormEditor,
  type FormMetadataContact,
  type FormMetadataContactEmail,
  type FormMetadataContactOnline,
  type FormMetadataInput,
  type QuestionSessionState
} from '@defra/forms-model'
import { type StringLikeMap } from '@hapi/bell'
import { type RequestAuth } from '@hapi/hapi'

import { type sessionNames } from '~/src/common/constants/session-names.js'
import { type UserProfile } from '~/src/common/helpers/auth/types.js'
import {
  type ErrorDetailsItem,
  type ValidationFailure
} from '~/src/common/helpers/types.js'

interface UserSessionCache {
  drop: (key: string) => Promise<void>
  get: (key: string) => Promise<RequestAuth['credentials'] | undefined>
  set: (key: string, value: RequestAuth['credentials']) => Promise<void>
}

interface StateCache {
  drop: (id: string, key: string) => Promise<void>
  get: (id: string, key: string) => Promise<string | undefined>
  set: (id: string, key: string, value: string, ttl?: number) => Promise<void>
}

/**
 * Type for view responses from Vision plugin.
 * The @hapi/vision plugin extends responses with a 'view' variety
 * but this isn't included in the base Hapi TypeScript definitions.
 */
export interface ViewResponse {
  variety: 'view'
  source: {
    context?: Record<string, unknown>
    [key: string]: unknown
  }
  [key: string]: unknown
}

declare module '@hapi/hapi' {
  // Here we are decorating Hapi interface types with
  // props from plugins which doesn't export @types

  interface Server {
    method(name: 'session.drop', method: UserSessionCache['drop']): void
    method(name: 'session.get', method: UserSessionCache['get']): void
    method(name: 'session.set', method: UserSessionCache['set']): void
    method(name: 'state.drop', method: StateCache['drop']): void
    method(name: 'state.get', method: StateCache['get']): void
    method(name: 'state.set', method: StateCache['set']): void
  }

  interface ServerMethods {
    session: UserSessionCache
    state: StateCache
  }

  interface AuthArtifacts {
    token_type: 'Bearer'
    scope: string
    expires_in: number
    ext_expires_in: number
    access_token: string
    refresh_token: string
    id_token: string
  }

  interface AuthCredentials {
    provider: 'azure-oidc'
    query: StringLikeMap
    token: string
    idToken: string
    refreshToken: string
    expiresIn: number
    flowId: string
    scope?: string[]
  }

  interface UserCredentials {
    /**
     * User ID
     */
    id: UserProfile['sub']

    /**
     * User email address
     */
    email: UserProfile['email']

    /**
     * User display name
     */
    displayName: string

    /**
     * User roles from entitlement API
     */
    roles?: string[]

    /**
     * User scopes from entitlement API
     */
    scopes?: string[]

    /**
     * Session issued time (ISO 8601)
     */
    issuedAt?: string

    /**
     * Session expiry time (ISO 8601)
     */
    expiresAt?: string
  }
}

declare module '@hapi/yar' {
  type CreateKey = (typeof sessionNames)['create']
  type RedirectToKey = (typeof sessionNames)['redirectTo']
  type SuccessNotification = (typeof sessionNames)['successNotification']
  type ErrorListKey = (typeof sessionNames)['errorList']
  type LogoutHintKey = (typeof sessionNames)['logoutHint']
  type QuestionType = (typeof sessionNames)['questionType']
  type ReorderPagesKey = (typeof sessionNames)['reorderPages']
  type QuestionSessionStateKey = (typeof sessionNames)['questionSessionState']
  type ConditionSessionStateKey = (typeof sessionNames)['conditionSessionState']

  // Export known validation session keys
  type ValidationSession = (typeof sessionNames)['validationFailure']
  export type ValidationSessionKey = ValidationSession[keyof ValidationSession]

  interface YarFlashes {
    // String flash types using actual constants
    [sessionNames.redirectTo]: string
    [sessionNames.successNotification]: string
    [sessionNames.questionType]: string
    [sessionNames.logoutHint]: string
    [sessionNames.reorderPages]: string
    [sessionNames.errorList]: ErrorDetailsItem
    [sessionNames.badRequestErrorList]: ErrorDetailsItem
    // Validation failure types using actual constants
    [sessionNames.validationFailure
      .createForm]: ValidationFailure<FormMetadataInput>
    [sessionNames.validationFailure
      .updateForm]: ValidationFailure<FormMetadataInput>
    [sessionNames.validationFailure.privacyNotice]: ValidationFailure<
      Pick<FormMetadataInput, 'privacyNoticeUrl'>
    >
    [sessionNames.validationFailure.notificationEmail]: ValidationFailure<
      Pick<FormMetadataInput, 'notificationEmail'>
    >
    [sessionNames.validationFailure
      .contactEmail]: ValidationFailure<FormMetadataContactEmail>
    [sessionNames.validationFailure.fileDownload]: ValidationFailure<{
      email: string
    }>
    [sessionNames.validationFailure.contactPhone]: ValidationFailure<
      Pick<FormMetadataContact, 'phone'>
    >
    [sessionNames.validationFailure
      .contactOnline]: ValidationFailure<FormMetadataContactOnline>
    [key: ValidationSession['fileDownload']]: ValidationFailure<{
      email: string
    }>
    [sessionNames.validationFailure.submissionGuidance]: ValidationFailure<
      Pick<FormMetadataInput, 'submissionGuidance'>
    >
    [key: string]: ValidationFailure<FormEditor> | string
    [sessionNames.validationFailure.upload]: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formErrors?: any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formValues?: any
    }
    [ConditionSessionStateKey]: ConditionSessionState
  }

  interface YarValues {
    [sessionNames.conditionSessionState]: ConditionSessionState

    /**
     * Get enhanced action state from the session
     */
    [sessionNames.questionSessionState]: QuestionSessionState

    /**
     * Get form metadata from the session
     */
    [sessionNames.create]: Partial<FormMetadataInput>
  }

  interface Yar {
    /**
     * Set form metadata on the session
     */
    set<Schema = FormMetadataInput>(
      type: CreateKey,
      metadata: Partial<Schema>
    ): Partial<Schema>
  }
}
