import {
  ConditionGroupDef,
  hasConditionField,
  slugify,
  toPresentationString,
  type Condition,
  type ConditionData,
  type ConditionGroup,
  type ConditionGroupData,
  type ConditionRef,
  type ConditionRefData,
  type ConditionsModel
} from '@defra/forms-model'
import classNames from 'classnames'
import { Component, Fragment, type ChangeEvent, type MouseEvent } from 'react'

import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { InlineConditionsDefinition } from '~/src/conditions/InlineConditionsDefinition.jsx'
import { type FieldDef } from '~/src/data/component/fields.js'

interface Props {
  conditions: ConditionsModel
  fields: Partial<Record<string, FieldDef>>
  saveCallback: (conditions: ConditionsModel) => void
  exitCallback: () => void
}

interface State {
  condition?: ConditionData | ConditionRefData | ConditionGroupData
  conditions?: ConditionsModel
  selectedConditions?: number[]
  editingIndex?: number
  editingError?: string
}

export class InlineConditionsEdit extends Component<Props, State> {
  state: State = {
    selectedConditions: []
  }

  componentDidMount() {
    const { conditions } = this.props
    this.setState({ conditions })
  }

  onChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const { selectedConditions } = this.state
    const { checked } = e.target

    let copy = selectedConditions ? structuredClone(selectedConditions) : []
    const index = Number(e.target.value)

    if (checked) {
      copy.push(index)
    } else {
      copy = copy.filter((it) => it !== index)
    }

    this.setState({
      selectedConditions: copy
    })
  }

  onClickGroup = (e: MouseEvent<HTMLButtonElement>) => {
    const { conditions, selectedConditions } = this.state

    e.preventDefault()
    if (!selectedConditions || selectedConditions.length < 2) {
      this.setState({
        editingError: 'Please select at least 2 items for grouping'
      })
    } else {
      const groups = this.groupWithConsecutiveConditions(selectedConditions)

      if (groups.find((group) => group.length === 1)) {
        this.setState({
          editingError: 'Please select consecutive items to group'
        })
      } else {
        this.setState({
          editingError: undefined,
          selectedConditions: [],
          conditions: conditions?.addGroups(
            groups.reduce<ConditionGroupDef[]>((groupDefs, group) => {
              groupDefs.push(
                new ConditionGroupDef(group[0], group[group.length - 1])
              )
              return groupDefs
            }, [])
          )
        })
      }
    }
  }

  onClickRemove = (index: number) => {
    const { exitCallback } = this.props
    const { conditions } = this.state

    this.setState({
      editingError: undefined,
      selectedConditions: [],
      conditions: conditions?.remove([index]),
      condition: undefined
    })

    if (!conditions?.hasConditions) {
      exitCallback()
    }
  }

  groupWithConsecutiveConditions(selectedConditions: number[]) {
    const result: number[][] = []

    selectedConditions.sort((a, b) => a - b)
    selectedConditions.forEach((condition) => {
      const groupForCondition = result.find(
        (group) =>
          group.includes(condition - 1) || group.includes(condition + 1)
      )

      if (groupForCondition) {
        groupForCondition.push(condition)
      } else {
        result.push([condition])
      }
    })

    return result
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    const { conditions } = this.props

    if (conditions === prevProps.conditions) {
      return
    }

    this.setState({
      conditions,
      selectedConditions: []
    })
  }

  onClickCancelEditView = (e: MouseEvent<HTMLButtonElement>) => {
    const { exitCallback } = this.props

    e.preventDefault()

    this.setState({
      selectedConditions: [],
      editingIndex: undefined
    })

    exitCallback()
  }

  onClickSplit(index: number) {
    const { conditions } = this.state

    this.setState({
      conditions: conditions?.splitGroup(index)
    })
  }

  onClickEdit(index: number) {
    const { conditions } = this.state

    const group = conditions?.asPerUserGroupings
    const condition = group?.[index]

    if (!condition) {
      return
    }

    this.setState({
      editingIndex: index,
      condition: condition.toJSON()
    })
  }

  setState(state: State) {
    const { saveCallback } = this.props
    const { conditions } = state

    if (conditions) {
      saveCallback(conditions)
    }

    super.setState(state)
  }

  saveCondition = (condition: Condition | ConditionRef | ConditionGroup) => {
    const { conditions, editingIndex } = this.state

    if (typeof editingIndex === 'undefined') {
      return
    }

    this.setState({
      conditions: conditions?.replace(editingIndex, condition),
      condition: undefined,
      editingIndex: undefined
    })
  }

  render() {
    const { fields } = this.props

    const {
      conditions,
      condition,
      editingIndex,
      editingError,
      selectedConditions
    } = this.state

    return (
      <>
        {typeof editingIndex === 'undefined' && (
          <div
            className={classNames({
              'govuk-form-group': true,
              'govuk-form-group--error': editingError
            })}
          >
            <fieldset className="govuk-fieldset">
              <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                Amend conditions
              </legend>
              {editingError && <ErrorMessage>{editingError}</ErrorMessage>}
              <div
                id="editing-checkboxes"
                className="govuk-checkboxes govuk-checkboxes--small"
              >
                {conditions?.asPerUserGroupings.map((condition, index) => {
                  const isChecked = selectedConditions?.includes(index)

                  const conditionLabel = toPresentationString(condition)
                  const conditionId = slugify(conditionLabel)

                  return (
                    <Fragment key={conditionId}>
                      <div className="govuk-checkboxes__item">
                        <input
                          type="checkbox"
                          className="govuk-checkboxes__input"
                          id={`condition-${index}`}
                          name={`condition-${index}`}
                          value={index}
                          onChange={this.onChangeCheckbox}
                          checked={isChecked}
                        />
                        <label
                          className="govuk-label govuk-checkboxes__label"
                          htmlFor={`condition-${index}`}
                        >
                          {conditionLabel}
                        </label>
                      </div>
                      <div
                        className={classNames(
                          'govuk-checkboxes__conditional',
                          !isChecked
                            ? 'govuk-checkboxes__conditional--hidden'
                            : undefined
                        )}
                      >
                        <div className="govuk-button-group">
                          {condition.isGroup() && (
                            <button
                              className="govuk-link govuk-!-margin-bottom-2"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                this.onClickSplit(index)
                              }}
                            >
                              Split
                            </button>
                          )}
                          {!condition.isGroup() && (
                            <button
                              className="govuk-link govuk-!-margin-bottom-2"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                this.onClickEdit(index)
                              }}
                            >
                              Edit
                            </button>
                          )}
                          {!selectedConditions?.length || (
                            <button
                              className="govuk-link govuk-!-margin-bottom-2"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                this.onClickRemove(index)
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </Fragment>
                  )
                })}
                {!!selectedConditions && selectedConditions.length > 1 && (
                  <div className="govuk-button-group">
                    <button
                      className="govuk-link"
                      type="button"
                      onClick={this.onClickGroup}
                    >
                      Group selected conditions
                    </button>
                  </div>
                )}
              </div>
            </fieldset>
          </div>
        )}
        {typeof editingIndex === 'number' && hasConditionField(condition) && (
          <InlineConditionsDefinition
            expectsCoordinator={editingIndex > 0}
            fields={fields}
            condition={condition}
            saveCallback={this.saveCondition}
          />
        )}
        <div className="govuk-button-group">
          <button
            className="govuk-button"
            type="button"
            onClick={this.onClickCancelEditView}
          >
            Finished editing
          </button>
        </div>
      </>
    )
  }
}
