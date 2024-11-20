export class ConditionValueAbstract {
  toPresentationString(): string {
    throw new Error(
      'Unsupported Operation. Method toPresentationString has not been implemented'
    )
  }

  toValue(): string {
    throw new Error(
      'Unsupported Operation. Method toExpression has not been implemented'
    )
  }

  clone() {
    throw new Error(
      'Unsupported Operation. Method clone has not been implemented'
    )
  }
}
