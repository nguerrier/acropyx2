// ** react
import { useState, useEffect } from 'react';

// ** nextjs
import { useRouter } from 'next/router'

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
import ResponsiveDatePicker from 'src/components/ResponsiveDatePicker'

const CompetitionPage = () => {
  // ** params
  const router = useRouter()
  const { code } = router.query

  // ** notification messages
  const [success, info, warning, error] = useNotifications()

  // ** auth/user
  const { user, authError, authIisLoading } = useUser();

  // ** local
  const [data, setData] = useState([])
  const [fullData, setFullData] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [newCompetition, setNewCompetition] = useState({})

  const loadCompetition = async () => {
    setLoading(true)

    const [err, data, headers] = await APIRequest(`/competitions/${code}`, {expect_json: true})

    if (err) {
        setData(false)
        setFullData(false)
        error(`Error while retrieving competitions list: ${err}`)
        return
    }

    data.delete = 'delete'
    data.update = 'update'
    data.id = data._id

    setData(data)
    setFullData(data)
    setLoading(false)
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
    loadCompetition()
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
    loadCompetition()
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
      id: 'runs',
      rewrite: (v, comp) => `${v.length} runs`,
    },
    {
      id: 'code',
    }
  ]

  useEffect(() => {
      if (!router.isReady) return
      loadCompetition()
  }, [router.isReady])

  if (isLoading || !router.isReady) {
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
        <Typography variant='h5'>{data.name}<RefreshIcon onClick={loadCompetition} /></Typography>
      </Grid>
{/*
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
                  <Grid item xs={6}>
                    <TextField
                      fullWidth name="name" label='Name' placeholder='Competition name' defaultValue={newCompetition.name ?? newCompetition.name}
                      onChange={(e) => {
                        newCompetition.name = e.target.value
                        setNewCompetition(newCompetition)
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth name="code" label='Code' placeholder='Code' defaultValue={newCompetition.code ?? newCompetition.code}
                      onChange={(e) => {
                        if (e.target.value.length > 0) {
                          newCompetition.code = e.target.value
                          setNewCompetition(newCompetition)
                        } else {
                          delete newCompetition.code
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Autocomplete
                      disablePortal
                      id="autocomplete-type"
                      options={['solo', 'synchro']}
                      defaultValue={newCompetition.type ?? ""}
                      renderInput={(params) => <TextField {...params} name="type" label="Type" />}
                      onChange={(e, v) => {
                        newCompetition.type = v
                        setNewCompetition(newCompetition)
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ResponsiveDatePicker
                      label="Start Date"
                      default={newCompetition.start_date ?? ""}
                      onChange={(v) => {
                        newCompetition.start_date = v
                        setNewCompetition(newCompetition)
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ResponsiveDatePicker
                      label="End Date"
                      default={newCompetition.end_date ?? ""}
                      onChange={(v) => {
                        console.log(v, typeof(v))
                        newCompetition.end_date = v
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
*/}
    </Grid>
  )
}

export default CompetitionPage
