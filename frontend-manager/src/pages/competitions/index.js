import * as React from 'react'
import { useRouter } from 'next/router'

// ** Auth0 Imports
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardActions from '@mui/material/CardActions'
import Breadcrumbs from '@mui/material/Breadcrumbs'

// ** Demo Components Imports
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import EnhancedTable from 'src/views/tables/EnhancedTable'
import { get } from 'src/util/backend'

import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '600px',
  bgcolor: 'background.paper',

  boxShadow: 24,
  p: 4
}

function createData(id, name, state, start_date, end_date, type, pilots, judges, runs) {
  return {
    id,
    name,
    state,
    start_date,
    end_date,
    type,
    pilots,
    judges,
    runs
  }
}

const CompetitionsPage = ({ data }) => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const router = useRouter()

  const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      type: 'ACTION',
      label: 'Name',
      path: router.asPath
    },
    {
      id: 'state',
      numeric: false,
      disablePadding: false,
      label: 'State'
    },
    {
      id: 'start_date',
      numeric: false,
      disablePadding: false,
      label: 'Start date'
    },
    {
      id: 'end_date',
      numeric: false,
      disablePadding: false,
      label: 'End date'
    },
    {
      id: 'type',
      numeric: false,
      disablePadding: false,
      label: 'Type'
    },
    {
      id: 'pilots',
      numeric: false,
      disablePadding: false,
      label: 'Pilots'
    },
    {
      id: 'judges',
      numeric: false,
      disablePadding: false,
      label: 'Judges'
    },
    {
      id: 'runs',
      numeric: false,
      disablePadding: false,
      label: 'Runs'
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Typography color='text.primary'>All competitions</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12} sm={12} container>
        <Button variant='contained' onClick={handleOpen} startIcon={<AddIcon />}>
          {' '}
          Create new competition
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Card sx={style}>
            <form onSubmit={e => e.preventDefault()}>
              <CardHeader title='New competition' titleTypographyProps={{ variant: 'h6' }} />
              <CardContent>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextField fullWidth label='Name' placeholder='Competition Name with Location and Type' />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth type='date' label='Start' InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth type='date' label='End' InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-simple-select-label'>Type</InputLabel>
                      <Select labelId='demo-simple-select-label' id='demo-simple-select' label='Type'>
                        <MenuItem value={'solo'}>Solo</MenuItem>
                        <MenuItem value={'synchro'}>Synchro</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                  Submit
                </Button>
                <Button size='large' color='secondary' variant='outlined' onClick={handleClose}>
                  Cancel
                </Button>
              </CardActions>
            </form>
          </Card>
        </Modal>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <EnhancedTable
            rows={data.map(p =>
              createData(
                p._id,
                p.name,
                p.state,
                p.start_date,
                p.end_date,
                p.type,
                p.pilots.length,
                p.judges.length,
                p.runs.length
              )
            )}
            headCells={headCells}
            orderById='rank'
          />
        </Card>
      </Grid>
    </Grid>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  let data = await get('/competitions/')

  // Pass data to the page via props
  return { props: { data } }
}

export default withPageAuthRequired(CompetitionsPage)
