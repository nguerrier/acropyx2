// ** React Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

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
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import GavelIcon from '@mui/icons-material/Gavel'

// ** Demo Tabs Imports
// import TabInfo from 'src/views/account-settings/TabInfo'
import TabPilots from 'src/views/competitions/TabPilots'
import TabResults from 'src/views/competitions/TabResults'
import TabJudges from 'src/views/competitions/TabJudges'
import TabTeams from 'src/views/competitions/TabTeams'
import TabResultsTeam from 'src/views/competitions/TabResultsTeam'

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
  const router = useRouter()
  const [value, setValue] = useState('results')

  useEffect(() => {
    setValue(router.query.tab ? router.query.tab : 'results')
  }, [router]);

  const handleChange = (event, newValue) => {
    setValue(newValue)
    router.push(
      {
        query: { tab: newValue, cid: router.query.cid }
      },
      undefined,
      { shallow: true }
    )
  }

  let tabResults
  let tabPilots
  if (data.type != 'synchro') {
    tabResults = <TabResults results={data.results} />
    tabPilots = <TabPilots pilots={data.pilots} />
  } else {
    tabResults = <TabResultsTeam results={data.results} />
    tabPilots = <TabTeams teams={data.teams} />
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Competition - {data.name}</Typography>
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
                value='results'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormatListNumberedIcon />
                    <TabName>Results</TabName>
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
                value='judges'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <GavelIcon />
                    <TabName>Judges</TabName>
                  </Box>
                }
              />
            </TabList>

            <TabPanel sx={{ p: 0 }} value='pilots'>
              {tabPilots}
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='judges'>
              {<TabJudges judges={data.judges} />}
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='results'>
              {tabResults}
            </TabPanel>
          </TabContext>
        </Card>
      </Grid>
    </Grid>
  )
}

