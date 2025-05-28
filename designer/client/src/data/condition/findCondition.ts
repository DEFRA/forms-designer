import {
  type ConditionWrapper,
  type ConditionWrapperV2,
  type FormDefinition
} from '@defra/forms-model'

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

export function isConditionWrapperV2(
  wrapper: ConditionWrapper | ConditionWrapperV2
): wrapper is ConditionWrapperV2 {
  return Array.isArray((wrapper as ConditionWrapperV2).conditions)
}

export function isConditionWrapper(
  wrapper: ConditionWrapper | ConditionWrapperV2
): wrapper is ConditionWrapper {
  return !isConditionWrapperV2(wrapper)
}
