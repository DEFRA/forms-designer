import { Registration } from '~/src/conditions/condition-value-registration.js'

export class ConditionValueAbstract {
  type: string

  constructor(registration: Registration) {
    if (new.target === ConditionValueAbstract) {
      throw new TypeError('Cannot construct ConditionValue instances directly')
    }

    if (!(registration instanceof Registration)) {
      throw new TypeError(
        'You must register your value type! Call registerValueType!'
      )
    }

    this.type = registration.type
  }

  toPresentationString(): string {
    throw new Error(
      'Unsupported Operation. Method toPresentationString has not been implemented'
    )
  }

  toExpression(): string {
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
