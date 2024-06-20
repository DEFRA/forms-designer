import { Component, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  children: ReactNode
}

export class RenderInPortal extends Component<Props> {
  $root: HTMLElement
  $wrapper: HTMLElement

  constructor(props: Props) {
    super(props)

    const $wrapper = document.createElement('div')
    const $root = document.querySelector('.app-form-portal')

    if (!($root instanceof HTMLElement)) {
      throw new Error('Missing portal root')
    }

    this.$wrapper = $wrapper
    this.$root = $root
  }

  componentDidMount() {
    this.$root.appendChild(this.$wrapper)
  }

  componentWillUnmount() {
    this.$root.removeChild(this.$wrapper)
  }

  render() {
    return createPortal(this.props.children, this.$wrapper)
  }
}
