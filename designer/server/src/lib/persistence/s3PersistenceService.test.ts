import { S3PersistenceService } from '~/src/lib/persistence/s3PersistenceService.js'

import { FormConfiguration } from '@defra/forms-model'

describe('s3PersistenceService', () => {
  const server = {
    logger: {
      warn: jest.fn(),
      error: jest.fn(),
      log: jest.fn()
    }
  }

  const underTest = new S3PersistenceService(server)
  underTest.bucket = {
    listObjects: jest.fn(),
    getObject: jest.fn(),
    upload: jest.fn(),
    copyObject: jest.fn(),
    config: { params: { Bucket: 'myBucket' } }
  }

  describe('listAllConfigurations', () => {
    test('should return configured objects', async () => {
      underTest.bucket.listObjects.mockReturnValue({
        promise: () => ({
          Contents: [
            {
              Key: 'myForm',
              Metadata: { 'x-amz-meta-name': 'My form' },
              LastModified: '2019-03-12T01:00:32.999Z'
            },
            {
              Key: 'anotherForm',
              Metadata: { 'x-amz-meta-name': 'Another form' }
            },
            {
              Key: 'feedbackForm',
              Metadata: {
                'x-amz-meta-name': 'Feedback form',
                'x-amz-meta-type': 'feedback'
              }
            },
            { Key: 'thirdForm' }
          ]
        })
      })

      await expect(underTest.listAllConfigurations()).resolves.toEqual([
        new FormConfiguration('myForm', 'My form', '2019-03-12T01:00:32.999Z'),
        new FormConfiguration('anotherForm', 'Another form'),
        new FormConfiguration('feedbackForm', 'Feedback form', undefined, true),
        new FormConfiguration('thirdForm')
      ])
    })

    test('should return error if one is returned', async () => {
      underTest.bucket.listObjects.mockReturnValue({
        promise: () => ({ error: 'some error' })
      })

      await expect(underTest.listAllConfigurations()).resolves.toBe(
        'some error'
      )
    })
  })

  describe('getConfiguration', () => {
    ;[
      {
        id: 'ab123456',
        expectedId: 'ab123456.json',
        description: 'a filename with no extension'
      },
      {
        id: 'ab123456.json',
        expectedId: 'ab123456.json',
        description: 'a filename with a json extension'
      },
      {
        id: 'ab123456.txt',
        expectedId: 'ab123456.txt.json',
        description: 'a filename with a different extension'
      }
    ].forEach((testCase) => {
      test(`should return configured objects when id is ${testCase.description}`, async () => {
        underTest.bucket.getObject.mockReturnValue({
          promise: () => ({
            Body: 'Some content string'
          })
        })

        await expect(underTest.getConfiguration(testCase.id)).resolves.toBe(
          'Some content string'
        )

        expect(underTest.bucket.getObject).toHaveBeenCalledTimes(1)
        expect(underTest.bucket.getObject.mock.calls[0][0]).toEqual({
          Key: testCase.expectedId
        })
      })
    })

    test('should return error if one is returned', async () => {
      underTest.bucket.getObject.mockReturnValue({
        promise: () => ({ error: 'some error' })
      })

      await expect(underTest.getConfiguration('efefsdasa')).resolves.toBe(
        'some error'
      )
    })
  })

  describe('uploadConfiguration', () => {
    ;[
      {
        id: 'ab123456',
        expectedId: 'ab123456.json',
        description: 'a filename with no extension'
      },
      {
        id: 'ab123456.json',
        expectedId: 'ab123456.json',
        description: 'a filename with a json extension'
      },
      {
        id: 'ab123456.txt',
        expectedId: 'ab123456.txt.json',
        description: 'a filename with a different extension'
      }
    ].forEach((testCase) => {
      test(`should upload configuration with no display name when id is ${testCase.description}`, async () => {
        const response = {}
        underTest.bucket.upload.mockReturnValue({ promise: () => response })
        const configuration = JSON.stringify({ someKey: 'someValue' })

        expect(
          await underTest.uploadConfiguration(testCase.id, configuration)
        ).toEqual(response)

        expect(underTest.bucket.upload).toHaveBeenCalledTimes(1)
        expect(underTest.bucket.upload.mock.calls[0][0]).toEqual({
          Key: testCase.expectedId,
          Body: configuration,
          Metadata: {}
        })
      })

      test(`should upload configuration with a display name when id is ${testCase.description}`, async () => {
        const response = {}
        const displayName = 'My form'
        underTest.bucket.upload.mockReturnValue({ promise: () => response })
        const configuration = JSON.stringify({
          someStuff: 'someValue',
          name: displayName
        })

        expect(
          await underTest.uploadConfiguration(testCase.id, configuration)
        ).toEqual(response)

        expect(underTest.bucket.upload).toHaveBeenCalledTimes(1)
        expect(underTest.bucket.upload.mock.calls[0][0]).toEqual({
          Key: testCase.expectedId,
          Body: configuration,
          Metadata: { 'x-amz-meta-name': displayName }
        })
      })

      test(`should upload configuration which is a feedback form when id is ${testCase.description}`, async () => {
        const response = {}
        const displayName = 'My form'
        underTest.bucket.upload.mockReturnValue({ promise: () => response })
        const configuration = JSON.stringify({
          someStuff: 'someValue',
          name: displayName,
          feedback: { feedbackForm: true }
        })

        expect(
          await underTest.uploadConfiguration(testCase.id, configuration)
        ).toEqual(response)

        expect(underTest.bucket.upload).toHaveBeenCalledTimes(1)
        expect(underTest.bucket.upload.mock.calls[0][0]).toEqual({
          Key: testCase.expectedId,
          Body: configuration,
          Metadata: {
            'x-amz-meta-name': displayName,
            'x-amz-meta-type': 'feedback'
          }
        })
      })
    })

    test('should return error if one is returned', async () => {
      underTest.bucket.upload.mockReturnValue({
        promise: () => ({ error: 'some error' })
      })

      const configuration = JSON.stringify({ someStuff: 'someValue' })

      expect(
        await underTest.uploadConfiguration('my badger', configuration)
      ).toEqual({ error: 'some error' })
    })
  })

  describe('copyConfiguration', () => {
    ;[
      {
        id: 'ab123456',
        expectedId: 'ab123456.json',
        description: 'a filename with no extension'
      },
      {
        id: 'ab123456.json',
        expectedId: 'ab123456.json',
        description: 'a filename with a json extension'
      },
      {
        id: 'ab123456.txt',
        expectedId: 'ab123456.txt.json',
        description: 'a filename with a different extension'
      }
    ].forEach((testCase) => {
      test(`should copy configuration when id is ${testCase.description}`, async () => {
        const response = {}
        const newName = 'wqmqadda'
        underTest.bucket.copyObject.mockReturnValue({ promise: () => response })

        await expect(
          underTest.copyConfiguration(testCase.id, newName)
        ).resolves.toEqual(response)

        expect(underTest.bucket.copyObject).toHaveBeenCalledTimes(1)

        expect(underTest.bucket.copyObject.mock.calls[0][0]).toEqual({
          CopySource: encodeURI(`myBucket/${testCase.expectedId}`),
          Key: `${newName}.json`
        })
      })
    })

    test('should return error if one is returned', async () => {
      underTest.bucket.copyObject.mockReturnValue({
        promise: () => ({ error: 'some error' })
      })

      const configuration = JSON.stringify({ someStuff: 'someValue' })

      expect(
        await underTest.copyConfiguration('my badger', configuration)
      ).toEqual({ error: 'some error' })
    })
  })
})
