import {
  ComponentType,
  allDocumentTypes,
  allImageTypes,
  allTabularDataTypes,
  allowedErrorTemplateFunctions
} from '@defra/forms-model'

const fieldMappings = /** @type {AdvancedFieldMappingsType } */ ({
  TextField: {
    min: 'minLength',
    max: 'maxLength'
  },
  MultilineTextField: {
    min: 'minLength',
    max: 'maxLength',
    minMax: 'TODO'
  },
  NumberField: {
    min: 'min',
    max: 'max',
    precision: 'precision'
  },
  YesNoField: {},
  DatePartsField: {
    dateMin: 'maxPast',
    dateMax: 'maxFuture'
  },
  MonthYearField: {
    dateMin: 'dateMin',
    dateMax: 'dateMax'
  },
  SelectField: {},
  AutocompleteField: {},
  RadiosField: {},
  CheckboxesField: {},
  UkAddressField: {},
  TelephoneNumberField: {},
  EmailAddressField: {},
  Html: {},
  InsetText: {},
  Details: {},
  List: {},
  Markdown: {},
  FileUploadField: {
    min: 'minFiles',
    max: 'maxFiles',
    length: 'exactFiles',
    accept: 'accept'
  },
  DeclarationField: {},
  EastingNorthingField: {
    eastingMin: 'eastingMin',
    eastingMax: 'eastingMax',
    northingMin: 'northingMin',
    northingMax: 'northingMax'
  },
  OsGridRefField: {},
  NationalGridFieldNumberField: {},
  LatLongField: {
    latitudeMin: 'latitudeMin',
    latitudeMax: 'latitudeMax',
    longitudeMin: 'longitudeMin',
    longitudeMax: 'longitudeMax'
  }
})

/**
 * @param {GovukField[]} fields
 * @param {ComponentType} questionType
 * @param {string} propertyName
 * @param {string} fallbackText
 * @returns { string | number }
 */
export function getFieldProperty(
  fields,
  questionType,
  propertyName,
  fallbackText
) {
  const mapping = /** @type {Record<string, string>} */ (
    fieldMappings[questionType]
  )
  const fieldname = mapping[propertyName]
  const field = fields.find((x) => x.name === fieldname)

  const propVal = /** @type {string | number | undefined | null } */ (
    field?.value
  )
  return propVal ?? fallbackText
}

/**
 * @param {ComponentType} type
 */
export function isTypeForMinMax(type) {
  return (
    type === ComponentType.TextField ||
    type === ComponentType.MultilineTextField ||
    type === ComponentType.EmailAddressField
  )
}

/**
 * @param {string[]} selectedMimeTypesFromCSV
 * @param {{ value: string; text: string; mimeType: string; }[]} allTypes
 */
export function findFileTypeMappings(selectedMimeTypesFromCSV, allTypes) {
  return selectedMimeTypesFromCSV
    .map((currMimeType) => {
      const found = allTypes.find((dt) => dt.mimeType === currMimeType)
      return found ? found.text : undefined
    })
    .filter((x) => typeof x === 'string')
}

/**
 * @param {string} types
 * @returns {string}
 */
export function lookupFileTypes(types) {
  const selectedMimeTypesFromCSV = types ? types.split(',') : []

  const documentTypes = findFileTypeMappings(
    selectedMimeTypesFromCSV,
    allDocumentTypes
  )

  const imageTypes = findFileTypeMappings(
    selectedMimeTypesFromCSV,
    allImageTypes
  )

  const tabularDataTypes = findFileTypeMappings(
    selectedMimeTypesFromCSV,
    allTabularDataTypes
  )

  const totalTypes = documentTypes.concat(imageTypes).concat(tabularDataTypes)

  const lastItem = totalTypes.pop()

  if (!lastItem) {
    return '[files types you accept]'
  }

  const penultimate = totalTypes.pop()

  if (!penultimate) {
    return lastItem
  }

  return [...totalTypes, `${penultimate} or ${lastItem}`].join(', ')
}

/**
 * @param {GovukField[]} fields
 * @param {ComponentType} questionType
 * @param {string} propertyName
 * @returns { string | number }
 */
export function getNumberLimits(fields, questionType, propertyName) {
  if (propertyName === 'numberMin') {
    return getFieldProperty(fields, questionType, 'min', '[lowest number]')
  }

  if (propertyName === 'numberMax') {
    return getFieldProperty(fields, questionType, 'max', '[highest number]')
  }

  if (propertyName === 'numberPrecision') {
    return getFieldProperty(fields, questionType, 'precision', '[precision]')
  }

  return '[unknown]'
}

/**
 * @param {GovukField[]} fields
 * @param {ComponentType} questionType
 * @param {string} propertyName
 * @returns { string | number }
 */
export function getDateLimits(fields, questionType, propertyName) {
  if (propertyName === 'dateMin') {
    return getFieldProperty(
      fields,
      questionType,
      'maxPast',
      '[max days in the past]'
    )
  }

  if (propertyName === 'dateMax') {
    return getFieldProperty(
      fields,
      questionType,
      'maxFuture',
      '[max days in the future]'
    )
  }

  return '[unknown]'
}

