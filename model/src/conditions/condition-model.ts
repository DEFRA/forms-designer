import { ConditionGroupDef } from '~/src/conditions/condition-group-def.js'
import { ConditionGroup } from '~/src/conditions/condition-group.js'
import { ConditionRef } from '~/src/conditions/condition-ref.js'
import { Condition } from '~/src/conditions/condition.js'
import { Coordinator } from '~/src/conditions/enums.js'
import {
  hasConditionGroup,
  hasConditionName,
  toExpression,
  toPresentationHtml,
  toPresentationString
} from '~/src/conditions/helpers.js'
import {
  type ConditionData,
  type ConditionGroupData,
  type ConditionRefData,
  type ConditionsModelData
} from '~/src/conditions/types.js'

export class ConditionsModel {
  #groupedConditions: (Condition | ConditionRef | ConditionGroup)[] = []
  #userGroupedConditions: (Condition | ConditionRef | ConditionGroup)[] = []
  #conditionName: string | undefined = undefined

  clone() {
    const toReturn = new ConditionsModel()
    toReturn.#groupedConditions = this.#groupedConditions.map((it) =>
      it.clone()
    )
    toReturn.#userGroupedConditions = this.#userGroupedConditions.map((it) =>
      it.clone()
    )
    toReturn.#conditionName = this.#conditionName
    return toReturn
  }

  clear() {
    this.#userGroupedConditions = []
    this.#groupedConditions = []
    this.#conditionName = undefined
    return this
  }

  set name(name) {
    this.#conditionName = name
  }

  get name() {
    return this.#conditionName
  }

  add(condition: Condition | ConditionRef | ConditionGroup) {
    const coordinatorExpected = this.#userGroupedConditions.length !== 0

    if (condition.getCoordinator() && !coordinatorExpected) {
      throw Error('No coordinator allowed on the first condition')
    } else if (!condition.getCoordinator() && coordinatorExpected) {
      throw Error('Coordinator must be present on subsequent conditions')
    }

    this.#userGroupedConditions.push(condition)
    this.#groupedConditions = this._applyGroups(this.#userGroupedConditions)

    return this
  }

  replace(index: number, condition: Condition | ConditionRef | ConditionGroup) {
    const coordinatorExpected = index !== 0

    if (condition.getCoordinator() && !coordinatorExpected) {
      throw Error('No coordinator allowed on the first condition')
    } else if (!condition.getCoordinator() && coordinatorExpected) {
      throw Error('Coordinator must be present on subsequent conditions')
    } else if (index >= this.#userGroupedConditions.length) {
      throw Error(
        `Cannot replace condition ${index} as no such condition exists`
      )
    }

    this.#userGroupedConditions.splice(index, 1, condition)
    this.#groupedConditions = this._applyGroups(this.#userGroupedConditions)

    return this
  }

  remove(indexes: number[]) {
    this.#userGroupedConditions = this.#userGroupedConditions
      .filter((_condition, index) => !indexes.includes(index))
      .map((condition, index) =>
        index === 0 ? condition.asFirstCondition() : condition
      )

    this.#groupedConditions = this._applyGroups(this.#userGroupedConditions)
    return this
  }

  addGroups(groupDefs: ConditionGroupDef[]) {
    this.#userGroupedConditions = this._group(
      this.#userGroupedConditions,
      groupDefs
    )
    this.#groupedConditions = this._applyGroups(this.#userGroupedConditions)
    return this
  }

  splitGroup(index: number) {
    this.#userGroupedConditions = this._ungroup(
      this.#userGroupedConditions,
      index
    )
    this.#groupedConditions = this._applyGroups(this.#userGroupedConditions)
    return this
  }

  moveEarlier(index: number) {
    if (index > 0 && index < this.#userGroupedConditions.length) {
      this.#userGroupedConditions.splice(
        index - 1,
        0,
        this.#userGroupedConditions.splice(index, 1)[0]
      )
      if (index === 1) {
        this.switchCoordinators()
      }
      this.#groupedConditions = this._applyGroups(this.#userGroupedConditions)
    }
    return this
  }

  moveLater(index: number) {
    if (index >= 0 && index < this.#userGroupedConditions.length - 1) {
      this.#userGroupedConditions.splice(
        index + 1,
        0,
        this.#userGroupedConditions.splice(index, 1)[0]
      )
      if (index === 0) {
        this.switchCoordinators()
      }
      this.#groupedConditions = this._applyGroups(this.#userGroupedConditions)
    }
    return this
  }

  switchCoordinators() {
    this.#userGroupedConditions[1].setCoordinator(
      this.#userGroupedConditions[0].getCoordinator()
    )
    this.#userGroupedConditions[0].setCoordinator()
  }

  get asPerUserGroupings() {
    return [...this.#userGroupedConditions]
  }

  get hasConditions() {
    return this.#userGroupedConditions.length > 0
  }

  get lastIndex() {
    return this.#userGroupedConditions.length - 1
  }

  toPresentationString() {
    return this.#groupedConditions
      .map((condition) => toPresentationString(condition))
      .join(' ')
  }

  toPresentationHtml() {
    return this.#groupedConditions
      .map((condition) => toPresentationHtml(condition))
      .join(' ')
  }

  toExpression() {
    return this.#groupedConditions
      .map((condition) => toExpression(condition))
      .join(' ')
  }

  _applyGroups(
    userGroupedConditions: (Condition | ConditionRef | ConditionGroup)[]
  ) {
    const correctedUserGroups = userGroupedConditions.map((condition) =>
      condition instanceof ConditionGroup && condition.conditions.length > 2
        ? new ConditionGroup(
            this._group(
              condition.conditions,
              this._autoGroupDefs(condition.conditions)
            )
          )
        : condition
    )

    return this._group(
      correctedUserGroups,
      this._autoGroupDefs(correctedUserGroups)
    )
  }

  _group(
    conditions: (Condition | ConditionRef | ConditionGroup)[],
    groupDefs: ConditionGroupDef[]
  ) {
    return conditions.reduce<(Condition | ConditionRef | ConditionGroup)[]>(
      (groups, condition, index, conditions) => {
        const groupDef = groupDefs.find((groupDef) => groupDef.contains(index))

        if (groupDef) {
          if (groupDef.startsWith(index)) {
            const groupConditions = groupDef.applyTo(conditions)
            groups.push(new ConditionGroup(groupConditions))
          }
        } else {
          groups.push(condition)
        }

        return groups
      },
      []
    )
  }

  _ungroup(
    conditions: (Condition | ConditionRef | ConditionGroup)[],
    splitIndex: number
  ) {
    if (conditions[splitIndex].isGroup()) {
      const copy = [...conditions]
      copy.splice(
        splitIndex,
        1,
        ...conditions[splitIndex].getGroupedConditions()
      )
      return copy
    }
    return conditions
  }

  _autoGroupDefs(conditions: (Condition | ConditionRef | ConditionGroup)[]) {
    const orPositions: number[] = []

    conditions.forEach((condition, index) => {
      if (condition.getCoordinator() === Coordinator.OR) {
        orPositions.push(index)
      }
    })

    const hasOr = orPositions.length > 0
    const hasAnd = !!conditions.find(
      (condition) => condition.getCoordinator() === Coordinator.AND
    )

    if (hasAnd && hasOr) {
      let start = 0
      const groupDefs: ConditionGroupDef[] = []
      orPositions.forEach((position, index) => {
        if (start < position - 1) {
          groupDefs.push(new ConditionGroupDef(start, position - 1))
        }
        const thisIsTheLastOr = orPositions.length === index + 1
        const thereAreMoreConditions = conditions.length - 1 > position
        if (thisIsTheLastOr && thereAreMoreConditions) {
          groupDefs.push(new ConditionGroupDef(position, conditions.length - 1))
        }
        start = position
      })
      return groupDefs
    }

    return []
  }

  toJSON() {
    const name = this.#conditionName
    const conditions = this.#userGroupedConditions
    return {
      name: name ?? '',
      conditions: conditions.map((it) => it.toJSON())
    }
  }

  // TODO:- why is this not a constructor?
  static from(obj: ConditionsModel | ConditionsModelData) {
    if (obj instanceof ConditionsModel) {
      return obj
    }
    const toReturn = new ConditionsModel()
    toReturn.#conditionName = obj.name
    toReturn.#userGroupedConditions = obj.conditions.map(conditionFrom)
    toReturn.#groupedConditions = toReturn._applyGroups(
      toReturn.#userGroupedConditions
    )
    return toReturn
  }
}

export function conditionFrom(
  it: ConditionData | ConditionRefData | ConditionGroupData
): Condition | ConditionRef | ConditionGroup {
  if (hasConditionGroup(it)) {
    return new ConditionGroup(it.conditions.map(conditionFrom))
  }

  if (hasConditionName(it)) {
    return ConditionRef.from(it)
  }

  return Condition.from(it)
}
