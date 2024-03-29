import logger from './plugins/logger'
export function fetchConfigurations() {
  return window
    .fetch('/forms-designer/api/configurations', {
      // TODO make config driven
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        throw res.error
      }
    })
}

export async function loadConfigurations() {
  return await fetchConfigurations()
    .then((data) => {
      return Object.values(data) || []
    })
    .catch((error) => {
      logger.error('loadConfigurations', error)
      return []
    })
}
