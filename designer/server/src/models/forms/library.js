import { buildEntry } from '~/src/common/nunjucks/context/build-navigation.js'
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
export function overviewViewModel(metadata) {
  const pageTitle = metadata.title
  const formPath = `/library/${metadata.slug}`

  const navigation = [
    buildEntry('Forms library', `/library`),
    buildEntry('Overview', formPath, { isActive: true }),
    buildEntry('Editor', `${formPath}/editor`)
  ]

  return {
    backLink: {
      text: 'Back to forms library',
      href: '/library'
    },
    navigation,
    pageTitle,
    form: metadata,
    previewUrl: config.previewUrl
  }
}

/**
 * @param {FormMetadata} metadata
 */
export function editorViewModel(metadata) {
  const pageTitle = metadata.title
  const formPath = `/library/${metadata.slug}`

  const navigation = [
    buildEntry('Forms library', `/library`),
    buildEntry('Overview', formPath),
    buildEntry('Editor', `${formPath}/editor`, { isActive: true })
  ]

  return {
    backLink: {
      text: 'Back to form overview',
      href: `/library/${metadata.slug}`
    },
    navigation,
    pageTitle,
    form: metadata,
    previewUrl: config.previewUrl
  }
}

/**
 * @typedef {import('~/src/lib/forms.js').FormMetadata} FormMetadata
 */
