import { type Roles } from '~/src/manage/roles.js'

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
  userRole: Roles

  /**
   * The full name of the user for display
   */
  displayName?: string
}
