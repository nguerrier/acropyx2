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
  },
  {
    id: 'acronym',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'technical_coefficient',
    numeric: true,
    disablePadding: false,
  },
  {
    id: 'bonus',
    numeric: true,
    disablePadding: false,
  },
  {
    id: 'bonus_types',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'base_trick',
    numeric: false,
    disablePadding: false,
  }
]

const TeamsPage = ({ data }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
            Tricks Variant
        </Typography>
        <Typography variant='body2'>All the variant of all the tricks.</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <EnhancedTable
            rows={data.map(p =>
              {return {
                name: p.name,
                acronym: p.acronym,
                technical_coefficient: p.technical_coefficient,
                bonus: p.bonus,
                bonus_types: p.bonus_types.join(', '),
                base_trick: p.base_trick
              }}
            )}
            headCells={headCells} orderById='technical_coefficient' />
        </Card>
      </Grid>
    </Grid>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  let [status, data] = await get('/tricks/scores')

  // Pass data to the page via props
  return { props: { data } }
}

export default withPageAuthRequired(TeamsPage)
