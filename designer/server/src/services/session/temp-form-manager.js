import { createLogger } from '~/src/common/helpers/logging/logger.js'

const logger = createLogger()

export class TempFormManager {
  /**
   * @param {any} server - Hapi server instance
   */
  constructor(server) {
    this.server = server
    this.defaultTTL = 3600 // 1 hour
  }

  /**
   * @param {string} sessionId
   * @param {any} formData
   */
  async storeTempForm(sessionId, formData) {
    const key = this.getTempFormKey(sessionId)
    const data = {
      ...formData,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.defaultTTL * 1000)
    }

    await this.server.methods.state.set(
      sessionId,
      key,
      JSON.stringify(data),
      this.defaultTTL * 1000
    )

    logger.info('Temporary form stored', sessionId)

    return data
  }

  /**
   * @param {string} sessionId
   */
  async getTempForm(sessionId) {
    const key = this.getTempFormKey(sessionId)
    const dataString = await this.server.methods.state.get(sessionId, key)

    if (!dataString) {
      logger.warn('Temporary form not found', sessionId)
      return null
    }

    try {
      const data = JSON.parse(dataString)

      // Check if expired
      if (new Date() > new Date(data.expiresAt)) {
        await this.deleteTempForm(sessionId)
        logger.warn('Temporary form expired', sessionId)
        return null
      }

      return data
    } catch (error) {
      logger.error('Failed to parse temporary form data', error)
      await this.deleteTempForm(sessionId)
      return null
    }
  }

  /**
   * @param {string} sessionId
   * @param {any} updates
   */
  async updateTempForm(sessionId, updates) {
    const existing = await this.getTempForm(sessionId)
    if (!existing) {
      throw new Error('Temporary form not found for update')
    }

    const updated = Object.assign({}, existing, updates)
    await this.storeTempForm(sessionId, updated)

    return updated
  }

  /**
   * @param {string} sessionId
   */
  async deleteTempForm(sessionId) {
    const key = this.getTempFormKey(sessionId)
    await this.server.methods.state.drop(sessionId, key)

    logger.info('Temporary form deleted', sessionId)
  }

  /**
   * @param {string} sessionId
   */
  getTempFormKey(sessionId) {
    return `temp-form:${sessionId}`
  }
}
