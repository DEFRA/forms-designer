import { highlight, languages } from 'prismjs'
import React from 'react'
import SimpleEditor from 'react-simple-code-editor'
import 'prismjs/components/prism-markup.js'

class Editor extends React.Component {
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
      <SimpleEditor.default
        textareaId={this.props.id}
        name={this.props.name}
        className="editor"
        value={this.state.value}
        required={this.props.required}
        highlight={(code) => highlight(code, languages.html, 'html')}
        onValueChange={(value) => this.setState({ value })}
        padding={5}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          border: '2px solid #0b0c0c',
          fontSize: 16
        }}
      />
    )
  }
}

export default Editor