export async function getStaticPaths() {
  // Call an external API endpoint to get competitions
  let res = await get('public/competitions')

  // Get the paths we want to pre-render based on posts
  const paths = res.map((c) => ({
    params: { cid: c.code },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return {
    paths,

    //paths: [
    //  { params: { cid: 'leryposes-synchro-2022' } } // See the "paths" section below
    //],
    fallback: false
  }
}

// This gets called on every request
export async function getStaticProps({ params }) {
  let data = await get(`public/competitions/${params.cid}`)

  //let data = mockData

  // Pass data to the page via props
  return { props: { data }, revalidate: 10 }
}

const mockData = {
  "_id": "62c8b03014c542cd8abb365d",
  "name": "Lery-Poses Synchro 2022",
  "code": "leryposes-synchro-2022",
  "start_date": "2022-07-07",
  "end_date": "2022-07-10",
  "location": "Lery-Poses",
  "published": true,
  "type": "synchro",
  "pilots": [],
  "teams": [
    {
      "_id": "62c8af837537851f9a6c9efd",
      "name": "Team Espectacular",
      "pilots": [
        {
          "_id": 26069,
          "civlid": 26069,
          "name": "Théo De Blic",
          "link": "https://civlcomps.org/pilot/26069/ranking?discipline_id=5",
          "country": "fra",
          "about": "There is no public information at this time. Please, check back later.",
          "links": [],
          "sponsors": [],
          "photo": "https://civlcomps.org/uploads/images/profile/260/7fcd2025c420c2d6c459ee70dcb0b0da/695688d2f89e9f0b7983e0d94e5f2958.jpeg",
          "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
          "last_update": "2022-07-06T22:47:13.813370",
          "rank": 1
        },
        {
          "_id": 46598,
          "civlid": 46598,
          "name": "Bicho Carrera",
          "link": "https://civlcomps.org/pilot/46598/ranking?discipline_id=5",
          "country": "cze",
          "about": "There is no public information at this time. Please, check back later.",
          "links": [],
          "sponsors": [],
          "photo": "https://civlcomps.org/uploads/images/profile/465/dc992024787dbe0c471be1dc9a7973d5/aeaf24da98cfc57ee3c8d3021d0a665c.jpeg",
          "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
          "last_update": "2022-07-06T22:46:49.568258",
          "rank": 3
        }
      ]
    },
    {
      "_id": "62c8afa346543c6aec47dd29",
      "name": "Team Jerry",
      "pilots": [
        {
          "_id": 78953,
          "civlid": 78953,
          "name": "Maud Perrin",
          "link": "https://civlcomps.org/pilot/78953/ranking?discipline_id=5",
          "country": "fra",
          "about": "There is no public information at this time. Please, check back later.",
          "links": [],
          "sponsors": [],
          "photo": "https://civlcomps.org/uploads/images/profile/789/a5e5a6dd4232aae03d20f765877a2d22/aa2ae98574e1b3ad32a6f1e995a0d740.jpeg",
          "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
          "last_update": "2022-07-06T22:48:44.538600",
          "rank": 52
        },
        {
          "_id": 43845,
          "civlid": 43845,
          "name": "Maxime Casamayou",
          "link": "https://civlcomps.org/pilot/43845/ranking?discipline_id=5",
          "country": "fra",
          "about": "There is no public information at this time. Please, check back later.",
          "links": [],
          "sponsors": [],
          "photo": "https://civlcomps.org/uploads/images/profile/438/cb5f1a08d1ec4f9436cba33c6d916b27/6834be2b3c5dcd325849967f466ec6dc.jpg",
          "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
          "last_update": "2022-07-06T22:46:56.163746",
          "rank": 58
        }
      ]
    },
    {
      "_id": "62c8af547537851f9a6c9efb",
      "name": "Team Orgsofsquad",
      "pilots": [
        {
          "_id": 67619,
          "civlid": 67619,
          "name": "Luke de Weert",
          "link": "https://civlcomps.org/pilot/67619/ranking?discipline_id=5",
          "country": "nld",
          "about": "\"I am an athlete who believes that dedication is the core of the thing that keeps me pushing and motivating me to achieve all my goals, and even set new goals where I never thought it was possible.\"",
          "links": [
            {
              "name": "facebook",
              "link": "https://www.facebook.com/deweert.luke"
            },
            {
              "name": "instagram",
              "link": "https://www.instagram.com/luke_deweert/"
            },
            {
              "name": "twitter",
              "link": "https://twitter.com/luke_deweert"
            },
            {
              "name": "youtube",
              "link": "https://www.youtube.com/lukedeweert"
            },
            {
              "name": "Website",
              "link": "https://lukedeweert.nl"
            },
            {
              "name": "Tiktok",
              "link": "https://www.tiktok.com/@lukedeweert"
            }
          ],
          "sponsors": [
            {
              "name": "Sky Paragliders",
              "link": "https://sky-cz.com/en",
              "img": "https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/4cbe1ebac175a9cde7a4c9d8769ba0c4/509e4e83c097d02828403b5a67e8c0b5.png"
            },
            {
              "name": "Sinner",
              "link": "https://www.sinner.eu/nl/",
              "img": "https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/dddccfa819ee01d9b2410ba49fa432fc/eeff42d05ffefb8ef945dc83485007ea.png"
            },
            {
              "name": "Wanbound",
              "link": "https://www.wanbound.com/",
              "img": "https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/aa675f347b7d7933332df96f08b21199/4ff22ae0404446f203ba682751e1e7b8.png"
            },
            {
              "name": "KNVvL",
              "link": "https://www.knvvl.nl/",
              "img": "https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/53ee05f2c2172541b7f1dd99e67a59f9/0f68789e476c0494019a750a6da9c6aa.png"
            }
          ],
          "photo": "https://civlcomps.org/uploads/images/profile/676/7bdecbee5d2246b1ebc14248dc1af935/8bfbe7e62a481a19145c55c9dc97e6ab.jpeg",
          "background_picture": "https://civlcomps.org/uploads/images/pilot_header/9/c017697641aa9ef817c4c17728e9e6d6/08788da048eea61f93be8591e97f6a0c.jpg",
          "last_update": "2022-07-06T22:47:20.705999",
          "rank": 2
        },
        {
          "_id": 30294,
          "civlid": 30294,
          "name": "Lukas Neu",
          "link": "https://civlcomps.org/pilot/30294/ranking?discipline_id=5",
          "country": "deu",
          "about": "There is no public information at this time. Please, check back later.",
          "links": [],
          "sponsors": [],
          "photo": "https://civlcomps.org/images/default-images/user/man.svg",
          "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
          "last_update": "2022-07-06T22:48:30.512523",
          "rank": 6
        }
      ]
    },
    {
      "_id": "62c8af3846543c6aec47dd28",
      "name": "U-turn Acro team",
      "pilots": [
        {
          "_id": 23654,
          "civlid": 23654,
          "name": "Cesar Arevalo Urrego",
          "link": "https://civlcomps.org/pilot/23654/ranking?discipline_id=5",
          "country": "col",
          "about": "There is no public information at this time. Please, check back later.",
          "links": [],
          "sponsors": [],
          "photo": "https://civlcomps.org/uploads/images/profile/236/66458ac5a311c78bf3be4e9ffe87507a/b2fc26ebca72c35fcc91164354efef26.jpeg",
          "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
          "last_update": "2022-07-06T22:46:04.094115",
          "rank": 7
        },
        {
          "_id": 23150,
          "civlid": 23150,
          "name": "Andrés Villamizar",
          "link": "https://civlcomps.org/pilot/23150/ranking?discipline_id=5",
          "country": "col",
          "about": "There is no public information at this time. Please, check back later.",
          "links": [
            {
              "name": "instagram",
              "link": "https://www.instagram.com/acroandres/?hl=en"
            },
            {
              "name": "facebook",
              "link": "https://www.facebook.com/acroandres"
            }
          ],
          "sponsors": [],
          "photo": "https://civlcomps.org/uploads/images/profile/231/3cf3e1ce9c914794f7e55d4ab0ad7572/401c84376171a0936b19d1a5f1d5b50f.jpeg",
          "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
          "last_update": "2022-07-06T22:49:09.502643",
          "rank": 5
        }
      ]
    },
    {
      "_id": "62c8af6b7537851f9a6c9efc",
      "name": "the french teuch  team",
      "pilots": [
        {
          "_id": 64202,
          "civlid": 64202,
          "name": "Juliette Liso-y-Claret",
          "link": "https://civlcomps.org/pilot/64202/ranking?discipline_id=5",
          "country": "fra",
          "about": "There is no public information at this time. Please, check back later.",
          "links": [],
          "sponsors": [],
          "photo": "https://civlcomps.org/images/default-images/user/woman.svg",
          "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
          "last_update": "2022-07-06T22:48:22.638086",
          "rank": 49
        },
        {
          "_id": 61707,
          "civlid": 61707,
          "name": "leconte carole",
          "link": "https://civlcomps.org/pilot/61707/ranking?discipline_id=5",
          "country": "fra",
          "about": "There is no public information at this time. Please, check back later.",
          "links": [],
          "sponsors": [],
          "photo": "https://civlcomps.org/images/default-images/user/woman.svg",
          "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
          "last_update": "2022-07-06T22:48:14.019649",
          "rank": 9999
        }
      ]
    }
  ],
  "judges": [
    {
      "_id": "629d5ebd91f562bf6c1c5135",
      "name": "Julien Grosse",
      "country": "fra",
      "level": "certified",
      "civlid": 79290,
      "deleted": null
    },
    {
      "_id": "629d6edec798c87a2b45a5ad",
      "name": "Alexandra Grillmayer",
      "country": "hun",
      "level": "senior",
      "civlid": 11601,
      "deleted": null
    },
    {
      "_id": "629cfff354e27dc8592dd69c",
      "name": "Jerome Loyet",
      "country": "fra",
      "level": "senior",
      "civlid": 33732,
      "deleted": null
    }
  ],
  "state": "open",
  "results": {
    "final": false,
    "type": "synchro",
    "overall_results": [
      {
        "pilot": null,
        "team": {
          "_id": "62c8af547537851f9a6c9efb",
          "name": "Team Orgsofsquad",
          "pilots": [
            {
              "_id": 67619,
              "civlid": 67619,
              "name": "Luke de Weert",
              "link": "https://civlcomps.org/pilot/67619/ranking?discipline_id=5",
              "country": "nld",
              "about": "\"I am an athlete who believes that dedication is the core of the thing that keeps me pushing and motivating me to achieve all my goals, and even set new goals where I never thought it was possible.\"",
              "links": [
                {
                  "name": "facebook",
                  "link": "https://www.facebook.com/deweert.luke"
                },
                {
                  "name": "instagram",
                  "link": "https://www.instagram.com/luke_deweert/"
                },
                {
                  "name": "twitter",
                  "link": "https://twitter.com/luke_deweert"
                },
                {
                  "name": "youtube",
                  "link": "https://www.youtube.com/lukedeweert"
                },
                {
                  "name": "Website",
                  "link": "https://lukedeweert.nl"
                },
                {
                  "name": "Tiktok",
                  "link": "https://www.tiktok.com/@lukedeweert"
                }
              ],
              "sponsors": [
                {
                  "name": "Sky Paragliders",
                  "link": "https://sky-cz.com/en",
                  "img": "https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/4cbe1ebac175a9cde7a4c9d8769ba0c4/509e4e83c097d02828403b5a67e8c0b5.png"
                },
                {
                  "name": "Sinner",
                  "link": "https://www.sinner.eu/nl/",
                  "img": "https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/dddccfa819ee01d9b2410ba49fa432fc/eeff42d05ffefb8ef945dc83485007ea.png"
                },
                {
                  "name": "Wanbound",
                  "link": "https://www.wanbound.com/",
                  "img": "https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/aa675f347b7d7933332df96f08b21199/4ff22ae0404446f203ba682751e1e7b8.png"
                },
                {
                  "name": "KNVvL",
                  "link": "https://www.knvvl.nl/",
                  "img": "https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/53ee05f2c2172541b7f1dd99e67a59f9/0f68789e476c0494019a750a6da9c6aa.png"
                }
              ],
              "photo": "https://civlcomps.org/uploads/images/profile/676/7bdecbee5d2246b1ebc14248dc1af935/8bfbe7e62a481a19145c55c9dc97e6ab.jpeg",
              "background_picture": "https://civlcomps.org/uploads/images/pilot_header/9/c017697641aa9ef817c4c17728e9e6d6/08788da048eea61f93be8591e97f6a0c.jpg",
              "last_update": "2022-07-06T22:47:20.705999",
              "rank": 2
            },
            {
              "_id": 30294,
              "civlid": 30294,
              "name": "Lukas Neu",
              "link": "https://civlcomps.org/pilot/30294/ranking?discipline_id=5",
              "country": "deu",
              "about": "There is no public information at this time. Please, check back later.",
              "links": [],
              "sponsors": [],
              "photo": "https://civlcomps.org/images/default-images/user/man.svg",
              "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
              "last_update": "2022-07-06T22:48:30.512523",
              "rank": 6
            }
          ]
        },
        "result_per_run": [
          {
            "rank": 1,
            "score": 7.792
          }
        ],
        "score": 7.792
      },
      {
        "pilot": null,
        "team": {
          "_id": "62c8af837537851f9a6c9efd",
          "name": "Team Espectacular",
          "pilots": [
            {
              "_id": 26069,
              "civlid": 26069,
              "name": "Théo De Blic",
              "link": "https://civlcomps.org/pilot/26069/ranking?discipline_id=5",
              "country": "fra",
              "about": "There is no public information at this time. Please, check back later.",
              "links": [],
              "sponsors": [],
              "photo": "https://civlcomps.org/uploads/images/profile/260/7fcd2025c420c2d6c459ee70dcb0b0da/695688d2f89e9f0b7983e0d94e5f2958.jpeg",
              "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
              "last_update": "2022-07-06T22:47:13.813370",
              "rank": 1
            },
            {
              "_id": 46598,
              "civlid": 46598,
              "name": "Bicho Carrera",
              "link": "https://civlcomps.org/pilot/46598/ranking?discipline_id=5",
              "country": "cze",
              "about": "There is no public information at this time. Please, check back later.",
              "links": [],
              "sponsors": [],
              "photo": "https://civlcomps.org/uploads/images/profile/465/dc992024787dbe0c471be1dc9a7973d5/aeaf24da98cfc57ee3c8d3021d0a665c.jpeg",
              "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
              "last_update": "2022-07-06T22:46:49.568258",
              "rank": 3
            }
          ]
        },
        "result_per_run": [
          {
            "rank": 2,
            "score": 7.735
          }
        ],
        "score": 7.735
      },
      {
        "pilot": null,
        "team": {
          "_id": "62c8afa346543c6aec47dd29",
          "name": "Team Jerry",
          "pilots": [
            {
              "_id": 78953,
              "civlid": 78953,
              "name": "Maud Perrin",
              "link": "https://civlcomps.org/pilot/78953/ranking?discipline_id=5",
              "country": "fra",
              "about": "There is no public information at this time. Please, check back later.",
              "links": [],
              "sponsors": [],
              "photo": "https://civlcomps.org/uploads/images/profile/789/a5e5a6dd4232aae03d20f765877a2d22/aa2ae98574e1b3ad32a6f1e995a0d740.jpeg",
              "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
              "last_update": "2022-07-06T22:48:44.538600",
              "rank": 52
            },
            {
              "_id": 43845,
              "civlid": 43845,
              "name": "Maxime Casamayou",
              "link": "https://civlcomps.org/pilot/43845/ranking?discipline_id=5",
              "country": "fra",
              "about": "There is no public information at this time. Please, check back later.",
              "links": [],
              "sponsors": [],
              "photo": "https://civlcomps.org/uploads/images/profile/438/cb5f1a08d1ec4f9436cba33c6d916b27/6834be2b3c5dcd325849967f466ec6dc.jpg",
              "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
              "last_update": "2022-07-06T22:46:56.163746",
              "rank": 58
            }
          ]
        },
        "result_per_run": [
          {
            "rank": 3,
            "score": 5.248
          }
        ],
        "score": 5.248
      },
      {
        "pilot": null,
        "team": {
          "_id": "62c8af3846543c6aec47dd28",
          "name": "U-turn Acro team",
          "pilots": [
            {
              "_id": 23654,
              "civlid": 23654,
              "name": "Cesar Arevalo Urrego",
              "link": "https://civlcomps.org/pilot/23654/ranking?discipline_id=5",
              "country": "col",
              "about": "There is no public information at this time. Please, check back later.",
              "links": [],
              "sponsors": [],
              "photo": "https://civlcomps.org/uploads/images/profile/236/66458ac5a311c78bf3be4e9ffe87507a/b2fc26ebca72c35fcc91164354efef26.jpeg",
              "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
              "last_update": "2022-07-06T22:46:04.094115",
              "rank": 7
            },
            {
              "_id": 23150,
              "civlid": 23150,
              "name": "Andrés Villamizar",
              "link": "https://civlcomps.org/pilot/23150/ranking?discipline_id=5",
              "country": "col",
              "about": "There is no public information at this time. Please, check back later.",
              "links": [
                {
                  "name": "instagram",
                  "link": "https://www.instagram.com/acroandres/?hl=en"
                },
                {
                  "name": "facebook",
                  "link": "https://www.facebook.com/acroandres"
                }
              ],
              "sponsors": [],
              "photo": "https://civlcomps.org/uploads/images/profile/231/3cf3e1ce9c914794f7e55d4ab0ad7572/401c84376171a0936b19d1a5f1d5b50f.jpeg",
              "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
              "last_update": "2022-07-06T22:49:09.502643",
              "rank": 5
            }
          ]
        },
        "result_per_run": [
          {
            "rank": 4,
            "score": 5.167
          }
        ],
        "score": 5.167
      },
      {
        "pilot": null,
        "team": {
          "_id": "62c8af6b7537851f9a6c9efc",
          "name": "the french teuch  team",
          "pilots": [
            {
              "_id": 64202,
              "civlid": 64202,
              "name": "Juliette Liso-y-Claret",
              "link": "https://civlcomps.org/pilot/64202/ranking?discipline_id=5",
              "country": "fra",
              "about": "There is no public information at this time. Please, check back later.",
              "links": [],
              "sponsors": [],
              "photo": "https://civlcomps.org/images/default-images/user/woman.svg",
              "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
              "last_update": "2022-07-06T22:48:22.638086",
              "rank": 49
            },
            {
              "_id": 61707,
              "civlid": 61707,
              "name": "leconte carole",
              "link": "https://civlcomps.org/pilot/61707/ranking?discipline_id=5",
              "country": "fra",
              "about": "There is no public information at this time. Please, check back later.",
              "links": [],
              "sponsors": [],
              "photo": "https://civlcomps.org/images/default-images/user/woman.svg",
              "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
              "last_update": "2022-07-06T22:48:14.019649",
              "rank": 9999
            }
          ]
        },
        "result_per_run": [
          {
            "rank": 5,
            "score": 2.846
          },
          {
            "rank": 1,
            "score": 2.309
          }
        ],
        "score": 5.155
      }
    ],
    "runs_results": [
      {
        "final": true,
        "type": "synchro",
        "results": [
          {
            "pilot": null,
            "team": {
              "_id": "62c8af6b7537851f9a6c9efc",
              "name": "the french teuch  team",
              "pilots": [
                {
                  "_id": 64202,
                  "civlid": 64202,
                  "name": "Juliette Liso-y-Claret",
                  "link": "https://civlcomps.org/pilot/64202/ranking?discipline_id=5",
                  "country": "fra",
                  "about": "There is no public information at this time. Please, check back later.",
                  "links": [],
                  "sponsors": [],
                  "photo": "https://civlcomps.org/images/default-images/user/woman.svg",
                  "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
                  "last_update": "2022-07-06T22:48:22.638086",
                  "rank": 49
                },
                {
                  "_id": 61707,
                  "civlid": 61707,
                  "name": "leconte carole",
                  "link": "https://civlcomps.org/pilot/61707/ranking?discipline_id=5",
                  "country": "fra",
                  "about": "There is no public information at this time. Please, check back later.",
                  "links": [],
                  "sponsors": [],
                  "photo": "https://civlcomps.org/images/default-images/user/woman.svg",
                  "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
                  "last_update": "2022-07-06T22:48:14.019649",
                  "rank": 9999
                }
              ]
            },
            "tricks": [
              {
                "name": "right Infinity Tumbling",
                "acronym": "RI",
                "technical_coefficient": 1.85,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Infinity Tumbling",
                "uniqueness": [
                  "right"
                ]
              },
              {
                "name": "Full Stall",
                "acronym": "FS",
                "technical_coefficient": 1,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Full Stall",
                "uniqueness": []
              },
              {
                "name": "right Synchro Spiral",
                "acronym": "RS36",
                "technical_coefficient": 1.8,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Synchro Spiral",
                "uniqueness": [
                  "right"
                ]
              }
            ],
            "marks": [],
            "did_not_start": false,
            "final_marks": {
              "judges_mark": {
                "judge": null,
                "technical": 4.333,
                "choreography": 1.833,
                "landing": 2.833,
                "synchro": 3.5
              },
              "technicity": 1.55,
              "bonus_percentage": 0,
              "technical": 1.679,
              "choreography": 0.458,
              "landing": 0.708,
              "synchro": 0.875,
              "bonus": 0,
              "score": 2.846,
              "warnings": [],
              "malus": 0,
              "notes": []
            },
            "published": true,
            "warnings": []
          },
          {
            "pilot": null,
            "team": {
              "_id": "62c8af3846543c6aec47dd28",
              "name": "U-turn Acro team",
              "pilots": [
                {
                  "_id": 23654,
                  "civlid": 23654,
                  "name": "Cesar Arevalo Urrego",
                  "link": "https://civlcomps.org/pilot/23654/ranking?discipline_id=5",
                  "country": "col",
                  "about": "There is no public information at this time. Please, check back later.",
                  "links": [],
                  "sponsors": [],
                  "photo": "https://civlcomps.org/uploads/images/profile/236/66458ac5a311c78bf3be4e9ffe87507a/b2fc26ebca72c35fcc91164354efef26.jpeg",
                  "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
                  "last_update": "2022-07-06T22:46:04.094115",
                  "rank": 7
                },
                {
                  "_id": 23150,
                  "civlid": 23150,
                  "name": "Andrés Villamizar",
                  "link": "https://civlcomps.org/pilot/23150/ranking?discipline_id=5",
                  "country": "col",
                  "about": "There is no public information at this time. Please, check back later.",
                  "links": [
                    {
                      "name": "instagram",
                      "link": "https://www.instagram.com/acroandres/?hl=en"
                    },
                    {
                      "name": "facebook",
                      "link": "https://www.facebook.com/acroandres"
                    }
                  ],
                  "sponsors": [],
                  "photo": "https://civlcomps.org/uploads/images/profile/231/3cf3e1ce9c914794f7e55d4ab0ad7572/401c84376171a0936b19d1a5f1d5b50f.jpeg",
                  "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
                  "last_update": "2022-07-06T22:49:09.502643",
                  "rank": 5
                }
              ]
            },
            "tricks": [
              {
                "name": "right Bitch Switch",
                "acronym": "RBS",
                "technical_coefficient": 1.75,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Bitch Switch",
                "uniqueness": [
                  "right"
                ]
              },
              {
                "name": "right Joker",
                "acronym": "RJ",
                "technical_coefficient": 1.95,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Joker",
                "uniqueness": [
                  "right"
                ]
              }
            ],
            "marks": [],
            "did_not_start": false,
            "final_marks": {
              "judges_mark": {
                "judge": null,
                "technical": 6.667,
                "choreography": 5.833,
                "landing": 2.5,
                "synchro": 6.333
              },
              "technicity": 1.85,
              "bonus_percentage": 0,
              "technical": 3.083,
              "choreography": 1.458,
              "landing": 0.625,
              "synchro": 1.583,
              "bonus": 0,
              "score": 5.167,
              "warnings": [],
              "malus": 0,
              "notes": []
            },
            "published": true,
            "warnings": []
          },
          {
            "pilot": null,
            "team": {
              "_id": "62c8afa346543c6aec47dd29",
              "name": "Team Jerry",
              "pilots": [
                {
                  "_id": 78953,
                  "civlid": 78953,
                  "name": "Maud Perrin",
                  "link": "https://civlcomps.org/pilot/78953/ranking?discipline_id=5",
                  "country": "fra",
                  "about": "There is no public information at this time. Please, check back later.",
                  "links": [],
                  "sponsors": [],
                  "photo": "https://civlcomps.org/uploads/images/profile/789/a5e5a6dd4232aae03d20f765877a2d22/aa2ae98574e1b3ad32a6f1e995a0d740.jpeg",
                  "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
                  "last_update": "2022-07-06T22:48:44.538600",
                  "rank": 52
                },
                {
                  "_id": 43845,
                  "civlid": 43845,
                  "name": "Maxime Casamayou",
                  "link": "https://civlcomps.org/pilot/43845/ranking?discipline_id=5",
                  "country": "fra",
                  "about": "There is no public information at this time. Please, check back later.",
                  "links": [],
                  "sponsors": [],
                  "photo": "https://civlcomps.org/uploads/images/profile/438/cb5f1a08d1ec4f9436cba33c6d916b27/6834be2b3c5dcd325849967f466ec6dc.jpg",
                  "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
                  "last_update": "2022-07-06T22:46:56.163746",
                  "rank": 58
                }
              ]
            },
            "tricks": [
              {
                "name": "right Corkscrew reverse",
                "acronym": "RKR",
                "technical_coefficient": 1.9,
                "bonus": 4,
                "bonus_types": [
                  "reverse"
                ],
                "base_trick": "Corkscrew",
                "uniqueness": [
                  "reverse",
                  "right"
                ]
              },
              {
                "name": "left Helicopter to SAT",
                "acronym": "LHS",
                "technical_coefficient": 1.85,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Helicopter to SAT",
                "uniqueness": [
                  "left"
                ]
              },
              {
                "name": "left Mac Twist to Helicopter reverse",
                "acronym": "LMCHR",
                "technical_coefficient": 1.85,
                "bonus": 3.5,
                "bonus_types": [
                  "reverse"
                ],
                "base_trick": "Mac Twist to Helicopter",
                "uniqueness": [
                  "reverse",
                  "left"
                ]
              }
            ],
            "marks": [],
            "did_not_start": false,
            "final_marks": {
              "judges_mark": {
                "judge": null,
                "technical": 6.5,
                "choreography": 6,
                "landing": 1.5,
                "synchro": 6.5
              },
              "technicity": 1.867,
              "bonus_percentage": 7.5,
              "technical": 3.033,
              "choreography": 1.5,
              "landing": 0.375,
              "synchro": 1.625,
              "bonus": 0.34,
              "score": 5.248,
              "warnings": [],
              "malus": 0,
              "notes": []
            },
            "published": true,
            "warnings": []
          },
          {
            "pilot": null,
            "team": {
              "_id": "62c8af837537851f9a6c9efd",
              "name": "Team Espectacular",
              "pilots": [
                {
                  "_id": 26069,
                  "civlid": 26069,
                  "name": "Théo De Blic",
                  "link": "https://civlcomps.org/pilot/26069/ranking?discipline_id=5",
                  "country": "fra",
                  "about": "There is no public information at this time. Please, check back later.",
                  "links": [],
                  "sponsors": [],
                  "photo": "https://civlcomps.org/uploads/images/profile/260/7fcd2025c420c2d6c459ee70dcb0b0da/695688d2f89e9f0b7983e0d94e5f2958.jpeg",
                  "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
                  "last_update": "2022-07-06T22:47:13.813370",
                  "rank": 1
                },
                {
                  "_id": 46598,
                  "civlid": 46598,
                  "name": "Bicho Carrera",
                  "link": "https://civlcomps.org/pilot/46598/ranking?discipline_id=5",
                  "country": "cze",
                  "about": "There is no public information at this time. Please, check back later.",
                  "links": [],
                  "sponsors": [],
                  "photo": "https://civlcomps.org/uploads/images/profile/465/dc992024787dbe0c471be1dc9a7973d5/aeaf24da98cfc57ee3c8d3021d0a665c.jpeg",
                  "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
                  "last_update": "2022-07-06T22:46:49.568258",
                  "rank": 3
                }
              ]
            },
            "tricks": [
              {
                "name": "right Tumbling",
                "acronym": "RT",
                "technical_coefficient": 1.8,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Tumbling",
                "uniqueness": [
                  "right"
                ]
              },
              {
                "name": "twisted right Mac Twist to Helicopter reverse",
                "acronym": "/RMCHR",
                "technical_coefficient": 1.85,
                "bonus": 8,
                "bonus_types": [
                  "twist",
                  "reverse"
                ],
                "base_trick": "Mac Twist to Helicopter",
                "uniqueness": [
                  "reverse",
                  "right"
                ]
              },
              {
                "name": "right Corkscrew reverse",
                "acronym": "RKR",
                "technical_coefficient": 1.9,
                "bonus": 4,
                "bonus_types": [
                  "reverse"
                ],
                "base_trick": "Corkscrew",
                "uniqueness": [
                  "reverse",
                  "right"
                ]
              },
              {
                "name": "right Synchro Spiral",
                "acronym": "RS36",
                "technical_coefficient": 1.8,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Synchro Spiral",
                "uniqueness": [
                  "right"
                ]
              }
            ],
            "marks": [],
            "did_not_start": false,
            "final_marks": {
              "judges_mark": {
                "judge": null,
                "technical": 8.333,
                "choreography": 7,
                "landing": 5.833,
                "synchro": 8
              },
              "technicity": 1.85,
              "bonus_percentage": 12,
              "technical": 3.854,
              "choreography": 1.75,
              "landing": 1.458,
              "synchro": 2,
              "bonus": 0.672,
              "score": 7.735,
              "warnings": [],
              "malus": 0,
              "notes": []
            },
            "published": true,
            "warnings": []
          },
          {
            "pilot": null,
            "team": {
              "_id": "62c8af547537851f9a6c9efb",
              "name": "Team Orgsofsquad",
              "pilots": [
                {
                  "_id": 67619,
                  "civlid": 67619,
                  "name": "Luke de Weert",
                  "link": "https://civlcomps.org/pilot/67619/ranking?discipline_id=5",
                  "country": "nld",
                  "about": "\"I am an athlete who believes that dedication is the core of the thing that keeps me pushing and motivating me to achieve all my goals, and even set new goals where I never thought it was possible.\"",
                  "links": [
                    {
                      "name": "facebook",
                      "link": "https://www.facebook.com/deweert.luke"
                    },
                    {
                      "name": "instagram",
                      "link": "https://www.instagram.com/luke_deweert/"
                    },
                    {
                      "name": "twitter",
                      "link": "https://twitter.com/luke_deweert"
                    },
                    {
                      "name": "youtube",
                      "link": "https://www.youtube.com/lukedeweert"
                    },
                    {
                      "name": "Website",
                      "link": "https://lukedeweert.nl"
                    },
                    {
                      "name": "Tiktok",
                      "link": "https://www.tiktok.com/@lukedeweert"
                    }
                  ],
                  "sponsors": [
                    {
                      "name": "Sky Paragliders",
                      "link": "https://sky-cz.com/en",
                      "img": "https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/4cbe1ebac175a9cde7a4c9d8769ba0c4/509e4e83c097d02828403b5a67e8c0b5.png"
                    },
                    {
                      "name": "Sinner",
                      "link": "https://www.sinner.eu/nl/",
                      "img": "https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/dddccfa819ee01d9b2410ba49fa432fc/eeff42d05ffefb8ef945dc83485007ea.png"
                    },
                    {
                      "name": "Wanbound",
                      "link": "https://www.wanbound.com/",
                      "img": "https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/aa675f347b7d7933332df96f08b21199/4ff22ae0404446f203ba682751e1e7b8.png"
                    },
                    {
                      "name": "KNVvL",
                      "link": "https://www.knvvl.nl/",
                      "img": "https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/53ee05f2c2172541b7f1dd99e67a59f9/0f68789e476c0494019a750a6da9c6aa.png"
                    }
                  ],
                  "photo": "https://civlcomps.org/uploads/images/profile/676/7bdecbee5d2246b1ebc14248dc1af935/8bfbe7e62a481a19145c55c9dc97e6ab.jpeg",
                  "background_picture": "https://civlcomps.org/uploads/images/pilot_header/9/c017697641aa9ef817c4c17728e9e6d6/08788da048eea61f93be8591e97f6a0c.jpg",
                  "last_update": "2022-07-06T22:47:20.705999",
                  "rank": 2
                },
                {
                  "_id": 30294,
                  "civlid": 30294,
                  "name": "Lukas Neu",
                  "link": "https://civlcomps.org/pilot/30294/ranking?discipline_id=5",
                  "country": "deu",
                  "about": "There is no public information at this time. Please, check back later.",
                  "links": [],
                  "sponsors": [],
                  "photo": "https://civlcomps.org/images/default-images/user/man.svg",
                  "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
                  "last_update": "2022-07-06T22:48:30.512523",
                  "rank": 6
                }
              ]
            },
            "tricks": [
              {
                "name": "Super Stall to Infinity Tumbling",
                "acronym": "SSI",
                "technical_coefficient": 2.05,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Super Stall to Infinity Tumbling",
                "uniqueness": []
              },
              {
                "name": "right Mac Twist to Helicopter reverse",
                "acronym": "RMCHR",
                "technical_coefficient": 1.85,
                "bonus": 3.5,
                "bonus_types": [
                  "reverse"
                ],
                "base_trick": "Mac Twist to Helicopter",
                "uniqueness": [
                  "reverse",
                  "right"
                ]
              },
              {
                "name": "right Misty Flip",
                "acronym": "RM",
                "technical_coefficient": 1.65,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Misty Flip",
                "uniqueness": [
                  "right"
                ]
              },
              {
                "name": "twisted left Corkscrew reverse",
                "acronym": "/LKR",
                "technical_coefficient": 1.9,
                "bonus": 8.5,
                "bonus_types": [
                  "twist",
                  "reverse"
                ],
                "base_trick": "Corkscrew",
                "uniqueness": [
                  "reverse",
                  "left"
                ]
              }
            ],
            "marks": [],
            "did_not_start": false,
            "final_marks": {
              "judges_mark": {
                "judge": null,
                "technical": 7.667,
                "choreography": 7.5,
                "landing": 6.167,
                "synchro": 7.333
              },
              "technicity": 1.933,
              "bonus_percentage": 12,
              "technical": 3.706,
              "choreography": 1.875,
              "landing": 1.542,
              "synchro": 1.833,
              "bonus": 0.67,
              "score": 7.792,
              "warnings": [],
              "malus": 0,
              "notes": []
            },
            "published": true,
            "warnings": []
          }
        ]
      },
      {
        "final": false,
        "type": "synchro",
        "results": [
          {
            "pilot": null,
            "team": {
              "_id": "62c8af6b7537851f9a6c9efc",
              "name": "the french teuch  team",
              "pilots": [
                {
                  "_id": 64202,
                  "civlid": 64202,
                  "name": "Juliette Liso-y-Claret",
                  "link": "https://civlcomps.org/pilot/64202/ranking?discipline_id=5",
                  "country": "fra",
                  "about": "There is no public information at this time. Please, check back later.",
                  "links": [],
                  "sponsors": [],
                  "photo": "https://civlcomps.org/images/default-images/user/woman.svg",
                  "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
                  "last_update": "2022-07-06T22:48:22.638086",
                  "rank": 49
                },
                {
                  "_id": 61707,
                  "civlid": 61707,
                  "name": "leconte carole",
                  "link": "https://civlcomps.org/pilot/61707/ranking?discipline_id=5",
                  "country": "fra",
                  "about": "There is no public information at this time. Please, check back later.",
                  "links": [],
                  "sponsors": [],
                  "photo": "https://civlcomps.org/images/default-images/user/woman.svg",
                  "background_picture": "https://civlcomps.org/images/pilot-header.jpg",
                  "last_update": "2022-07-06T22:48:14.019649",
                  "rank": 9999
                }
              ]
            },
            "tricks": [
              {
                "name": "right Tumbling",
                "acronym": "RT",
                "technical_coefficient": 1.8,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Tumbling",
                "uniqueness": [
                  "right"
                ]
              },
              {
                "name": "left Misty Flip",
                "acronym": "LM",
                "technical_coefficient": 1.65,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Misty Flip",
                "uniqueness": [
                  "left"
                ]
              },
              {
                "name": "Wingovers",
                "acronym": "W",
                "technical_coefficient": 1.35,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Wingovers",
                "uniqueness": []
              },
              {
                "name": "Full Stall",
                "acronym": "FS",
                "technical_coefficient": 1,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Full Stall",
                "uniqueness": []
              },
              {
                "name": "right Rodeo SAT",
                "acronym": "RRS",
                "technical_coefficient": 1.65,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Rodeo SAT",
                "uniqueness": [
                  "right"
                ]
              },
              {
                "name": "Full Stall",
                "acronym": "FS",
                "technical_coefficient": 1,
                "bonus": 0,
                "bonus_types": [],
                "base_trick": "Full Stall",
                "uniqueness": []
              }
            ],
            "marks": [],
            "did_not_start": false,
            "final_marks": {
              "judges_mark": {
                "judge": null,
                "technical": 3.833,
                "choreography": 3.333,
                "landing": 0.667,
                "synchro": 2.833
              },
              "technicity": 1.7,
              "bonus_percentage": -13,
              "technical": 1.629,
              "choreography": 0.833,
              "landing": 0.167,
              "synchro": 0.708,
              "bonus": -0.32,
              "score": 2.309,
              "warnings": [],
              "malus": 13,
              "notes": [
                "trick number #1 (right Tumbling) has already been performed in a previous run. Adding a 13.0% malus."
              ]
            },
            "published": true,
            "warnings": []
          }
        ]
      }
    ]
  }
}

export default CompetitionsPage
