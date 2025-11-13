import config from '~/src/config.js'

const URL_PROTOCOL = 'http://'
const LOCALHOST = `${URL_PROTOCOL}localhost`
const INTERNAL_DOCKER = `${URL_PROTOCOL}host.docker.internal`

/**
 * @param { string } [downloadUrl]
 */
export function downloadCompleteModel(downloadUrl) {
  // Change host in download url if running locally
  const isRunningLocally =
    config.appBaseUrl.startsWith(LOCALHOST) &&
    downloadUrl?.startsWith(INTERNAL_DOCKER)

  const pageTitle = 'Your file is downloading'
  return {
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    downloadUrl: isRunningLocally
      ? downloadUrl?.replace(INTERNAL_DOCKER, LOCALHOST)
      : downloadUrl,
    buttonText: 'Download file'
  }
}
