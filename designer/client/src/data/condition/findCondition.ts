import { isConditionWrapperV2, type FormDefinition } from '@defra/forms-model'

/**
 * Find condition by name
 */
export function findCondition(
  { conditions }: Pick<FormDefinition, 'conditions'>,
  conditionName?: string
) {
  const condition = conditions.find(({ name }) => name === conditionName)

  if (!condition) {
    throw Error(`Condition not found with name '${conditionName}'`)
  }

  if (isConditionWrapperV2(condition)) {
    throw Error(
      `Expected ConditionWrapper but found ConditionWrapperV2 for condition named '${conditionName}'`
    )
  }

  return condition
}
