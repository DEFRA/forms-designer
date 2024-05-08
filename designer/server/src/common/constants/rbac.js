import config from '~/src/config.js'

export const SCOPE_READ = 'read'
export const SCOPE_WRITE = 'write'

/**
 * Maps a group a user is a member of to the scopes they have access to.
 * @type {{[key: string]: Array<string>}}
 */
export const groupsToScopes = {
  [config.formsEditorAdGroupId]: [SCOPE_READ, SCOPE_WRITE]
}
