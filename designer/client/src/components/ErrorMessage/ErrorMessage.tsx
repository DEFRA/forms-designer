import classNames from 'classnames'
import React, { type FunctionComponent, type HTMLAttributes } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  className?: string
  visuallyHiddenText?: string
}

export const ErrorMessage: FunctionComponent<Props> = (props) => {
  let { className, children, visuallyHiddenText, ...attributes } = props

  visuallyHiddenText ??= i18n('error')

  const visuallyHiddenTextComponent = (
    <span className="govuk-visually-hidden">{visuallyHiddenText}:</span>
  )

  return (
    <p className={classNames('govuk-error-message', className)} {...attributes}>
      {visuallyHiddenTextComponent} {children}
    </p>
  )
}
