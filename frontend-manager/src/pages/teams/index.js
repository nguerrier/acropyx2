// ** Auth0 Imports
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import Typography from '@mui/material/Typography'
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
    id: 'pilots',
    numeric: false,
    disablePadding: false,
    label: 'Pilots'
  }
]

const TeamsPage = ({ data }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Teams</Typography>
        <Typography variant='body2'>Tables display sets of teams.</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <EnhancedTable rows={data} headCells={headCells} orderById='rank' />
        </Card>
      </Grid>
    </Grid>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  let data = await get('/teams/')
  data = data.map((team) => {return {
      id: team._id,
      name: team.name,
      pilots: [
        team.pilots[0].name,
        team.pilots[1].name
      ]
  };})
  // Pass data to the page via props
  return { props: { data } }
}

export default withPageAuthRequired(TeamsPage)
