// @ts-expect-error -- No types available
import { Textarea } from '@xgovformbuilder/govuk-react-jsx'
import { Component, type ContextType, type FormEvent } from 'react'

import { logger } from '~/src/common/helpers/logging/logger.js'
import { DataContext } from '~/src/context/DataContext.js'

interface Props {
  onSave: () => void
}

export class DeclarationEdit extends Component<Props> {
  declare context: ContextType<typeof DataContext>
  static readonly contextType = DataContext

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const { onSave } = this.props
    const { save, data } = this.context

    const definition = structuredClone(data)
    const formData = new window.FormData(e.currentTarget)

    definition.declaration = formData.get('declaration')?.toString()
    definition.skipSummary = formData.get('skip-summary') === 'on'

    try {
      await save(definition)
      onSave()
    } catch (error) {
      logger.error(error, 'DeclarationEdit')
    }
  }

  render() {
    const { data } = this.context
    const { declaration, skipSummary } = data

    return (
      <form onSubmit={this.onSubmit} autoComplete="off" noValidate>
        <div className="govuk-form-group">
          <fieldset
            className="govuk-fieldset"
            aria-describedby="skip-summary-hint"
          >
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
              Skip summary page?
            </legend>
            <div className="govuk-hint" id="skip-summary-hint">
              The user will not be shown a summary page, and will continue to
              pay and/or the application complete page.
            </div>
            <div className="govuk-radios" data-module="govuk-radios">
              <div className="govuk-checkboxes__item">
                <input
                  className="govuk-checkboxes__input"
                  id="skip-summary"
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
          </fieldset>
        </div>

        <Textarea
          id="field-declaration"
          name="declaration"
          rows={3}
          label={{
            className: 'govuk-label--s',
            children: 'Declaration'
          }}
          hint={{
            children: (
              <>
                The declaration can include HTML and the `govuk-prose-scope` css
                class is available. Use this on a wrapping element to apply
                default govuk styles.
              </>
            )
          }}
          defaultValue={declaration}
        />

        <button className="govuk-button" type="submit">
          Save
        </button>
      </form>
    )
  }
}
