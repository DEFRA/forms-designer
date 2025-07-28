/**
 * @param {string} email
 */
export async function getUserFromEntra(email) {
  const firstName = 'John'
  const lastName = 'Smith'
  await new Promise((resolve) => setTimeout(resolve, 10))
  return {
    userId: email.replace('@', '-'),
    fullName: `${firstName} ${lastName}`,
    email
  }
}
