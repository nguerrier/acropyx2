// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
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
// import TabInfo from 'src/views/account-settings/TabInfo'
import TabPilots from 'src/views/competitions/TabPilots'
import TabResults from 'src/views/competitions/TabResults'
// import TabAccount from 'src/views/account-settings/TabAccount'
// import TabSecurity from 'src/views/account-settings/TabSecurity'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'



import EnhancedTable from 'src/views/tables/EnhancedTable'
import { get } from 'src/util/backend'


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

const CompetitionsPage = ({ data }) => {

    const [value, setValue] = useState('competition')
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>Competitions</Typography>
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
                                value='account'
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AccountOutline />
                                        <TabName>Pilots</TabName>
                                    </Box>
                                }
                            />
                            <Tab
                                value='security'
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LockOpenOutline />
                                        <TabName>Judges</TabName>
                                    </Box>
                                }
                            />
                            <Tab
                                value='info'
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <InformationOutline />
                                        <TabName>Results</TabName>
                                    </Box>
                                }
                            />
                        </TabList>

                        <TabPanel sx={{ p: 0 }} value='account'>
                             { <TabPilots /> }
                            {/* <TabAccount /> */}
                        </TabPanel>
                        <TabPanel sx={{ p: 0 }} value='security'>
                            {/* <TabSecurity /> */}
                        </TabPanel>
                        <TabPanel sx={{ p: 0 }} value='info'>
                            { <TabResults /> }
                        </TabPanel>
                    </TabContext>
                </Card>
            </Grid>
        </Grid>
    )
}

// // This gets called on every request
// export async function getServerSideProps() {
//   let data = await get('competitions')

//   console.log(data[0])

//   // Pass data to the page via props
//   return { props: { data } }
// }

export default CompetitionsPage
