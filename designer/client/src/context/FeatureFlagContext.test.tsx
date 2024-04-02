import React from 'react'
import { screen } from '@testing-library/dom'
import { cleanup, render, waitFor } from '@testing-library/react'
import {
  FeatureFlagContext,
  FeatureFlagProvider
} from '~/src/context/FeatureFlagContext.jsx'
import { FeatureToggleApi } from '~/src/api/toggleApi.js'
import FeatureToggle from '~/src/FeatureToggle.jsx'

describe('FeatureFlagContext', () => {
  afterEach(cleanup)

  const { findAllByText, queryByText } = screen

  const WrappingComponent = ({ value, children }) => {
    return (
      <FeatureFlagContext.Provider value={value}>
        {children}
      </FeatureFlagContext.Provider>
    )
  }

  test('should show element if feature is set', async () => {
    render(
      <WrappingComponent value={{ featureEditPageDuplicateButton: true }}>
        <FeatureToggle feature="featureEditPageDuplicateButton">
          <button>Johnny Five Is Alive!</button>
        </FeatureToggle>
      </WrappingComponent>
    )

    const $button = await waitFor(() => findAllByText('Johnny Five Is Alive!'))
    expect($button).toBeTruthy()
  })

  test('should not show element if feature is not set', async () => {
    render(
      <WrappingComponent value={{ featureEditPageDuplicateButton: false }}>
        <FeatureToggle feature="featureEditPageDuplicateButton">
          <button>Johnny Five Is Alive!</button>
        </FeatureToggle>
      </WrappingComponent>
    )

    const $button = queryByText('Johnny Five Is Alive!')
    expect($button).toBeNull()
  })

  test('should not show element if feature is not defined', async () => {
    render(
      <WrappingComponent value={{ featureA: false }}>
        <FeatureToggle feature="featureB">
          <button>Johnny Five Is Alive!</button>
        </FeatureToggle>
      </WrappingComponent>
    )

    const $button = queryByText('Johnny Five Is Alive!')
    expect($button).toBeNull()
  })

  test('should feature toggle api only load once', async () => {
    const response = { featureA: false, featureB: true, featureC: true }

    jest.spyOn(FeatureToggleApi.prototype, 'fetch').mockResolvedValue(response)

    render(
      <FeatureFlagProvider>
        <FeatureToggle feature="featureA">
          <button>Johnny Five Is Alive!</button>
        </FeatureToggle>
        <FeatureToggle feature="featureB">
          <button>Johnny Five Is Alive!</button>
        </FeatureToggle>
        <FeatureToggle feature="featureC">
          <button>Johnny Five Is Alive!</button>
        </FeatureToggle>
      </FeatureFlagProvider>
    )

    await waitFor(() =>
      expect(FeatureToggleApi.prototype.fetch).toHaveBeenCalledTimes(1)
    )
  })

  test('should not show element if features api fails', () => {
    render(
      <WrappingComponent
        value={async () => {
          throw new Error()
        }}
      >
        <FeatureToggle feature="featureEditPageDuplicateButton">
          <button>Johnny Five Is Alive!</button>
        </FeatureToggle>
      </WrappingComponent>
    )

    const $button = queryByText('Johnny Five Is Alive!')
    expect($button).toBeNull()
  })
})
