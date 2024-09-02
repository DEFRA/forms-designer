/**
 * @param { string } [downloadUrl]
 */
export function downloadCompleteModel(downloadUrl) {
  const pageTitle = 'Download complete'
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
