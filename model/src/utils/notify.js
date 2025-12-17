/**
 * Notify auto-translates ASCII hyphens to en dashes, and strips whitespace (including tabs) before punctuation.
 * This method is used to escape each of these characters so Notify doesn't translate the content.
 * @param {string} str
 */
export function escapeNotifyContent(str) {
  return str
    .replaceAll('-', '&hyphen;')
    .replaceAll(' ', '&nbsp;')
    .replaceAll('\t', '&nbsp;&nbsp;&nbsp;&nbsp;')
}