/**
 * Get file upload limit values
 * @param {string} type
 * @param {GovukField[]} fields
 * @returns {string|number}
 */
function getFileUploadLimit(type, fields) {
  if (type === 'filesMimes' || type.includes('mime')) {
    return getFileTypesLimit(fields)
  }

  if (type === 'min' || type === 'filesMin' || type === 'array.min') {
    return getFieldProperty(
      fields,
      ComponentType.FileUploadField,
      'min',
      '[min file count]'
    )
  }

  if (type === 'max' || type === 'filesMax' || type === 'array.max') {
    return getFieldProperty(
      fields,
      ComponentType.FileUploadField,
      'max',
      '[max file count]'
    )
  }

  if (type === 'length' || type === 'filesExact' || type === 'array.length') {
    return getFieldProperty(
      fields,
      ComponentType.FileUploadField,
      'length',
      '[exact file count]'
    )
  }

  return getFileTypesLimit(fields)
}

/**
 * Get location field limit values
 * @param {GovukField[]} fields
 * @param {ComponentType} questionType
 * @param {string} propertyName
 * @returns {string|number}
 */
function getLocationFieldLimits(fields, questionType, propertyName) {
  return getFieldProperty(
    fields,
    questionType,
    propertyName,
    `[${propertyName} limit]`
  )
}

/**
 * Get text field min/max limit values
 * @param {string} type
 * @param {GovukField[]} fields
 * @param {ComponentType} questionType
 * @returns {string|number|undefined}
 */
function getTextFieldLimits(type, fields, questionType) {
  if (type === 'min' && isTypeForMinMax(questionType)) {
    return getFieldProperty(fields, questionType, 'min', '[min length]')
  }

  if (type === 'max' && isTypeForMinMax(questionType)) {
    return getFieldProperty(fields, questionType, 'max', '[max length]')
  }

  return undefined
}

/**
 * Get location field limit based on type prefix
 * @param {string} type
 * @param {GovukField[]} fields
 * @returns {string|number|undefined}
 */
function getLocationLimitsByType(type, fields) {
  if (type.startsWith('easting') || type.startsWith('northing')) {
    return getLocationFieldLimits(
      fields,
      ComponentType.EastingNorthingField,
      type
    )
  }

  if (type.startsWith('latitude') || type.startsWith('longitude')) {
    return getLocationFieldLimits(fields, ComponentType.LatLongField, type)
  }

  return undefined
}

/**
 * Get file types limit
 * @param {GovukField[]} fields
 * @returns {string}
 */
function getFileTypesLimit(fields) {
  const acceptField = fields.find((f) => f.name === 'accept')
  if (acceptField?.value) {
    const acceptValue =
      typeof acceptField.value === 'object'
        ? JSON.stringify(acceptField.value)
        : String(acceptField.value)
    return lookupFileTypes(acceptValue)
  }

  if (fields.find((f) => f.name === 'images')?.value) {
    return 'image files'
  }
  if (fields.find((f) => f.name === 'documents')?.value) {
    return 'document files'
  }

  return '[files types you accept]'
}

/**
 * Determine the limit relevant to the error type
 * @param {string} type
 * @param {GovukField[]} fields
 * @param {ComponentType} questionType
 * @returns {number|string}
 */
export function determineLimit(type, fields, questionType) {
  if (questionType === ComponentType.FileUploadField) {
    return getFileUploadLimit(type, fields)
  }

  const textFieldLimit = getTextFieldLimits(type, fields, questionType)
  if (textFieldLimit !== undefined) {
    return textFieldLimit
  }

  if (type.startsWith('number')) {
    return getNumberLimits(fields, questionType, type)
  }

  if (type.startsWith('date')) {
    return getDateLimits(fields, questionType, type)
  }

  const locationLimit = getLocationLimitsByType(type, fields)
  if (locationLimit !== undefined) {
    return locationLimit
  }

  return '[unknown]'
}

/**
 * Return a data attribute if the template includes a function (from the allowed list)
 * @param {string} part
 * @returns {string}
 */
export function getFunctionAttribute(part) {
  for (const func of allowedErrorTemplateFunctions) {
    if (part.includes(`${func}(`)) {
      return ` data-templatefunc="${func}"`
    }
  }
  return ''
}

/**
 * @param {string} type
 * @param {string} part
 * @returns {string}
 */
export function spanTag(type, part) {
  const functionAttribute = getFunctionAttribute(part)
  return `<span class="error-preview-${type}"${functionAttribute}>{{${part}}}</span>`
}

/**
 * @param {string} templateStr
 * @param {string} type
 */
export function insertTags(templateStr, type) {
  const delimiterRegex = /{{([^{}]*)}}/g
  return templateStr.replace(delimiterRegex, (match, content) => {
    if (content.includes('#label') || content.includes('#title')) {
      return `<span class="error-preview-shortDescription"${getFunctionAttribute(content)}>{{${content}}}</span>`
    } else if (content.includes('#limit')) {
      return `<span class="error-preview-${type}">{{${content}}}</span>`
    } else {
      return match
    }
  })
}

/**
 * @import { AdvancedFieldMappingsType, ComponentDef, GovukField } from '@defra/forms-model'
 */
