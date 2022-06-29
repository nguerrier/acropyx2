// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'


// ** local
import EnhancedTable from 'src/views/tables/EnhancedTable'
import { useNotifications } from 'src/util/notifications'
import { APIRequest } from 'src/util/backend'

const TabFlights = ({ comp, run, rid }) => {
  // ** notification messages
  const [success, info, warning, error] = useNotifications()

  const headCells = [
    {
      id: 'rank',
    },
    {
      id: 'pilot',
      rewrite: (p) => p.name,
    },
    {
      id: 'score',
      numeric: true,
    }
  ]

  useEffect(() => {
  }, [])

  return (
    <CardContent>
      <Grid container spacing={7}>
        <Grid item xs={12} sm={12}>
          <EnhancedTable
            rows={run.flights}
            headCells={headCells}
            orderById='rank'
          />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TabFlights
