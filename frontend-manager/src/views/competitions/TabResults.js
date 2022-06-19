// ** React Imports
import { forwardRef, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import EnhancedTable from 'src/views/tables/EnhancedTable'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

function createData(id, name, state) {
  return {
    id,
    name,
    state
  }
}

const TabResults = ({ results }) => {
  // ** State
  const [date, setDate] = useState(null)

  const router = useRouter()

  const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      type: 'ACTION',
      path: router.asPath + '/runs',
      label: 'Name'
    },
    {
      id: 'state',
      numeric: false,
      disablePadding: false,
      label: 'State'
    }
  ]

  return (
    <CardContent>
      <Grid container spacing={7}>
        <Grid item xs={12} sm={12}>
          <EnhancedTable
            rows={results}
            headCells={headCells}
            orderById='rank'
          />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TabResults
