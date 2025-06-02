import {
  ConditionsModel,
  isConditionWrapper,
  randomId,
  type Condition,
  type ConditionGroup,
  type ConditionRef,
  type ConditionWrapper
} from '@defra/forms-model'
import classNames from 'classnames'
import { type Root } from 'joi'
import {
  Component,
  type ChangeEvent,
  type ContextType,
  type MouseEvent
} from 'react'

import { ErrorSummary, type ErrorList } from '~/src/ErrorSummary.jsx'
import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { InlineConditionsDefinition } from '~/src/conditions/InlineConditionsDefinition.jsx'
import { InlineConditionsEdit } from '~/src/conditions/InlineConditionsEdit.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { type FieldDef } from '~/src/data/component/fields.js'
import { getFieldsTo } from '~/src/data/component/fields.js'
import { addCondition } from '~/src/data/condition/addCondition.js'
import { removeCondition } from '~/src/data/condition/removeCondition.js'
import { updateCondition } from '~/src/data/condition/updateCondition.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import {
  hasValidationErrors,
  validateCustom,
  validateRequired
} from '~/src/validations.js'

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
  errors: Partial<ErrorList<'name'>>
}

interface Form {
  displayName: string
}

export class InlineConditions extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static readonly contextType = DataContext

  state: State = {
    conditions: new ConditionsModel(),
    fields: {},
    errors: {}
  }

  componentDidMount() {
    const { path, condition } = this.props
    const { conditions: model } = this.state

    const conditions = condition?.value
      ? ConditionsModel.from(condition.value)
      : model

    conditions.name ??= condition?.displayName

    this.setState({
      conditions,
      fields: this.fieldsForPath(path)
    })
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    const { path } = this.props

    if (path === prevProps.path) {
      return
    }

    const fields = this.fieldsForPath(path)

    this.setState({
      conditions: new ConditionsModel(),
      fields,
      editView: false
    })
  }

  fieldsForPath = (path?: string) => {
    const { data } = this.context

    const fieldInputs = getFieldsTo(data, path)

    const conditionsInputs: FieldDef[] = data.conditions
      .filter(isConditionWrapper)
      .map((condition) => ({
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

  onClickSave = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const { conditionsChange, condition } = this.props
    const { data, save } = this.context
    const { conditions } = this.state

    const payload = {
      displayName: conditions.name
    }

    const { default: schema } = await import('joi')

    // Check for valid form payload
    if (!this.validate(payload, schema)) {
      return
    }

    if (condition) {
      const definition = updateCondition(data, condition.name, {
        displayName: payload.displayName,
        value: conditions.toJSON()
      })

      await save(definition)
      conditionsChange(payload.displayName)
    } else if (conditions.hasConditions) {
      const name = randomId()
      const definition = addCondition(data, {
        name,
        displayName: payload.displayName,
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
      const definition = removeCondition(data, condition)
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

  validate = (payload: Partial<Form>, schema: Root): payload is Form => {
    const { data } = this.context
    const { condition } = this.props

    const errors: State['errors'] = {}

    const displayNames = data.conditions
      .filter(({ displayName }) => displayName !== condition?.displayName)
      .map(({ displayName }) => displayName)

    errors.name = validateRequired('cond-name', payload.displayName, {
      label: i18n('conditions.displayName'),
      schema
    })

    errors.name ??= validateCustom(
      'cond-name',
      [...displayNames, payload.displayName],
      {
        message: 'errors.duplicate',
        label: i18n('conditions.displayName'),
        schema: schema.array().unique()
      }
    )

    this.setState({ errors })
    return !hasValidationErrors(errors)
  }

  render() {
    const { condition } = this.props
    const { conditions, editView, fields, errors } = this.state

    const hasErrors = hasValidationErrors(errors)

    return (
      <>
        {hasErrors && (
          <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
        )}
        <div className="govuk-hint">{i18n('conditions.addOrEditHint')}</div>
        <div
          className={classNames('govuk-form-group', {
            'govuk-form-group--error': errors.name
          })}
        >
          <label className="govuk-label govuk-label--s" htmlFor="cond-name">
            {i18n('conditions.displayName')}
          </label>
          <div className="govuk-hint" id="cond-name-hint">
            {i18n('conditions.displayNameHint')}
          </div>
          {errors.name && (
            <ErrorMessage id="cond-name-error">
              {errors.name.children}
            </ErrorMessage>
          )}
          <input
            className={classNames('govuk-input govuk-input--width-20', {
              'govuk-input--error': errors.name
            })}
            id="cond-name"
            aria-describedby={
              'cond-name-hint' + (errors.name ? ' cond-name-error' : '')
            }
            name="cond-name"
            type="text"
            defaultValue={conditions.name}
            required
            onChange={this.onChangeDisplayName}
          />
        </div>
        <h3 className="govuk-heading-s govuk-!-margin-bottom-1">
          {i18n('conditions.condition')}
        </h3>
        <p className="govuk-hint govuk-!-margin-top-0">
          {i18n('conditions.conditionHint')}
        </p>
        {conditions.hasConditions && (
          <ul className="govuk-list govuk-list--bullet">
            <li key="condition-string">
              <strong>{conditions.toPresentationString()}</strong>
              {!editView && (
                <>
                  <br />
                  <a
                    href="#inline-conditions-edit"
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
                    className="govuk-button"
                    type="button"
                    onClick={this.onClickSave}
                  >
                    {i18n('save')}
                  </button>
                  {condition && (
                    <button
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
      </>
    )
  }
}
