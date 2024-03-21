/**
 * Used to add auth access entity to an array of routes
 *
 * @param scope
 * @returns {function(*): *&{options: {auth: {mode: string, access: {scope: *}}}}}
 */
function authScope(scope) {
  return (route) => ({
    ...route,
    options: {
      ...(route.options && route.options),
      auth: {
        mode: 'required',
        access: {
          scope
        }
      }
    }
  })
}

export { authScope }
