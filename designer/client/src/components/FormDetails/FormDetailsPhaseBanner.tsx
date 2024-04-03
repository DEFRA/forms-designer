import { type FormDefinition } from '@defra/forms-model'
import { Label, Radios } from '@xgovformbuilder/govuk-react-jsx'
import React, { type ChangeEvent } from 'react'

import { i18n } from '~/src/i18n/index.js'

type PhaseBanner = Exclude<FormDefinition['phaseBanner'], undefined>
type Phase = PhaseBanner['phase']

interface Props {
  phase: Phase
  handlePhaseBannerChange: (event: ChangeEvent<HTMLSelectElement>) => void
}

export const FormDetailsPhaseBanner = (props: Props) => {
  const { phase = '', handlePhaseBannerChange } = props

  return (
    <div className="govuk-form-group">
      <Radios
        id="field-form-phase-banner"
        name="phaseBanner"
        value={phase}
        onChange={handlePhaseBannerChange}
        required={false}
        fieldset={{
          legend: {
            children: (
              <Label
                className="govuk-label--s"
                htmlFor="#field-form-phase-banner"
              >
                {i18n('formDetails.phaseBanner.fieldTitle')}
              </Label>
            )
          }
        }}
        hint={{
          children: [i18n('formDetails.phaseBanner.hint')]
        }}
        items={[
          {
            children: [i18n('formDetails.alpha')],
            value: 'alpha'
          },
          {
            children: [i18n('formDetails.beta')],
            value: 'beta'
          },
          {
            children: [i18n('formDetails.none')],
            value: ''
          }
        ]}
      />
    </div>
  )
}
