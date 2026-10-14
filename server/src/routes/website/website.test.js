import { within } from '@testing-library/dom'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import { auth } from '~/test/fixtures/auth.js'
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

    const { container } = await renderResponse(server, options)

    const $heading = container.getByRole('heading', { level: 1 })
    const $navigation = container.getByRole('navigation', { name: 'menu' })
    const menus = ['Home', 'Features', 'Making a form', 'Support']
    const $navigationItems = within($navigation).getAllByRole('link')

    menus.forEach((item, idx) => {
      expect($navigationItems[idx]).toHaveTextContent(item)
    })
    expect($heading).toHaveTextContent(
      'Create and publish Defra forms on GOV.UK'
    )
  })

  test('/resources should redirect to home when not logged in', async () => {
    const options = {
      method: 'GET',
      url: '/resources'
    }

    const {
      response: { statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
  })

  test('/resources should show the Defra Forms Website Resources page', async () => {
    const options = {
      method: 'GET',
      url: '/resources',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $heading = container.getByRole('heading', { level: 1 })
    expect($heading).toHaveTextContent('Resources')
  })

  test('/making-a-form should show the Defra Forms Website Making a Form page', async () => {
    const options = {
      method: 'GET',
      url: '/making-a-form'
    }

    const { container } = await renderResponse(server, options)

    const $heading = container.getByRole('heading', { level: 1 })
    expect($heading).toHaveTextContent('Making a form')
  })

  test('/making-a-form/what-makes-a-good-form should load Make a form live checklist', async () => {
    const options = {
      method: 'GET',
      url: '/making-a-form/what-makes-a-good-form'
    }

    const { container, response } = await renderResponse(server, options)
    const $heading = container.getByRole('heading', { level: 1 })

    expect($heading).toHaveTextContent('What makes a good form')
    expect(response.result).toMatchSnapshot()
  })

  test('/features should shows the Defra Forms Website Features', async () => {
    const options = {
      method: 'GET',
      url: '/features'
    }

    const { container, response } = await renderResponse(server, options)

    const $heading = container.getByRole('heading', { level: 1 })
    expect($heading).toHaveTextContent('Features')
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
