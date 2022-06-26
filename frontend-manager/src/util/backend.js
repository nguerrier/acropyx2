export async function APIRequest(route, props={}) {
  var expected_status = props.expected_status ?? 200
  var expect_json = props.expect_json ?? false

  if (props.headers == null) {
    props.headers = {}
  }
  props.headers = new Headers(props.headers)

  var token = localStorage.getItem('token')
  if (token) {
    props.headers.append('Authorization', 'Bearer ' + token)
  }

  route = new URL(route, process.env.NEXT_PUBLIC_API_URL)

  const res = await fetch(route, props)

  var body = null
  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    body = await res.json()
  }

  if (expect_json && body == null) {
    err = `did not receive JSON response`
  }

  var err = null
  if (expected_status > 0 && res.status != expected_status) {
    err = `wrong status code (received ${res.status} while expecting ${expected_status}`
    if (body) {
      err += ": " + JSON.stringify(body)
    }
  }

  return [err, body, res.headers]
}
