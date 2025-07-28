import { getUserFromEntra } from '~/src/lib/entra.js'

describe('entra.js', () => {
  describe('getUserFromEntra', () => {
    it('should get the user', async () => {
      const result = await getUserFromEntra('some-email@gmail.com')
      expect(result).toEqual({
        userId: 'some-email-gmail.com',
        fullName: 'John Smith',
        email: 'some-email@gmail.com'
      })
    })
  })
})
