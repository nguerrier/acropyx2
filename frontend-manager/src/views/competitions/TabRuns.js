// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Avatar from '@mui/material/Avatar'

// ** local imports
import EnhancedTable from 'src/views/tables/EnhancedTable'


const TabRuns = ({comp}) => {
  // ** State
  const [runs, setRuns] = useState([])

  const headCells = [
    {
      id: 'name',
      type: 'LINK',
      href: (name, run) => {
        return `/runs/show?competition=${comp.code}&id=${run.id}`
      },
    },
    {
      id: 'state',
    }
  ]

  useEffect(() =>{
    setRuns(comp.runs.map((r,i) => {
      r.delete = 'delete'
      r.id = i
      r.name = `run${i}`
      return r
    }))
  }, [])

  return (
    <CardContent>
      <Grid container spacing={7}>
        <Grid item xs={6} sm={6}>
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => {}}>
            New Run
          </Button>
        </Grid>
        <Grid item xs={12} sm={12}>
          <EnhancedTable rows={runs} headCells={headCells} orderById='id' />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TabRuns
