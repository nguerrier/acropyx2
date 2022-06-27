// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import EnhancedTable from 'src/views/tables/EnhancedTable'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField'

// ** local imports
import {usePilots} from 'src/util/backend'

const TabPilots = ({pilots, update}) => {
  // ** State
  const [allPilots] = usePilots()
  const [value, setValue] = useState([])

  const removePilot = async(e) => {
    const id = e.target.dataset.id
    const name = allPilots.filter(p => p.id == id)[0].name
    if (!confirm(`Are you sure you want to remove pilot ${name} (${id}) ?`)) return
    update(pilots.filter(p => p.id != id))
  }

  const headCells = [
    {
      id: 'civlid',
      numeric: true,
    },
    {
      id: 'name',
    },
    {
      id: 'country',
    },
    {
      id: 'rank',
    },
    {
      id: 'link',
      type: 'LINK'
    },
    {
      id: 'delete',
      type: 'ACTION',
      func: removePilot,
    }
  ]

  useEffect(() =>{
    pilots = pilots.map(p => {
      p.delete = 'delete'
      p.id = p.id
      return p
    })
  }, [])

  return (
    <CardContent>
      <Grid container spacing={7}>
        <Grid item xs={6} sm={6}>
                    <Autocomplete
                      multiple
                      disablePortal
                      id="autocomplete-pilots"
                      options={allPilots.filter(p => pilots.filter(p2 => p2.id == p.id).length == 0)}
                      getOptionLabel={(p) => `${p.name} (${p.id})`}
                      value={value}
                      renderInput={(params) => <TextField {...params} name="pilots" label="Pilots" onKeyPress={(e) => {
                          e.key === 'Enter' && update(value.concat(pilots))
                      }}/>}
                      onChange={(e, v) => {
                        setValue(v)
                      }}
                    />
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => {
              update(value.concat(pilots))
          }}>
            Add pilot(s)
          </Button>
        </Grid>
        <Grid item xs={12} sm={12}>
          <EnhancedTable rows={pilots} headCells={headCells} orderById='rank' />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TabPilots
