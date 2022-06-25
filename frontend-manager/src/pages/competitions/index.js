// ** react
import { useState, useEffect } from 'react';

// ** nextjs
import Router from 'next/router'

// ** auth
import { withPageAuthRequired, useUser } from '@auth0/nextjs-auth0';

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import RefreshIcon from '@mui/icons-material/Refresh'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link'
import AddIcon from '@mui/icons-material/Add'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CardActions from '@mui/material/CardActions'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

// ** local
import EnhancedTable from 'src/views/tables/EnhancedTable'
import CardPilot from 'src/views/cards/CardPilot'
import { countryListAllIsoData } from 'src/util/countries'
import { useNotifications } from 'src/util/notifications'
import { APIRequest } from 'src/util/backend'
import modalStyle from 'src/configs/modalStyle'

const CompetitionsPage = () => {
  // ** notification messages
  const [success, info, warning, error] = useNotifications()

  // ** auth/user
  const { user, authError, authIisLoading } = useUser();

  // ** local
  const [data, setData] = useState([])
  const [fullData, setFullData] = useState([])
  const [pilots, setPilots] = useState([])
  const [Judges, setJudges] = useState([])
  const [Tricks, setTricks] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [newCompetition, setNewCompetition] = useState({})

  const loadCompetitions = async () => {
    setLoading(true)

    const [err, data, headers] = await APIRequest('/competitions', {expect_json: true})

    if (err) {
        setData(false)
        setFullData(false)
        error(`Error while retrieving competitions list: ${err}`)
        return
    }

    data = data.map(j => {
      j.delete = 'delete'
      j.update = 'update'
      j.id = j._id
      return j
    })

    setData(data)
    setFullData(data)
    setLoading(false)
  }

  const loadPilots = async () => {
    const [err, data, headers] = await APIRequest('/pilots', {expect_json: true})

    if (err) {
        setPilots([])
        error(`Error while retrieving judge levels: ${err}`)
        return
    }
    setPilots(data)
  }

  const loadJudges = async () => {
    const [err, data, headers] = await APIRequest('/judges', {expect_json: true})

    if (err) {
        setJudges([])
        error(`Error while retrieving judge levels: ${err}`)
        return
    }
    setJudges(data)
  }

  const loadTricks = async () => {
    const [err, data, headers] = await APIRequest('/tricks', {expect_json: true})

    if (err) {
        setTricks([])
        error(`Error while retrieving judge levels: ${err}`)
        return
    }
    setTricks(data)
  }


  const createOrUpdateCompetition = async(event) => {
    event.preventDefault()

    var route = '/competitions/new'
    var method = 'POST'
    var expected_status = 201

    if (newCompetition._id) {
      route = `/competitions/${newCompetition._id}`
      method = 'PUT'
      expected_status = 204
    }

    newCompetition.pilots = newCompetition.pilots ?? []
    newCompetition.pilots = newCompetition.pilots.map(p => p.civlid)

    const [err, data, headers] = await APIRequest(route, {
      expected_status: expected_status,
      method: method,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newCompetition),
    })

    if (err) {
        if (newCompetition._id) {
            error(`error while updating competition ${newCompetition._id}: ${err}`)
        } else {
            error(`error while creating new competition: ${err}`)
        }
        return
    }

    setModalOpen(false)
    loadCompetitions()
  }

  const deleteCompetition = async (e) => {
      const id = e.target.dataset.id
      if (!confirm(`Are you sure you want to delete Competition ${name} (${id}) ?`)) return

      setLoading(true)
    const [err, data, headers] = await APIRequest(`/competitions/${id}`, {method: "DELETE", expected_status: 204})
    if (err) {
      error(`Error while deleting Competition ${id}: ${err}`)
    } else {
      success(`Competition ${id} successfully deleted`)
    }
    loadCompetitions()
  }

  const openCreateModal = () => {
    setModalTitle('New competition')
    setNewCompetition({})
    setModalOpen(true)
  }

  const openUpdateModal = (e) => {
    const id = e.target.dataset.id
    const competition = data.find(j => j._id == id)
    setModalTitle(`Updating competition ${id}`)
    setNewCompetition(competition)
    setModalOpen(true)
  }

  const updateSearch = async(e) => {
    const s = e.target.value
    // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    // to compare ignoring accents
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const r = new RegExp(s, "i");
    const d = fullData.filter(competition => competition.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(r))
    setData(d)
    info(`${d.length} competitions filtered over ${fullData.length}`)
  }

  const headCells = [
    {
      id: 'name',
    },
    {
      id: 'type',
    },
    {
      id: 'start_date',
    },
    {
      id: 'end_date',
    },
    {
      id: 'pilots',
      rewrite: (v, comp) => comp.type == 'solo' ? `${v.length} pilots` : 'N/A',
    },
    {
      id: 'teams',
      rewrite: (v, comp) => comp.type == 'synchro' ? `${v.length} teams` : 'N/A',
    },
    {
      id: 'judges',
      rewrite: (v, comp) => `${v.length} judges`,
    },
    {
      id: 'runs',
      rewrite: (v, comp) => `${v.length} runs`,
    },
    {
      id: 'repeatable_tricks',
      rewrite: (v, comp) => `${v.length} repeatable tricks`,
    }
  ]

  useEffect(() => {
      loadCompetitions()
      loadPilots()
      loadJudges()
      loadTricks()
  }, [])

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <LinearProgress />
        Loading
      </Box>
    )
  }

  if (!data) {
    error("Empty or invalid data")
    return ''
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Competitions<RefreshIcon onClick={loadCompetitions} /></Typography>
      </Grid>
      <Grid item xs={4} sm={4}>
        <TextField fullWidth id='outlined-basic' label='Search competition' variant='outlined' onChange={updateSearch} />
      </Grid>
      <Grid item xs={8} sm={8} container>
        <Button
          variant='contained'
          onClick={openCreateModal}
          startIcon={<AddIcon />}
        >new competition</Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Card sx={modalStyle}>
            <form onSubmit={createOrUpdateCompetition}>
              <CardHeader
                title={modalTitle}
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth name="name" label='Name' placeholder='Competition name' defaultValue={newCompetition.name ?? Date.now()}
                      onChange={(e) => {
                        newCompetition.name = e.target.value
                        setNewCompetition(newCompetition)
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      openTo="day"
                      views={['year', 'month', 'day']}
                      value={newCompetition.start_date ?? ""}
                      onChange={v => {
                        newCompetition.start_date = v
                        setNewCompetition(newCompetition)
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      disablePortal
                      multiple
                      id="autocomplete-pilots"
                      options={pilots}
                      getOptionLabel={(p) => `${p.name} (${p.civlid})`}
                      defaultValue={pilots.filter(p => {
                          if (!newCompetition.pilots) return false
                          return newCompetition.pilots.find((p2) => p2.civlid == p.civlid)
                      })}
                      renderInput={(params) => <TextField {...params} name="pilots" label="Pilots" />}
                      onChange={(e, v) => {
                        newCompetition.pilots = v
                        setNewCompetition(newCompetition)
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                  Submit
                </Button>
                <Button size='large' color='secondary' variant='outlined' onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
              </CardActions>
            </form>
          </Card>
        </Modal>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <EnhancedTable rows={data} headCells={headCells} orderById='name' />
        </Card>
      </Grid>
    </Grid>
  )
}

export default CompetitionsPage
