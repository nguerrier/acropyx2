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
import Checkbox from '@mui/material/Checkbox'

// ** local
import EnhancedTable from 'src/views/tables/EnhancedTable'
import { useNotifications } from 'src/util/notifications'
import { APIRequest } from 'src/util/backend'

const TabResults = ({ code, rid }) => {
  // ** notification messages
  const [success, info, warning, error] = useNotifications()

  // ** State
  const [results, setResults] = useState(false)

  const loadResults = async() => {

    const [err, data, headers] = await APIRequest(`/competitions/${code}/results/${rid}?published_only=false`, {
      expect_json: true
    })

    if (err) {
        error(`error while retrieving results for competition ${code}: ${err}`)
        setResults(false)
        return
    }

    data.results = data.results.map((r, i) => {
      r.rank = i+1
      return r
    })

    setResults(data)
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
  console.log(results)


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
                  <TableCell>Tricks</TableCell>
                  <TableCell>Warnings</TableCell>
                  <TableCell>Technicity</TableCell>
                  <TableCell>Judges marks</TableCell>
                  <TableCell>Final marks</TableCell>
                  <TableCell>Bonus</TableCell>
                  <TableCell>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
{ results.results.sort((a,b) => b.final_marks.score-a.final_marks.score).map((r,rank) => {
  return(
                <TableRow key="result-{i}">
                  <TableCell>
                    {rank+1}
                  </TableCell>
                  <TableCell>{r.pilot.name}</TableCell>
                  <TableCell>
{r.tricks.map(t => {
    return(
        <p>{t.name}</p>
    )
})}
                  </TableCell>
                  <TableCell>
                    <p>warnings: {r.final_marks.warnings.length}</p>
                    <p>Malus: {r.final_marks.malus}%</p>
                    { r.did_not_start && <p>DID NOT START</p>}
                  </TableCell>
                  <TableCell>
                    <p>Techniciy: {r.final_marks.technicity}</p>
                    <p>Bonus: {r.final_marks.bonus_percentage}%</p>
                  </TableCell>
                  <TableCell>
                    <p>Technical: {r.final_marks.judges_mark.technical}</p>
                    <p>Choreography: {r.final_marks.judges_mark.choreography}</p>
                    <p>Landing: {r.final_marks.judges_mark.landing}</p>
{/* TODO
                    <p>Synchro: {r.final_marks.judges_mark.synchro}</p>
*/}
                  </TableCell>
                  <TableCell>
                    <p>Technical: {r.final_marks.technical}</p>
                    <p>Choreography: {r.final_marks.choreography}</p>
                    <p>Landing: {r.final_marks.landing}</p>
{/* TODO
                    <p>Synchro: {r.final_marks.synchro}</p>
*/}
                  </TableCell>
                  <TableCell>{r.final_marks.bonus}</TableCell>
                  <TableCell>{r.final_marks.score}</TableCell>
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
