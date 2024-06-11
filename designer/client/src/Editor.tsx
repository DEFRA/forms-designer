import { highlight, languages } from 'prismjs'
import React, { Component, type TextareaHTMLAttributes } from 'react'
import SimpleEditor from 'react-simple-code-editor'
import 'prismjs/components/prism-markup.js'

type Props = {
  value?: string
  onValueChange?: (content: string) => void
} & TextareaHTMLAttributes<HTMLTextAreaElement>

interface State {
  value: string
}

export class Editor extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { value } = this.props

    this.state = {
      value: value ?? ''
    }
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
