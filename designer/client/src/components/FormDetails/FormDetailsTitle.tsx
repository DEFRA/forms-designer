import { Input } from '@xgovformbuilder/govuk-react-jsx'
import React, { type ChangeEvent } from 'react'

import { i18n } from '~/src/i18n/index.js'

interface Props {
  errors: any
  handleTitleInputBlur: (event: ChangeEvent<HTMLInputElement>) => void
  title: string
}
export const FormDetailsTitle = (props: Props) => {
  const { title, errors, handleTitleInputBlur } = props

  return (
    <Input
      id="form-title"
      name="title"
      label={{
        className: 'govuk-label--s',
        children: [i18n('Title')]
      }}
      onChange={handleTitleInputBlur}
      defaultValue={title}
      errorMessage={
        errors?.title ? { children: errors.title.children } : undefined
      }
    />
  )
}
