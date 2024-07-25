import { clone } from '@defra/forms-model'
import React, { Component, type ContextType, type FormEvent } from 'react'

import { Editor } from '~/src/Editor.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { DataContext } from '~/src/context/DataContext.js'

export class DeclarationEdit extends Component {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  constructor(props, context) {
    super(props, context)

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    } catch (error) {
      logger.error(error, 'DeclarationEdit')
    }
  }

  render() {
    const { data } = this.context
    const { declaration, skipSummary } = data

    return (
      <form onSubmit={this.onSubmit} autoComplete="off">
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
          <div className="govuk-hint" id="declaration-hint">
            The declaration can include HTML and the `govuk-prose-scope` css
            class is available. Use this on a wrapping element to apply default
            govuk styles.
          </div>
          <Editor
            id="declaration"
            aria-describedby="declaration-hint"
            name="declaration"
            value={declaration}
          />
        </div>

        <button className="govuk-button" type="submit">
          Save
        </button>
      </form>
    )
  }
}
