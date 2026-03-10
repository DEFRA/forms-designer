import { type Roles, type Scopes } from '~/src/manage/roles.js'

export interface EntitlementUser {
  /**
   * The id of the user
   */
  userId: string

  /**
   * The display name (full name) of the user
   */
  displayName: string

  /**
   * The email addresss of the user
   */
  email: string

  /**
   * The roles assigned to the user
   */
  roles: Roles[]

  /**
   * The scopes assigned to the user
   */
  scopes: Scopes[]
}
