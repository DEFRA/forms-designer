import {
  ConditionsModel,
  type ConditionWrapper,
  type FormDefinition
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
import {
  isDuplicateCondition,
  hasConditionName,
  getFieldNameSubstring,
  conditionsByType
} from '~/src/conditions/select-condition-helpers.js'
import { DataContext } from '~/src/context/DataContext.js'
import { allInputs, inputsAccessibleAt } from '~/src/data/component/inputs.js'
import { hasConditions as dataHasConditions } from '~/src/data/condition/hasConditions.js'
import { i18n } from '~/src/i18n/i18n.jsx'

export interface Props {
  path: string
  data: FormDefinition
  conditionsChange: (selectedCondition: string) => void
  noFieldsHintText?: string
}

interface State {
  inline: boolean
  selectedCondition: string
  fields: any
}

export class SelectConditions extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      fields: this.fieldsForPath(props.path),
      inline: false,
      selectedCondition: props.selectedCondition
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.path !== prevProps.path) {
      const fields = this.fieldsForPath(this.props.path)

      this.setState({
        conditions: new ConditionsModel(),
        fields,
        editView: false
      })
    }
  }

  fieldsForPath(path: string) {
    const { data } = this.context
    const inputs = path
      ? inputsAccessibleAt(data, path)
      : (allInputs(data) ?? [])
    return inputs
      .map((input) => ({
        label: input.title,
        name: this.trimSectionName(input.propertyPath),
        type: input.type
      }))
      .reduce((obj, item) => {
        obj[item.name] = item
        return obj
      }, {})
  }

  conditionsForPath(path: string) {
    const { data } = this.context
    const fields: any = Object.values(this.fieldsForPath(path))
    const { conditions = [] } = data
    const conditionsForPath: any[] = []
    const conditionsByTypeMap = conditionsByType(conditions)

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

    return conditionsForPath
  }

  handleConditions(
    objectConditions: ConditionWrapper[],
    fieldName: string,
    conditionsForPath: any[]
  ) {
    objectConditions.forEach((condition) => {
      condition.value.conditions.forEach((innerCondition) => {
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
    conditionsForPath: any[]
  ) {
    nestedConditions.forEach((condition) => {
      condition.value.conditions.forEach((innerCondition) => {
        // if the condition is already in the conditions array, skip the for each loop iteration
        if (isDuplicateCondition(conditionsForPath, condition.name)) return
        // if the inner condition isn't a nested condition, handle it in the standard way
        if (!hasConditionName(innerCondition)) {
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
    conditionToAdd,
    fieldName: string,
    conditionFieldName: string,
    conditions: any[]
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

  setState(state, callback?: () => void) {
    if (state.selectedCondition !== undefined) {
      this.props.conditionsChange(state.selectedCondition)
    }
    super.setState(state, callback)
  }

  onChangeConditionSelection = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    this.setState({
      selectedCondition: input.value
    })
  }

  onCancelInlineCondition = () => {
    this.setState({
      inline: false
    })
  }

  onSaveInlineCondition = (createdCondition) => {
    this.setState({
      inline: false,
      selectedCondition: createdCondition
    })
  }

  render() {
    const { selectedCondition, inline } = this.state
    const { noFieldsHintText } = this.props
    const conditions = this.conditionsForPath(this.props.path)
    const hasConditions = dataHasConditions(conditions) || selectedCondition
    const hasFields = Object.keys(this.state.fields ?? {}).length > 0

    return (
      <div className="conditions" data-testid="select-conditions">
        <div className="govuk-form-group" id="conditions-header-group">
          <label
            className="govuk-label govuk-label--s"
            htmlFor="page-conditions"
          >
            {i18n('conditions.optional')}
          </label>
        </div>
        {hasFields || hasConditions ? (
          <>
            {hasConditions && (
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
                  className: 'govuk-label--s',
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
                    path={this.props.path}
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
