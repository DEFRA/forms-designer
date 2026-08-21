/* istanbul ignore file */
import { ServiceHeader } from '@defra/forms-designer/server/src/common/components/service-header/service-header.js'
import * as MOJ from '@ministryofjustice/frontend'
import {
  Accordion,
  Button,
  CharacterCount,
  Checkboxes,
  ErrorSummary,
  NotificationBanner,
  Radios,
  SkipLink,
  Tabs,
  createAll
} from 'govuk-frontend'

import { initConditionOptionsFilters } from '~/src/javascripts/condition-options-filter.js'

createAll(Accordion)
createAll(Button)
createAll(CharacterCount)
createAll(Checkboxes)
createAll(ErrorSummary)
createAll(Radios)
createAll(SkipLink)
createAll(Tabs)
createAll(NotificationBanner)
createAll(ServiceHeader)

MOJ.initAll()

// Adds a filter box to long condition answer-option lists (no-op elsewhere).
initConditionOptionsFilters()

const jsElem = /** @type { HTMLInputElement | null } */ (
  document.getElementById('jsEnabled')
)
if (jsElem && jsElem instanceof HTMLInputElement) {
  jsElem.value = 'true'
}
