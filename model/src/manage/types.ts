/**
 * Interface for `EntitlementRole`
 */
export interface EntitlementRole {
  /**
   * The display name
   */
  name: string

  /**
   * The code value
   */
  code: string

  /**
   * The description
   */
  description: string
}

/**
 * Interface for `ManageUser`
 */
export interface ManageUser {
  /**
   * The object id of the user
   */
  userId: string

  /**
   * The email address of the user
   */
  emailAddress: string

  /**
   * The role assigned to the user
   */
  userRole: string
}
