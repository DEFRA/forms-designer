import { expect, test } from '@playwright/test'
// import path from 'path';
// import dotenv from 'dotenv';

test('Question Preview', async ({ page }) => {
  await page.goto('http://localhost:3000/library')
  await page.getByRole('button', { name: 'Create a new form' }).click()

  const formName =
    'Automated test - Playwright form ' +
    Math.random().toString().substring(0, 6)
  await page
    .getByRole('textbox', { name: 'Enter a name for your form' })
    .fill(formName)
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.getByRole('radio', { name: 'Defra' }).check()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('textbox', { name: 'Name of team' }).fill('Team A')
  await page
    .getByRole('textbox', { name: 'Shared team email address' })
    .fill('test@test.gov.uk')
  await page.getByRole('button', { name: 'Save and continue' }).click()
  await page
    .getByRole('heading', { name: 'Automated test - Playwright form' })
    .click()

  await page.getByRole('button', { name: 'Edit draft' }).click()
  // go to v2 editor
  await page.goto(page.url().replace('?', '') + '-v2/pages')

  await page.getByRole('button', { name: 'Add new page' }).click()
  await page.getByRole('radio', { name: 'Question page' }).check()
  await page.getByRole('button', { name: 'Save and continue' }).click()
  await page.getByRole('radio', { name: 'Written answer' }).check()
  await page
    .getByRole('radio', { name: 'Short answer (a single line)' })
    .check()
  await page.getByRole('button', { name: 'Save and continue' }).click()

  // enter question title
  await page
    .getByRole('textbox', { name: 'Question' })
    .fill('What is your name?')
  await page
    .getByRole('textbox', { name: 'Hint text (optional)' })
    .fill('first name hint')
  await expect(
    page.getByText('What is your name?', { exact: true })
  ).toBeVisible()
  await expect(page.getByText('first name hint', { exact: true })).toBeVisible()

  await page.waitForTimeout(2000)
})
