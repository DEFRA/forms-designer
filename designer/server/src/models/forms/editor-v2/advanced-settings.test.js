import { testFormDefinitionWithSummaryOnly } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { advancedSettingsViewModel } from '~/src/models/forms/editor-v2/advanced-settings.js'

describe('advanced settings view model', () => {
  test('should return the correct view model', () => {
    const result = advancedSettingsViewModel(
      testFormMetadata,
      testFormDefinitionWithSummaryOnly
    )

    expect(result).toEqual({
      backLink: {
        href: '/library/my-form-slug/editor-v2/pages',
        text: 'Back to pages'
      },
      navigation: expect.any(Object),
      pageTitle: 'Advanced settings - Test form',
      pageHeading: {
        text: 'Advanced settings'
      },
      pageCaption: {
        text: 'Test form'
      }
    })
  })
})
