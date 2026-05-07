import '@testing-library/jest-dom'
import JSDOM from 'global-jsdom'

const cleanupJSDOM = JSDOM()

afterAll(() => {
  cleanupJSDOM()
})
