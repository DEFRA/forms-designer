import React from 'react'
import { useFeatures } from '~/src/hooks/featureToggling'

describe('FeatureToggleHook', () => {
  it('should return feature context value', () => {
    const mockContextValue = {
      featureA: false,
      featureB: true,
      featureC: true
    }

    jest.spyOn(React, 'useContext').mockReturnValue(mockContextValue)

    const result = useFeatures()
    expect(result).toEqual(mockContextValue)
  })
})
