import { type ComponentProps } from 'react'

interface Props extends ComponentProps<'div'> {
  moveUp: Omit<SortButtonProps, 'direction'>
  moveDown: Omit<SortButtonProps, 'direction'>
}

export function SortUpDown(props: Readonly<Props>) {
  const { moveUp, moveDown } = props

  return (
    <div className="app-result__actions">
      <SortButton {...moveUp} direction="up" />
      <SortButton {...moveDown} direction="down" />
    </div>
  )
}

type SortButtonProps = ComponentProps<'button'> & {
  direction: 'up' | 'down'
  onClick: () => void | Promise<void>
}

export function SortButton({ children, direction, ...props }: SortButtonProps) {
  return (
    <button
      className={`app-result__action-${direction} govuk-button govuk-button--secondary`}
      type="button"
      {...props}
    >
      <span className="govuk-visually-hidden">{children}</span>
    </button>
  )
}
