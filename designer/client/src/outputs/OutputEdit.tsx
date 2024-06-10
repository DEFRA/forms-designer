import { Input } from '@xgovformbuilder/govuk-react-jsx'
import React, {
  Component,
  type MouseEvent,
  type ChangeEvent,
  type FormEvent,
  type ReactNode
} from 'react'

import { ErrorSummary } from '~/src/ErrorSummary.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { EmailEdit } from '~/src/outputs/EmailEdit.jsx'
import { NotifyEdit } from '~/src/outputs/NotifyEdit.jsx'
import { WebhookEdit } from '~/src/outputs/WebhookEdit.jsx'
import {
  OutputType,
  type OutputConfiguration,
  type Output,
  type ValidationErrors
} from '~/src/outputs/types.js'
import logger from '~/src/plugins/logger.js'
import { validateNotEmpty, hasValidationErrors } from '~/src/validations.js'

interface State {
  outputType: OutputType
  errors: ValidationErrors
}

interface Props {
  onEdit: ({ data: any }) => void // TODO: type
  onCancel: (event: MouseEvent<HTMLAnchorElement>) => void
  data: any // TODO: type
  output: Output
}

export class OutputEdit extends Component<Props, State> {
  static contextType = DataContext

  constructor(props: Props) {
    super(props)
    this.state = {
      outputType: props.output.type ?? OutputType.Email,
      errors: {}
    }
  }

  onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { data, save } = this.context
    let output = this.props.output || { name: '', type: '' }
    const form = event.currentTarget
    const formData = new window.FormData(form)
    const copy = { ...data }
    const outputType: OutputType =
      (formData.get('output-type') as OutputType) || output.type
    const outputName = formData.get('output-name') as string
    const outputTitle = formData.get('output-title') as string
    const validationErrors = this.validate(formData, outputType)

    if (hasValidationErrors(validationErrors)) return

    let outputIndex = -1

    if (output.name) {
      outputIndex = data.outputs.indexOf(output)
    }

    let outputConfiguration: OutputConfiguration =
      output.outputConfiguration || {}

    switch (outputType) {
      case OutputType.Email:
        outputConfiguration = {
          emailAddress: formData.get('email-address') as string
        }
        break
      case OutputType.Notify:
        outputConfiguration = {
          personalisation: formData
            .getAll('personalisation')
            .map((t) => (t as string).trim()),
          templateId: formData.get('template-id') as string,
          apiKey: formData.get('api-key') as string,
          emailField: formData.get('email-field') as string,
          addReferencesToPersonalisation:
            formData.get('add-references-to-personalisation') === 'true'
        }
        break
      case OutputType.Webhook:
        outputConfiguration = {
          url: formData.get('webhook-url') as string,
          allowRetry: true
        }
        break
    }

    output = {
      name: outputName.trim(),
      title: outputTitle.trim(),
      type: outputType,
      outputConfiguration
    }

    if (outputIndex >= 0) {
      copy.outputs[outputIndex] = output
    } else {
      copy.outputs = copy.outputs || []
      copy.outputs.push(output)
    }

    save(copy)
      .then((data) => {
        this.props.onEdit({ data })
      })
      .catch((err: Error) => {
        logger.error('OutputEdit', err)
      })
  }

  validate = (formData: FormData, outputType: OutputType) => {
    const outputName = formData.get('output-name') as string
    const outputTitle = formData.get('output-title') as string
    const errors: ValidationErrors = {}

    validateNotEmpty(
      'output-title',
      'output title',
      'title',
      outputTitle,
      errors
    )

    validateNotEmpty('output-name', 'output name', 'name', outputName, errors)

    switch (outputType) {
      case OutputType.Email:
        const emailAddress = formData.get('email-address') as string
        validateNotEmpty(
          'email-address',
          'email address',
          'email',
          emailAddress,
          errors
        )
        break
      case OutputType.Notify:
        const templateId = formData.get('template-id') as string
        const apiKey = formData.get('api-key') as string
        const emailField = formData.get('email-field') as string
        validateNotEmpty(
          'template-id',
          'template id',
          'templateId',
          templateId,
          errors
        )
        validateNotEmpty('api-key', 'API key', 'apiKey', apiKey, errors)
        validateNotEmpty(
          'email-field',
          'email address',
          'email',
          emailField,
          errors
        )
        break
      case OutputType.Webhook:
        const url = formData.get('webhook-url') as string
        if (!url) {
          errors.url = {
            href: '#webhook-url',
            children: 'Not a valid url'
          }
        }
        break
    }

    this.setState({ errors })

    return errors
  }

  onChangeOutputType = (event: ChangeEvent<HTMLSelectElement>) => {
    const outputType = event.currentTarget.value as OutputType
    this.setState({ outputType, errors: {} })
  }

  onClickDelete = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const { output } = this.props
    const { data, save } = this.context
    const copy = { ...data }
    const outputIndex = data.outputs.indexOf(output)
    copy.outputs.splice(outputIndex, 1)

    save(copy)
      .then((data) => {
        this.props.onEdit({ data })
      })
      .catch((err: Error) => {
        logger.error('OutputEdit', err)
      })
  }

  handleOnClickBackLink = (e) => {
    e.preventDefault()
    this.props.onCancel(e)
  }

  render() {
    const { outputType, errors } = this.state
    const { data, output } = this.props
    let outputEdit: ReactNode

    if (outputType === OutputType.Notify) {
      outputEdit = (
        <NotifyEdit
          data={data}
          output={output}
          onEdit={this.props.onEdit}
          errors={errors}
        />
      )
    } else if (outputType === OutputType.Email) {
      outputEdit = <EmailEdit output={output} errors={errors} />
    } else if (outputType === OutputType.Webhook) {
      outputEdit = (
        <WebhookEdit url={output.outputConfiguration.url} errors={errors} />
      )
    }
    return (
      <>
        {hasValidationErrors(errors) && (
          <ErrorSummary errorList={Object.values(errors)} />
        )}
        <form onSubmit={this.onSubmit} autoComplete="off">
          {this.props.onCancel && (
            <a
              className="govuk-back-link"
              href="#"
              onClick={this.handleOnClickBackLink}
            >
              Back
            </a>
          )}
          <Input
            id="output-title"
            name="output-title"
            label={{
              className: 'govuk-label--s',
              children: ['Title']
            }}
            defaultValue={output.title ?? ''}
            errorMessage={
              errors.title ? { children: errors.title.children } : undefined
            }
          />
          <Input
            id="output-name"
            name="output-name"
            label={{
              className: 'govuk-label--s',
              children: ['Name']
            }}
            pattern="^\S+"
            defaultValue={output.name ?? ''}
            errorMessage={
              errors.name ? { children: errors.name.children } : undefined
            }
          />

          <div className="govuk-form-group">
            <label className="govuk-label govuk-label--s" htmlFor="output-type">
              Output type
            </label>
            <select
              className="govuk-select"
              id="output-type"
              name="output-type"
              disabled={!!output.type}
              value={outputType}
              onChange={this.onChangeOutputType}
            >
              <option value="email">Email</option>
              <option value="notify">Email via GOVUK Notify</option>
              <option value="webhook">Webhook</option>
            </select>
          </div>

          {outputEdit}
          <div className="govuk-button-group">
            <button className="govuk-button" type="submit">
              Save
            </button>
            {output && (
              <button
                className="govuk-button govuk-button--warning"
                onClick={this.onClickDelete}
                type="button"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </>
    )
  }
}
