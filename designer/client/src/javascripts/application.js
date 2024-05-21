import { ServiceHeader } from '@defra/forms-designer/server/src/common/components/service-header/service-header.js'
import {
  createAll,
  Button,
  ErrorSummary,
  CharacterCount,
  Radios
} from 'govuk-frontend'

createAll(Button)
createAll(CharacterCount)
createAll(ErrorSummary)
createAll(Radios)

new ServiceHeader(document.querySelector("[data-module='one-login-header']"))
