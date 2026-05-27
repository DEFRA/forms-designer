const APP_HIDDEN_CLASS = 'app-hidden'

/**
 * Returns a promise that resolves after the specified number of milliseconds
 * @param {number} milliseconds - the number of milliseconds to wait before resolving the promise
 */
function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

/**
 * Downloads a file from the specified URL
 * @param {string} url - the URL of the file to download
 * @param {string} name - the name of the file to download
 */
async function download(url, name) {
  const a = document.createElement('a')
  a.download = name
  a.href = url
  a.style.display = 'none'
  document.body.append(a)
  a.click()

  // Chrome requires the timeout
  await delay(100)
  a.remove()
}

/**
 * Resets the status tags for all files to their initial state (hidden)
 */
function resetStatusTags() {
  const downloadingTags = document.querySelectorAll(
    '.govuk-tag[id^="downloading-tag-"]'
  )
  const downloadedTags = document.querySelectorAll(
    '.govuk-tag[id^="downloaded-tag-"]'
  )

  downloadingTags.forEach((tag) => tag.classList.add(APP_HIDDEN_CLASS))
  downloadedTags.forEach((tag) => tag.classList.add(APP_HIDDEN_CLASS))
}

/**
 * Downloads a single file from the given URL, with a delay between each download to prevent browser freezing
 * @param {{href: string, fileId: string}} file - an array of URLs and file IDs for the files to download
 * @param {string} email - the email address of the user
 * @param {string} referenceNumber - the submission reference number
 */
async function downloadFile(file, email, referenceNumber) {
  const { href, fileId } = file

  onDownloadStarted(fileId)

  const opts = {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }
  const response = await fetch(href, opts)

  if (response.ok) {
    const { url, fileName } = await response.json()
    await download(url, fileName)
  } else {
    const forbiddenCode = 403
    const next = `/file-download/${fileId}`

    // Redirect to email entry page
    // If the response was forbibben then include the reference
    // number so they come back to the download all page afterward
    window.location.replace(
      response.status === forbiddenCode
        ? next
        : `${next}?referenceNumber=${referenceNumber}`
    )
  }

  onDownloadFinished(fileId)
}

/**
 * Callback function for handling each downloaded file
 * @param {string} fileId - the ID of the downloaded file
 */
function onDownloadStarted(fileId) {
  document
    .getElementById(`downloaded-tag-${fileId}`)
    ?.classList.add(APP_HIDDEN_CLASS)
  document
    .getElementById(`downloading-tag-${fileId}`)
    ?.classList.remove(APP_HIDDEN_CLASS)
}

/**
 * Callback function for handling each downloaded file
 * @param {string} fileId - the ID of the downloaded file
 */
function onDownloadFinished(fileId) {
  document
    .getElementById(`downloading-tag-${fileId}`)
    ?.classList.add(APP_HIDDEN_CLASS)
  document
    .getElementById(`downloaded-tag-${fileId}`)
    ?.classList.remove(APP_HIDDEN_CLASS)
}

/**
 * Downloads all files associated with the given reference number
 * @param {string} email - the email address of the user
 * @param {string} referenceNumber - the submission reference number
 */
async function downloadAll(email, referenceNumber) {
  const links = /** @type {NodeListOf<HTMLAnchorElement>} */ (
    document.querySelectorAll('.govuk-summary-list__actions a')
  )
  const files = Array.from(links).map((link) => ({
    href: /** @type {string} */ (link.getAttribute('href')),
    fileId: /** @type {string} */ (link.dataset.fileid)
  }))

  await downloadAllFiles(files, email, referenceNumber)
}

/**
 * Downloads all files from the given array of file objects, with a delay between each download to prevent browser freezing
 * @param {{href: string, fileId: string}[]} files - an array of URLs and file IDs for the files to download
 * @param {string} email - the email address of the user
 * @param {string} referenceNumber - the submission reference number
 */
export async function downloadAllFiles(files, email, referenceNumber) {
  resetStatusTags()

  for (const file of files) {
    await downloadFile(file, email, referenceNumber)
  }
}

/**
 * Initialises the download functionality for the given reference number
 * @param {string} email - the email address of the user
 * @param {string} referenceNumber - the submission reference number
 */
export function init(email, referenceNumber) {
  const downloadAllBtn = document.getElementById('download-all')

  /**
   * Handles the click event for the download all button
   * @param {Event} e
   */
  async function onClickDownloadAll(e) {
    e.preventDefault()

    this.disabled = true

    try {
      await downloadAll(email, referenceNumber)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error downloading files:', err)
    } finally {
      this.disabled = false
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  downloadAllBtn?.addEventListener('click', onClickDownloadAll, false)

  const summaryList = document.getElementById('download-all-list')

  /**
   * Handles the click event for the download single file links
   * @param {Event} e
   */
  async function onClickDownloadFileLink(e) {
    e.preventDefault()

    const target = e.target

    if (!(target instanceof HTMLElement)) {
      return
    }

    if (target.tagName === 'A') {
      const fileId = target.dataset.fileid
      const href = target.getAttribute('href')

      if (fileId && href) {
        const file = { href, fileId }

        try {
          await downloadFile(file, email, referenceNumber)
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Error downloading files:', err)
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  summaryList?.addEventListener('click', onClickDownloadFileLink, false)
}

/**
 * @typedef {{url: string, fileName: string}} DownloadFile
 */

/**
 * A callback function for handling file downloads
 * @callback DownloadCallback
 * @param {string} fileId - the ID of the file
 * @returns {void}
 */
