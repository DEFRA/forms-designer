import { type FormMetadata, type FormDefinition } from '@defra/forms-model'
import { Component } from 'react'
import ReactDOM from 'react-dom'

import { Designer } from '~/src/Designer.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { initI18n } from '~/src/i18n/i18n.jsx'

import 'prismjs/components/prism-json.js'

interface Props {
  container: HTMLElement
}

export class App extends Component<Props> {
  metadata: FormMetadata
  definition: FormDefinition
  previewUrl: string

  constructor(props: Props) {
    super(props)

    const $definition = document.querySelector('.app-form-definition')
    const $metadata = document.querySelector('.app-form-metadata')

    // Extract from HTML data-* attributes
    const { previewUrl } = props.container.dataset

    if (
      !($metadata instanceof HTMLScriptElement) ||
      !($definition instanceof HTMLScriptElement) ||
      !$definition.textContent ||
      !$metadata.textContent ||
      !previewUrl
    ) {
      throw new Error('Missing form data')
    }

    this.definition = JSON.parse($definition.textContent) as FormDefinition
    this.metadata = JSON.parse($metadata.textContent) as FormMetadata
    this.previewUrl = previewUrl
  }

  render() {
    return (
      <Designer
        meta={this.metadata}
        data={this.definition}
        previewUrl={this.previewUrl}
      />
    )
  }
}

function initApp() {
  const $root = document.querySelector('.app-form-editor')

  if (!($root instanceof HTMLElement)) {
    throw new Error('Missing form data')
  }

  ReactDOM.render(<App container={$root} />, $root)
}

initI18n()
  .then(initApp)
  .catch((error: unknown) => {
    logger.error(error, 'App')
  })
