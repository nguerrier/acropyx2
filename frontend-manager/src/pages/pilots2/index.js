// ** Auth0 Imports
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import Typography from '@mui/material/Typography'
import CardPilot from 'src/views/cards/CardPilot'
import { get } from 'src/util/backend'
import Button from '@mui/material/Button'
import RefreshIcon from '@mui/icons-material/Refresh'
import TextField from '@mui/material/TextField'

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
  const [isLoading, setLoading] = useState(false)
  const [isUpdating, setUpdating] = useState(false)

  const loadPilots = () => {
    setLoading(true)
    fetch('/api/acropyx/pilots')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setFullData(data)
        setLoading(false)
      })
  }
  useEffect(() => {
      loadPilots()
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (isUpdating) return <p>Updating pilot(s), please wait</p>
  if (!data) return <p>No data</p>

  const handleSubmit = async (e) => {
      event.preventDefault()
      const civlid = parseInt(document.getElementById('civlid').value)
      if (civlid < 1 || isNaN(civlid)) return
      setUpdating(true)
      const res = await fetch('/api/acropyx/pilots/' + civlid, {
          method: 'POST'
      })
      setUpdating(false)
      if (res.status != 201) {
          alert("Error while trying to update pilot ${civlid}\nHTTP Status Code=${res.status}")
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
    setData(fullData.filter(pilot => pilot.name.match(r)))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ paddingBottom: 4 }}>
        <Typography variant='h5'>Pilots</Typography>
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
        <Button
          variant='outlined'
          startIcon={<RefreshIcon />}
          onClick={() => {
              alert('Not yet implemented, please use the API directly')
          }}
        >
          {' '}
          Synchronize from CIVL
        </Button>
      </Grid>
      {data.map(p => (
        <Grid item xs={12} sm={4} key={p.civlid}>
          <CardPilot pilot={p} />
        </Grid>
      ))}
    </Grid>
  )
}

export default withPageAuthRequired(PilotsPage)
