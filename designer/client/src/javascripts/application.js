import { initAll } from 'govuk-frontend'

import { ServiceHeader } from '../../../server/src/common/components/service-header/service-header.js'

initAll()

new ServiceHeader(document.querySelector("[data-module='one-login-header']"))
