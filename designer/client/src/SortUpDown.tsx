import React, { type ComponentProps } from 'react'

interface Props extends ComponentProps<'div'> {
  moveUp: SortButtonProps
  moveDown: SortButtonProps
}

export function SortUpDown(props: Readonly<Props>) {
  const { moveUp, moveDown } = props

  return (
    <div className="app-result__actions">
      <SortButton {...moveUp}>▲</SortButton>
      <SortButton {...moveDown}>▼</SortButton>
    </div>
  )
}

type SortButtonProps = ComponentProps<'button'> & {
  onClick: () => void | Promise<void>
}

export function SortButton({ children, ...props }: SortButtonProps) {
  return (
    <button
      className="app-result__action govuk-button govuk-button--secondary"
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
