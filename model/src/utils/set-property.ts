/**
 * Filter to be able to set an object property within a nunjucks file
 * @param { object | undefined } obj - the object
 * @param {string} propertyName - the property name
 * @param {unknown} propertyValue - the property value
 */
export function setProperty(
  obj: object | undefined,
  propertyName: string,
  propertyValue: unknown
) {
  if (!obj || !propertyName) {
    return obj
  }

  const typed = obj as Record<string, unknown>
  typed[propertyName] = propertyValue

  return obj
}
