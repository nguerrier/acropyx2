// ** React Imports
import { useState } from 'react'

// ** Auth0 Imports
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'

// ** Demo Tabs Imports
import TabRuns from 'src/views/competitions/TabRuns'
import TabTeams from 'src/views/competitions/TabTeams'
import TabPilots from 'src/views/competitions/TabPilots'
import TabJudges from 'src/views/competitions/TabJudges'
import TabSettings from 'src/views/competitions/TabSettings'
import TabResults from 'src/views/competitions/TabResults'
import TabReapeatableTricks from 'src/views/competitions/TabReapeatableTricks'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

import { getCompetitions, getCompetitionResults } from 'src/util/backend'

import Moment from 'react-moment'

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

const Post = ({ data, results }) => {
  // ** State
  const [value, setValue] = useState('runs')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Link underline='hover' color='inherit' href='/competitions'>
            All competitions
          </Link>
          <Typography color='text.primary'>{data.name}</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h5'>{data.name}</Typography>
      </Grid>
      <Grid item xs={12} md={6} sx={{ paddingBottom: 4 }}>
        <Typography>
          Competition Id: <strong>{data._id}</strong>
        </Typography>
        <Typography>
          Status: <strong>{data.state}</strong>
        </Typography>
        <Typography>
          Type: <strong>{data.type}</strong>
        </Typography>
        <Typography>
          Start date:{' '}
          <strong>
            <Moment date={data.start_date} format='DD/MM/YYYY' />
          </strong>
        </Typography>
        <Typography>
          End date:{' '}
          <strong>
            <Moment date={data.end_date} format='DD/MM/YYYY' />
          </strong>
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} sx={{ paddingBottom: 4 }}>
        <Typography>
          Warning: <strong>{data.config.warning}</strong>
        </Typography>
        <Typography>
          Malus Repetition: <strong>{data.config.malus_repetition}</strong>
        </Typography>
        <Typography>
          Warnings to dsq: <strong>{data.config.warnings_to_dsq}</strong>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              aria-label='account-settings tabs'
              sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
            >
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
                value='pilots'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountOutline />
                    <TabName>Pilots</TabName>
                  </Box>
                }
              />
              <Tab
                value='teams'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountOutline />
                    <TabName>Teams</TabName>
                  </Box>
                }
              />
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
                value='results'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InformationOutline />
                    <TabName>Results</TabName>
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
            </TabList>

            <TabPanel sx={{ p: 0 }} value='runs'>
              <TabRuns runs={data.runs} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='pilots'>
              <TabPilots pilots={data.pilots} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='teams'>
              <TabTeams teams={data.teams} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='judges'>
              <TabJudges judges={data.judges} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='repeatable_tricks'>
              <TabReapeatableTricks tricks={data.repeatable_tricks} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='settings'>
              <TabSettings competition={data} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='results'>
              <TabResults results={results} />
            </TabPanel>
          </TabContext>
        </Card>
      </Grid>
    </Grid>
  )
}

// This gets called on every request
export async function getServerSideProps({ params }) {
  let [status, data] = await getCompetitions(params.cid)
  let results = [] // await getCompetitionResults(params.cid)

  console.log(data)
  console.log(results)

  // Pass data to the page via props
  return { props: { data, results } }
}

export default withPageAuthRequired(Post)
