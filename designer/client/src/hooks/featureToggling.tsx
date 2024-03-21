import { useContext } from 'react'

import {
  FeatureFlagContext,
  type FeaturesInterface
} from '../context/FeatureFlagContext'

export const useFeatures = () => {
  const features: FeaturesInterface = useContext(FeatureFlagContext)
  return features
}
