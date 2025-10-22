import { type FormDefinition } from '~/src/form/form-definition/types.js'

/**
 * TypeGuard to check if component is a ListComponentsDef
 * @param { FormDefinition | undefined } definition
 * @returns { definition is FormDefinition }
 */
export function isFormDefinition(
  definition: FormDefinition | undefined
): definition is FormDefinition {
  if (!definition) {
    return false
  }
  return (
    'name' in definition && 'pages' in definition && 'conditions' in definition
  )
}
