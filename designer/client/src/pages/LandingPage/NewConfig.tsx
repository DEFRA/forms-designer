import React, { Component, type MouseEvent } from 'react'
import { withRouter } from 'react-router-dom'

import { BackLink } from '~/src/components/BackLink/index.js'
import { i18n } from '~/src/i18n/index.js'
import * as formConfigurationApi from '~/src/load-form-configurations.js'
import './LandingPage.scss'
import { isEmpty } from '~/src/helpers.js'

import { Input } from '@xgovformbuilder/govuk-react-jsx'

import ErrorSummary from '~/src/error-summary.jsx'

interface Props {
  history: any
}

interface State {
  configs: { Key: string; DisplayName: string }[]
  newName: string
  errors?: any
  loading?: boolean
}

const parseNewName = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-')
}

export class NewConfig extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      configs: [],
      newName: '',
      errors: {},
      loading: true
    }
  }

  componentDidMount() {
    formConfigurationApi.loadConfigurations().then((configs) => {
      this.setState({
        configs,
        loading: false
      })
    })
  }

  validate = () => {
    const { newName, configs } = this.state

    const errors: any = {}
    let hasErrors = false

    if (isEmpty(newName)) {
      errors.name = {
        href: '#formName',
        children: i18n('Enter form name')
      }
      hasErrors = true
      return { errors, hasErrors }
    }

    if (!newName.match(/^[a-zA-Z0-9 _-]+$/)) {
      errors.name = {
        href: '#formName',
        children: i18n('Form name should not contain special characters')
      }
      hasErrors = true
      return { errors, hasErrors }
    }

    const parsedName = parseNewName(newName)
    const alreadyExists =
      configs.find((config) => {
        const fileName = config.Key.toLowerCase().replace('.json', '')
        return fileName === parsedName
      }) ?? false

    if (alreadyExists) {
      errors.name = {
        href: '#formName',
        children: i18n('A form with this name already exists')
      }
      hasErrors = true
    }

    return { errors, hasErrors }
  }

  handleErrors = (errors) => {
    this.setState({
      errors
    })
  }

  handleResponse = async (res) => {
    if (!res.ok) {
      const text = await res.text()
      this.handleErrors({
        name: {
          href: '#formName',
          children: i18n(text)
        }
      })
      return
    }
    return res.json()
  }

  onSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const { newName } = this.state

    const { errors, hasErrors } = this.validate()

    if (hasErrors) {
      this.handleErrors(errors)
      return
    } else {
      this.handleErrors(errors)
    }

    const newResponse = await window
      .fetch('/forms-designer/api/new', {
        method: 'POST',
        body: JSON.stringify({
          selected: { Key: 'New' },
          name: parseNewName(newName)
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then((res) => this.handleResponse(res))
    this.props.history.push(`designer/${newResponse.id}`)
  }

  goBack = (event) => {
    event.preventDefault()
    this.props.history.goBack()
  }

  render() {
    const { newName, errors } = this.state

    if (this.state.loading) {
      return <p>Loading ...</p>
    }

    return (
      <div className="new-config">
        <div>
          <BackLink onClick={this.goBack}>
            {i18n('Back to previous page')}
          </BackLink>

          {errors?.name && (
            <ErrorSummary
              titleChildren="There is a problem"
              errorList={Object.values(errors)}
            />
          )}

          <h1 className="govuk-heading-l">
            {i18n('Enter a name for your form')}
          </h1>

          <Input
            id="formName"
            name="formName"
            className="govuk-input--width-10"
            label={{
              className: 'govuk-label--s',
              children: ['Title']
            }}
            value={newName || ''}
            onChange={(e) => this.setState({ newName: e.target.value })}
            errorMessage={
              errors?.name ? { children: errors?.name.children } : undefined
            }
          />
          <button
            className="govuk-button govuk-button--start"
            onClick={this.onSubmit}
          >
            {i18n('Next')}
          </button>
        </div>
      </div>
    )
  }
}

export default withRouter(NewConfig)
