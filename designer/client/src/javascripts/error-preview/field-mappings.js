import { ComponentType } from '@defra/forms-model'

export const fieldMappings =
  /** @type { Record< string, ErrorPreviewFieldMappingDef > } >} */ ({
    [ComponentType.TextField]: {
      min: { fieldName: 'minLength', placeholder: '[min length]' },
      max: { fieldName: 'maxLength', placeholder: '[max length]' }
    },
    [ComponentType.DatePartsField]: {
      dateMin: { fieldName: 'maxPast', placeholder: '[max days in the past]' },
      dateMax: {
        fieldName: 'maxFuture',
        placeholder: '[max days in the future]'
      }
    }
  })

/**
 * @import { ErrorPreviewFieldMappingDef } from '@defra/forms-model'
 */
