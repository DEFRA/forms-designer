import React, { Component, type ContextType, type FormEvent } from 'react'

import { Editor } from '~/src/Editor.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { DataContext } from '~/src/context/DataContext.js'
import { getFormValue } from '~/src/helpers.js'

interface Props {
  onCreate: () => void
}

export class DeclarationEdit extends Component<Props> {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { onCreate } = this.props
    const { save, data } = this.context

    const formData = new window.FormData(e.currentTarget)
    const definition = structuredClone(data)

    definition.declaration = getFormValue(formData, 'declaration')
    definition.skipSummary = getFormValue(formData, 'skip-summary') === 'on'

    try {
      await save(definition)
      onCreate()
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
