import { highlight, languages } from 'prismjs'
import React, { Component } from 'react'
import SimpleEditor from 'react-simple-code-editor'
import 'prismjs/components/prism-markup.js'

class Editor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.props.value || ''
    }
  }

  setState(state, callback) {
    super.setState(state, callback)
    if (state.value && this.props.valueCallback) {
      this.props.valueCallback(state.value)
    }
  }

  render() {
    return (
      <SimpleEditor
        textareaId={this.props.id}
        name={this.props.name}
        className="editor"
        value={this.state.value}
        required={this.props.required}
        highlight={(code) => highlight(code, languages.html, 'html')}
        onValueChange={(value) => this.setState({ value })}
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

export default Editor
