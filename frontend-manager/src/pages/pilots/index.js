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
import { getNotifications } from 'src/util/notifications'
import { APIRequest } from 'src/util/backend'


const PilotsPage = () => {
  // ** notification messages
  const [success, info, warning, error] = getNotifications()


  const [data, setData] = useState([])
  const [fullData, setFullData] = useState([])
  const [isLoading, setLoading] = useState(false)

  const loadPilots = async () => {
    setLoading('Loading pilots list')

    const [err, data, headers] = await APIRequest('/pilots', {expect_json: true})

    if (err) {
        setData(false)
        setFullData(false)
        error(`Error while retrieving pilots list: ${err}`)
        return
    }

    setData(data)
    setFullData(data)
    setLoading(false)
  }

  const handleSubmitUpdatePilot = (e) => {
      event.preventDefault()
      updatePilot(parseInt(document.getElementById('civlid').value))
  }

  const updatePilot = async (civlid) => {
      if (civlid < 1 || isNaN(civlid)) return

      setLoading(`Updating pilot #${civlid}`)

      const [err, data, headers] = await APIRequest(`/pilots/${civlid}`, {method: 'POST', expected_status: 201})
      if (err) {
          error(`Error updating Pilot #${civlid}: ${err}`)
      } else {
          success(`Pilot #${civlid} successfully updated`)
      }
      loadPilots()
  }

  const updateAllPilots = async () => {

      if (!confirm('Are you sure to update all pilots ?')) return;

      setLoading(`Updating all pilots`)

      const [err, data, headers] = await APIRequest(`/pilots/update_all`, {method: 'POST', expected_status: 201})
      if (err) {
          error(`Error updating all pilots: ${err}`)
      } else {
          success(`Pilots successfully updated`)
      }

      loadPilots()
  }

  const updateSearch = async(e) => {
    const s = e.target.value
    const civlid = parseInt(s)
    if (civlid > 0) {
      setData(fullData.filter(pilot => pilot.civlid == civlid))
      return
    }
    // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    // to compare ignoring accents
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const r = new RegExp(s, "i");
    const d = fullData.filter(pilot => pilot.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(r))
    setData(d)
    info(`${d.length} pilots filtered over ${fullData.length}`)
  }

  useEffect(() => {
      loadPilots()
  }, [])

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <LinearProgress />
        { isLoading }
      </Box>
    )
  }

  if (!data) return <p>No data</p>

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ paddingBottom: 4 }}>
        <Typography variant='h5'>Pilots<RefreshIcon onClick={loadPilots} /></Typography>
      </Grid>
      <Grid item xs={4} sm={4}>
        <TextField fullWidth id='outlined-basic' label='Search pilot' variant='outlined' onChange={updateSearch} />
      </Grid>
      <Grid item xs={2} sm={2}>
        <form onSubmit={handleSubmitUpdatePilot}>
          <TextField id='civlid' label='CIVL ID' />
        </form>
      </Grid>
      <Grid item xs={2} sm={2}>
        <form onSubmit={handleSubmitUpdatePilot}>
          <Button type="submit">Add or Update pilot</Button>
        </form>
      </Grid>
      <Grid item xs={4} sm={4} container direction='row' justifyContent='flex-end'>
        <Button variant='outlined' startIcon={<RefreshIcon />} onClick={updateAllPilots} >
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
