import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { Designer } from '~/src/Designer.jsx'
import { initI18n } from '~/src/i18n/i18n.jsx'
import logger from '~/src/plugins/logger.js'

initI18n().catch((error: unknown) => {
  logger.error(error, 'I18n')
})

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
