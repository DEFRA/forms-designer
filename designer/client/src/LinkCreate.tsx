import classNames from 'classnames'
import React, {
  Component,
  type ChangeEvent,
  type ContextType,
  type FormEvent
} from 'react'

import { ErrorSummary, type ErrorList } from '~/src/ErrorSummary.jsx'
import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { SelectConditions } from '~/src/conditions/SelectConditions.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { addLink } from '~/src/data/page/addLink.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { validateRequired, hasValidationErrors } from '~/src/validations.js'

interface Props {
  onSave: () => void
}

interface State extends Partial<Form> {
  selectedCondition?: string
  errors: Partial<ErrorList<'from' | 'to' | 'selectedCondition'>>
}

interface Form {
  from: string
  to: string
}

export class LinkCreate extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  state: State = {
    errors: {}
  }

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { onSave } = this.props
    const { data, save } = this.context
    const { from, to, selectedCondition } = this.state

    const payload = { from, to }

    // Check for valid form payload
    if (!this.validate(payload)) {
      return
    }

    const definition = addLink(
      data,
      payload.from,
      payload.to,
      selectedCondition
    )

    await save(definition)
    onSave()
  }

  conditionSelected = (selectedCondition: string) => {
    this.setState({
      selectedCondition
    })
  }

  storeValue = (e: ChangeEvent<HTMLSelectElement>, key: 'from' | 'to') => {
    const stateUpdate: Pick<State, typeof key> = {}
    stateUpdate[key] = e.target.value
    this.setState(stateUpdate)
  }

  validate = (payload: Partial<Form>): payload is Form => {
    const { from, to } = payload

    const errors: State['errors'] = {}

    errors.from = validateRequired('link-source', from, { label: 'From' })
    errors.to = validateRequired('link-target', to, { label: 'To' })

    this.setState({ errors })
    return !hasValidationErrors(errors)
  }

  render() {
    const { data } = this.context
    const { from, errors } = this.state

    const { pages } = data
    const hasErrors = hasValidationErrors(errors)

    return (
      <>
        {hasErrors && (
          <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
        )}

        <div className="govuk-hint">{i18n('addLink.hint')}</div>
        <form onSubmit={this.onSubmit} autoComplete="off">
          <div
            className={classNames({
              'govuk-form-group': true,
              'govuk-form-group--error': errors.from
            })}
          >
            <label className="govuk-label govuk-label--s" htmlFor="link-source">
              From
            </label>
            {errors.from && (
              <ErrorMessage id="link-source-error">
                {errors.from.children}
              </ErrorMessage>
            )}
            <select
              className={classNames({
                'govuk-select': true,
                'govuk-input--error': errors.from
              })}
              id="link-source"
              aria-describedby={errors.to && 'link-source-error'}
              name="path"
              onChange={(e) => this.storeValue(e, 'from')}
            >
              <option value="" />
              {pages.map((page) => (
                <option key={page.path} value={page.path}>
                  {page.title}
                </option>
              ))}
            </select>
          </div>

          <div
            className={classNames({
              'govuk-form-group': true,
              'govuk-form-group--error': errors.to
            })}
          >
            <label className="govuk-label govuk-label--s" htmlFor="link-target">
              To
            </label>
            {errors.to && (
              <ErrorMessage id="link-target-error">
                {errors.to.children}
              </ErrorMessage>
            )}
            <select
              className={classNames({
                'govuk-select': true,
                'govuk-input--error': errors.to
              })}
              id="link-target"
              aria-describedby={errors.to && 'link-target-error'}
              name="page"
              onChange={(e) => this.storeValue(e, 'to')}
            >
              <option value="" />
              {pages.map((page) => (
                <option key={page.path} value={page.path}>
                  {page.title}
                </option>
              ))}
            </select>
          </div>

          {from && (
            <SelectConditions
              path={from}
              conditionsChange={this.conditionSelected}
              noFieldsHintText={i18n('addLink.noFieldsAvailable')}
            />
          )}

          <button className="govuk-button" type="submit">
            Save
          </button>
        </form>
      </>
    )
  }
}
