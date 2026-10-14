import classNames from 'classnames'
import { type ComponentProps } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'

interface Props extends ComponentProps<'p'> {
  visuallyHiddenText?: string
}

export function ErrorMessage(props: Readonly<Props>) {
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
