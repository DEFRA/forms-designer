import React, { useContext } from 'react'

import { CssClasses } from '~/src/components/CssClasses/CssClasses.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Actions } from '~/src/reducers/component/types.js'

const defaultOptions = {
  multiple: false,
  imageQualityPlayback: false
}

export function FileUploadFieldEdit() {
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent } = state
  const options = { ...defaultOptions, ...selectedComponent.options }

  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">
          {i18n('common.detailsLink.title')}
        </span>
      </summary>

      <div className="govuk-checkboxes govuk-form-group">
        <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id="field-options-multiple"
            name="options.multiple"
            type="checkbox"
            checked={options.multiple}
            onChange={(e) => {
              dispatch({
                type: Actions.EDIT_OPTIONS_FILE_UPLOAD_MULTIPLE,
                payload: e.target.checked
              })
            }}
          />
          <label
            className="govuk-label govuk-checkboxes__label"
            htmlFor="field-options-multiple"
          >
            {i18n('fileUploadFieldEditPage.multipleFilesOption.title')}
          </label>
          <div className="govuk-hint govuk-checkboxes__hint">
            {i18n('fileUploadFieldEditPage.multipleFilesOption.helpText')}
          </div>
        </div>
      </div>

      <div className="govuk-checkboxes govuk-form-group">
        <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id="field-options-imageQualityPlayback"
            name="options.imageQualityPlayback"
            type="checkbox"
            checked={options.imageQualityPlayback}
            onChange={(e) => {
              dispatch({
                type: Actions.EDIT_OPTIONS_IMAGE_QUALITY_PLAYBACK,
                payload: e.target.checked
              })
            }}
          />
          <label
            className="govuk-label govuk-checkboxes__label"
            htmlFor="field-options.multiple"
          >
            {i18n('fileUploadFieldEditPage.imageQualityPlaybackOption.title')}
          </label>
          <div className="govuk-hint govuk-checkboxes__hint">
            {i18n(
              'fileUploadFieldEditPage.imageQualityPlaybackOption.helpText'
            )}
          </div>
        </div>
      </div>

      <CssClasses />
    </details>
  )
}
