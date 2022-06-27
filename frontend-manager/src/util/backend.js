// ** react
import React, { useState, useEffect } from 'react';

// ** locals
import { useNotifications } from 'src/util/notifications'

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


/*
 * Hook to load pilots
 */
export const usePilots = () => {
  const [success, info, warning, error] = useNotifications()
  const [pilots, setPilots] = useState([]);

  useEffect(() => {
    const asyncFunc = async () => {
      const [err, data, headers] = await APIRequest('/pilots', {expect_json: true})

      if (err) {
          setPilots([])
          error(`Error while retrieving pilots list: ${err}`)
          return
      }

      data = data.map(j => {
        j.id = j._id
        return j
      })

      setPilots(data)
    }
    asyncFunc()
  }, [])

  return([pilots])
}


/*
 * Hook to load teams
 */
export const useTeams = () => {
  const [success, info, warning, error] = useNotifications()
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const asyncFunc = async () => {
      const [err, data, headers] = await APIRequest('/teams', {expect_json: true})

      if (err) {
          setTeams([])
          error(`Error while retrieving teams list: ${err}`)
          return
      }

      data = data.map(j => {
        j.id = j._id
        return j
      })

      setTeams(data)
    }
    asyncFunc()
  }, [])

  return([teams])
}


/*
 * Hook to load judges
 */
export const useJudges = () => {
  const [success, info, warning, error] = useNotifications()
  const [judges, setJudges] = useState([]);

  useEffect(() => {
    const asyncFunc = async () => {
      const [err, data, headers] = await APIRequest('/judges', {expect_json: true})

      if (err) {
          setJudges([])
          error(`Error while retrieving judges list: ${err}`)
          return
      }

      data = data.map(j => {
        j.id = j._id
        return j
      })

      setJudges(data)
    }
    asyncFunc()
  }, [])

  return([judges])
}


/*
 * Hook to load repeatable tricks
 */
export const useTricks = () => {
  const [success, info, warning, error] = useNotifications()
  const [tricks, setTricks] = useState([]);

  useEffect(() => {
    const asyncFunc = async () => {
      const [err, data, headers] = await APIRequest('/tricks', {expect_json: true})

      if (err) {
          setTricks([])
          error(`Error while retrieving tricks list: ${err}`)
          return
      }

      data = data.map(j => {
        j.id = j._id
        return j
      })

      setTricks(data)
    }
    asyncFunc()
  }, [])

  return([tricks])
}
