import { Coordinator } from '~/src/conditions/enums.js'

export class ConditionAbstract {
  coordinator?: Coordinator

  constructor(coordinator?: Coordinator) {
    if (coordinator && !Object.values(Coordinator).includes(coordinator)) {
      throw Error(`coordinator ${coordinator} is not a valid coordinator`)
    }

    this.coordinator = coordinator
  }

  coordinatorString(): string {
    return this.coordinator ? `${this.coordinator} ` : ''
  }

  coordinatorHtml(): string {
    return this.coordinator
      ? `<strong>${this.coordinator.toUpperCase()}</strong> `
      : ''
  }

  getCoordinator(): Coordinator | undefined {
    return this.coordinator
  }

  setCoordinator(coordinator?: Coordinator) {
    this.coordinator = coordinator
  }

  isGroup() {
    return false
  }

  getGroupedConditions() {
    return [this]
  }

  _asFirstCondition() {
    delete this.coordinator
  }

  asFirstCondition() {
    throw Error(
      'Unsupported Operation. Method asFirstCondition have not been implemented'
    )
  }

  clone() {
    throw Error('Unsupported Operation. Method clone have not been implemented')
  }

  conditionString() {
    throw Error(
      'Unsupported Operation. Method conditionString have not been implemented'
    )
  }

  conditionExpression() {
    throw Error(
      'Unsupported Operation. Method conditionExpression have not been implemented'
    )
  }
}
