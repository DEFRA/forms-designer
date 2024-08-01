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
import { isEmpty } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { hasValidationErrors } from '~/src/validations.js'

interface Props {
  onCreate?: () => void
}

interface State {
  from?: string
  to?: string
  selectedCondition?: string
  errors?: Partial<ErrorList<'from' | 'to' | 'selectedCondition'>>
}

export class LinkCreate extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  state: State = {}

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { onCreate } = this.props
    const { data, save } = this.context
    const { from, to, selectedCondition } = this.state

    const validationErrors = this.validate(from, to)
    if (hasValidationErrors(validationErrors) || !from || !to) {
      return
    }

    const definition = addLink(data, from, to, selectedCondition)

    await save(definition)
    onCreate?.()
  }

  conditionSelected = (selectedCondition: string) => {
    this.setState({
      selectedCondition
    })
  }

  storeValue = (e: ChangeEvent<HTMLSelectElement>, key: keyof State) => {
    const stateUpdate: State = {}
    stateUpdate[key] = e.target.value
    this.setState(stateUpdate)
  }

  validate = (from?: string, to?: string): State['errors'] => {
    const errors: State['errors'] = {}

    const fromIsEmpty = isEmpty(from)
    const toIsEmpty = isEmpty(to)

    if (fromIsEmpty) {
      errors.from = { href: '#link-source', children: 'Enter from' }
    }

    if (toIsEmpty) {
      errors.to = { href: '#link-target', children: 'Enter to' }
    }

    this.setState({
      errors
    })

    return errors
  }

  render() {
    const { data } = this.context
    const { pages } = data
    const { from, errors } = this.state
    const hasErrors = hasValidationErrors(errors)

    return (
      <>
        {hasErrors && <ErrorSummary errorList={Object.values(errors)} />}
        <div className="govuk-hint">{i18n('addLink.hint')}</div>
        <form onSubmit={(e) => this.onSubmit(e)} autoComplete="off">
          <div
            className={classNames({
              'govuk-form-group': true,
              'govuk-form-group--error': errors?.from
            })}
          >
            <label className="govuk-label govuk-label--s" htmlFor="link-source">
              From
            </label>
            {errors?.from && (
              <ErrorMessage>{errors.from.children}</ErrorMessage>
            )}
            <select
              className={classNames({
                'govuk-select': true,
                'govuk-input--error': errors?.from
              })}
              id="link-source"
              data-testid="link-source"
              name="path"
              onChange={(e) => this.storeValue(e, 'from')}
            >
              <option value="" />
              {pages.map((page) => (
                <option
                  key={page.path}
                  value={page.path}
                  data-testid="link-source-option"
                >
                  {page.title}
                </option>
              ))}
            </select>
          </div>

          <div
            className={classNames({
              'govuk-form-group': true,
              'govuk-form-group--error': errors?.to
            })}
          >
            <label className="govuk-label govuk-label--s" htmlFor="link-target">
              To
            </label>
            {errors?.to && <ErrorMessage>{errors.to.children}</ErrorMessage>}
            <select
              className={classNames({
                'govuk-select': true,
                'govuk-input--error': errors?.to
              })}
              id="link-target"
              data-testid="link-target"
              name="page"
              onChange={(e) => this.storeValue(e, 'to')}
            >
              <option value="" />
              {pages.map((page) => (
                <option
                  key={page.path}
                  value={page.path}
                  data-testid="link-target-option"
                >
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
