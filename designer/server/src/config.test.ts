describe('Config', () => {
  const OLD_ENV = { ...process.env }

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('footerText prop is set correctly', async () => {
    process.env = {
      ...OLD_ENV,
      FOOTER_TEXT: 'Footer Text Test'
    }

    const { default: config } = await import('~/src/config.js')
    expect(config.footerText).toBe('Footer Text Test')
  })

  test('lastCommit and lastTag props are set correctly', async () => {
    process.env = {
      ...OLD_ENV,
      LAST_COMMIT: 'LAST COMMIT',
      LAST_TAG: 'LAST TAG'
    }

    const { default: config } = await import('~/src/config.js')
    expect(config.lastCommit).toBe('LAST COMMIT')
    expect(config.lastTag).toBe('LAST TAG')
  })

  test('lastCommit and lastTag props are set correctly with GH variables', async () => {
    process.env = {
      ...OLD_ENV,
      LAST_COMMIT: undefined,
      LAST_TAG: undefined,
      LAST_COMMIT_GH: 'LAST COMMIT',
      LAST_TAG_GH: 'LAST TAG'
    }

    const { default: config } = await import('~/src/config.js')
    expect(config.lastCommit).toBe('LAST COMMIT')
    expect(config.lastTag).toBe('LAST TAG')
  })

  test('Throws if S3 is required and no AWS config is found', async () => {
    process.env = {
      ...OLD_ENV,
      PERSISTENT_BACKEND: 's3',
      AWS_ACCESS_KEY_ID: undefined,
      AWS_ACCESS_SECRET_KEY: undefined
    }

    try {
      import('~/src/config.js')
    } catch (e) {
      expect(e).toBeTruthy()
    }

    process.env = {
      ...OLD_ENV,
      PERSISTENT_BACKEND: 's3',
      AWS_ACCESS_KEY_ID: 'key',
      AWS_SECRET_ACCESS_KEY: 'secret'
    }

    await expect(import('~/src/config.js')).resolves.toBeTruthy()
  })
})
