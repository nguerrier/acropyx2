// ** React Imports
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import AddIcon from '@mui/icons-material/Add'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import Editable from 'src/components/Editable'
import Autocomplete from '@mui/material/Autocomplete'


// ** local
import EnhancedTable from 'src/views/tables/EnhancedTable'
import { useNotifications } from 'src/util/notifications'
import { APIRequest, useUniqueTricks } from 'src/util/backend'

const TabFlights = ({ comp, run, rid }) => {
  // ** notification messages
  const [success, info, warning, error] = useNotifications()

  // ** states
  const [currentFlight, setCurrentFlight] = useState(0)
  const [pilot, setPilot] = useState(null)
  const [uniqueTricks] = useUniqueTricks()

  // ** refs
  const nameRef = useRef()

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
      <Grid container>
        <Grid item xs={1} sm={1}>
            <IconButton onClick={prevPilot} >
              <NavigateBeforeIcon />
            </IconButton>
        </Grid>
        <Grid item xs={10} sm={10}>
                    <Autocomplete
                      id="autocomplete-pilot"
                      options={run.pilots}
                      value={pilot}
                      getOptionLabel={(p) => `${p.name} (${p.civlid})`}
                      renderInput={(params) => <TextField {...params} name="pilot" label="Pilot" />}
                      onChange={(e, v) => {
                        if (!v) return
                        for(const [i,p] of run.pilots.entries()){
                            if (p.civlid == v.civlid) {
                                setPilot(v)
                                setCurrentFlight(i)
                                return
                            }
                        }
                      }}
                    />
        </Grid>
        <Grid item xs={1} sm={1}>
            <IconButton onClick={prevPilot} >
              <NavigateNextIcon />
            </IconButton>
        </Grid>
      </Grid>
}
      <Grid container spacing={2}>
        separator
      </Grid>
      <Grid container spacing={2}>
        {/* 1st column / maneuvers*/}
        <Grid container xs={6}>
            <Grid xs={12}>
              <Typography variant="h5">Maneuvers</Typography>
            </Grid>
            <Grid xs={11}>
                    <Autocomplete
                      id="autocomplete-trick"
                      options={uniqueTricks}
                      getOptionLabel={(p) => `${p.name} (${p.acronym})`}
                      renderInput={(params) => <TextField {...params} name="trick" label="Trick" />}
                      onChange={(e, v) => {
                        console.log('unique trick', v)
                      }}
                    />
            </Grid>
            <Grid xs={1}>
                    <Button variant='contained' onClick={() => {console.log('clik add button')}}><AddIcon /></Button>
            </Grid>
        </Grid>
        {/* 2nd column */}
        <Grid container xs={6}>
          {/* marks */}
          <Grid container xs={12}>
            <Typography variant="h5">Marks</Typography>
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
    <TableHead>
      <TableRow>
          <TableCell>
            Judge
          </TableCell>
          <TableCell>
            Technical
          </TableCell>
          <TableCell>
            Choreography
          </TableCell>
          <TableCell>
            Landing
          </TableCell>
          <TableCell>
            Synchro
          </TableCell>
      </TableRow>
    </TableHead>
            <TableBody>
{ run.judges.map((j) => {
    return (
              <TableRow>
                <TableCell>
                  <Typography>{ j.name }</Typography>
                </TableCell>
                <TableCell>
                  <TextField />
                </TableCell>
                <TableCell>
                  <TextField />
                </TableCell>
                <TableCell>
                  <TextField />
                </TableCell>
                <TableCell>
                  <TextField />
                </TableCell>
            </TableRow>
)})}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
          </Grid>
          {/* scores */}
          <Grid container xs={12}>
            <Typography variant="h5">Scores</Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography>Technicity: 2.05</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>% Bonus: 26%</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>Judge's marks</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>Technical: 7</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>Choreography: 7</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>Landing: 7</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>Synchro: 7</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>Final's marks</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>Technical: 7</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>Choreography: 7</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>Landing: 7</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>Synchro: 7</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>Bonuses: 1.04</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h5">Final Score: 12.404</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          {/* actions */}
          <Grid container xs={12}>
            <Typography variant="h5">Actions</Typography>
            <Grid container xs={12}>
              <Grid item xs={6}>
                <Button>Save Results</Button>
              </Grid>
              <Grid item xs={6}>
                <Button>Publish Results</Button>
              </Grid>
              <Grid item xs={6}>
                <Button>Save Results + next Run</Button>
              </Grid>
              <Grid item xs={6}>
                <Button>Publish Results + next Run</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
