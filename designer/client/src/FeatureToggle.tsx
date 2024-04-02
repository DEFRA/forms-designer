import { useFeatures } from '~/src/hooks/featureToggling.jsx'

const FeatureToggle = ({ feature, children }) => {
  const features = useFeatures()
  return features[feature] ? children : null
}

export default FeatureToggle
