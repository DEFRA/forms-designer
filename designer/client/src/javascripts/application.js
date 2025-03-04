import { ServiceHeader } from '@defra/forms-designer/server/src/common/components/service-header/service-header.js'
import {
  Accordion,
  Button,
  CharacterCount,
  Checkboxes,
  ErrorSummary,
  NotificationBanner,
  Radios,
  createAll
} from 'govuk-frontend'

createAll(Accordion)
createAll(Button)
createAll(CharacterCount)
createAll(Checkboxes)
createAll(ErrorSummary)
createAll(Radios)
createAll(NotificationBanner)
createAll(ServiceHeader)
