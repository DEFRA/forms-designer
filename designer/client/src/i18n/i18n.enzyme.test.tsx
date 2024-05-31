import { describe, expect, test } from '@jest/globals'
import { shallow } from 'enzyme'
import React from 'react'

import { withI18n, i18n } from '~/src/i18n/index.js'

describe('I18n', () => {
  test('withI18n HOC passes down i18n translation function', () => {
    function Component({ i18n }) {
      return <div>{i18n('Test')}</div>
    }

    const WithI18nComponent = withI18n(Component)
    const wrapper = shallow(<WithI18nComponent />)
    expect(wrapper.find(Component).prop('i18n')).toBeDefined()
  })

  test('withI18n translation is correct', () => {
    function Component({ i18n }) {
      return <div>{i18n('Test')}</div>
    }

    const WithI18nComponent = withI18n(Component)
    const wrapper = shallow(<WithI18nComponent />)
    const translation = wrapper.find(Component).prop('i18n')('Test')
    expect(translation).toBe('For testing purpose, do not delete it')
  })

  test('i18n translates correctly', () => {
    const translation = i18n('Test')
    expect(translation).toBe('For testing purpose, do not delete it')
  })
})
