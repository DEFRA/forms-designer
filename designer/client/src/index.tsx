import { type FormMetadata, type FormDefinition } from '@defra/forms-model'
import { Component } from 'react'
import ReactDOM from 'react-dom'

import { Designer } from '~/src/Designer.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { initI18n } from '~/src/i18n/i18n.jsx'

import 'prismjs/components/prism-markup.js'
import 'prismjs/components/prism-json.js'

initI18n().catch((error: unknown) => {
  logger.error(error, 'I18n')
})

const $container = document.querySelector('.app-form-editor')
const $definition = document.querySelector('.app-form-definition')
const $metadata = document.querySelector('.app-form-metadata')

export class App extends Component {
  render() {
    if (
      !($container instanceof HTMLElement) ||
      !($metadata instanceof HTMLScriptElement) ||
      !($definition instanceof HTMLScriptElement) ||
      !$container.dataset.previewUrl ||
      !$definition.textContent ||
      !$metadata.textContent
    ) {
      throw new Error('Missing form data')
    }

    let definition: FormDefinition | undefined
    let metadata: FormMetadata | undefined

    try {
      definition = JSON.parse($definition.textContent) as FormDefinition
      metadata = JSON.parse($metadata.textContent) as FormMetadata
    } catch (error) {
      logger.error(error, 'App')
      throw error
    }

    // Extract from HTML data-* attributes
    const { previewUrl } = $container.dataset
    return (
      <Designer meta={metadata} data={definition} previewUrl={previewUrl} />
    )
  }
}

ReactDOM.render(<App />, $container)
