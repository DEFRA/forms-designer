import { ComponentType } from '@defra/forms-model'

export const fieldMappings =
  /** @type { Record< string, ErrorPreviewFieldMappingDef > } >} */ ({
    [ComponentType.TextField]: {
      min: { fieldName: 'minLength', placeholder: '[min length]' },
      max: { fieldName: 'maxLength', placeholder: '[max length]' }
    },
    [ComponentType.MultilineTextField]: {
      min: { fieldName: 'minLength', placeholder: '[min length]' },
      max: { fieldName: 'maxLength', placeholder: '[max length]' }
    },
    [ComponentType.NumberField]: {
      numberMin: { fieldName: 'min', placeholder: '[lowest number]' },
      numberMax: { fieldName: 'max', placeholder: '[highest number]' },
      numberPrecision: { fieldName: 'precision', placeholder: '[precision]' }
    },
    [ComponentType.DatePartsField]: {
      dateMin: { fieldName: 'maxPast', placeholder: '[max days in the past]' },
      dateMax: {
        fieldName: 'maxFuture',
        placeholder: '[max days in the future]'
      }
    },
    [ComponentType.FileUploadField]: {
      min: { fieldName: 'minFiles', placeholder: '[min file count]' },
      max: { fieldName: 'maxFiles', placeholder: '[max file count]' },
      length: { fieldName: 'exactFiles', placeholder: '[exact file count]' },
      filesMimes: {
        fieldName: 'accept',
        placeholder: '[files types you accept]'
      }
    }
  })

/**
 * @import { ErrorPreviewFieldMappingDef } from '@defra/forms-model'
 */
