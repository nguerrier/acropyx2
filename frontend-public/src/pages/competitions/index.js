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
    type: 'ACTION',
    path: '/competitions',
    label: 'Name'
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
  }
]

function createData(id, name, state, start_date, end_date, pilots, judges) {
  return {
    id,
    name,
    state,
    start_date,
    end_date,
    pilots,
    judges
  }
}

const CompetitionsPage = ({ data }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Competitions</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <EnhancedTable
            rows={data.map(p =>
              createData(
                p.code,
                p.name,
                p.state,
                p.start_date,
                p.end_date,
                p.pilots.length,
                p.judges.length
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
export async function getStaticProps() {
  let data = await get('public/competitions')

  // Pass data to the page via props
  return { props: { data }, revalidate: 10 }
}

export default CompetitionsPage
