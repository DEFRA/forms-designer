import config from '~/src/config.js'

const LOCALHOST = 'http://localhost'
const INTERNAL_DOCKER = 'http://host.docker.internal'

/**
 * @param { string } [downloadUrl]
 */
export function downloadCompleteModel(downloadUrl) {
  // Amend download url if running locally
  if (
    config.appBaseUrl.startsWith(LOCALHOST) &&
    downloadUrl?.startsWith(INTERNAL_DOCKER)
  ) {
    downloadUrl = downloadUrl.replace(INTERNAL_DOCKER, LOCALHOST)
  }
  const pageTitle = 'Your file is downloading'
  return {
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    downloadUrl,
    buttonText: 'Download file'
  }
}
