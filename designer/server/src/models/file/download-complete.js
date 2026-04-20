import config from '~/src/config.js'

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1'])
const INTERNAL_HOSTS = new Set([
  'host.docker.internal',
  'localstack',
  '0.0.0.0'
])

/**
 * @param {string} baseUrl
 */
function isLoopbackBaseUrl(baseUrl) {
  try {
    return LOOPBACK_HOSTS.has(new URL(baseUrl).hostname)
  } catch {
    return false
  }
}

/**
 * @param {string | undefined} downloadUrl
 */
function getBrowserSafeDownloadUrl(downloadUrl) {
  if (!downloadUrl || !isLoopbackBaseUrl(config.appBaseUrl)) {
    return downloadUrl
  }

  try {
    const browserBaseUrl = new URL(config.appBaseUrl)
    const parsedDownloadUrl = new URL(downloadUrl)

    if (!INTERNAL_HOSTS.has(parsedDownloadUrl.hostname)) {
      return downloadUrl
    }

    parsedDownloadUrl.protocol = browserBaseUrl.protocol
    parsedDownloadUrl.hostname = browserBaseUrl.hostname

    return parsedDownloadUrl.toString()
  } catch {
    return downloadUrl
  }
}

/**
 * @param { string } [downloadUrl]
 */
export function downloadCompleteModel(downloadUrl) {
  // Change host in download url if running locally.
  // The presigned URL may embed an internal Docker hostname (for example
  // host.docker.internal, localstack, or 0.0.0.0). Those hosts are valid for
  // containers, but not for a browser running on the host in local/CI harnesses,
  // so we rewrite them to the browser-visible host from APP_BASE_URL.
  const effectiveDownloadUrl = getBrowserSafeDownloadUrl(downloadUrl)

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
