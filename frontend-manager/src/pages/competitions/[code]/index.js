// ** react
import { useState, useEffect, useRef } from 'react';

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
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import Checkbox from '@mui/material/Checkbox';

// ** others
import Moment from 'react-moment'

// ** local
import EnhancedTable from 'src/views/tables/EnhancedTable'
import CardPilot from 'src/views/cards/CardPilot'
import { countryListAllIsoData } from 'src/util/countries'
import { useNotifications } from 'src/util/notifications'
import { APIRequest } from 'src/util/backend'
import modalStyle from 'src/configs/modalStyle'
import ResponsiveDatePicker from 'src/components/ResponsiveDatePicker'
import Editable from 'src/components/Editable'

// ** Tabs Imports
import TabRuns from 'src/views/competitions/TabRuns'
import TabTeams from 'src/views/competitions/TabTeams'
import TabPilots from 'src/views/competitions/TabPilots'
import TabJudges from 'src/views/competitions/TabJudges'
import TabConfig from 'src/views/competitions/TabConfig'
import TabResults from 'src/views/competitions/TabResults'
import TabReapeatableTricks from 'src/views/competitions/TabReapeatableTricks'


const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const CompetitionPage = () => {
  // ** params
  const router = useRouter()
  const { code } = router.query

  // ** notification messages
  const [success, info, warning, error] = useNotifications()

  // ** auth/user
  const { user, authError, authIisLoading } = useUser();

  // ** local
  const [data, setData] = useState({})
  const [tempData, setTempData] = useState({})
  const [isLoading, setLoading] = useState(false)
  const [tabContext, setTabContext] = useState('runs')

  // ** refs
  const nameRef = useRef()
  const codeRef = useRef()
  const startDateRef = useRef()
  const endDateRef = useRef()
  const locationRef = useRef()

  const loadCompetition = async () => {
    setLoading(true)

    const [err, data, headers] = await APIRequest(`/competitions/${code}`, {expect_json: true})

    if (err) {
        setData(false)
        setTempData(false)
        error(`Error while retrieving competitions list: ${err}`)
        return
    }

    data.delete = 'delete'
    data.update = 'update'
    data.id = data._id

    setData(data)
    setTempData(Object.assign({}, data)) // clone data before assigning it to tempData, otherwise they'll share the same object
    setLoading(false)
  }

  const updateCompetition = async(event) => {
    event.preventDefault()

    var route = `/competitions/${code}`
    var method = 'PATCH'
    var expected_status = 204

    const updatedCompetition = {
        name: tempData.name,
        code: tempData.code,
        start_date: tempData.start_date,
        end_date: tempData.end_date,
        location: tempData.location,
        published: tempData.published,
        type: tempData.type,
    }

    const [err, retData, headers] = await APIRequest(route, {
      expected_status: expected_status,
      method: method,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(updatedCompetition),
    })

    if (err) {
        error(`error while updating competition ${code}: ${err}`)
        return
    }

    if (tempData.code != data.code) return router.replace(`/competitions/${tempData.code}`)
    loadCompetition()
  }

  const setPilots = async(pilots) => {
    const [err, retData, headers] = await APIRequest(`/competitions/${code}/pilots`, {
        expected_status: 204,
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(pilots.map(p => p.civlid)),
    })

    if (err) {
      error(`error while updating pilots list ${code}: ${err}`)
      return
    }
    loadCompetition()
  }

  const setTeams = async(teams) => {
    const [err, retData, headers] = await APIRequest(`/competitions/${code}/teams`, {
        expected_status: 204,
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(teams.map(j => j.id)),
    })

    if (err) {
      error(`error while updating teams list ${code}: ${err}`)
      return
    }
    loadCompetition()
  }

  const setJudges = async(judges) => {
    const [err, retData, headers] = await APIRequest(`/competitions/${code}/judges`, {
        expected_status: 204,
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(judges.map(p => p.id)),
    })

    if (err) {
      error(`error while updating judges list ${code}: ${err}`)
      return
    }
    loadCompetition()
  }

  const setRepeatableTricks = async(tricks) => {
    const [err, retData, headers] = await APIRequest(`/competitions/${code}/repeatable_tricks`, {
        expected_status: 204,
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(tricks.map(t => t.id)),
    })

    if (err) {
      error(`error while updating repeatable tricks list ${code}: ${err}`)
      return
    }
    loadCompetition()
  }

  const setConfig = async(config) => {
    const [err, retData, headers] = await APIRequest(`/competitions/${code}/config`, {
        expected_status: 204,
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(config),
    })

    if (err) {
      error(`error while updating config ${code}: ${err}`)
      return
    }
    loadCompetition()
  }

/*
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
*/
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

  console.log(data)

  return (
    <Grid container spacing={6}>

      <Grid item xs={12}>
        <Typography variant='h5'>{data.name}<RefreshIcon onClick={loadCompetition} /></Typography>
      </Grid>

      <Grid item xs={12} md={6} sx={{ paddingBottom: 4 }}>
        <Typography>
          <Editable
            text={tempData.name}
            title="Name"
            onChange={updateCompetition}
            onCancel={(e) => {
              setTempData(data)
            }}
            childRef={nameRef}
          >
                    <TextField
                      fullWidth name="name" label='Name' placeholder='Name' defaultValue={tempData.name} inputProps={ {ref:nameRef} }
                      onChange={(e) => {
                        tempData.name = e.target.value
                        setTempData(tempData)
                      }}
                    />
          </Editable>
        </Typography>
        <Typography>
          <Editable
            text={tempData.code}
            title="Code"
            onChange={updateCompetition}
            onCancel={(e) => {
              setTempData(data)
            }}
            childRef={codeRef}
          >
                    <TextField
                      fullWidth name="code" label='Code' placeholder='Code' defaultValue={tempData.code} inputProps={ {ref:codeRef} }
                      onChange={(e) => {
                        tempData.code = e.target.value
                        setTempData(tempData)
                      }}
                    />
          </Editable>
        </Typography>
        <Typography>
          Status: <strong>{tempData.state}</strong>
        </Typography>
        <Typography>
          Type: <strong>{tempData.type}</strong>
        </Typography>
      </Grid>

      <Grid item xs={12} md={6} sx={{ paddingBottom: 4 }}>
        <Typography>
          <Editable
            text={tempData.start_date}
            title="Start date"
            onChange={updateCompetition}
            onCancel={(e) => {
              setTempData(data)
            }}
            childRef={startDateRef}
          >
            <TextField
              fullWidth name="start_date" label='Start date' placeholder='Start date' defaultValue={tempData.start_date} inputProps={ {ref:startDateRef} }
              onChange={(e) => {
                tempData.start_date = e.target.value
                setTempData(tempData)
              }}
            />
          </Editable>
        </Typography>
        <Typography>
          <Editable
            text={tempData.end_date}
            title="End date"
            onChange={updateCompetition}
            onCancel={(e) => {
              setTempData(data)
            }}
            childRef={endDateRef}
          >
            <TextField
              fullWidth name="end_date" label='End date' placeholder='End date' defaultValue={tempData.end_date} inputProps={ {ref:endDateRef} }
              onChange={(e) => {
                tempData.end_date = e.target.value
                setTempData(tempData)
              }}
            />
          </Editable>
        </Typography>

        <Typography>
          <Editable
            text={tempData.location}
            title="Location"
            onChange={updateCompetition}
            onCancel={(e) => {
              setTempData(data)
            }}
            childRef={locationRef}
          >
            <TextField
              fullWidth name="location" label='Location' placeholder='Location' defaultValue={tempData.location} inputProps={ {ref:locationRef} }
              onChange={(e) => {
                tempData.location = e.target.value
                setTempData(tempData)
              }}
            />
          </Editable>
        </Typography>

        <Typography>
          <section>
            <div>
              <span>
                Published: 
                <Checkbox checked={tempData.published} 
                  onChange={(e) => {
                    if (!confirm(`Are you sure to ${e.target.checked ? 'publish' : 'unpublish'} the competition ?`)) {
                        e.target.checked = !e.target.checked
                        return
                    }
                    tempData.published = e.target.checked
                    setTempData(tempData)
                    updateCompetition(e)
                }}/>
              </span>
            </div>
          </section>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <TabContext value={tabContext}>
            <TabList
              onChange={(e, v) => {setTabContext(v)}}
              aria-label='account-settings tabs'
              sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
            >
{ data.type == "solo" &&
              <Tab
                value='pilots'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountOutline />
                    <TabName>Pilots</TabName>
                  </Box>
                }
              />
}
{ data.type == "synchro" &&
              <Tab
                value='teams'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountOutline />
                    <TabName>Teams</TabName>
                  </Box>
                }
              />
}
              <Tab
                value='judges'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountOutline />
                    <TabName>Judges</TabName>
                  </Box>
                }
              />

              <Tab
                value='repeatable_tricks'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InformationOutline />
                    <TabName>Repeatables tricks</TabName>
                  </Box>
                }
              />
              <Tab
                value='settings'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InformationOutline />
                    <TabName>Competition Settings</TabName>
                  </Box>
                }
              />
              <Tab
                value='runs'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LockOpenOutline />
                    <TabName>Runs</TabName>
                  </Box>
                }
              />
              <Tab
                value='results'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InformationOutline />
                    <TabName>Results</TabName>
                  </Box>
                }
              />
            </TabList>

            <TabPanel sx={{ p: 0 }} value='pilots'>
              <TabPilots pilots={data.pilots} update={v => setPilots(v) } />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='teams'>
              <TabTeams teams={data.teams} update={v => setTeams(v) }/>
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='judges'>
              <TabJudges judges={data.judges} update={v => setJudges(v) }/>
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='repeatable_tricks'>
              <TabReapeatableTricks tricks={data.repeatable_tricks} update={v => setRepeatableTricks(v) }/>
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='settings'>
              <TabConfig config={data.config} update={v => setConfig(v) } type={data.type}/>
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='runs'>
{/*
              <TabRuns runs={data.runs} />
*/}
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='results'>
{/*
              <TabResults results={results} />
*/}
            </TabPanel>
          </TabContext>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CompetitionPage
