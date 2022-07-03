// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'


// ** local
import EnhancedTable from 'src/views/tables/EnhancedTable'
import { useNotifications } from 'src/util/notifications'
import { APIRequest } from 'src/util/backend'

const TabFlights = ({ comp, run, rid }) => {
  // ** notification messages
  const [success, info, warning, error] = useNotifications()
  const [currentFlight, setCurrentFlight] = useState(0)
  const [pilot, setPilot] = useState(null)

  const prevPilot = () => {
    currentFlight -= 1
    if (currentFlight < 0) currentFlight = run.pilots.length -1
    setPilot(run.pilots[currentFlight])
    setCurrentFlight(currentFlight)
  }

  const nextPilot = () => {
    if (run.pilots.length == 0) {
      currentFlight = -1
    } else {
      currentFlight += 1
      if (currentFlight >= run.pilots.length) currentFlight = 0
    }
    setPilot(run.pilots[currentFlight])
    setCurrentFlight(currentFlight)
  }

  const headCells = [
    {
      id: 'rank',
    },
    {
      id: 'pilot',
      rewrite: (p) => p.name,
    },
    {
      id: 'score',
      numeric: true,
    }
  ]

  useEffect(() => {
    currentFlight = run.pilots.length -1
    setPilot(run.pilots[currentFlight])
    setCurrentFlight(currentFlight)
  }, [])

  return (
    <CardContent>
{ pilot &&
      <Grid container spacing={7} direction="column" alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={12}>
          <Typography>
            <IconButton onClick={prevPilot} >
              <NavigateBeforeIcon />
            </IconButton>
            { pilot.name }
            <IconButton onClick={prevPilot} >
              <NavigateNextIcon />
            </IconButton>
          </Typography>
        </Grid>
      </Grid>
}
      <Grid container spacing={7}>
        <Grid item xs={12} sm={12}>
          <EnhancedTable
            rows={run.flights}
            headCells={headCells}
            orderById='rank'
          />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TabFlights
