const BASE = 'https://www.dnd5eapi.co'

export async function getJson(path) {
  const res = await fetch(path.startsWith('http') ? path : BASE + path)
  if (!res.ok) throw new Error('Error al consultar la API')
  return res.json()
}

export async function getList(endpoint) {
  const data = await getJson('/api/' + endpoint)
  return data.results
}

export async function getDetail(endpoint, index) {
  return getJson('/api/' + endpoint + '/' + index)
}
