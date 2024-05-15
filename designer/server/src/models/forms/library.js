import config from '~/src/config.js'
import * as forms from '~/src/lib/forms.js'

export async function listViewModel() {
  const pageTitle = 'Forms library'
  const formItems = await forms.list()

  return { pageTitle, formItems }
}

/**
 * @param {FormMetadata} metadata
 */
export function editorViewModel(metadata) {
  const pageTitle = metadata.title

  return {
    backLink: {
      text: 'Back to form library',
      href: '/library'
    },
    pageTitle,
    form: metadata,
    previewUrl: config.previewUrl
  }
}

/**
 * @typedef {import('~/src/lib/forms.js').FormMetadata} FormMetadata
 */
