import {
  ComponentType,
  allDocumentTypes,
  allImageTypes,
  allTabularDataTypes
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
  FileUploadField: {}
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

  const propVal = field?.value
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
  // console.log('date', propertyName)
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
 * @param {ComponentDef} component
 * @param {string} type
 * @returns { string | number }
 */
/*
export function getFileLimits(component, type) {
  if (type === 'filesMin') {
    return getSchemaProperty(component, 'min', '[min file count]')
  }

  if (type === 'filesMax') {
    return getSchemaProperty(component, 'max', '[max file count]')
  }

  if (type === 'filesExact') {
    return getSchemaProperty(component, 'length', '[exact file count]')
  }

  if (type === 'filesMimes') {
    const accept = getOptionsProperty(component, 'accept', '')
    return lookupFileTypes(typeof accept === 'string' ? accept : '')
  }

  return '[unknown]'
}
*/
/**
 * Determine the limit (if any) relevant to the error type
 * @param {string} type
 * @param {GovukField[]} fields
 * @param {ComponentType} questionType
 * @returns { number | string }
 */
export function determineLimit(type, fields, questionType) {
  if (type === 'min' && isTypeForMinMax(questionType)) {
    return getFieldProperty(fields, questionType, 'min', '[min length]')
  }

  if (type === 'max' && isTypeForMinMax(questionType)) {
    return getFieldProperty(fields, questionType, 'max', '[max length]')
  }

  if (type.startsWith('number')) {
    return getNumberLimits(fields, questionType, type)
  }

  if (type.startsWith('date')) {
    return getDateLimits(fields, questionType, type)
  }

  // if (type.startsWith('files')) {
  //   return getFileLimits(component, type)
  // }

  return '[unknown]'
}

/**
 * @param {string} type
 * @param {string} part
 * @returns {string}
 */
export function spanTag(type, part) {
  return `<span class="error-preview-${type}">{{${part}}}</span>`
}

/**
 * @param {string} templateStr
 * @param {string} type
 */
export function insertTags(templateStr, type) {
  const delimiterRegex = /({{|}})/
  const parts = templateStr.split(delimiterRegex)
  const resultParts = []
  for (const part of parts) {
    if (part.includes('#label') || part.includes('#title')) {
      resultParts.push(spanTag('shortDescription', part))
    } else if (part.includes('#limit')) {
      resultParts.push(spanTag(type, part))
    } else if (part !== '{{' && part !== '}}') {
      resultParts.push(part)
    }
  }
  return resultParts.join('')
}

/**
 * @import { AdvancedFieldMappingsType, ComponentDef, GovukField } from '@defra/forms-model'
 */
