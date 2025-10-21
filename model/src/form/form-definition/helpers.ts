import { type FormDefinition } from '~/src/form/form-definition/types.js'

export function isFormDefinition(
  definition: object | undefined
): definition is FormDefinition {
  if (!definition) {
    return false
  }
  return (
    'name' in definition && 'pages' in definition && 'conditions' in definition
  )
}
