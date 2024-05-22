import React, { type ReactNode, type MouseEvent } from 'react'

interface Props {
  children: ReactNode
  href?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

export const BackLink = ({ children, ...otherProps }: Props) => (
  <a className="govuk-back-link" {...otherProps}>
    {children}
  </a>
)
