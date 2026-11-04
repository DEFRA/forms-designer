import {
  applyLogContextHeaders as applyLogContextHeader,
  applyTraceHeaders as applyTraceHeader,
  getRequestSessionId,
  requestTracing as requestTracingPlugin
} from '@defra/forms-common'
import { tracing } from '@defra/hapi-tracing'

import config from '~/src/config.js'

const tracingHeader = config.tracing.header

/**
 * Origins of the forms services the designer calls. The session ID and form
 * reference number are only sent to these, never to a service outside forms
 * such as Azure AD.
 */
const formsServiceOrigins = new Set(
  [
    config.auditUrl,
    config.entitlementUrl,
    config.managerUrl,
    config.newlsCwtListenerUrl,
    config.notifyUrl,
    config.sharepointUrl,
    config.submissionUrl
  ].map((serviceUrl) => new URL(serviceUrl).origin)
)

/**
 * Adds the correlation ID of the current log context to the headers of an
 * outbound HTTP request, so the receiving service logs the same ID
 * @template {Record<string, any>} Headers
 * @param {Headers} [headers] - the existing headers
 * @returns {Headers | undefined}
 */
export function applyTraceHeaders(headers) {
  return applyTraceHeader(headers, tracingHeader)
}

/**
 * Adds the session ID and form reference number of the current log context to
 * the headers of an outbound HTTP request, when the request is to another
 * forms service
 * @template {Record<string, any>} Headers
 * @param {URL} url - the URL of the request
 * @param {Headers} [headers] - the existing headers
 * @returns {Headers | undefined}
 */
export function applyLogContextHeaders(url, headers) {
  if (!formsServiceOrigins.has(url.origin)) {
    return headers
  }

  return applyLogContextHeader(headers)
}

/**
 * Gets the unique ID of the signed in user, which is the `oid` from Azure AD
 * @param {Request} request
 * @returns {string | undefined}
 */
export function getRequestUserId(request) {
  const { credentials, isAuthenticated } = request.auth

  if (!isAuthenticated) {
    return undefined
  }

  return credentials.user?.id
}

/**
 * Starts a log context for every request, holding the correlation ID from the
 * tracing header (or a new ID when the caller sent none), the ID of the
 * signed in user and the ID of the yar session. The logger writes them on
 * every log line.
 * @satisfies {ServerRegisterPluginObject<RequestTracingOptions>}
 */
export const requestTracing = {
  plugin: requestTracingPlugin,
  options: {
    tracingHeader,
    tracingPlugin: tracing.plugin,
    getUserId: getRequestUserId,
    getSessionId: getRequestSessionId
  }
}

/**
 * @import { RequestTracingOptions } from '@defra/forms-common'
 * @import { Request, ServerRegisterPluginObject } from '@hapi/hapi'
 */
