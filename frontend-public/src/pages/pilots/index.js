// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import Typography from '@mui/material/Typography'
import CardPilot from 'src/views/cards/CardPilot'
import { get } from 'src/util/backend'

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
      {data.map(p => (
        <Grid item xs={12} sm={4} key={p.civlid}>
          <CardPilot pilot={p} />
          {/* <CardHorizontalPilot pilot={p} /> */}
        </Grid>
      ))}
    </Grid>
  )
}

export async function getStaticProps() {
  let data = await get('public/pilots')

  // Pass data to the page via props
  return { props: { data }, revalidate: 10 }
}

export default PilotsPage
