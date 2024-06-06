import { clone } from '@defra/forms-model'
import React, { Component } from 'react'

import Editor from '~/src/Editor.jsx'
import { DataContext } from '~/src/context/index.js'
import logger from '~/src/plugins/logger.js'

class DeclarationEdit extends Component {
  static contextType = DataContext

  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const formData = new window.FormData(form)
    const { save, data } = this.context
    const copy = clone(data)

    copy.declaration = formData.get('declaration')
    copy.skipSummary = formData.get('skip-summary') === 'on'

    try {
      const savedData = await save(copy)
      this.props.onCreate({ data: savedData })
    } catch (err) {
      logger.error('DeclarationEdit', err)
    }
  }

  render() {
    const { data } = this.context
    const { declaration, skipSummary } = data

    return (
      <div className="govuk-body">
        <form onSubmit={(e) => this.onSubmit(e)} autoComplete="off">
          <div className="govuk-checkboxes govuk-form-group">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
              <p className="govuk-fieldset__heading">Skip summary page?</p>
              <div className="govuk-hint">
                The user will not be shown a summary page, and will continue to
                pay and/or the application complete page.
              </div>
            </legend>
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id="skip-summary"
                data-cast="boolean"
                name="skip-summary"
                type="checkbox"
                defaultChecked={skipSummary}
              />
              <label
                className="govuk-label govuk-checkboxes__label"
                htmlFor="skip-summary"
              >
                Skip summary
              </label>
            </div>
          </div>

          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="declaration">
              Declaration
            </label>
            <div className="govuk-hint">
              The declaration can include HTML and the `govuk-prose-scope` css
              class is available. Use this on a wrapping element to apply
              default govuk styles.
            </div>
            <Editor name="declaration" value={declaration} />
          </div>

          <button className="govuk-button" type="submit">
            Save
          </button>
        </form>
      </div>
    )
  }
}

export default DeclarationEdit
