export const ROLE_FORMS_EDITOR = 'forms-editor'

export const SCOPE_READ = 'read'
export const SCOPE_WRITE = 'write'

/**
 * @type {{[key: string]: Array<string>}}
 */
export const rolesToScopes = {
  [ROLE_FORMS_EDITOR]: [ SCOPE_READ, SCOPE_WRITE ]
}
