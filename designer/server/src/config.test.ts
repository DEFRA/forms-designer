describe('Config', () => {
  const OLD_ENV = { ...process.env }

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('footerText prop is set correctly', async () => {
    process.env.FOOTER_TEXT = 'Footer Text Test'

    const { default: config } = await import('~/src/config.js')
    expect(config.footerText).toBe('Footer Text Test')
  })

  test('lastCommit and lastTag props are set correctly', async () => {
    process.env.LAST_COMMIT = 'LAST COMMIT'
    process.env.LAST_TAG = 'LAST TAG'

    const { default: config } = await import('~/src/config.js')
    expect(config.lastCommit).toBe('LAST COMMIT')
    expect(config.lastTag).toBe('LAST TAG')
  })

  test('lastCommit and lastTag props are set correctly with GH variables', async () => {
    process.env.LAST_COMMIT = undefined
    process.env.LAST_TAG = undefined
    process.env.LAST_COMMIT_GH = 'LAST COMMIT'
    process.env.LAST_TAG_GH = 'LAST TAG'

    const { default: config } = await import('~/src/config.js')
    expect(config.lastCommit).toBe('LAST COMMIT')
    expect(config.lastTag).toBe('LAST TAG')
  })
})
