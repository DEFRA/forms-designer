import * as forms from '~/src/lib/forms.js'

export async function listLibraryViewModel() {
  const pageTitle = 'Forms library'
  const results = await forms.list()

  const formItems = results.map((form) => ({
    title: form.title,
    href: `/editor/${form.id}`,
    status: 'draft',
    updated: {
      date: '9 Apr 2024',
      name: 'Enrique Chase'
    }
  }))

  return { pageTitle, formItems }
}
