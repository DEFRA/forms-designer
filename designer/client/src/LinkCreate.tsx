import classNames from 'classnames'
import React, { Component, type ContextType } from 'react'

import { ErrorSummary } from '~/src/ErrorSummary.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { SelectConditions } from '~/src/conditions/SelectConditions.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { addLink } from '~/src/data/page/addLink.js'
import { i18n } from '~/src/i18n/i18n.jsx'

export class LinkCreate extends Component {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  state = { errors: {} }

  onSubmit = async (e) => {
    e.preventDefault()
    const { data, save } = this.context
    const { from, to, selectedCondition } = this.state
    const hasValidationErrors = this.validate()
    if (hasValidationErrors) return

    const copy = { ...data }
    const { error, ...updatedData } = addLink(copy, from, to, selectedCondition)
    error && logger.error(error, 'LinkCreate')
    const savedData = await save(updatedData)
    this.props.onCreate?.({ data: savedData })
  }

  conditionSelected = (selectedCondition) => {
    this.setState({
      selectedCondition
    })
  }

  storeValue = (e, key) => {
    const input = e.target
    const stateUpdate = {}
    stateUpdate[key] = input.value
    this.setState(stateUpdate)
  }

  validate = () => {
    const { from, to } = this.state
    const errors = {}
    if (!from) {
      errors.from = { href: '#link-source', children: 'Enter from' }
    }
    if (!to) {
      errors.to = { href: '#link-target', children: 'Enter to' }
    }
    this.setState({
      errors
    })
    return !from || !to
  }

  render() {
    const { data } = this.context
    const { pages } = data
    const { from, errors } = this.state
    const hasValidationErrors = Object.keys(errors).length > 0

    return (
      <>
        {hasValidationErrors && (
          <ErrorSummary errorList={Object.values(errors)} />
        )}
        <div className="govuk-hint">{i18n('addLink.hint')}</div>
        <form onSubmit={(e) => this.onSubmit(e)} autoComplete="off">
          <div
            className={classNames({
              'govuk-form-group': true,
              'govuk-form-group--error': errors.from
            })}
          >
            <label className="govuk-label govuk-label--s" htmlFor="link-source">
              From
            </label>
            {errors.from && <ErrorMessage>{errors.from.children}</ErrorMessage>}
            <select
              className={classNames({
                'govuk-select': true,
                'govuk-input--error': errors.from
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
              'govuk-form-group--error': errors.to
            })}
          >
            <label className="govuk-label govuk-label--s" htmlFor="link-target">
              To
            </label>
            {errors.to && <ErrorMessage>{errors.to.children}</ErrorMessage>}
            <select
              className={classNames({
                'govuk-select': true,
                'govuk-input--error': errors.to
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

          {from && from.trim() !== '' && (
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
