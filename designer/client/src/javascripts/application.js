/* istanbul ignore file */
import { ServiceHeader } from '@defra/forms-designer/server/src/common/components/service-header/service-header.js'
import {
  Accordion,
  // Button,
  CharacterCount,
  Checkboxes,
  ErrorSummary,
  NotificationBanner,
  Radios,
  Tabs,
  createAll
} from 'govuk-frontend'

createAll(Accordion)
// createAll(Button) - this init doesn't seem to be needed as throws a console error - TODO investigate further
createAll(CharacterCount)
createAll(Checkboxes)
createAll(ErrorSummary)
createAll(Radios)
createAll(Tabs)
createAll(NotificationBanner)
createAll(ServiceHeader)
