import { Component, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  children: ReactNode
}

interface State {
  $wrapper: HTMLElement
  $root?: HTMLElement
}

export class RenderInPortal extends Component<Props, State> {
  state: State = {
    $wrapper: document.createElement('div')
  }

  componentDidMount() {
    const { $wrapper } = this.state

    const $root = document.querySelector('.app-form-portal')

    if (!($root instanceof HTMLElement)) {
      throw new Error('Missing portal root')
    }

    this.setState({ $root })
    $root.appendChild($wrapper)
  }

  componentWillUnmount() {
    const { $wrapper, $root } = this.state
    $root?.removeChild($wrapper)
  }

  render() {
    const { children } = this.props
    const { $wrapper } = this.state

    return createPortal(children, $wrapper)
  }
}
