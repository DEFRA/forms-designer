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
      },
      notification: undefined,
      settingsTable: expect.any(Object)
    })
  })

  test('should include the notification when a setting has been changed', () => {
    const { notification } = advancedSettingsViewModel(
      testFormMetadata,
      testFormDefinitionWithSummaryOnly,
      'Reuse previous answers has been enabled'
    )

    expect(notification).toBe('Reuse previous answers has been enabled')
  })

  test('should show a row for each advanced setting', () => {
    const { settingsTable } = advancedSettingsViewModel(
      testFormMetadata,
      testFormDefinitionWithSummaryOnly
    )

    expect(settingsTable.rows).toHaveLength(2)
  })

  test('should show an email actions row linking to the email actions page', () => {
    const { settingsTable } = advancedSettingsViewModel(
      testFormMetadata,
      testFormDefinitionWithSummaryOnly
    )

    const [setting, description, actions] = settingsTable.rows[0]

    expect(setting.html).toContain('Email actions')
    expect(description.text).toBe(
      'Configure email recipients of this submitted form'
    )
    expect(actions.html).toContain(
      'href="/library/my-form-slug/editor-v2/email-actions"'
    )
    expect(actions.html).toContain('>Change<')
  })

  test('should show a reuse previous answers row linking to the reuse previous answers page', () => {
    const { settingsTable } = advancedSettingsViewModel(
      testFormMetadata,
      testFormDefinitionWithSummaryOnly
    )

    const [setting, description, actions] = settingsTable.rows[1]

    expect(setting.html).toContain('Reuse previous answers')
    expect(description.text).toBe('Start each new form with blank answers')
    expect(actions.html).toContain(
      'href="/library/my-form-slug/editor-v2/reuse-previous-answers"'
    )
    expect(actions.html).toContain('>Change<')
  })

  test.each([
    { allowCopy: true, expected: 'Reuse answers from a previous submission' },
    { allowCopy: false, expected: 'Start each new form with blank answers' }
  ])(
    'should describe reuse previous answers as "$expected" when allowCopy is $allowCopy',
    ({ allowCopy, expected }) => {
      const { settingsTable } = advancedSettingsViewModel(testFormMetadata, {
        ...testFormDefinitionWithSummaryOnly,
        metadata: { options: { allowCopy } }
      })

      const [, description] = settingsTable.rows[1]

      expect(description.text).toBe(expected)
    }
  )
})
