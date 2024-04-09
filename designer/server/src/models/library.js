import * as forms from '../lib/forms.js'

export async function listLibraryViewModel() {
  const list = await forms.list()
  const pageTitle = 'Form library'
  const head = [{ text: 'Name' }, { text: 'Last updated' } ]
  const rows = list.map((form) => {
    const { name, lastUpdated } = form

    return [{ text: name }, { text: lastUpdated }]
  })

  return { pageTitle, head, rows }
}
