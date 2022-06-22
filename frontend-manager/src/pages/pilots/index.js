// ** Auth0 Imports
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import RefreshIcon from '@mui/icons-material/Refresh'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

import CardPilot from 'src/views/cards/CardPilot'

//
import Router from 'next/router'
import { useState, useEffect } from 'react';

const headCells = [
  {
    id: 'civlid',
    numeric: false,
    disablePadding: true,
    label: 'CIVL ID'
  },
  {
    id: 'rank',
    numeric: false,
    disablePadding: false,
    label: 'Rank'
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name'
  },
  {
    id: 'country',
    numeric: false,
    disablePadding: false,
    label: 'Country'
  },
  {
    id: 'link',
    numeric: false,
    link: true,
    disablePadding: false,
    label: 'Link'
  }
]

const PilotsPage = () => {

  const [data, setData] = useState([])
  const [fullData, setFullData] = useState([])
  const [message, setMessage] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [isUpdatingPilots, setUpdatingPilots] = useState(false)
  const [isUpdatingPilot, setUpdatingPilot] = useState(0)

  const loadPilots = () => {
    setMessage('')
    setLoading(true)
    fetch('/api/acropyx/pilots')
      .then((res) => {
        if (res.status == 200) {
          return res.json()
        } else {
          throw new Error(`Wrong status code ${res.status}`)
        }
      })
      .then((data) => {
        setData(data)
        setFullData(data)
        setMessage(`${data.length} pilots successfully loaded`)
        setLoading(false)
      }).catch(error => {
        setMessage(error.toString())
      })
  }
  useEffect(() => {
      loadPilots()
  }, [])

  const handleSubmit = async (e) => {
      event.preventDefault()
      updatePilot(parseInt(document.getElementById('civlid').value))
  }
  const updatePilot = async (civlid) => {
      setMessage('')
      if (civlid < 1 || isNaN(civlid)) return
      setUpdatingPilot(civlid)
      const res = await fetch('/api/acropyx/pilots/' + civlid, {
          method: 'POST'
      })
      setUpdatingPilot(0)
      if (res.status != 201) {
          alert("Error while trying to update pilot ${civlid}\nHTTP Status Code=${res.status}")
          return
      }
      // reload data
      loadPilots()
  }

  const updateAllPilots = async () => {
      if (!confirm('Are you sure to update all pilots ?')) return;
      setMessage('')
      setUpdatingPilots(true)

      const res = await fetch('/api/acropyx/pilots/update_all', {
          method: 'POST'
      })
      setUpdatingPilots(false)
      if (res.status != 201) {
          alert(`Error while trying to update pilots\nHTTP Status Code=${res.status}`)
          return
      }
      // reload data
      loadPilots()
  }

  const updateSearch = async(e) => {
    const s = e.target.value
    const civlid = parseInt(s)
    if (civlid > 0) {
      setData(fullData.filter(pilot => pilot.civlid == civlid))
      return
    }
    const r = new RegExp(s, "i");
    const d = fullData.filter(pilot => pilot.name.match(r))
    setData(d)
    setMessage(`${d.length} pilots filtered over ${fullData.length}`)
  }

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <LinearProgress />
        Loading
        {message}
      </Box>
    )
  }

  if (isUpdatingPilot > 0) {
    return (
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <LinearProgress />
        Updating pilot #{isUpdatingPilot}
        {message}
      </Box>
    )
  }

  if (isUpdatingPilots) {
    return (
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <LinearProgress />
        Updating all pilots, this can be long
        {message}
      </Box>
    )
  }
  if (!data) return <p>No data</p>

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ paddingBottom: 4 }}>
        <Typography variant='h5'>Pilots<RefreshIcon onClick={loadPilots} /></Typography>
        { message }
      </Grid>
      <Grid item xs={4} sm={4}>
        <TextField fullWidth id='outlined-basic' label='Search pilot' variant='outlined' onChange={updateSearch} />
      </Grid>
      <Grid item xs={2} sm={2}>
        <form onSubmit={handleSubmit}>
          <TextField id='civlid' label='CIVL ID' />
        </form>
      </Grid>
      <Grid item xs={2} sm={2}>
        <form onSubmit={handleSubmit}>
          <Button type="submit">
            Add or Update pilot
          </Button>
        </form>
      </Grid>
      <Grid item xs={4} sm={4} container direction='row' justifyContent='flex-end'>
        <Button variant='outlined' startIcon={<RefreshIcon />} onClick={updateAllPilots} >
          {' '}
          Synchronize from CIVL
        </Button>
      </Grid>
      {data.map(p => (
        <Grid item xs={12} sm={4} key={p.civlid}>
          <CardPilot pilot={p} updatePilot={updatePilot}/>
        </Grid>
      ))}
    </Grid>
  )
}

export default withPageAuthRequired(PilotsPage)
