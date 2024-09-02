/**
 * @param { string } [downloadUrl]
 */
export function downloadCompleteModel(downloadUrl) {
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
