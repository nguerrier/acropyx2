// ** Auth0 Imports
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import EnhancedTable from 'src/views/tables/EnhancedTable'
import { get } from 'src/util/backend'

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name'
  },
  {
    id: 'acronym',
    numeric: false,
    disablePadding: false,
    label: 'Acronym'
  },
  {
    id: 'technical_coefficient',
    numeric: false,
    disablePadding: false,
    label: 'Technical Coefficient'
  },
  {
    id: 'solo',
    numeric: false,
    type: 'BOOLEAN',
    disablePadding: false,
    label: 'Solo'
  },
  {
    id: 'synchro',
    numeric: false,
    type: 'BOOLEAN',
    disablePadding: false,
    label: 'Synchro'
  },
  {
    id: 'first_maneuver',
    numeric: false,
    disablePadding: false,
    label: 'First maneuver'
  },
  {
    id: 'no_first_maneuver',
    numeric: false,
    disablePadding: false,
    label: 'No first maneuver'
  },
  {
    id: 'last_maneuver',
    numeric: false,
    disablePadding: false,
    label: 'Last maneuver'
  },
  {
    id: 'no_last_maneuver',
    numeric: false,
    disablePadding: false,
    label: 'No last maneuver'
  }
]

const TeamsPage = ({ data }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
            Tricks
        </Typography>
        <Typography variant='body2'>Tables display sets of teams.</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <EnhancedTable rows={data} headCells={headCells} orderById='technical_coefficient' />
        </Card>
      </Grid>
    </Grid>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  let [status, data] = await get('/tricks/')

  // Pass data to the page via props
  return { props: { data } }
}

export default withPageAuthRequired(TeamsPage)
