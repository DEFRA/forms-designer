import config from '~/src/config.js'
import { postJson } from '~/src/lib/fetch.js'

const llmEndpoint = new URL('/api/short_description', config.ai.llmEndpoint)

export async function getShortDescription(title) {
  const postJsonByType =
    /** @type { typeof postJson<{ short_description: string }>} */ (postJson)

  const { body } = await postJsonByType(llmEndpoint, {
    payload: {
      title
    }
  })

  return body
}
