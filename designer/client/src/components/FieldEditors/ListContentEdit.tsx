import { ComponentType, type ListTypeOption } from '@defra/forms-model'
import upperFirst from 'lodash/upperFirst.js'
import { useContext } from 'react'

import { CssClasses } from '~/src/components/CssClasses/CssClasses.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

export function ListContentEdit() {
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent } = state

  if (selectedComponent?.type !== ComponentType.List) {
    return null
  }

  const { options } = selectedComponent

  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">
          {i18n('common.detailsLink.title')}
        </span>
      </summary>

      <div className="govuk-details__text">
        <div className="govuk-form-group">
          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
              {i18n('listContentEditComponent.bulletField.title')}
            </legend>
            <div className="govuk-radios" data-module="govuk-radios">
              {(['bulleted', 'numbered'] as ListTypeOption[]).map((bullet) => {
                const name = 'cond-value-units'
                const id = `${name}-${bullet}`

                return (
                  <div className="govuk-radios__item" key={bullet}>
                    <input
                      className="govuk-radios__input"
                      id={id}
                      name={name}
                      type="radio"
                      value={bullet}
                      checked={
                        options.type === bullet ||
                        (!options.type && bullet === 'bulleted')
                      }
                      onChange={() => {
                        dispatch({
                          name: Options.EDIT_OPTIONS_TYPE,
                          payload: bullet,
                          as: selectedComponent
                        })
                      }}
                    />
                    <label
                      className="govuk-label govuk-radios__label"
                      htmlFor={id}
                    >
                      {upperFirst(bullet)}
                    </label>
                  </div>
                )
              })}
            </div>
          </fieldset>
        </div>

        <CssClasses />
      </div>
    </details>
  )
}
