import classNames from 'classnames'
import React, { type FunctionComponent, type HTMLAttributes } from 'react'

import { type ErrorListItem } from '~/src/ErrorSummary.jsx'
import { i18n } from '~/src/i18n/index.js'

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  children: ErrorListItem['children']
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

ErrorMessage.defaultProps = {
  visuallyHiddenText: i18n('error')
}
