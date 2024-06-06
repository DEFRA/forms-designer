import React, { Component } from 'react'

interface Props {
  output: any // TODO
}

export class EmailEdit extends Component<Props> {
  render() {
    const { output } = this.props
    const outputConfiguration = output?.outputConfiguration ?? {
      emailAddress: ''
    }

    return (
      <div className="govuk-body email-edit">
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="email-address">
            Email Address
          </label>
          <input
            className="govuk-input"
            name="email-address"
            type="text"
            required
            defaultValue={outputConfiguration.emailAddress}
          />
        </div>
      </div>
    )
  }
}
