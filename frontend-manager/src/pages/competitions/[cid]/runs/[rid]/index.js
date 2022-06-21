// ** React Imports
import { useState } from 'react'
import { useRouter } from 'next/router'

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
import InformationOutline from 'mdi-material-ui/InformationOutline'

// ** Demo Tabs Imports
import TabPilots from 'src/views/runs/TabPilots'
import TabJudges from 'src/views/runs/TabJudges'
import TabTeams from 'src/views/runs/TabTeams'
import TabTricks from 'src/views/runs/TabReapeatableTricks'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

import { getCompetitions } from 'src/util/backend'

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

const Post = ({ data }) => {
  // ** State
  const [value, setValue] = useState('pilots')
  const router = useRouter()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  let rid = parseInt(router.query.rid)
  let runName = 'Run ' + rid
  let runState = data.runs[rid - 1].state

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Link underline='hover' color='inherit' href='/competitions'>
            All competitions
          </Link>
          <Link underline='hover' color='inherit' href={'/competitions/' + router.query.cid}>
            {data.name}
          </Link>
          <Typography color='text.primary'>{runName}</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12} sx={{ paddingBottom: 4 }}>
        <Typography variant='h5' sx={{ paddingBottom: 4 }}>
          {runName}
        </Typography>
        <Typography>
          Run Id: <strong>{rid}</strong>
        </Typography>
        <Typography>
          Status: <strong>{runState}</strong>
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
                value='pilots'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountOutline />
                    <TabName>Pilots</TabName>
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
                value='teams'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountOutline />
                    <TabName>Teams</TabName>
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
                value='flights'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InformationOutline />
                    <TabName>Flights</TabName>
                  </Box>
                }
              />
              <Tab
                value='settings'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InformationOutline />
                    <TabName>Run Settings</TabName>
                  </Box>
                }
              />
            </TabList>

            <TabPanel sx={{ p: 0 }} value='pilots'>
              <TabPilots pilots={data.pilots} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='judges'>
              <TabJudges judges={data.judges} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='teams'>
              <TabTeams teams={data.teams} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='repeatable_tricks'>
              <TabTricks tricks={data.repeatable_tricks} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='flights'>
              <TabJudges />
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

  // // TODO en attente du endpoint rest retournant un run par id
  // let data = competitions.runs[0]

  console.log(data.runs)

  // Pass data to the page via props
  return { props: { data } }
}

export default withPageAuthRequired(Post)
