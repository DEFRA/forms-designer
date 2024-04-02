import React from 'react'
import {
  Output,
  EmailOutputConfiguration,
  ValidationErrors
} from '~/src/outputs/types'
import { Input } from '@xgovformbuilder/govuk-react-jsx'

type Props = {
  output: Output
  errors: ValidationErrors
}

const EmailEdit = ({ output, errors = {} }: Props) => {
  const outputConfiguration = (
    typeof output?.outputConfiguration === 'object'
      ? output?.outputConfiguration
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
          errors?.email ? { children: errors?.email.children } : undefined
        }
      />
    </div>
  )
}

export default EmailEdit
