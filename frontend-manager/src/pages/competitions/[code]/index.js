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
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [newCompetition, setNewCompetition] = useState({})

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
      </Grid>

    </Grid>
  )
}

export default CompetitionPage
