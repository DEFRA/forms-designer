import {
  type Condition2Wrapper,
  type ConditionWrapper,
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

  if (isCondition2Wrapper(condition)) {
    throw Error(
      `Condition should not be a Condition2Wrapper '${conditionName}'`
    )
  }

  return condition
}

export function isCondition2Wrapper(
  wrapper: ConditionWrapper | Condition2Wrapper
): wrapper is Condition2Wrapper {
  return Array.isArray((wrapper as Condition2Wrapper).conditions)
}

export function isConditionWrapper(
  wrapper: ConditionWrapper | Condition2Wrapper
): wrapper is ConditionWrapper {
  return !isCondition2Wrapper(wrapper)
}
