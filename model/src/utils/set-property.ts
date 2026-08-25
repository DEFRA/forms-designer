/**
 * Filter to be able to set an object property within a nunjucks file
 * @param { object | undefined } obj - the object
 * @param {string} propertyName - the property name
 * @param {string | number | boolean | undefined} propertyValue - the property value
 */
export function setProperty(
  obj: object | undefined,
  propertyName: string,
  propertyValue: string | number | boolean | undefined
) {
  if (!obj || !propertyName) {
    return obj
  }

  const typed = obj as Record<string, string | number | boolean | undefined>
  typed[propertyName] = propertyValue

  return obj
}
