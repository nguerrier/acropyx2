// ** React Imports
import { forwardRef, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import RadioGroup from '@mui/material/RadioGroup'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Birth Date' fullWidth {...props} />
})

const TabResults = () => {
  // ** State
  const [date, setDate] = useState(null)

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Overall" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <WorkIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Work" secondary="Jan 7, 2014" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <BeachAccessIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Vacation" secondary="July 20, 2014" />
            </ListItem>
          </List>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabResults
