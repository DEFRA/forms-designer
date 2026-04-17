import config from '~/src/config.js'

const URL_PROTOCOL = 'http://'
const LOCALHOST = `${URL_PROTOCOL}localhost`
const INTERNAL_DOCKER = `${URL_PROTOCOL}host.docker.internal`
const LOCALSTACK_CONTAINER = `${URL_PROTOCOL}localstack`

/**
 * @param { string } [downloadUrl]
 */
export function downloadCompleteModel(downloadUrl) {
  // Change host in download url if running locally.
  // The presigned URL may embed an internal Docker hostname (host.docker.internal
  // when using Docker Desktop, or the localstack service name when containers
  // communicate over the Docker network in CI). Neither is resolvable by the
  // browser, so we rewrite to localhost so the browser can fetch the file
  // directly from LocalStack.
  const isInternalDockerUrl =
    downloadUrl !== undefined &&
    (downloadUrl.startsWith(INTERNAL_DOCKER) ||
      downloadUrl.startsWith(LOCALSTACK_CONTAINER))

  const isRunningLocally =
    config.appBaseUrl.startsWith(LOCALHOST) && isInternalDockerUrl

  let effectiveDownloadUrl = downloadUrl
  if (isRunningLocally && downloadUrl) {
    effectiveDownloadUrl = downloadUrl
      .replace(INTERNAL_DOCKER, LOCALHOST)
      .replace(LOCALSTACK_CONTAINER, LOCALHOST)
  }

  const pageTitle = 'Your file is downloading'
  return {
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    downloadUrl: effectiveDownloadUrl,
    buttonText: 'Download file'
  }
}
