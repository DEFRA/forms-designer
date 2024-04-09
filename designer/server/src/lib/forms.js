import config from '../config.js'
import { getJson } from './fetch.js'

const endpoint = `${config.managerUrl}/forms-manager/forms`

export async function list () {
  const { body } = await getJson(endpoint)

  return body
}

export async function get (id) {
  // TODO
}

export async function create (data) {
  // TODO
}

export async function update (id, data) {
  // TODO
}

export async function remove (id) {
  // TODO
}