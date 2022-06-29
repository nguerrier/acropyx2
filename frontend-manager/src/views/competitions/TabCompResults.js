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

const TabResults = ({ code }) => {
  // ** notification messages
  const [success, info, warning, error] = useNotifications()

  // ** State
  const [results, setResults] = useState(false)

  const loadResults = async() => {

    const [err, retData, headers] = await APIRequest(`/competitions/${code}/results`, {
      expect_json: true
    })

    if (err) {
        error(`error while retrieving results for competition ${code}: ${err}`)
        setResults(false)
        return
    }

    retData.overall_results = retData.overall_results.map((r, i) => {
      r.rank = i+1
      return r
    })

    setResults(retData)
  }

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
    loadResults()
  }, [])

  if (!results) return('loading ...')


  return (
    <CardContent>
      <Typography varian="h2">
        { results.final ? 'Final' : 'Intermediate' } results
      </Typography>
      <Grid container spacing={7}>
        <Grid item xs={12} sm={12}>
          <EnhancedTable
            rows={results.overall_results}
            headCells={headCells}
            orderById='rank'
          />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TabResults
