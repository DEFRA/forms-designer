export async function postShortDescription(title) {
  const payload = JSON.stringify({ title })

  const response = await window.fetch(
    'http://localhost:3000/api/ai/short_description',
    {
      body: payload,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }
  )
  return response.json()
}
