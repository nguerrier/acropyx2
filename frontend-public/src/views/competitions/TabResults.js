// ** React Imports
import { forwardRef, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
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
import ListItemButton from '@mui/material/ListItemButton';

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

function TabPanel(props) {
  const { children, value, index, data, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
          <Typography>{data[0].score}</Typography>
        </Box>
      )}
    </div>
  );
}



const TabResults = ({ results }) => {
  // ** State
  const [date, setDate] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [displayList, setDisplayList] = useState(true);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setDisplayList(false)
  };

  const handleBackButton = (event, index) => {
    setDisplayList(true)
  };

  return (
    <CardContent>
      <form>
        <Grid container spacing={2}>
          <Box hidden={displayList}>
            <IconButton aria-label="delete" onClick={(event) => handleBackButton(event, 0)} >
              <DeleteIcon />
            </IconButton>
          </Box>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} hidden={!displayList}>
            <ListItemButton
              selected={selectedIndex === 0}
              onClick={(event) => handleListItemClick(event, 0)}
            >
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Overall" />
            </ListItemButton>
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
          <TabPanel hidden={displayList} data={results.overall_results}>
            Item Three
          </TabPanel>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabResults
