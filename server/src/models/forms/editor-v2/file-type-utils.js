import {
  ComponentType,
  allDocumentTypes,
  allImageTypes,
  allTabularDataTypes
} from '@defra/forms-model'

const TABULAR_DATA = 'tabular-data'
const DOCUMENTS = 'documents'
const IMAGES = 'images'
const ANY = 'any'

export const allowedParentFileTypes = [
  { value: DOCUMENTS, text: 'Documents' },
  { value: IMAGES, text: 'Images' },
  { value: TABULAR_DATA, text: 'Tabular data' },
  { divider: 'or' },
  { value: ANY, text: 'Accept any file', behaviour: 'exclusive' }
]

/**
 * Map file extensions to mime types
 * @param {string[]} fileExtensions
 */
export function mapExtensionsToMimeTypes(fileExtensions) {
  return fileExtensions.map((ext) => {
    const found =
      allDocumentTypes.find((x) => x.value === ext) ??
      allImageTypes.find((x) => x.value === ext) ??
      allTabularDataTypes.find((x) => x.value === ext)
    return found?.mimeType
  })
}

/**
 * @param {Partial<FormEditorInputQuestion>} payload
 */
export function mapPayloadToFileMimeTypes(payload) {
  // If "any" is selected, don't restrict file types
  const anySelected = payload.fileTypes?.includes('any')
  if (anySelected) {
    return {}
  }

  const documentParentSelected = payload.fileTypes?.includes('documents')
  const imagesParentSelected = payload.fileTypes?.includes('images')
  const tabularDataParentSelected = payload.fileTypes?.includes('tabular-data')

  const combinedTypes = (
    documentParentSelected ? (payload.documentTypes ?? []) : []
  )
    .concat(imagesParentSelected ? (payload.imageTypes ?? []) : [])
    .concat(tabularDataParentSelected ? (payload.tabularDataTypes ?? []) : [])
  return combinedTypes.length
    ? { accept: mapExtensionsToMimeTypes(combinedTypes).join(',') }
    : {}
}

/**
 * @param {ComponentDef | undefined} question
 */
export function getSelectedFileTypesFromCSVMimeTypes(question) {
  const isFileUpload = question?.type === ComponentType.FileUploadField

  if (!isFileUpload) {
    return {}
  }

  const acceptValue = question.options.accept

  // If no accept restriction, "any" is selected
  if (!acceptValue || acceptValue.trim() === '') {
    return {
      fileTypes: ['any'],
      documentTypes: [],
      imageTypes: [],
      tabularDataTypes: []
    }
  }

  const selectedMimeTypesFromCSV = acceptValue.split(',')

  const documentTypes = selectedMimeTypesFromCSV
    .map((currMimeType) => {
      const found = allDocumentTypes.find((dt) => dt.mimeType === currMimeType)
      return found ? found.value : null
    })
    .filter(Boolean)

  const imageTypes = selectedMimeTypesFromCSV
    .map((currMimeType) => {
      const found = allImageTypes.find((dt) => dt.mimeType === currMimeType)
      return found ? found.value : null
    })
    .filter(Boolean)

  const tabularDataTypes = selectedMimeTypesFromCSV
    .map((currMimeType) => {
      const found = allTabularDataTypes.find(
        (dt) => dt.mimeType === currMimeType
      )
      return found ? found.value : null
    })
    .filter(Boolean)

  const fileTypes = /** @type {string[]} */ ([])
  if (documentTypes.length) {
    fileTypes.push(DOCUMENTS)
  }
  if (imageTypes.length) {
    fileTypes.push(IMAGES)
  }
  if (tabularDataTypes.length) {
    fileTypes.push(TABULAR_DATA)
  }

  return {
    fileTypes,
    documentTypes,
    imageTypes,
    tabularDataTypes
  }
}

/**
 * @import { ComponentDef, FormEditorInputQuestion } from '@defra/forms-model'
 */
