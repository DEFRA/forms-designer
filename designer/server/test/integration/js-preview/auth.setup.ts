// import dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'url'

import { test } from '@playwright/test'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// // dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') }); // TODO: we shouldn't need dotenv but one for later

const authFile = path.join(__dirname, '../playwright/.auth/user.json')

test('Setup', async ({ page }) => {
  const email = process.env.AUTH_EMAIL
  const password = process.env.AUTH_PASSWORD

  if (!password || !email) {
    throw new Error(
      'Email or Password is not defined in the environment variables.'
    )
  }
  await page.goto('http://localhost:3000/library')
  await page
    .getByRole('textbox', { name: 'Enter your email, phone, or' })
    .fill(email)
  await page.getByRole('button', { name: 'Next' }).click()
  await page
    .getByRole('textbox', { name: 'Enter the password for' })
    .fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.getByRole('button', { name: 'Yes' }).click()
  await page.getByRole('link', { name: 'Jignesh Nayi' }).click()
  await page.context().storageState({ path: authFile })
})
