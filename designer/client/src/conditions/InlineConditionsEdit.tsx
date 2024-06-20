import {
  ConditionGroupDef,
  toPresentationString,
  clone
} from '@defra/forms-model'
import classNames from 'classnames'
import React, { Component, Fragment } from 'react'

import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { InlineConditionsDefinition } from '~/src/conditions/InlineConditionsDefinition.jsx'

export class InlineConditionsEdit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      conditions: props.conditions,
      selectedConditions: []
    }
  }

  onChangeCheckbox = (e) => {
    let copy = clone(this.state.selectedConditions ?? [])
    const index = Number(e.target.value)
    if (e.target.checked) {
      copy.push(index)
    } else {
      copy = copy.filter((it) => it !== index)
    }
    this.setState({
      selectedConditions: copy
    })
  }

  onClickGroup = (e) => {
    e?.preventDefault()
    if (this.state.selectedConditions.length < 2) {
      this.setState({
        editingError: 'Please select at least 2 items for grouping'
      })
    } else {
      const groups = this.groupWithConsecutiveConditions(
        this.state.selectedConditions
      )
      if (groups.find((group) => group.length === 1)) {
        this.setState({
          editingError: 'Please select consecutive items to group'
        })
      } else {
        this.setState({
          editingError: undefined,
          selectedConditions: [],
          conditions: this.state.conditions.addGroups(
            groups
              .sort((a, b) => a - b)
              .reduce((groupDefs, group) => {
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

  onClickRemove = (index) => {
    this.setState({
      editingError: undefined,
      selectedConditions: [],
      conditions: this.state.conditions.remove([index]),
      condition: undefined
    })

    if (!this.state.conditions.hasConditions) {
      this.props.exitCallback()
    }
  }

  groupWithConsecutiveConditions(selectedConditions) {
    const result = []
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.conditions !== this.props.conditions) {
      this.setState({
        conditions: this.props.conditions,
        selectedConditions: []
      })
    }
  }

  onClickCancelEditView = (e) => {
    e?.preventDefault()
    this.setState({
      selectedConditions: [],
      editingIndex: undefined
    })
    this.props.exitCallback()
  }

  onClickSplit(index) {
    this.setState({
      conditions: this.state.conditions.splitGroup(index)
    })
  }

  onClickEdit(index) {
    const conditions = this.state.conditions.asPerUserGroupings
    if (conditions.length > index) {
      this.setState({
        editingIndex: index,
        condition: Object.assign({}, conditions[index])
      })
    }
  }

  setState(state, callback) {
    if (state.conditions) {
      this.props.saveCallback(state.conditions)
    }
    super.setState(state, callback)
  }

  saveCondition = (condition) => {
    this.setState({
      conditions: this.state.conditions.replace(
        this.state.editingIndex,
        condition
      ),
      condition: undefined,
      editingIndex: undefined
    })
  }

  render() {
    const {
      conditions,
      condition,
      editingIndex,
      editingError,
      selectedConditions
    } = this.state

    return (
      <div id="edit-conditions">
        {!editingIndex && editingIndex !== 0 && (
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
                {conditions.asPerUserGroupings.map((condition, index) => {
                  const isChecked = selectedConditions.includes(index)

                  return (
                    <Fragment key={`condition-checkbox-${index}`}>
                      <div className="govuk-checkboxes__item">
                        <input
                          type="checkbox"
                          className="govuk-checkboxes__input"
                          id={`condition-${index}`}
                          name={`condition-${index}`}
                          value={index}
                          onChange={this.onChangeCheckbox}
                          checked={isChecked ?? undefined}
                        />
                        <label
                          className="govuk-label govuk-checkboxes__label"
                          htmlFor={`condition-${index}`}
                        >
                          {toPresentationString(condition)}
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
                            <a
                              href="#"
                              className="govuk-link govuk-!-margin-bottom-2"
                              onClick={(e) => {
                                e.preventDefault()
                                this.onClickSplit(index)
                              }}
                            >
                              Split
                            </a>
                          )}
                          {!condition.isGroup() && (
                            <a
                              href="#"
                              className="govuk-link govuk-!-margin-bottom-2"
                              onClick={(e) => {
                                e.preventDefault()
                                this.onClickEdit(index)
                              }}
                            >
                              Edit
                            </a>
                          )}
                          {!selectedConditions.length || (
                            <a
                              href="#"
                              className="govuk-link govuk-!-margin-bottom-2"
                              onClick={(e) => {
                                e.preventDefault()
                                this.onClickRemove(index)
                              }}
                            >
                              Remove
                            </a>
                          )}
                        </div>
                      </div>
                    </Fragment>
                  )
                })}
                {selectedConditions.length > 1 && (
                  <div className="govuk-button-group">
                    <a
                      href="#"
                      className="govuk-link"
                      onClick={this.onClickGroup}
                    >
                      Group selected conditions
                    </a>
                  </div>
                )}
              </div>
            </fieldset>
          </div>
        )}
        {editingIndex >= 0 && (
          <InlineConditionsDefinition
            expectsCoordinator={editingIndex > 0}
            fields={this.props.fields}
            condition={condition}
            saveCallback={this.saveCondition}
          />
        )}
        <div className="govuk-button-group">
          <button
            id="cancel-edit-inline-conditions-link"
            className="govuk-button"
            type="button"
            onClick={this.onClickCancelEditView}
          >
            Finished editing
          </button>
        </div>
      </div>
    )
  }
}
