import { Checkboxes, Input } from '@xgovformbuilder/govuk-react-jsx'
import classNames from 'classnames'
import React, { Component } from 'react'

import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { allInputs } from '~/src/data/component/inputs.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { NotifyEditItems } from '~/src/outputs/NotifyEditItems.jsx'
import {
  type Output,
  type NotifyOutputConfiguration,
  type ValidationErrors
} from '~/src/outputs/types.js'

interface State {}

interface Props {
  data: any // TODO: type
  output: Output
  onEdit: ({ data: any }) => void
  errors: ValidationErrors
}

export class NotifyEdit extends Component<Props, State> {
  usableKeys: { name: string; display: string }[]

  constructor(props: Props) {
    super(props)
    const { data } = this.props

    this.usableKeys = allInputs(data).map((input) => ({
      name: input.propertyPath || '',
      display: input.title || ''
    }))
  }

  render() {
    const { data, output, onEdit, errors } = this.props
    const { conditions, lists } = data
    const outputConfiguration = (
      typeof output.outputConfiguration === 'object'
        ? output.outputConfiguration
        : {
            templateId: '',
            apiKey: '',
            emailField: '',
            personalisation: []
          }
    ) as NotifyOutputConfiguration

    const { templateId, apiKey, emailField } = outputConfiguration
    const personalisation = outputConfiguration.personalisation
    const values = [
      ...conditions.map((condition) => ({
        name: condition.name,
        display: condition.displayName
      })),
      ...lists.map((list) => ({
        name: list.name,
        display: `${list.title} (List)`
      })),
      ...this.usableKeys
    ]

    return (
      <>
        <Input
          id="template-id"
          name="template-id"
          label={{
            className: 'govuk-label--s',
            children: ['Template ID']
          }}
          defaultValue={templateId}
          step="any"
          errorMessage={
            errors.templateId
              ? { children: errors.templateId.children }
              : undefined
          }
        />
        <Input
          id="api-key"
          name="api-key"
          label={{
            className: 'govuk-label--s',
            children: ['API Key']
          }}
          defaultValue={apiKey}
          step="any"
          errorMessage={
            errors.apiKey ? { children: errors.apiKey.children } : undefined
          }
        />
        <div
          className={classNames({
            'govuk-form-group': true,
            'govuk-form-group--error': errors.email
          })}
        >
          <label className="govuk-label" htmlFor="email-field">
            Email field
          </label>
          {errors.email && <ErrorMessage>{errors.email.children}</ErrorMessage>}
          <select
            className={classNames({
              'govuk-select': true,
              'govuk-input--error': errors.email
            })}
            id="email-field"
            name="email-field"
            defaultValue={emailField}
          >
            {this.usableKeys.map((value, i) => (
              <option key={`${value.name}-${i}`} value={value.name}>
                {value.display ?? value.name}
              </option>
            ))}
          </select>
        </div>
        <NotifyEditItems
          items={personalisation}
          values={values}
          data={data}
          onEdit={onEdit}
        />
        <Checkboxes
          items={[
            {
              children: (
                <strong>
                  {i18n('outputEdit.notifyEdit.includeReferenceTitle')}
                </strong>
              ),
              hint: {
                children: i18n('outputEdit.notifyEdit.includeReferenceHint')
              },
              value: true
            }
          ]}
          name="add-references-to-personalisation"
        />
      </>
    )
  }
}
