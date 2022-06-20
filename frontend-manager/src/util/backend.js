export async function getAuthToken() {
  if (process.env.BACKEND_API_USERNAME && process.env.BACKEND_API_PASSWORD) {
      // Fetch data from external API
      var paramsString = 'grant_type=&username=' + process.env.BACKEND_API_USERNAME + '&password=' + process.env.BACKEND_API_PASSWORD + '&scope=&client_id=&client_secret='
      var searchParams = new URLSearchParams(paramsString)
      const url = new URL('/auth/login', process.env.BACKEND_API_URL)
      const res = await fetch(url, {
        method: 'POST',
        body: searchParams
      })
      return res.json()
  }
  return null
}

export async function request(method, route, body) {
  const token = await getAuthToken()
  var myHeaders = new Headers({})
  if (token) {
    myHeaders = new Headers({
      Authorization: 'Bearer ' + token.access_token
    })
  }
  const url = new URL(route, process.env.BACKEND_API_URL)
  const res = await fetch(url, {
    method: method,
    headers: myHeaders,
    body: body
  })

  return res.json()
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
