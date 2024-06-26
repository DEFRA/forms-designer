import { ConditionsModel, clone, type Item } from '@defra/forms-model'
import classNames from 'classnames'
import React, {
  Component,
  type ChangeEvent,
  type ContextType,
  type MouseEvent
} from 'react'

import { ErrorSummary, type ErrorListItem } from '~/src/ErrorSummary.jsx'
import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { InlineConditionsDefinition } from '~/src/conditions/InlineConditionsDefinition.jsx'
import { InlineConditionsEdit } from '~/src/conditions/InlineConditionsEdit.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { allInputs, inputsAccessibleAt } from '~/src/data/component/inputs.js'
import { addCondition } from '~/src/data/condition/addCondition.js'
import { removeCondition } from '~/src/data/condition/removeCondition.js'
import { updateCondition } from '~/src/data/condition/updateCondition.js'
import { findList } from '~/src/data/list/findList.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import randomId from '~/src/randomId.js'

interface Props {
  path: string
  condition?: any
  cancelCallback?: (event: MouseEvent) => void
  conditionsChange?: (event: MouseEvent) => void
}

interface State {
  editView?: boolean
  conditions: ConditionsModel
  fields: any
  conditionString: any
  validationErrors: ErrorListItem[]
}

const yesNoValues: Readonly<Item> = [
  {
    text: 'Yes',
    value: true
  },
  {
    text: 'No',
    value: false
  }
]

export class InlineConditions extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  constructor(props, context) {
    super(props, context)

    const { path, condition } = this.props

    const conditions =
      condition && typeof condition.value === 'object'
        ? ConditionsModel.from(condition.value)
        : new ConditionsModel()

    conditions.name &&= condition.displayName

    this.state = {
      validationErrors: [],
      conditions,
      fields: this.fieldsForPath(path),
      conditionString: condition?.value
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

  fieldsForPath = (path) => {
    const { data } = this.context

    const inputs = path ? inputsAccessibleAt(data, path) : allInputs(data)

    const fieldInputs = inputs.map((input) => {
      const label = [
        data.sections?.[input.page.section]?.title,
        input.title ?? input.name
      ]
        .filter((p) => p)
        .join(' ')

      let list
      if (input.list) {
        list = findList(data, input.list)
      }

      const values = input.type == 'YesNoField' ? yesNoValues : list?.items

      return {
        label,
        name: input.propertyPath,
        type: input.type,
        values
      }
    })
    const conditionsInputs = data.conditions.map((condition) => ({
      label: condition.displayName,
      name: condition.name,
      type: 'Condition'
    }))

    return fieldInputs.concat(conditionsInputs).reduce((obj, item) => {
      obj[item.name] = item
      return obj
    }, {})
  }

  toggleEdit = () => {
    this.setState({
      editView: !this.state.editView
    })
  }

  onClickCancel = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const { cancelCallback } = this.props
    this.setState({
      conditions: this.state.conditions.clear(),
      editView: false
    })
    if (cancelCallback) {
      cancelCallback(e)
    }
  }

  onClickSave = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const { conditionsChange, condition } = this.props
    const { data, save } = this.context
    const { conditions } = this.state

    const nameError = this.validateName()

    if (nameError) {
      return
    }

