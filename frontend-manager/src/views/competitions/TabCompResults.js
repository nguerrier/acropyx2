// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'


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
          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Pilot</TableCell>
                  <TableCell>Runs</TableCell>
                  <TableCell>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
{ results.overall_results.map((r,rank) => {
  return(
                <TableRow key="result-{i}">
                  <TableCell>
                    {rank+1}
                  </TableCell>
                  <TableCell>{r.pilot.name}</TableCell>
                  <TableCell>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Ranking</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
{r.result_per_run.map((rr, rid) => {
  return(
          <TableRow>
            <TableCell>{rid+1}</TableCell>
            <TableCell>{rr.score}</TableCell>
            <TableCell>{rr.rank}</TableCell>
          </TableRow>
  )
})}
        </TableBody>
      </Table>

                  </TableCell>
                  <TableCell>{r.score}</TableCell>
                </TableRow>
 )
})}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TabResults
