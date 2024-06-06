import { Input } from '@xgovformbuilder/govuk-react-jsx'
import React from 'react'

import {
  type Output,
  type EmailOutputConfiguration,
  type ValidationErrors
} from '~/src/outputs/types.js'

interface Props {
  output: Output
  errors: ValidationErrors
}

export const EmailEdit = ({ output, errors = {} }: Props) => {
  const outputConfiguration = (
    typeof output.outputConfiguration === 'object'
      ? output.outputConfiguration
      : {
          emailAddress: ''
        }
  ) as EmailOutputConfiguration

  return (
    <div className="govuk-body email-edit">
      <Input
        id="email-address"
        name="email-address"
        label={{
          className: 'govuk-label--s',
          children: ['Email Address']
        }}
        defaultValue={outputConfiguration.emailAddress}
        errorMessage={
          errors.email ? { children: errors.email.children } : undefined
        }
      />
    </div>
  )
}
