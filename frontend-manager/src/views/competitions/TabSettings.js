// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const TabSettings = ({ competition }) => {
  // ** State
  const [date, setDate] = useState(null)

  return (
    <CardContent>
      <Grid container spacing={7}>
        <Grid item xs={12} sm={12} container>
          <form onSubmit={e => e.preventDefault()}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField fullWidth label='Name' placeholder='Lery Pose - French Championship' />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth type='date' label='Start' InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth type='date' label='End' InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <InputLabel id='demo-simple-select-label'>Type</InputLabel>
                  <Select labelId='demo-simple-select-label' id='demo-simple-select' label='Type'>
                    <MenuItem value={'solo'}>Solo</MenuItem>
                    <MenuItem value={'synchro'}>Synchro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                  Submit
                </Button>
                <Button size='large' color='secondary' variant='outlined'>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TabSettings
