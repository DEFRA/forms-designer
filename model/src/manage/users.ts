export interface EntitlementUser {
  /**
   * The id of the user
   */
  userId: string

  /**
   * The full name of the user
   */
  fullName: string

  /**
   * The email addresss of the user
   */
  emailAddress: string

  /**
   * The roles assigned to the user
   */
  roles: string[]

  /**
   * The scopes assigned to the user
   */
  scopes: string[]
}
