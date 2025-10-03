import { within } from '@testing-library/dom'

import { createServer } from '~/src/createServer.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

describe('Health check route', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('/ should shows the Defra Forms Website homepage for guest users', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const { container, document } = await renderResponse(server, options)

    const $heading = container.getByRole('heading', { level: 1 })
    const $whatsNewText = document
      .querySelector('.app-masthead .govuk-card__content .govuk-body')
      .textContent.trim()
    const $time = document.querySelector(
      '.app-masthead .govuk-card__content time'
    )
    const $timeIso = $time.getAttribute('datetime')
    const $navigation = container.getByRole('navigation', { name: 'Menu' })
    const menus = ['About', 'Get started', 'Features', 'Resources', 'Support']
    const $navigationItems = within($navigation).getAllByRole('link')

    menus.forEach((item, idx) => {
      expect($navigationItems[idx]).toHaveTextContent(item)
    })
    expect($heading).toHaveTextContent(
      'Create and publish Defra forms on GOV.UK'
    )
    expect($whatsNewText.length).toBeTruthy()
    expect(new Date($timeIso)).not.toBeNaN()

    // remove
    expect($timeIso).toBe('2025-06-14T14:01:00.000Z')
    // remove
    expect(
      document.querySelector('.app-masthead .govuk-card__content').textContent
    ).toContain('14 June 2025')
    // remove
    expect(
      document
        .querySelector('.app-masthead .govuk-card__content .govuk-body')
        .textContent.trim()
    ).toBe(
      'New conditions and accessibility improvements and updates to preview panel functionality.'
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
