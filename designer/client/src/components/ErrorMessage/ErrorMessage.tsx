import React, { FC } from 'react'
import classNames from 'classnames'
import { i18n } from '~/src/i18n/index.js'

interface Props {
  className?: string
}

export const ErrorMessage: FC<Props> = ({ children, className, ...props }) => {
  return (
    <span className={classNames('govuk-error-message', className)} {...props}>
      <span className="govuk-visually-hidden">{i18n('error')}</span> {children}
    </span>
  )
}
