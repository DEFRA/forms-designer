import { ServiceHeader } from '@defra/forms-designer/server/src/common/components/service-header/service-header.js'
import { initAll } from 'govuk-frontend'

initAll()

new ServiceHeader(document.querySelector("[data-module='one-login-header']"))
