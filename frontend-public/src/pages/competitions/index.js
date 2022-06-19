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
  let data = await get('competitions')

  console.log(data[0])

  // Pass data to the page via props
  return { props: { data } }
}

export default CompetitionsPage
