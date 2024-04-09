import * as forms from '../lib/forms.js'

export async function listLibraryViewModel() {
  const list = await forms.list()
  const pageTitle = 'Form library'
  const head = [{ text: 'Name' }, { text: 'Last updated' }]
  const rows = list.map((form) => [
    { text: form.title },
    { text: '9 Apr 2024' }
  ])

  return { pageTitle, head, rows }
}
