import { Input } from '@xgovformbuilder/govuk-react-jsx'
import React from 'react'

import { type ValidationErrors } from '~/src/outputs/types.js'

interface Props {
  url: string
  errors: ValidationErrors
}

const WebhookEdit = ({ url = '', errors }: Props) => (
  <Input
    id="webhook-url"
    name="webhook-url"
    label={{
      className: 'govuk-label--s',
      children: ['Webhook url']
    }}
    defaultValue={url}
    pattern="^\S+"
    errorMessage={errors.url ? { children: errors.url.children } : undefined}
  />
)

export default WebhookEdit
