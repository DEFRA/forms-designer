import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Designer from '~/src/designer.jsx'
import { initI18n } from '~/src/i18n/index.js'

initI18n()

const container = document.querySelector('.app-editor')

export class App extends Component {
  render() {
    if (
      !(container instanceof HTMLElement) ||
      !container.dataset.id ||
      !container.dataset.slug ||
      !container.dataset.previewUrl
    ) {
      throw new Error('Missing form data attributes')
    }

    // Extract from HTML data-* attributes
    const { id, slug, previewUrl } = container.dataset
    return <Designer id={id} slug={slug} previewUrl={previewUrl} />
  }
}

ReactDOM.render(<App />, container)
