import { highlight, languages } from 'prismjs'
import { Component, type ComponentProps } from 'react'
import SimpleEditor from 'react-simple-code-editor'

type Props = {
  value?: string
  onValueChange?: (content: string) => void
} & ComponentProps<'textarea'>

interface State {
  value: string
}

export class Editor extends Component<Props, State> {
  state: State = {
    value: ''
  }

  componentDidMount() {
    const { value } = this.props

    this.setState({
      value: value ?? ''
    })
  }

  render() {
    const { id, name, onValueChange } = this.props

    return (
      <SimpleEditor
        textareaId={id}
        name={name}
        className="editor"
        value={this.state.value}
        highlight={(code) => highlight(code, languages.html, 'html')}
        onValueChange={(value) =>
          this.setState({ value }, () => onValueChange?.(value))
        }
        padding={10}
        style={{
          fontFamily:
            'ui-monospace, menlo, "Cascadia Mono", "Segoe UI Mono", consolas, "Liberation Mono", monospace',
          border: '2px solid #0b0c0c',
          fontSize: 16
        }}
      />
    )
  }
}
