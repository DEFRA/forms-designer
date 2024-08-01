import {
  ComponentType,
  ConditionsModel,
  isListType,
  type Condition,
  type ConditionGroup,
  type ConditionRef,
  type ConditionWrapper,
  type Item
} from '@defra/forms-model'
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
import { type FieldDef } from '~/src/conditions/InlineConditionsDefinitionValue.jsx'
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
  path?: string
  condition?: ConditionWrapper
  cancelCallback: () => void
  conditionsChange: (selectedCondition?: string) => void
}

interface State {
  editView?: boolean
  conditions: ConditionsModel
  fields: Partial<Record<string, FieldDef>>
  validationErrors: ErrorListItem[]
}

const yesNoValues: Readonly<Item>[] = [
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

  constructor(props: Props, context: typeof DataContext) {
    super(props, context)

    const { path, condition } = this.props

    const conditions = condition?.value
      ? ConditionsModel.from(condition.value)
      : new ConditionsModel()

    conditions.name ??= condition?.displayName

    this.state = {
      validationErrors: [],
      conditions,
      fields: this.fieldsForPath(path)
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

  fieldsForPath = (path?: string) => {
    const { data } = this.context

    const inputs = path ? inputsAccessibleAt(data, path) : allInputs(data)

    const fieldInputs: FieldDef[] = inputs.map((input) => {
      const { page, propertyPath: name, title, type } = input

      const section = data.sections.find(({ name }) => name === page.section)
      const label = section ? `${section.title}: ${title}` : title

      if (isListType(type) || type === ComponentType.YesNoField) {
        const list = input.list ? findList(data, input.list)[0] : undefined

        return {
          label,
          name,
          type,
          values:
            type === ComponentType.YesNoField
              ? yesNoValues
              : (list?.items ?? [])
        }
      }

      return {
        label,
        name,
        type
      }
    })

    const conditionsInputs: FieldDef[] = data.conditions.map((condition) => ({
      label: condition.displayName,
      name: condition.name,
      type: 'Condition'
    }))

    return fieldInputs
      .concat(conditionsInputs)
      .reduce<Record<string, FieldDef>>((obj, item) => {
        obj[item.name] = item
        return obj
      }, {})
  }

  toggleEdit = () => {
    const { editView } = this.state

    this.setState({
      editView: !editView
    })
  }

  onClickCancel = (e: MouseEvent<HTMLAnchorElement>) => {
    const { cancelCallback } = this.props
    const { conditions } = this.state

    e.preventDefault()

    this.setState({
      conditions: conditions.clear(),
      editView: false
    })

    cancelCallback()
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
      const definition = updateCondition(data, condition.name, {
        value: conditions.toJSON()
      })

      await save(definition)
      conditionsChange(condition.name)
    } else if (conditions.hasConditions && conditions.name) {
      const name = randomId()
      const definition = addCondition(data, {
        name,
        displayName: conditions.name,
        value: conditions.toJSON()
      })

      await save(definition)
      conditionsChange(name)
    }
  }

  onClickDelete = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const { data, save } = this.context
    const { cancelCallback, condition } = this.props

    if (condition) {
      const definition = removeCondition(data, condition.name)
      await save(definition)
    }

    cancelCallback()
  }

  saveCondition = (condition: Condition | ConditionRef | ConditionGroup) => {
    const { conditions } = this.state

    this.setState({
      conditions: conditions.add(condition)
    })
  }

  editCallback = (conditions: ConditionsModel) => {
    this.setState({
      conditions
    })
  }

  onChangeDisplayName = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: name } = e.target
    const { conditions } = this.state

    const newConditions = conditions.clone()
    newConditions.name = name

    this.setState({
      conditions: newConditions
    })
  }

  validateName = () => {
    const { conditions, validationErrors } = this.state

    const nameError: ErrorListItem = {
      href: '#cond-name',
      children: i18n('conditions.enterName')
    }

    const otherErrors = validationErrors.filter(
      (error) => error.href !== nameError.href
    )

    if (!conditions.name) {
      this.setState({
        validationErrors: [...otherErrors, nameError]
      })

      return true
    }

    this.setState({ validationErrors: otherErrors })
    return false
  }

  render() {
    const { condition } = this.props
    const { conditions, editView, fields, validationErrors } = this.state

    const nameError = validationErrors
      .filter((error) => error.href === '#cond-name')
      .at(0)

    const hasErrors = !!validationErrors.length

    return (
      <div id="inline-conditions" data-testid={'inline-conditions'}>
        <div id="inline-condition-header">
          <div className="govuk-hint">{i18n('conditions.addOrEditHint')}</div>
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
              <div className="govuk-hint" id="cond-name-hint">
                {i18n('conditions.displayNameHint')}
              </div>
              {nameError && (
                <ErrorMessage id="cond-name-error">
                  {nameError.children}
                </ErrorMessage>
              )}
              <input
                className={classNames('govuk-input govuk-input--width-20', {
                  'govuk-input--error': nameError
                })}
                id="cond-name"
                aria-describedby={
                  'cond-name-hint' + (nameError ? 'cond-name-error' : '')
                }
                name="cond-name"
                type="text"
                defaultValue={conditions.name}
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
          {conditions.hasConditions && (
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
              expectsCoordinator={conditions.hasConditions}
              fields={fields}
              saveCallback={this.saveCondition}
            />
            <div className="govuk-button-group">
              {conditions.hasConditions && (
                <>
                  <button
                    id="save-inline-conditions"
                    className="govuk-button"
                    type="button"
                    onClick={this.onClickSave}
                  >
                    {i18n('save')}
                  </button>
                  {condition && (
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
            fields={fields}
            saveCallback={this.editCallback}
            exitCallback={this.toggleEdit}
          />
        )}
      </div>
    )
  }
}
InlineConditions.contextType = DataContext
