import {
  ConditionsModel,
  hasConditionField,
  hasConditionName,
  hasNestedCondition,
  isDuplicateCondition,
  type ConditionWrapper
} from '@defra/forms-model'
// @ts-expect-error -- No types available
import { Select } from '@xgovformbuilder/govuk-react-jsx'
import React, {
  Component,
  type ChangeEvent,
  type ContextType,
  type MouseEvent
} from 'react'

import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { InlineConditions } from '~/src/conditions/InlineConditions.jsx'
import { type FieldDef } from '~/src/conditions/InlineConditionsDefinitionValue.jsx'
import {
  conditionsByType,
  getFieldNameSubstring
} from '~/src/conditions/select-condition-helpers.js'
import { DataContext } from '~/src/context/DataContext.js'
import { allInputs, inputsAccessibleAt } from '~/src/data/component/inputs.js'
import { hasConditions } from '~/src/data/condition/hasConditions.js'
import { i18n } from '~/src/i18n/i18n.jsx'

export interface Props {
  path?: string
  selectedCondition?: string
  conditionsChange: (selectedCondition: string) => void
  noFieldsHintText?: string
}

interface State {
  selectedCondition?: string
  conditions?: ConditionsModel
  fields?: Partial<Record<string, FieldDef>>
  inline?: boolean
  editView?: boolean
}

export class SelectConditions extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  constructor(props: Props, context: typeof DataContext) {
    super(props, context)

    this.state = {
      fields: this.fieldsForPath(props.path),
      selectedCondition: props.selectedCondition,
      inline: false
    }
  }

  componentDidUpdate = (prevProps: Props) => {
    const { path } = this.props

    if (path !== prevProps.path) {
      const fields = this.fieldsForPath(path)

      this.setState({
        conditions: new ConditionsModel(),
        fields,
        editView: false
      })
    }
  }

  fieldsForPath(path?: string) {
    const { data } = this.context

    const inputs = path ? inputsAccessibleAt(data, path) : allInputs(data)
    return inputs
      .map(
        (input) =>
          ({
            label: input.title,
            name: this.trimSectionName(input.propertyPath),
            type: input.type
          }) satisfies FieldDef
      )
      .reduce<Record<string, FieldDef>>((obj, item) => {
        obj[item.name] = item
        return obj
      }, {})
  }

  conditionsForPath(path?: string) {
    const { data } = this.context

    const fields = Object.values(this.fieldsForPath(path))
    const conditionsForPath: ConditionWrapper[] = []
    const conditionsByTypeMap = conditionsByType(data.conditions)

    fields.forEach((field) => {
      this.handleConditions(
        conditionsByTypeMap.object,
        field.name,
        conditionsForPath
      )
      this.handleNestedConditions(
        conditionsByTypeMap.nested,
        field.name,
        conditionsForPath
      )
    })

    return conditionsForPath.sort(
      ({ displayName: nameA }, { displayName: nameB }) =>
        nameA.localeCompare(nameB)
    )
  }

  handleConditions(
    objectConditions: ConditionWrapper[],
    fieldName: string,
    conditionsForPath: ConditionWrapper[]
  ) {
    objectConditions.forEach((condition) => {
      condition.value.conditions.forEach((innerCondition) => {
        if (!hasConditionField(innerCondition)) {
          return
        }

        this.checkAndAddCondition(
          condition,
          fieldName,
          getFieldNameSubstring(innerCondition.field.name),
          conditionsForPath
        )
      })
    })
  }

  // loops through nested conditions, checking the referenced condition against the current field
  handleNestedConditions(
    nestedConditions: ConditionWrapper[],
    fieldName: string,
    conditionsForPath: ConditionWrapper[]
  ) {
    nestedConditions.forEach((condition) => {
      if (!hasNestedCondition(condition)) {
        return
      }

      condition.value.conditions.forEach((innerCondition) => {
        // if the condition is already in the conditions array, skip the for each loop iteration
        if (isDuplicateCondition(conditionsForPath, condition.name)) return

        // if the inner condition isn't a nested condition, handle it in the standard way
        if (!hasConditionName(innerCondition)) {
          if (!hasConditionField(innerCondition)) {
            return
          }

          this.checkAndAddCondition(
            condition,
            fieldName,
            getFieldNameSubstring(innerCondition.field.name),
            conditionsForPath
          )

          return
        }

        // if the inner condition is a nested condition,
        // check if that nested condition is already in the conditions array,
        // and if so, add this condition to the array
        if (
          isDuplicateCondition(conditionsForPath, innerCondition.conditionName)
        )
          conditionsForPath.push(condition)
      })
    })
  }

  checkAndAddCondition(
    conditionToAdd: ConditionWrapper,
    fieldName: string,
    conditionFieldName: string,
    conditions: ConditionWrapper[]
  ) {
    if (isDuplicateCondition(conditions, conditionToAdd.name)) return
    if (fieldName === conditionFieldName) conditions.push(conditionToAdd)
  }

  trimSectionName(fieldName: string) {
    if (fieldName.includes('.')) {
      return fieldName.substring(fieldName.indexOf('.') + 1)
    }
    return fieldName
  }

  onClickDefineCondition = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    this.setState({
      inline: true
    })
  }

  setState(state: State, callback?: () => void) {
    const { conditionsChange } = this.props

    conditionsChange(state.selectedCondition ?? '')
    super.setState(state, callback)
  }

  onChangeConditionSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: selectedCondition } = e.target

    this.setState({
      selectedCondition
    })
  }

  onCancelInlineCondition = () => {
    this.setState({
      inline: false
    })
  }

  onSaveInlineCondition = (selectedCondition?: string) => {
    this.setState({
      inline: false,
      selectedCondition
    })
  }

  render() {
    const { data } = this.context
    const { noFieldsHintText, path } = this.props
    const { fields, inline, selectedCondition } = this.state

    const conditions = this.conditionsForPath(path)
    const hasConditionsForPath = hasConditions(data) && !!conditions.length
    const hasFields = Object.keys(fields ?? {}).length > 0

    return (
      <div className="conditions" data-testid="select-conditions">
        <h4 className="govuk-heading-s govuk-!-margin-bottom-1">
          {i18n('conditions.optional')}
        </h4>
        {hasFields || hasConditionsForPath ? (
          <>
            {hasConditionsForPath && (
              <Select
                id="select-condition"
                name="cond-select"
                data-testid="select-condition"
                value={selectedCondition ?? ''}
                items={[
                  {
                    children: [''],
                    value: ''
                  },
                  ...conditions.map((it) => ({
                    children: [it.displayName],
                    value: it.name
                  }))
                ]}
                label={{
                  children: ['Select a condition']
                }}
                onChange={this.onChangeConditionSelection}
                required={false}
              />
            )}
            {!inline && (
              <p className="govuk-body">
                <a
                  href="#"
                  id="inline-conditions-link"
                  className="govuk-link"
                  onClick={this.onClickDefineCondition}
                >
                  Define a new condition
                </a>
              </p>
            )}
            {inline && (
              <RenderInPortal>
                <Flyout
                  title="Define condition"
                  onHide={this.onCancelInlineCondition}
                >
                  <InlineConditions
                    path={path}
                    conditionsChange={this.onSaveInlineCondition}
                    cancelCallback={this.onCancelInlineCondition}
                  />
                </Flyout>
              </RenderInPortal>
            )}
          </>
        ) : (
          <p className="govuk-body">{noFieldsHintText}</p>
        )}
      </div>
    )
  }
}
