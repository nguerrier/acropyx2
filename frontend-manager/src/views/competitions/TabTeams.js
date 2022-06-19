// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import EnhancedTable from 'src/views/tables/EnhancedTable'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'Id'
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name'
  }
]

function createData(id, name) {
  return {
    id,
    name
  }
}

const TabTeams = ({ teams }) => {
  // ** State
  const [date, setDate] = useState(null)

  return (
    <CardContent>
      <Grid container spacing={7}>
        <Grid item xs={12} sm={12} container>
          <Button variant='contained' startIcon={<AddIcon />}>
            {' '}
            Add team
          </Button>
        </Grid>
        <Grid item xs={12} sm={12}>
          <EnhancedTable rows={teams.map(j => createData(j, ''))} headCells={headCells} orderById='rank' />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TabTeams