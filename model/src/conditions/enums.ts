export enum ConditionType {
  Value = 'Value',
  RelativeDate = 'RelativeDate',
  StringValue = 'StringValue',
  ListItemRef = 'ListItemRef'
}

export enum Coordinator {
  AND = 'and',
  OR = 'or'
}

export enum Operator {
  Is = '==',
  IsNot = '!=',
  Contains = 'in',
  IsAtLeast = '>=',
  IsAtMost = '<=',
  IsLessThan = '<',
  IsMoreThan = '>'
}

export enum OperatorName {
  Is = 'is',
  IsNot = 'is not',
  IsLongerThan = 'is longer than',
  IsShorterThan = 'is shorter than',
  HasLength = 'has length',
  Contains = 'contains',
  DoesNotContain = 'does not contain',
  IsAtLeast = 'is at least',
  IsAtMost = 'is at most',
  IsLessThan = 'is less than',
  IsMoreThan = 'is more than',
  IsBefore = 'is before',
  IsAfter = 'is after'
}

export enum DateDirections {
  FUTURE = 'in the future',
  PAST = 'in the past'
}

export enum DateUnits {
  YEARS = 'years',
  MONTHS = 'months',
  DAYS = 'days'
}
