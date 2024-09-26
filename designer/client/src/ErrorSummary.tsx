import { useEffect, useRef, type ReactNode } from 'react'

export interface ErrorListItem {
  href: string
  children: ReactNode
}

export type ErrorList<Key extends string = string> = Record<Key, ErrorListItem>

interface Props {
  className?: string
  descriptionChildren?: string
  errorList: ErrorListItem[]
  titleChildren?: string
}

export function ErrorSummary({
  className,
  descriptionChildren,
  errorList,
  titleChildren = 'There is a problem'
}: Readonly<Props>) {
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    errorSummaryRef.current?.focus()
  }, [])

  let description
  if (descriptionChildren) {
    description = <p className="govuk-body">{descriptionChildren}</p>
  }

  const handleClick = (selector?: string) => {
    if (!selector) {
      return
    }

    const $element = document.querySelector<HTMLElement>(selector)
    $element?.scrollIntoView()
    $element?.focus()
  }

  return (
    <div
      className={`govuk-error-summary ${className ?? ''}`}
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex={-1}
      data-module="govuk-error-summary"
      ref={errorSummaryRef}
    >
      <h2 className="govuk-error-summary__title" id="error-summary-title">
        {titleChildren}
      </h2>
      <div className="govuk-error-summary__body">
        {description}
        <ul className="govuk-list govuk-error-summary__list">
          {errorList.map((error) => (
            <li key={error.href}>
              {error.href ? (
                <a
                  href={error.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleClick(error.href)
                  }}
                >
                  {error.children}
                </a>
              ) : (
                error.children
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
