export async function getAuthToken() {
  if (process.env.BACKEND_API_USERNAME && process.env.BACKEND_API_PASSWORD) {
      // Fetch data from external API
      var params = new URLSearchParams()
      params.append('grand__type', 'password')
      params.append('username', process.env.BACKEND_API_USERNAME)
      params.append('password', process.env.BACKEND_API_PASSWORD)
      const url = new URL('/auth/login', process.env.BACKEND_API_URL)
      const res = await fetch(url, {
        method: 'POST',
        body: params
      })
      if (res.status != 200) {
          return false
      }
      return res.json()
  }
  return true
}

export async function request(method, route, body, headers) {
  if (headers == null) {
    headers = new Headers({})
  }
  const token = await getAuthToken()

  if (token == false) {
      return [401, null]
  }

  if (token.constructor == Object) {
    headers.append('Authorization', 'Bearer ' + token.access_token)
  }

  if (headers.get('Content-Type') == 'application/json' && typeof(body) === 'object' && body != null) {
      body = JSON.stringify(body)
  }

  const url = new URL(route, process.env.BACKEND_API_URL)
  const res = await fetch(url, {
    method: method,
    headers: headers,
    body: body
  })

  var response_body = null
  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    response_body = await res.json()
  }

  return [res.status, response_body]
}

export async function get(route) {
    return await request('GET', route, null)
}

export async function post(route, body) {
    return await request('POST', route, body)
}

export async function getCompetitions(id) {
  return await get('/competitions/' + id)
}

export async function getCompetitionResults(id) {
  return await get('/competitions/' + id + '/results')
}
