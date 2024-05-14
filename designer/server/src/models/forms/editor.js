import config from '~/src/config.js'

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
