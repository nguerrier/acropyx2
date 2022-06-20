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

const PilotsPage = ({ data }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ paddingBottom: 4 }}>
        <Typography variant='h5'>Pilots</Typography>
      </Grid>
      <Grid item xs={6} sm={6}>
{/*
        <TextField fullWidth id='outlined-basic' label='Search pilot' variant='outlined' />
*/}
      </Grid>
      <Grid item xs={6} sm={6} container direction='row' justifyContent='flex-end'>
        <Button
          variant='outlined'
          onClick={() => {
            window.open(pilot.link, '_blank')
          }}
          startIcon={<RefreshIcon />}
        >
          {' '}
          Synchronize from CIVL
        </Button>
      </Grid>
      {data.map(p => (
        <Grid item xs={12} sm={4} key={p.civlid}>
          <CardPilot pilot={p} />
          {/* <CardHorizontalPilot pilot={p} /> */}
        </Grid>
      ))}
    </Grid>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  let data = await get('/pilots/')

  console.log(data)

  // Pass data to the page via props
  return { props: { data } }
}

export default withPageAuthRequired(PilotsPage)