    if (condition) {
      const updatedData = updateCondition(data, condition.name, conditions)
      await save(updatedData)
      if (conditionsChange) {
        conditionsChange(event)
      }
    } else if (conditions.hasConditions) {
      const updatedData = addCondition(data, {
        displayName: conditions.name!,
        name: randomId(),
        value: conditions.toJSON()
      })

      await save(updatedData)
      if (conditionsChange) {
        conditionsChange(event)
      }
    }
  }

  onClickDelete = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const { data, save } = this.context
    const { cancelCallback, condition } = this.props

    const updatedData = removeCondition(data, condition.name)
    await save(updatedData)
    if (cancelCallback) {
      cancelCallback(event)
    }
  }

  saveCondition = (condition) => {
    this.setState({
      conditions: this.state.conditions.add(condition)
    })
  }

  editCallback = (conditions) => {
    this.setState({
      conditions
    })
  }

  onChangeDisplayName = (e: ChangeEvent<HTMLInputElement>) => {
    const copy = clone(this.state.conditions)
    copy.name = e.target.value
    this.setState({
      conditions: copy
    })
  }

  validateName = () => {
    const nameError: ErrorListItem = {
      href: '#cond-name',
      children: i18n('conditions.enterName')
    }
    const { validationErrors } = this.state
    const otherErrors = validationErrors.filter(
      (error) => error.href !== nameError.href
    )

    if (!this.state.conditions.name) {
      this.setState({
        validationErrors: [...otherErrors, nameError]
      })

      return true
    }

    this.setState({ validationErrors: otherErrors })
    return false
  }

  render() {
    const { conditions, editView, conditionString, validationErrors } =
      this.state
    const hasConditions = conditions.hasConditions

    const nameError = validationErrors
      .filter((error) => error.href === '#cond-name')
      .at(0)

    const hasErrors = !!validationErrors.length

    return (
      <div id="inline-conditions" data-testid={'inline-conditions'}>
        <div id="inline-condition-header">
          <div className="govuk-hint">{i18n('conditions.addOrEditHint')}</div>
          {typeof conditionString === 'string' && (
            <div
              id="condition-string-edit-warning"
              className="govuk-warning-text"
            >
              <span className="govuk-warning-text__icon" aria-hidden="true">
                !
              </span>
              <strong className="govuk-warning-text__text">
                <span className="govuk-visually-hidden">{i18n('warning')}</span>
                {i18n('conditions.youCannotEditWarning', { conditionString })}
              </strong>
            </div>
          )}
          <>
            {hasErrors && <ErrorSummary errorList={validationErrors} />}
            <div
              className={classNames('govuk-form-group', {
                'govuk-form-group--error': nameError
              })}
            >
              <label className="govuk-label govuk-label--s" htmlFor="cond-name">
                {i18n('conditions.displayName')}
              </label>
              <div className="govuk-hint">
                {i18n('conditions.displayNameHint')}
              </div>
              {nameError && <ErrorMessage>{nameError.children}</ErrorMessage>}
              <input
                className={classNames('govuk-input govuk-input--width-20', {
                  'govuk-input--error': nameError
                })}
                id="cond-name"
                name="cond-name"
                type="text"
                value={conditions.name ?? ''}
                required
                onChange={this.onChangeDisplayName}
              />
            </div>
            <h4 className="govuk-heading-s govuk-!-margin-bottom-1">
              {i18n('conditions.condition')}
            </h4>
            <p className="govuk-hint govuk-!-margin-top-0">
              {i18n('conditions.conditionHint')}
            </p>
          </>
          {hasConditions && (
            <ul
              className="govuk-list govuk-list--bullet"
              id="conditions-display"
            >
              <li key="condition-string" id="condition-string">
                <strong>{conditions.toPresentationString()}</strong>
                {!editView && (
                  <>
                    <br />
                    <a
                      href="#"
                      id="edit-conditions-link"
                      className="govuk-link"
                      onClick={(e) => {
                        e.preventDefault()
                        this.toggleEdit()
                      }}
                    >
                      {i18n('conditions.edit')}
                    </a>
                  </>
                )}
              </li>
            </ul>
          )}
        </div>
        {!editView && (
          <>
            <InlineConditionsDefinition
              expectsCoordinator={hasConditions}
              fields={this.state.fields}
              saveCallback={this.saveCondition}
            />
            <div className="govuk-button-group">
              {hasConditions && (
                <>
                  <button
                    id="save-inline-conditions"
                    className="govuk-button"
                    type="button"
                    onClick={this.onClickSave}
                  >
                    {i18n('save')}
                  </button>
                  {this.props.condition && (
                    <button
                      id="delete-inline-conditions"
                      className="govuk-button govuk-button--warning"
                      type="button"
                      onClick={this.onClickDelete}
                    >
                      {i18n('delete')}
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}
        {editView && (
          <InlineConditionsEdit
            conditions={conditions}
            fields={this.state.fields}
            saveCallback={this.editCallback}
            exitCallback={this.toggleEdit}
          />
        )}
      </div>
    )
  }
}
InlineConditions.contextType = DataContext
