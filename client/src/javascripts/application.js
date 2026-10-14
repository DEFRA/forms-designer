/* istanbul ignore file */
import * as MOJ from '@ministryofjustice/frontend'
import {
  Accordion,
  Button,
  CharacterCount,
  Checkboxes,
  ErrorSummary,
  FileUpload,
  NotificationBanner,
  Radios,
  SkipLink,
  Tabs,
  createAll
} from 'govuk-frontend'

// Server components are outside the client `~` alias
// eslint-disable-next-line no-restricted-imports
import { LinkMenu } from '../../../server/src/common/components/link-menu/link-menu.js'
// eslint-disable-next-line no-restricted-imports
import { ServiceHeader } from '../../../server/src/common/components/service-header/service-header.js'

import { initConditionOptionsFilters } from '~/src/javascripts/condition-options-filter.js'

createAll(Accordion)
createAll(Button)
createAll(CharacterCount)
createAll(Checkboxes)
createAll(ErrorSummary)
createAll(FileUpload)
createAll(Radios)
createAll(SkipLink)
createAll(Tabs)
createAll(NotificationBanner)
createAll(ServiceHeader)
createAll(LinkMenu)

MOJ.initAll()

// Adds a filter box to long condition answer-option lists (no-op elsewhere).
initConditionOptionsFilters()

const jsElem = /** @type { HTMLInputElement | null } */ (
  document.getElementById('jsEnabled')
)
if (jsElem && jsElem instanceof HTMLInputElement) {
  jsElem.value = 'true'
}
