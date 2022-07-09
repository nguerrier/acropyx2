// ** React Imports
import { forwardRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import ListItemButton from '@mui/material/ListItemButton'

import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ImageIcon from '@mui/icons-material/Image'
import WorkIcon from '@mui/icons-material/Work'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Birth Date' fullWidth {...props} />
})

function createData(rank, teamName, pilots, score, tricks, finalMarks) {
  return { rank, teamName, pilots, score, tricks, finalMarks }
}

function TabPanel(props) {
  const { children, value, index, rows, handleBackButton, ...other } = props
  const [selectedPilotIndex, setSelectedPilotIndex] = useState(0)
  const [displayPilotResume, setDisplayPilotResume] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (router.query.p) {
      setSelectedPilotIndex(router.query.p)
      setDisplayPilotResume(true)
    } else {
      setSelectedPilotIndex(0)
      setDisplayPilotResume(false)
    }
  }, [router])

  const handlePilot = (event, index) => {
    if (rows[index].tricks) {
      setSelectedPilotIndex(index)
      setDisplayPilotResume(true)
      router.push(
        {
          query: { r: router.query.r, tab: router.query.tab, p: index, cid: router.query.cid }
        },
        undefined,
        { shallow: true }
      )
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const hiddenPilotResume = (event, index) => {
    setDisplayPilotResume(false)
    router.push(
      {
        query: { r: router.query.r, tab: router.query.tab, cid: router.query.cid }
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <TableContainer component={Paper} hidden={displayPilotResume}>
            <IconButton aria-label='delete' onClick={event => handleBackButton(event, 0)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography>{children}</Typography>
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell align='right'>Name</TableCell>
                  <TableCell align='right'>Pilots name</TableCell>
                  <TableCell align='right'>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    hover
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    onClick={event => handlePilot(event, index)}
                  >
                    <TableCell component='th' scope='row'>
                      {index + 1}
                    </TableCell>
                    <TableCell align='right'>{row.teamName}</TableCell>
                    <TableCell align='right'>{row.pilots.map((p,i)=>(
                      <div key="i">{p.name}</div>
                    ))}</TableCell>
                    <TableCell align='right'>{row.score.toLocaleString('en-US')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6} hidden={!displayPilotResume}>
              <IconButton aria-label='delete' onClick={event => hiddenPilotResume(event, 0)}>
                <ArrowBackIcon />
              </IconButton>
              <Typography>
                {children} - {rows[selectedPilotIndex].name}
              </Typography>
              <Typography variant='span' gutterBottom component='div'>
                Tricks:
              </Typography>
              <ol>
                {rows[selectedPilotIndex].tricks?.map((t, i) => (
                  <li key={i}>
                    {t.name
                      .split(' ')
                      .map(word => word[0].toUpperCase() + word.substring(1))
                      .join(' ')}
                  </li>
                ))}
              </ol>

              <Typography variant='span' gutterBottom component='div'>
                Final Marks:
              </Typography>
              <ul>
                <li>Technicity: {rows[selectedPilotIndex].finalMarks?.technicity}</li>
                <li>Bonus percentage: {rows[selectedPilotIndex].finalMarks?.bonus_percentage}</li>
                <li>Technical: {rows[selectedPilotIndex].finalMarks?.technical}</li>
                <li>Choreography: {rows[selectedPilotIndex].finalMarks?.choreography}</li>
                <li>Landing: {rows[selectedPilotIndex].finalMarks?.landing}</li>
                <li>Bonus: {rows[selectedPilotIndex].finalMarks?.bonus}</li>
                <li>Malus: {rows[selectedPilotIndex].finalMarks?.malus}</li>
                <li>Score: {rows[selectedPilotIndex].finalMarks?.score}</li>
                <li>
                  Warnings:
                  <ul>
                    {rows[selectedPilotIndex].finalMarks?.warnings.map((w, i) => (
                      <li key={i}>w</li>
                    ))}
                  </ul>
                </li>
              </ul>
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  )
}

const TabResults = ({ results }) => {
  // ** State
  const [date, setDate] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(1)
  const [value, setValue] = useState(-99)
  const router = useRouter()

  useEffect(() => {
    console.log('r:' + router.query.r)
    if (router.query.r) {
      setSelectedIndex(parseInt(router.query.r))
      setValue(parseInt(router.query.r))
    } else {
      setSelectedIndex(1)
      setValue(-99)
    }
  }, [router])

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
    setValue(index)
    console.log(value)
    router.push(
      {
        query: { r: index, tab: router.query.tab, cid: router.query.cid }
      },
      undefined,
      { shallow: true }
    )
  }

  const handleBackButton = (event, index) => {
    setValue(-99)
    router.push(
      {
        query: { tab: router.query.tab, cid: router.query.cid }
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box hidden={value == -99}></Box>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} hidden={value != -99}>
            <ListItemButton onClick={event => handleListItemClick(event, 0)}>
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Overall results' />
            </ListItemButton>
            {results.runs_results.map((rr, index) => (
              <ListItemButton key={index} onClick={event => handleListItemClick(event, index + 1)}>
                <ListItemAvatar>
                  <Avatar>
                    <WorkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={'Run ' + (index + 1) + ' results'} />
              </ListItemButton>
            ))}
          </List>
          <TabPanel
            rows={results.overall_results
              .sort((a, b) => b.score - a.score)
              .map((r, index) => createData(index, r.team.name, r.team.pilots, r.score))}
            index={0}
            value={value}
            handleBackButton={event => handleBackButton(event, 100)}
          >
            Overall results
          </TabPanel>
          {results.runs_results.map((rr, index) => (
            <TabPanel
              key={index + 1}
              rows={rr.results
                .sort((a, b) => b.final_marks.score - a.final_marks.score)
                .map((r, index) => createData(index, r.team.name, r.team.pilots, r.final_marks.score, r.tricks, r.final_marks))}
              index={index + 1}
              value={value}
              handleBackButton={event => handleBackButton(event, 100)}
            >
              Run {index + 1} results
            </TabPanel>
          ))}
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TabResults
