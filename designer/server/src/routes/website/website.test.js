import { AssertionError } from 'assert'

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
    const $whatsNewTextObj = document.querySelector(
      '.app-masthead .govuk-card__content .govuk-body'
    )

    if (
      $whatsNewTextObj?.textContent === undefined ||
      $whatsNewTextObj.textContent === null
    ) {
      throw new AssertionError({ message: '$whatsNewTextObj is missing' })
    }
    const $time = document.querySelector(
      '.app-masthead .govuk-card__content time'
    )

    if ($time === null) {
      throw new AssertionError({ message: '$time is null' })
    }

    const $whatsNewText = $whatsNewTextObj.textContent.trim()

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
    // @ts-expect-error - testing for invalid input
    expect(new Date($timeIso)).not.toBeNaN()
  })

  test('/about should shows the Defra Forms Website About page', async () => {
    const options = {
      method: 'GET',
      url: '/about'
    }

    const { container } = await renderResponse(server, options)

    const $heading = container.getByRole('heading', { level: 1 })
    const $navigation = container.getByRole('navigation', { name: 'Menu' })
    const menus = ['About', 'Get started', 'Features', 'Resources', 'Support']
    const $navigationItems = within($navigation).getAllByRole('link')

    menus.forEach((item, idx) => {
      expect($navigationItems[idx]).toHaveTextContent(item)
    })
    expect($heading).toHaveTextContent('About the Defra Forms team')
  })

  test('/get-started should load get access page', async () => {
    const options = {
      method: 'GET',
      url: '/get-started'
    }

    const { container } = await renderResponse(server, options)
    const $heading = container.getByRole('heading', { level: 1 })
    const $main = container.getByRole('main')
    const [, $firstSubMenu] = within($main).getAllByRole('link')
    const $nav = container.getByRole('navigation', {
      name: 'Pagination'
    })

    expect($heading).toHaveTextContent('Get access to the Defra Form Designer')
    const [$nextLink] = within($nav).getAllByRole('link')
    expect($firstSubMenu).toHaveTextContent(
      'Get access to the Defra Form Designer'
    )
    expect($firstSubMenu).toHaveProperty(
      'href',
      expect.stringContaining('/get-started/get-access')
    )
    expect($nextLink).toHaveTextContent('Make a form live checklist')
    expect($nextLink).toHaveProperty(
      'href',
      expect.stringContaining('/get-started/get-access')
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
