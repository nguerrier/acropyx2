import axios from 'axios'

export async function getAuthToken() {
  // Fetch data from external API
  var paramsString = 'grant_type=&username=admin&password=PimeQcXLGGB&scope=&client_id=&client_secret='
  var searchParams = new URLSearchParams(paramsString)

  const resToken = await fetch('https://preprod-api-acropyx.herokuapp.com/auth/login', {
    method: 'POST',
    body: searchParams
  })

  return resToken.json()
}

export async function get(route) {
  const { data } = await axios.get('https://preprod-api-acropyx.herokuapp.com/' + route)

  return data
}

export async function getCompetitions(id) {
  const token = await getAuthToken()

  var myHeaders = new Headers({
    Authorization: 'Bearer ' + token.access_token
  })

  console.log(id)

  const resPilots = await fetch(
    'https://preprod-api-acropyx2.herokuapp.com/competitions/62aaed96085eeaf2a9f0a997?deleted=false',
    {
      method: 'GET',
      headers: myHeaders
    }
  )

  return resPilots.json()
}
