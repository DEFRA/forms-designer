import { useFeatures } from '~/src/hooks/featureToggling'

const FeatureToggle = ({ feature, children }) => {
  const features = useFeatures()
  return features[feature] ? children : null
}

export default FeatureToggle
