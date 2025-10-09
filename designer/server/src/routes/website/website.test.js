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

  test('/ should show the Defra Forms Website homepage for guest users', async () => {
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

  test('/about should show the Defra Forms Website About page', async () => {
    const options = {
      method: 'GET',
      url: '/about'
    }

    const { container } = await renderResponse(server, options)

    const $heading = container.getByRole('heading', { level: 1 })
    expect($heading).toHaveTextContent('About the Defra Forms team')
  })

  test('/get-started should load get Get Started page', async () => {
    const options = {
      method: 'GET',
      url: '/get-started'
    }

    const { container, response } = await renderResponse(server, options)
    const $heading = container.getByRole('heading', { level: 1 })

    expect($heading).toHaveTextContent('Get access to the Defra Form Designer')
    expect(response.result).toMatchSnapshot()
  })

  test('/get-started/make-form-live-checklist should load Make a form live checklist', async () => {
    const options = {
      method: 'GET',
      url: '/get-started/make-form-live-checklist'
    }

    const { container, response } = await renderResponse(server, options)
    const $heading = container.getByRole('heading', { level: 1 })

    expect($heading).toHaveTextContent('Make a form live checklist')
    expect(response.result).toMatchSnapshot()
  })

  test('/resources should load Make a form live checklist', async () => {
    const options = {
      method: 'GET',
      url: '/resources'
    }

    const { container, response } = await renderResponse(server, options)
    const $heading = container.getByRole('heading', { level: 1 })

    expect($heading).toHaveTextContent('Does this need to be a form?')
    expect(response.result).toMatchSnapshot()
  })

  test('/support should shows the Defra Forms Website Support page', async () => {
    const options = {
      method: 'GET',
      url: '/support'
    }

    const { container, response } = await renderResponse(server, options)

    const $heading = container.getByRole('heading', { level: 1 })
    expect($heading).toHaveTextContent('Support')
    expect(response.result).toMatchSnapshot()
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
