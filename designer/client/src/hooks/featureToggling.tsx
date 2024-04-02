import { useContext } from 'react'
import {
  FeatureFlagContext,
  FeaturesInterface
} from '~/src/context/FeatureFlagContext.jsx'

export const useFeatures = () => {
  const features: FeaturesInterface = useContext(FeatureFlagContext)
  return features
}
