import { Roles, mapScopesToRoles } from '@defra/forms-model'

import config from '~/src/config.js'

/**
 * Maps a group a user is a member of to the scopes they have access to.
 */
export const groupsToScopes = {
  [config.roleEditorGroupId]: mapScopesToRoles([Roles.Admin])
}
