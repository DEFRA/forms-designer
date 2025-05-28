/**
 * @param {{ source: HTMLInputElement; }} field
 */
export function updateFileUploadVisibility(field) {
  const minFilesInput = /** @type {HTMLInputElement} */ (
    document.getElementById('minFiles')
  )
  const maxFilesInput = /** @type {HTMLInputElement} */ (
    document.getElementById('maxFiles')
  )
  const exactFilesInput = /** @type {HTMLInputElement} */ (
    document.getElementById('exactFiles')
  )

  if (field.source === minFilesInput) {
    const minCountSpans = document.querySelectorAll('.error-preview-min')
    minCountSpans.forEach((span) => {
      span.textContent = minFilesInput.value || '[min file count]'
    })
  }

  if (field.source === maxFilesInput) {
    const maxCountSpans = document.querySelectorAll('.error-preview-max')
    maxCountSpans.forEach((span) => {
      span.textContent = maxFilesInput.value || '[max file count]'
    })
  }

  if (field.source === exactFilesInput) {
    const exactCountSpans = document.querySelectorAll('.error-preview-length')
    exactCountSpans.forEach((span) => {
      span.textContent = exactFilesInput.value || '[exact file count]'
    })
  }
}
