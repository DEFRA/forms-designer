export interface EntitlementUser {
  /**
   * The id of the user
   */
  userId?: string

  /**
   * The display name (full name) of the user
   */
  displayName?: string

  /**
   * The email addresss of the user
   */
  email?: string

  /**
   * The roles assigned to the user
   */
  roles: string[]

  /**
   * The scopes assigned to the user
   */
  scopes?: string[]
}
