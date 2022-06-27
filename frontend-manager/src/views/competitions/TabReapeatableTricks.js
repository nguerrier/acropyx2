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
import {useTricks} from 'src/util/backend'

const TabRepeatableTricks = ({tricks, update}) => {
  // ** State
  const [allTricks] = useTricks()
  const [value, setValue] = useState([])

  const removeRepeatableTrick = async(e) => {
    const id = e.target.dataset.id
    const name = allTricks.filter(j => j.id == id)[0].name
    if (!confirm(`Are you sure you want to remove repeatable_trick ${name} (${id}) ?`)) return
    update(tricks.filter(p => p.id != id))
  }

  const headCells = [
    {
      id: 'id',
    },
    {
      id: 'name',
    },
    {
      id: 'acronym',
    },
    {
      id: 'delete',
      type: 'ACTION',
      func: removeRepeatableTrick,
    }
  ]

  useEffect(() =>{
    tricks = tricks.map(p => {
      p.delete = 'delete'
      p.id = p._id
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
                      id="autocomplete-tricks"
                      options={allTricks.filter(p => tricks.filter(p2 => p2.name == p.name).length == 0)}
                      getOptionLabel={(p) => `${p.name}`}
                      value={value}
                      renderInput={(params) => <TextField {...params} name="tricks" label="Tricks" onKeyPress={(e) => {
                          e.key === 'Enter' && update(value.concat(tricks))
                      }}/>}
                      onChange={(e, v) => {
                        setValue(v)
                      }}
                    />
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => {
              update(value.concat(tricks))
          }}>
            Add repeatable_trick(s)
          </Button>
        </Grid>
        <Grid item xs={12} sm={12}>
          <EnhancedTable rows={tricks} headCells={headCells} orderById='technical_coefficient' />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TabRepeatableTricks
