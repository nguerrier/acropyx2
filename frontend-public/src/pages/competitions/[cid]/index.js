// ** React Imports
import { useState } from 'react'
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
    tabResults = <div />
    tabPilots = <div />
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
  // let res = await get('public/competitions')

  // Get the paths we want to pre-render based on posts
  // const paths = res.map((c) => ({
  //   params: { cid: c.code },
  // }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return {
    paths: [
      { params: { cid: 'awt-leryposes-2022' } } // See the "paths" section below
    ],
    fallback: false
  }
}

// This gets called on every request
export async function getStaticProps({ params }) {
  //let data = await get(`public/competitions/${params.cid}`)

  let data = mockData

  // Pass data to the page via props
  return { props: { data }, revalidate: 10 }
}

const mockData = {
  _id: '62c60ff47a7745ca975d9c31',
  name: 'AWT Lery-Poses 2022',
  code: 'awt-leryposes-2022',
  start_date: '2022-07-07',
  end_date: '2022-07-10',
  location: 'Lery-Poses',
  published: true,
  type: 'solo',
  pilots: [
    {
      _id: 16658,
      civlid: 16658,
      name: 'François Ragolski',
      link: 'https://civlcomps.org/pilot/16658/ranking?discipline_id=5',
      country: 'fra',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo:
        'https://civlcomps.org/uploads/images/profile/166/ec5a13e5a30ff9211043332e6b3571c0/9bdfbe5e83ae910fe53a12ecdefc6799.jpeg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:48:52.763356',
      rank: 42
    },
    {
      _id: 26069,
      civlid: 26069,
      name: 'Théo De Blic',
      link: 'https://civlcomps.org/pilot/26069/ranking?discipline_id=5',
      country: 'fra',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo:
        'https://civlcomps.org/uploads/images/profile/260/7fcd2025c420c2d6c459ee70dcb0b0da/695688d2f89e9f0b7983e0d94e5f2958.jpeg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:47:13.813370',
      rank: 1
    },
    {
      _id: 61812,
      civlid: 61812,
      name: 'Mael Jimenez',
      link: 'https://civlcomps.org/pilot/61812/ranking?discipline_id=5',
      country: 'fra',
      about: 'There is no public information at this time. Please, check back later.',
      links: [
        {
          name: 'instagram',
          link: 'Http://instagram.com/mael_jmz'
        }
      ],
      sponsors: [
        {
          name: 'AirG Products',
          link: 'https://airg.family/',
          img: 'https://civlcomps.org/images/no-image.png'
        },
        {
          name: 'Phieres Products',
          link: 'https://www.phieres.com/',
          img: 'https://civlcomps.org/images/no-image.png'
        }
      ],
      photo:
        'https://civlcomps.org/uploads/images/profile/618/efa7614c82de1fe4ad303e8d631d409e/bc7886c5970ed4a3cf0cea8cd56e4c55.jpeg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:47:51.618893',
      rank: 9
    },
    {
      _id: 78952,
      civlid: 78952,
      name: 'Axel Coste',
      link: 'https://civlcomps.org/pilot/78952/ranking?discipline_id=5',
      country: 'fra',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo: 'https://civlcomps.org/images/default-images/user/man.svg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:47:05.523243',
      rank: 19
    },
    {
      _id: 23150,
      civlid: 23150,
      name: 'Andrés Villamizar',
      link: 'https://civlcomps.org/pilot/23150/ranking?discipline_id=5',
      country: 'col',
      about: 'There is no public information at this time. Please, check back later.',
      links: [
        {
          name: 'instagram',
          link: 'https://www.instagram.com/acroandres/?hl=en'
        },
        {
          name: 'facebook',
          link: 'https://www.facebook.com/acroandres'
        }
      ],
      sponsors: [],
      photo:
        'https://civlcomps.org/uploads/images/profile/231/3cf3e1ce9c914794f7e55d4ab0ad7572/401c84376171a0936b19d1a5f1d5b50f.jpeg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:49:09.502643',
      rank: 5
    },
    {
      _id: 23654,
      civlid: 23654,
      name: 'Cesar Arevalo Urrego',
      link: 'https://civlcomps.org/pilot/23654/ranking?discipline_id=5',
      country: 'col',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo:
        'https://civlcomps.org/uploads/images/profile/236/66458ac5a311c78bf3be4e9ffe87507a/b2fc26ebca72c35fcc91164354efef26.jpeg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:46:04.094115',
      rank: 7
    },
    {
      _id: 30294,
      civlid: 30294,
      name: 'Lukas Neu',
      link: 'https://civlcomps.org/pilot/30294/ranking?discipline_id=5',
      country: 'deu',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo: 'https://civlcomps.org/images/default-images/user/man.svg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:48:30.512523',
      rank: 6
    },
    {
      _id: 67619,
      civlid: 67619,
      name: 'Luke de Weert',
      link: 'https://civlcomps.org/pilot/67619/ranking?discipline_id=5',
      country: 'nld',
      about:
        '"I am an athlete who believes that dedication is the core of the thing that keeps me pushing and motivating me to achieve all my goals, and even set new goals where I never thought it was possible."',
      links: [
        {
          name: 'facebook',
          link: 'https://www.facebook.com/deweert.luke'
        },
        {
          name: 'instagram',
          link: 'https://www.instagram.com/luke_deweert/'
        },
        {
          name: 'twitter',
          link: 'https://twitter.com/luke_deweert'
        },
        {
          name: 'youtube',
          link: 'https://www.youtube.com/lukedeweert'
        },
        {
          name: 'Website',
          link: 'https://lukedeweert.nl'
        },
        {
          name: 'Tiktok',
          link: 'https://www.tiktok.com/@lukedeweert'
        }
      ],
      sponsors: [
        {
          name: 'Sky Paragliders',
          link: 'https://sky-cz.com/en',
          img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/4cbe1ebac175a9cde7a4c9d8769ba0c4/509e4e83c097d02828403b5a67e8c0b5.png'
        },
        {
          name: 'Sinner',
          link: 'https://www.sinner.eu/nl/',
          img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/dddccfa819ee01d9b2410ba49fa432fc/eeff42d05ffefb8ef945dc83485007ea.png'
        },
        {
          name: 'Wanbound',
          link: 'https://www.wanbound.com/',
          img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/aa675f347b7d7933332df96f08b21199/4ff22ae0404446f203ba682751e1e7b8.png'
        },
        {
          name: 'KNVvL',
          link: 'https://www.knvvl.nl/',
          img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/53ee05f2c2172541b7f1dd99e67a59f9/0f68789e476c0494019a750a6da9c6aa.png'
        }
      ],
      photo:
        'https://civlcomps.org/uploads/images/profile/676/7bdecbee5d2246b1ebc14248dc1af935/8bfbe7e62a481a19145c55c9dc97e6ab.jpeg',
      background_picture:
        'https://civlcomps.org/uploads/images/pilot_header/9/c017697641aa9ef817c4c17728e9e6d6/08788da048eea61f93be8591e97f6a0c.jpg',
      last_update: '2022-07-06T22:47:20.705999',
      rank: 2
    },
    {
      _id: 46598,
      civlid: 46598,
      name: 'Bicho Carrera',
      link: 'https://civlcomps.org/pilot/46598/ranking?discipline_id=5',
      country: 'cze',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo:
        'https://civlcomps.org/uploads/images/profile/465/dc992024787dbe0c471be1dc9a7973d5/aeaf24da98cfc57ee3c8d3021d0a665c.jpeg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:46:49.568258',
      rank: 3
    },
    {
      _id: 68308,
      civlid: 68308,
      name: 'Marco Papa',
      link: 'https://civlcomps.org/pilot/68308/ranking?discipline_id=5',
      country: 'ita',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo:
        'https://civlcomps.org/uploads/images/profile/683/22a05ab0f67326a3bddc1dc194093720/bb1c51953e149f8c7d538d487fb77d79.jpg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:48:37.147479',
      rank: 10
    }
  ],
  teams: [],
  judges: [
    {
      _id: '629d5ebd91f562bf6c1c5135',
      name: 'Julien Grosse',
      country: 'fra',
      level: 'certified',
      civlid: 79290,
      deleted: null
    },
    {
      _id: '629d6edec798c87a2b45a5ad',
      name: 'Alexandra Grillmayer',
      country: 'hun',
      level: 'senior',
      civlid: 11601,
      deleted: null
    },
    {
      _id: '629cfff354e27dc8592dd69c',
      name: 'Jerome Loyet',
      country: 'fra',
      level: 'senior',
      civlid: 33732,
      deleted: null
    }
  ],
  state: 'open',
  results: {
    final: false,
    type: 'solo',
    overall_results: [
      {
        pilot: {
          _id: 26069,
          civlid: 26069,
          name: 'Théo De Blic',
          link: 'https://civlcomps.org/pilot/26069/ranking?discipline_id=5',
          country: 'fra',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo:
            'https://civlcomps.org/uploads/images/profile/260/7fcd2025c420c2d6c459ee70dcb0b0da/695688d2f89e9f0b7983e0d94e5f2958.jpeg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:47:13.813370',
          rank: 1
        },
        team: null,
        result_per_run: [
          {
            rank: 1,
            score: 15.322
          },
          {
            rank: 1,
            score: 15.649
          }
        ],
        score: 30.970999999999997
      },
      {
        pilot: {
          _id: 67619,
          civlid: 67619,
          name: 'Luke de Weert',
          link: 'https://civlcomps.org/pilot/67619/ranking?discipline_id=5',
          country: 'nld',
          about:
            '"I am an athlete who believes that dedication is the core of the thing that keeps me pushing and motivating me to achieve all my goals, and even set new goals where I never thought it was possible."',
          links: [
            {
              name: 'facebook',
              link: 'https://www.facebook.com/deweert.luke'
            },
            {
              name: 'instagram',
              link: 'https://www.instagram.com/luke_deweert/'
            },
            {
              name: 'twitter',
              link: 'https://twitter.com/luke_deweert'
            },
            {
              name: 'youtube',
              link: 'https://www.youtube.com/lukedeweert'
            },
            {
              name: 'Website',
              link: 'https://lukedeweert.nl'
            },
            {
              name: 'Tiktok',
              link: 'https://www.tiktok.com/@lukedeweert'
            }
          ],
          sponsors: [
            {
              name: 'Sky Paragliders',
              link: 'https://sky-cz.com/en',
              img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/4cbe1ebac175a9cde7a4c9d8769ba0c4/509e4e83c097d02828403b5a67e8c0b5.png'
            },
            {
              name: 'Sinner',
              link: 'https://www.sinner.eu/nl/',
              img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/dddccfa819ee01d9b2410ba49fa432fc/eeff42d05ffefb8ef945dc83485007ea.png'
            },
            {
              name: 'Wanbound',
              link: 'https://www.wanbound.com/',
              img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/aa675f347b7d7933332df96f08b21199/4ff22ae0404446f203ba682751e1e7b8.png'
            },
            {
              name: 'KNVvL',
              link: 'https://www.knvvl.nl/',
              img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/53ee05f2c2172541b7f1dd99e67a59f9/0f68789e476c0494019a750a6da9c6aa.png'
            }
          ],
          photo:
            'https://civlcomps.org/uploads/images/profile/676/7bdecbee5d2246b1ebc14248dc1af935/8bfbe7e62a481a19145c55c9dc97e6ab.jpeg',
          background_picture:
            'https://civlcomps.org/uploads/images/pilot_header/9/c017697641aa9ef817c4c17728e9e6d6/08788da048eea61f93be8591e97f6a0c.jpg',
          last_update: '2022-07-06T22:47:20.705999',
          rank: 2
        },
        team: null,
        result_per_run: [
          {
            rank: 2,
            score: 15.248
          },
          {
            rank: 3,
            score: 14.742
          }
        ],
        score: 29.990000000000002
      },
      {
        pilot: {
          _id: 68308,
          civlid: 68308,
          name: 'Marco Papa',
          link: 'https://civlcomps.org/pilot/68308/ranking?discipline_id=5',
          country: 'ita',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo:
            'https://civlcomps.org/uploads/images/profile/683/22a05ab0f67326a3bddc1dc194093720/bb1c51953e149f8c7d538d487fb77d79.jpg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:48:37.147479',
          rank: 10
        },
        team: null,
        result_per_run: [
          {
            rank: 9,
            score: 10.662
          },
          {
            rank: 10,
            score: 9.007
          },
          {
            rank: 1,
            score: 9.666
          }
        ],
        score: 29.335
      },
      {
        pilot: {
          _id: 46598,
          civlid: 46598,
          name: 'Bicho Carrera',
          link: 'https://civlcomps.org/pilot/46598/ranking?discipline_id=5',
          country: 'cze',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo:
            'https://civlcomps.org/uploads/images/profile/465/dc992024787dbe0c471be1dc9a7973d5/aeaf24da98cfc57ee3c8d3021d0a665c.jpeg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:46:49.568258',
          rank: 3
        },
        team: null,
        result_per_run: [
          {
            rank: 3,
            score: 13.967
          },
          {
            rank: 2,
            score: 15.066
          }
        ],
        score: 29.033
      },
      {
        pilot: {
          _id: 23654,
          civlid: 23654,
          name: 'Cesar Arevalo Urrego',
          link: 'https://civlcomps.org/pilot/23654/ranking?discipline_id=5',
          country: 'col',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo:
            'https://civlcomps.org/uploads/images/profile/236/66458ac5a311c78bf3be4e9ffe87507a/b2fc26ebca72c35fcc91164354efef26.jpeg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:46:04.094115',
          rank: 7
        },
        team: null,
        result_per_run: [
          {
            rank: 10,
            score: 7.588
          },
          {
            rank: 9,
            score: 9.72
          },
          {
            rank: 2,
            score: 8.939
          }
        ],
        score: 26.247
      },
      {
        pilot: {
          _id: 61812,
          civlid: 61812,
          name: 'Mael Jimenez',
          link: 'https://civlcomps.org/pilot/61812/ranking?discipline_id=5',
          country: 'fra',
          about: 'There is no public information at this time. Please, check back later.',
          links: [
            {
              name: 'instagram',
              link: 'Http://instagram.com/mael_jmz'
            }
          ],
          sponsors: [
            {
              name: 'AirG Products',
              link: 'https://airg.family/',
              img: 'https://civlcomps.org/images/no-image.png'
            },
            {
              name: 'Phieres Products',
              link: 'https://www.phieres.com/',
              img: 'https://civlcomps.org/images/no-image.png'
            }
          ],
          photo:
            'https://civlcomps.org/uploads/images/profile/618/efa7614c82de1fe4ad303e8d631d409e/bc7886c5970ed4a3cf0cea8cd56e4c55.jpeg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:47:51.618893',
          rank: 9
        },
        team: null,
        result_per_run: [
          {
            rank: 6,
            score: 12.112
          },
          {
            rank: 4,
            score: 12.449
          }
        ],
        score: 24.561
      },
      {
        pilot: {
          _id: 78952,
          civlid: 78952,
          name: 'Axel Coste',
          link: 'https://civlcomps.org/pilot/78952/ranking?discipline_id=5',
          country: 'fra',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo: 'https://civlcomps.org/images/default-images/user/man.svg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:47:05.523243',
          rank: 19
        },
        team: null,
        result_per_run: [
          {
            rank: 4,
            score: 12.564
          },
          {
            rank: 5,
            score: 11.466
          }
        ],
        score: 24.03
      },
      {
        pilot: {
          _id: 23150,
          civlid: 23150,
          name: 'Andrés Villamizar',
          link: 'https://civlcomps.org/pilot/23150/ranking?discipline_id=5',
          country: 'col',
          about: 'There is no public information at this time. Please, check back later.',
          links: [
            {
              name: 'instagram',
              link: 'https://www.instagram.com/acroandres/?hl=en'
            },
            {
              name: 'facebook',
              link: 'https://www.facebook.com/acroandres'
            }
          ],
          sponsors: [],
          photo:
            'https://civlcomps.org/uploads/images/profile/231/3cf3e1ce9c914794f7e55d4ab0ad7572/401c84376171a0936b19d1a5f1d5b50f.jpeg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:49:09.502643',
          rank: 5
        },
        team: null,
        result_per_run: [
          {
            rank: 5,
            score: 12.561
          },
          {
            rank: 7,
            score: 10.457
          }
        ],
        score: 23.018
      },
      {
        pilot: {
          _id: 30294,
          civlid: 30294,
          name: 'Lukas Neu',
          link: 'https://civlcomps.org/pilot/30294/ranking?discipline_id=5',
          country: 'deu',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo: 'https://civlcomps.org/images/default-images/user/man.svg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:48:30.512523',
          rank: 6
        },
        team: null,
        result_per_run: [
          {
            rank: 8,
            score: 10.78
          },
          {
            rank: 6,
            score: 11.178
          }
        ],
        score: 21.958
      },
      {
        pilot: {
          _id: 16658,
          civlid: 16658,
          name: 'François Ragolski',
          link: 'https://civlcomps.org/pilot/16658/ranking?discipline_id=5',
          country: 'fra',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo:
            'https://civlcomps.org/uploads/images/profile/166/ec5a13e5a30ff9211043332e6b3571c0/9bdfbe5e83ae910fe53a12ecdefc6799.jpeg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:48:52.763356',
          rank: 42
        },
        team: null,
        result_per_run: [
          {
            rank: 7,
            score: 11.358
          },
          {
            rank: 8,
            score: 10.059
          }
        ],
        score: 21.417
      }
    ],
    runs_results: [
      {
        final: true,
        type: 'solo',
        results: [
          {
            pilot: {
              _id: 23654,
              civlid: 23654,
              name: 'Cesar Arevalo Urrego',
              link: 'https://civlcomps.org/pilot/23654/ranking?discipline_id=5',
              country: 'col',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/236/66458ac5a311c78bf3be4e9ffe87507a/b2fc26ebca72c35fcc91164354efef26.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:46:04.094115',
              rank: 7
            },
            team: null,
            tricks: [
              {
                name: 'Flat Stall to Infinity Tumbling',
                acronym: 'FSI',
                technical_coefficient: 2.1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Flat Stall to Infinity Tumbling',
                uniqueness: []
              },
              {
                name: 'right Helicopter to SAT reverse',
                acronym: 'RHSR',
                technical_coefficient: 1.85,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'twisted right Tumbling',
                acronym: '/RT',
                technical_coefficient: 1.8,
                bonus: 3.5,
                bonus_types: ['twist'],
                base_trick: 'Tumbling',
                uniqueness: ['right']
              },
              {
                name: 'twisted right Misty Flip twisted exit',
                acronym: '/RM/',
                technical_coefficient: 1.65,
                bonus: 7,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Joker reverse',
                acronym: '/LJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'left Mac Twist',
                acronym: 'LMC',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 4.333,
                choreography: 5.5,
                landing: 3.167,
                synchro: 0
              },
              technicity: 1.967,
              bonus_percentage: 24,
              technical: 3.409,
              choreography: 2.2,
              landing: 0.633,
              synchro: 0,
              bonus: 1.346,
              score: 7.588,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 68308,
              civlid: 68308,
              name: 'Marco Papa',
              link: 'https://civlcomps.org/pilot/68308/ranking?discipline_id=5',
              country: 'ita',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/683/22a05ab0f67326a3bddc1dc194093720/bb1c51953e149f8c7d538d487fb77d79.jpg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:37.147479',
              rank: 10
            },
            team: null,
            tricks: [
              {
                name: 'twisted left Joker reverse',
                acronym: '/LJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted left Mac Twist to Helicopter reverse',
                acronym: '/LMCHR',
                technical_coefficient: 1.85,
                bonus: 8,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted left Helicopter to SAT reverse',
                acronym: '/LHSR',
                technical_coefficient: 1.85,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted left Misty Flip twisted exit',
                acronym: '/LM/',
                technical_coefficient: 1.65,
                bonus: 7,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
                uniqueness: ['left']
              },
              {
                name: 'twisted Full Stall twisted exit',
                acronym: '/FS/',
                technical_coefficient: 1,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Full Stall',
                uniqueness: []
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.833,
                choreography: 5.667,
                landing: 2.333,
                synchro: 0
              },
              technicity: 1.883,
              bonus_percentage: 37.5,
              technical: 5.148,
              choreography: 2.267,
              landing: 0.467,
              synchro: 0,
              bonus: 2.78,
              score: 10.662,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 30294,
              civlid: 30294,
              name: 'Lukas Neu',
              link: 'https://civlcomps.org/pilot/30294/ranking?discipline_id=5',
              country: 'deu',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:30.512523',
              rank: 6
            },
            team: null,
            tricks: [
              {
                name: 'twisted left Joker reverse',
                acronym: '/LJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'right Helicopter to SAT reverse',
                acronym: 'RHSR',
                technical_coefficient: 1.85,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'Super Stall to Infinity Tumbling',
                acronym: 'SSI',
                technical_coefficient: 2.05,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Super Stall to Infinity Tumbling',
                uniqueness: []
              },
              {
                name: 'left Misty to Helicopter',
                acronym: 'LMH',
                technical_coefficient: 1.75,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Joker',
                acronym: '/RJ',
                technical_coefficient: 1.95,
                bonus: 5,
                bonus_types: ['twist'],
                base_trick: 'Joker',
                uniqueness: ['right']
              },
              {
                name: 'left Mac Twist to Helicopter reverse',
                acronym: 'LMCHR',
                technical_coefficient: 1.85,
                bonus: 3.5,
                bonus_types: ['reverse'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['reverse', 'left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 7.333,
                choreography: 7,
                landing: 1.333,
                synchro: 0
              },
              technicity: 1.983,
              bonus_percentage: 22,
              technical: 5.818,
              choreography: 2.8,
              landing: 0.267,
              synchro: 0,
              bonus: 1.896,
              score: 10.78,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 16658,
              civlid: 16658,
              name: 'François Ragolski',
              link: 'https://civlcomps.org/pilot/16658/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/166/ec5a13e5a30ff9211043332e6b3571c0/9bdfbe5e83ae910fe53a12ecdefc6799.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:52.763356',
              rank: 42
            },
            team: null,
            tricks: [
              {
                name: 'twisted right Rythmic SAT',
                acronym: '/RR',
                technical_coefficient: 1.95,
                bonus: 5.5,
                bonus_types: ['twist'],
                base_trick: 'Rythmic SAT',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Corkscrew reverse',
                acronym: '/LKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'right Twister',
                acronym: 'RHH',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Twister',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Helicopter to SAT reverse',
                acronym: '/LHSR',
                technical_coefficient: 1.85,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted right Cowboy',
                acronym: '/RC',
                technical_coefficient: 1.9,
                bonus: 4,
                bonus_types: ['twist'],
                base_trick: 'Cowboy',
                uniqueness: ['right']
              },
              {
                name: 'twisted right X-Chopper',
                acronym: '/RX',
                technical_coefficient: 1.7,
                bonus: 3.5,
                bonus_types: ['twist'],
                base_trick: 'X-Chopper',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.667,
                choreography: 6.5,
                landing: 6.667,
                synchro: 0
              },
              technicity: 1.917,
              bonus_percentage: 30,
              technical: 5.111,
              choreography: 2.6,
              landing: 1.333,
              synchro: 0,
              bonus: 2.313,
              score: 11.358,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 61812,
              civlid: 61812,
              name: 'Mael Jimenez',
              link: 'https://civlcomps.org/pilot/61812/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [
                {
                  name: 'instagram',
                  link: 'Http://instagram.com/mael_jmz'
                }
              ],
              sponsors: [
                {
                  name: 'AirG Products',
                  link: 'https://airg.family/',
                  img: 'https://civlcomps.org/images/no-image.png'
                },
                {
                  name: 'Phieres Products',
                  link: 'https://www.phieres.com/',
                  img: 'https://civlcomps.org/images/no-image.png'
                }
              ],
              photo:
                'https://civlcomps.org/uploads/images/profile/618/efa7614c82de1fe4ad303e8d631d409e/bc7886c5970ed4a3cf0cea8cd56e4c55.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:47:51.618893',
              rank: 9
            },
            team: null,
            tricks: [
              {
                name: 'twisted right Corkscrew reverse',
                acronym: '/RKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'left Helicopter to SAT reverse',
                acronym: 'LHSR',
                technical_coefficient: 1.85,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'Super Stall to Infinity Tumbling',
                acronym: 'SSI',
                technical_coefficient: 2.05,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Super Stall to Infinity Tumbling',
                uniqueness: []
              },
              {
                name: 'twisted right Misty Flip twisted exit',
                acronym: '/RM/',
                technical_coefficient: 1.65,
                bonus: 7,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Joker reverse',
                acronym: '/LJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted right Mac Twist to Helicopter',
                acronym: '/RMCH',
                technical_coefficient: 1.85,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['right']
              },
              {
                name: 'left X-Chopper',
                acronym: 'LX',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'X-Chopper',
                uniqueness: ['left']
              },
              {
                name: 'Super Stall',
                acronym: 'SS',
                technical_coefficient: 1.6,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Super Stall',
                uniqueness: []
              },
              {
                name: 'right Misty to Helicopter',
                acronym: 'RMH',
                technical_coefficient: 1.75,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 7.667,
                choreography: 7.167,
                landing: 1.167,
                synchro: 0
              },
              technicity: 1.967,
              bonus_percentage: 33.5,
              technical: 6.031,
              choreography: 2.867,
              landing: 0.233,
              synchro: 0,
              bonus: 2.981,
              score: 12.112,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 23150,
              civlid: 23150,
              name: 'Andrés Villamizar',
              link: 'https://civlcomps.org/pilot/23150/ranking?discipline_id=5',
              country: 'col',
              about: 'There is no public information at this time. Please, check back later.',
              links: [
                {
                  name: 'instagram',
                  link: 'https://www.instagram.com/acroandres/?hl=en'
                },
                {
                  name: 'facebook',
                  link: 'https://www.facebook.com/acroandres'
                }
              ],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/231/3cf3e1ce9c914794f7e55d4ab0ad7572/401c84376171a0936b19d1a5f1d5b50f.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:49:09.502643',
              rank: 5
            },
            team: null,
            tricks: [
              {
                name: 'twisted left Cowboy',
                acronym: '/LC',
                technical_coefficient: 1.9,
                bonus: 4,
                bonus_types: ['twist'],
                base_trick: 'Cowboy',
                uniqueness: ['left']
              },
              {
                name: 'left Twister',
                acronym: 'LHH',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Twister',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Helicopter to SAT',
                acronym: '/RHS',
                technical_coefficient: 1.85,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['right']
              },
              {
                name: 'twisted right Rythmic SAT twisted exit',
                acronym: '/RR/',
                technical_coefficient: 1.95,
                bonus: 11.5,
                bonus_types: ['twist'],
                base_trick: 'Rythmic SAT',
                uniqueness: ['right']
              },
              {
                name: 'twisted Misty to Misty twisted exit',
                acronym: '/MM/',
                technical_coefficient: 1.75,
                bonus: 9,
                bonus_types: ['twist'],
                base_trick: 'Misty to Misty',
                uniqueness: []
              },
              {
                name: 'twisted right Joker reverse',
                acronym: '/RJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'left Misty to Helicopter reverse',
                acronym: 'LMHR',
                technical_coefficient: 1.75,
                bonus: 3,
                bonus_types: ['reverse'],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['reverse', 'left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.833,
                choreography: 7.333,
                landing: 4.667,
                synchro: 0
              },
              technicity: 1.933,
              bonus_percentage: 41.5,
              technical: 5.284,
              choreography: 2.933,
              landing: 0.933,
              synchro: 0,
              bonus: 3.41,
              score: 12.561,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 78952,
              civlid: 78952,
              name: 'Axel Coste',
              link: 'https://civlcomps.org/pilot/78952/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:47:05.523243',
              rank: 19
            },
            team: null,
            tricks: [
              {
                name: 'twisted right Joker reverse',
                acronym: '/RJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'left Helicopter to SAT reverse',
                acronym: 'LHSR',
                technical_coefficient: 1.85,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'right Mac Twist',
                acronym: 'RMC',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist',
                uniqueness: ['right']
              },
              {
                name: 'Tail Slide to Infinity Tumbling',
                acronym: 'TSI',
                technical_coefficient: 2.25,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Tail Slide to Infinity Tumbling',
                uniqueness: []
              },
              {
                name: 'twisted left Misty Flip twisted exit',
                acronym: '/LM/',
                technical_coefficient: 1.65,
                bonus: 7,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Cowboy',
                acronym: '/RC',
                technical_coefficient: 1.9,
                bonus: 4,
                bonus_types: ['twist'],
                base_trick: 'Cowboy',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Corkscrew',
                acronym: '/LK',
                technical_coefficient: 1.9,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Corkscrew',
                uniqueness: ['left']
              },
              {
                name: 'left Misty to Helicopter reverse',
                acronym: 'LMHR',
                technical_coefficient: 1.75,
                bonus: 3,
                bonus_types: ['reverse'],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['reverse', 'left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 7.333,
                choreography: 8,
                landing: 2.333,
                synchro: 0
              },
              technicity: 2.033,
              bonus_percentage: 32,
              technical: 5.964,
              choreography: 3.2,
              landing: 0.467,
              synchro: 0,
              bonus: 2.933,
              score: 12.564,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 46598,
              civlid: 46598,
              name: 'Bicho Carrera',
              link: 'https://civlcomps.org/pilot/46598/ranking?discipline_id=5',
              country: 'cze',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/465/dc992024787dbe0c471be1dc9a7973d5/aeaf24da98cfc57ee3c8d3021d0a665c.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:46:49.568258',
              rank: 3
            },
            team: null,
            tricks: [
              {
                name: 'Flat Stall to Infinity Tumbling twisted exit',
                acronym: 'FSI/',
                technical_coefficient: 2.1,
                bonus: 2,
                bonus_types: ['twist'],
                base_trick: 'Flat Stall to Infinity Tumbling',
                uniqueness: []
              },
              {
                name: 'twisted left Mac Twist to Helicopter reverse',
                acronym: '/LMCHR',
                technical_coefficient: 1.85,
                bonus: 8,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted right Helicopter to SAT reverse',
                acronym: '/RHSR',
                technical_coefficient: 1.85,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'right Tumbling',
                acronym: 'RT',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Tumbling',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Joker reverse',
                acronym: '/LJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'right Twister',
                acronym: 'RHH',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Twister',
                uniqueness: ['right']
              },
              {
                name: 'right X-Chopper',
                acronym: 'RX',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'X-Chopper',
                uniqueness: ['right']
              },
              {
                name: 'Super Stall',
                acronym: 'SS',
                technical_coefficient: 1.6,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Super Stall',
                uniqueness: []
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 8.167,
                choreography: 7.833,
                landing: 8.667,
                synchro: 0
              },
              technicity: 1.967,
              bonus_percentage: 28,
              technical: 6.424,
              choreography: 3.133,
              landing: 1.733,
              synchro: 0,
              bonus: 2.676,
              score: 13.967,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 67619,
              civlid: 67619,
              name: 'Luke de Weert',
              link: 'https://civlcomps.org/pilot/67619/ranking?discipline_id=5',
              country: 'nld',
              about:
                '"I am an athlete who believes that dedication is the core of the thing that keeps me pushing and motivating me to achieve all my goals, and even set new goals where I never thought it was possible."',
              links: [
                {
                  name: 'facebook',
                  link: 'https://www.facebook.com/deweert.luke'
                },
                {
                  name: 'instagram',
                  link: 'https://www.instagram.com/luke_deweert/'
                },
                {
                  name: 'twitter',
                  link: 'https://twitter.com/luke_deweert'
                },
                {
                  name: 'youtube',
                  link: 'https://www.youtube.com/lukedeweert'
                },
                {
                  name: 'Website',
                  link: 'https://lukedeweert.nl'
                },
                {
                  name: 'Tiktok',
                  link: 'https://www.tiktok.com/@lukedeweert'
                }
              ],
              sponsors: [
                {
                  name: 'Sky Paragliders',
                  link: 'https://sky-cz.com/en',
                  img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/4cbe1ebac175a9cde7a4c9d8769ba0c4/509e4e83c097d02828403b5a67e8c0b5.png'
                },
                {
                  name: 'Sinner',
                  link: 'https://www.sinner.eu/nl/',
                  img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/dddccfa819ee01d9b2410ba49fa432fc/eeff42d05ffefb8ef945dc83485007ea.png'
                },
                {
                  name: 'Wanbound',
                  link: 'https://www.wanbound.com/',
                  img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/aa675f347b7d7933332df96f08b21199/4ff22ae0404446f203ba682751e1e7b8.png'
                },
                {
                  name: 'KNVvL',
                  link: 'https://www.knvvl.nl/',
                  img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/53ee05f2c2172541b7f1dd99e67a59f9/0f68789e476c0494019a750a6da9c6aa.png'
                }
              ],
              photo:
                'https://civlcomps.org/uploads/images/profile/676/7bdecbee5d2246b1ebc14248dc1af935/8bfbe7e62a481a19145c55c9dc97e6ab.jpeg',
              background_picture:
                'https://civlcomps.org/uploads/images/pilot_header/9/c017697641aa9ef817c4c17728e9e6d6/08788da048eea61f93be8591e97f6a0c.jpg',
              last_update: '2022-07-06T22:47:20.705999',
              rank: 2
            },
            team: null,
            tricks: [
              {
                name: 'twisted left Joker reverse',
                acronym: '/LJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted right Helicopter to SAT reverse',
                acronym: '/RHSR',
                technical_coefficient: 1.85,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'twisted left Rythmic SAT twisted exit',
                acronym: '/LR/',
                technical_coefficient: 1.95,
                bonus: 11.5,
                bonus_types: ['twist'],
                base_trick: 'Rythmic SAT',
                uniqueness: ['left']
              },
              {
                name: 'twisted left Misty Flip twisted exit',
                acronym: '/LM/',
                technical_coefficient: 1.65,
                bonus: 7,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Corkscrew reverse',
                acronym: '/RKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'right Misty to Helicopter reverse',
                acronym: 'RMHR',
                technical_coefficient: 1.75,
                bonus: 3,
                bonus_types: ['reverse'],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['reverse', 'right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 8.333,
                choreography: 8.167,
                landing: 5.833,
                synchro: 0
              },
              technicity: 1.933,
              bonus_percentage: 45,
              technical: 6.444,
              choreography: 3.267,
              landing: 1.167,
              synchro: 0,
              bonus: 4.37,
              score: 15.248,
              warnings: [],
              malus: 0,
              notes: [
                'trick number #6 (right Misty to Helicopter reverse) has been ignored because more than 3 reverse tricks have been flown'
              ]
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 26069,
              civlid: 26069,
              name: 'Théo De Blic',
              link: 'https://civlcomps.org/pilot/26069/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/260/7fcd2025c420c2d6c459ee70dcb0b0da/695688d2f89e9f0b7983e0d94e5f2958.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:47:13.813370',
              rank: 1
            },
            team: null,
            tricks: [
              {
                name: 'twisted right Joker',
                acronym: '/RJ',
                technical_coefficient: 1.95,
                bonus: 5,
                bonus_types: ['twist'],
                base_trick: 'Joker',
                uniqueness: ['right']
              },
              {
                name: 'left Misty to SAT devil twist',
                acronym: 'LMSX',
                technical_coefficient: 1.7,
                bonus: 6,
                bonus_types: ['twist'],
                base_trick: 'Misty to SAT',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Corkscrew reverse',
                acronym: '/RKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'left Helicopter to SAT reverse',
                acronym: 'LHSR',
                technical_coefficient: 1.85,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted Misty to Misty twisted exit',
                acronym: '/MM/',
                technical_coefficient: 1.75,
                bonus: 9,
                bonus_types: ['twist'],
                base_trick: 'Misty to Misty',
                uniqueness: []
              },
              {
                name: 'twisted left Joker',
                acronym: '/LJ',
                technical_coefficient: 1.95,
                bonus: 5,
                bonus_types: ['twist'],
                base_trick: 'Joker',
                uniqueness: ['left']
              },
              {
                name: 'right Misty to Helicopter reverse',
                acronym: 'RMHR',
                technical_coefficient: 1.75,
                bonus: 3,
                bonus_types: ['reverse'],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'left Mac Twist to Helicopter',
                acronym: 'LMCH',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['left']
              },
              {
                name: 'left Twister',
                acronym: 'LHH',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Twister',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 9,
                choreography: 8.5,
                landing: 3.833,
                synchro: 0
              },
              technicity: 1.933,
              bonus_percentage: 40.5,
              technical: 6.96,
              choreography: 3.4,
              landing: 0.767,
              synchro: 0,
              bonus: 4.196,
              score: 15.322,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          }
        ]
      },
      {
        final: true,
        type: 'solo',
        results: [
          {
            pilot: {
              _id: 68308,
              civlid: 68308,
              name: 'Marco Papa',
              link: 'https://civlcomps.org/pilot/68308/ranking?discipline_id=5',
              country: 'ita',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/683/22a05ab0f67326a3bddc1dc194093720/bb1c51953e149f8c7d538d487fb77d79.jpg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:37.147479',
              rank: 10
            },
            team: null,
            tricks: [
              {
                name: 'twisted right Joker reverse',
                acronym: '/RJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'twisted right Misty Flip twisted exit',
                acronym: '/RM/',
                technical_coefficient: 1.65,
                bonus: 7,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Corkscrew reverse',
                acronym: '/LKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted left Mac Twist to Helicopter',
                acronym: '/LMCH',
                technical_coefficient: 1.85,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Cowboy',
                acronym: '/RC',
                technical_coefficient: 1.9,
                bonus: 4,
                bonus_types: ['twist'],
                base_trick: 'Cowboy',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 5.333,
                choreography: 5.333,
                landing: 3.5,
                synchro: 0
              },
              technicity: 1.917,
              bonus_percentage: 33.5,
              technical: 4.089,
              choreography: 2.133,
              landing: 0.7,
              synchro: 0,
              bonus: 2.084,
              score: 9.007,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 23654,
              civlid: 23654,
              name: 'Cesar Arevalo Urrego',
              link: 'https://civlcomps.org/pilot/23654/ranking?discipline_id=5',
              country: 'col',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/236/66458ac5a311c78bf3be4e9ffe87507a/b2fc26ebca72c35fcc91164354efef26.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:46:04.094115',
              rank: 7
            },
            team: null,
            tricks: [
              {
                name: 'twisted right Joker reverse',
                acronym: '/RJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'left Twister',
                acronym: 'LHH',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Twister',
                uniqueness: ['left']
              },
              {
                name: 'twisted left Corkscrew reverse',
                acronym: '/LKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted left Joker',
                acronym: '/LJ',
                technical_coefficient: 1.95,
                bonus: 5,
                bonus_types: ['twist'],
                base_trick: 'Joker',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Cowboy',
                acronym: '/RC',
                technical_coefficient: 1.9,
                bonus: 4,
                bonus_types: ['twist'],
                base_trick: 'Cowboy',
                uniqueness: ['right']
              },
              {
                name: 'left Mac Twist to Helicopter reverse',
                acronym: 'LMCHR',
                technical_coefficient: 1.85,
                bonus: 3.5,
                bonus_types: ['reverse'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted right Misty to Helicopter',
                acronym: '/RMH',
                technical_coefficient: 1.75,
                bonus: 3,
                bonus_types: ['twist'],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Misty Flip',
                acronym: '/LM',
                technical_coefficient: 1.65,
                bonus: 2.5,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.333,
                choreography: 5.333,
                landing: 1.667,
                synchro: 0
              },
              technicity: 1.933,
              bonus_percentage: 33.5,
              technical: 4.898,
              choreography: 2.133,
              landing: 0.333,
              synchro: 0,
              bonus: 2.355,
              score: 9.72,
              warnings: [],
              malus: 0,
              notes: [
                'trick number #8 (twisted left Misty Flip) has been ignored because more than 5 twist tricks have been flown'
              ]
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 16658,
              civlid: 16658,
              name: 'François Ragolski',
              link: 'https://civlcomps.org/pilot/16658/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/166/ec5a13e5a30ff9211043332e6b3571c0/9bdfbe5e83ae910fe53a12ecdefc6799.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:52.763356',
              rank: 42
            },
            team: null,
            tricks: [
              {
                name: 'twisted right Esfera',
                acronym: '/RE',
                technical_coefficient: 1.95,
                bonus: 6,
                bonus_types: ['twist'],
                base_trick: 'Esfera',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Cowboy',
                acronym: '/LC',
                technical_coefficient: 1.9,
                bonus: 4,
                bonus_types: ['twist'],
                base_trick: 'Cowboy',
                uniqueness: ['left']
              },
              {
                name: 'left Twister',
                acronym: 'LHH',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Twister',
                uniqueness: ['left']
              },
              {
                name: 'right Helicopter to SAT reverse',
                acronym: 'RHSR',
                technical_coefficient: 1.85,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'twisted left Rythmic SAT',
                acronym: '/LR',
                technical_coefficient: 1.95,
                bonus: 5.5,
                bonus_types: ['twist'],
                base_trick: 'Rythmic SAT',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Joker reverse',
                acronym: '/RJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'twisted left X-Chopper',
                acronym: '/LX',
                technical_coefficient: 1.7,
                bonus: 3.5,
                bonus_types: ['twist'],
                base_trick: 'X-Chopper',
                uniqueness: ['left']
              },
              {
                name: 'twisted Super Stall',
                acronym: '/SS',
                technical_coefficient: 1.6,
                bonus: 2.5,
                bonus_types: ['twist'],
                base_trick: 'Super Stall',
                uniqueness: []
              },
              {
                name: 'twisted left Misty to Helicopter reverse',
                acronym: '/LMHR',
                technical_coefficient: 1.75,
                bonus: 6,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'Misty to Misty',
                acronym: 'MM',
                technical_coefficient: 1.75,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty to Misty',
                uniqueness: []
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 5.333,
                choreography: 6,
                landing: 6.833,
                synchro: 0
              },
              technicity: 1.95,
              bonus_percentage: 32.5,
              technical: 4.16,
              choreography: 2.4,
              landing: 1.367,
              synchro: 0,
              bonus: 2.132,
              score: 10.059,
              warnings: [],
              malus: 0,
              notes: [
                'trick number #8 (twisted Super Stall) has been ignored because more than 5 twist tricks have been flown',
                'trick number #9 (twisted left Misty to Helicopter reverse) has been ignored because more than 5 twist tricks have been flown'
              ]
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 23150,
              civlid: 23150,
              name: 'Andrés Villamizar',
              link: 'https://civlcomps.org/pilot/23150/ranking?discipline_id=5',
              country: 'col',
              about: 'There is no public information at this time. Please, check back later.',
              links: [
                {
                  name: 'instagram',
                  link: 'https://www.instagram.com/acroandres/?hl=en'
                },
                {
                  name: 'facebook',
                  link: 'https://www.facebook.com/acroandres'
                }
              ],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/231/3cf3e1ce9c914794f7e55d4ab0ad7572/401c84376171a0936b19d1a5f1d5b50f.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:49:09.502643',
              rank: 5
            },
            team: null,
            tricks: [
              {
                name: 'Flat Stall to Infinity Tumbling',
                acronym: 'FSI',
                technical_coefficient: 2.1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Flat Stall to Infinity Tumbling',
                uniqueness: []
              },
              {
                name: 'twisted left Corkscrew reverse',
                acronym: '/LKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'right Helicopter to SAT reverse',
                acronym: 'RHSR',
                technical_coefficient: 1.85,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'twisted right Tumbling',
                acronym: '/RT',
                technical_coefficient: 1.8,
                bonus: 3.5,
                bonus_types: ['twist'],
                base_trick: 'Tumbling',
                uniqueness: ['right']
              },
              {
                name: 'twisted right Cowboy',
                acronym: '/RC',
                technical_coefficient: 1.9,
                bonus: 4,
                bonus_types: ['twist'],
                base_trick: 'Cowboy',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Joker reverse',
                acronym: '/LJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.5,
                choreography: 7.167,
                landing: 2.833,
                synchro: 0
              },
              technicity: 1.983,
              bonus_percentage: 29.5,
              technical: 5.157,
              choreography: 2.867,
              landing: 0.567,
              synchro: 0,
              bonus: 2.367,
              score: 10.457,
              warnings: ['Flat Stall to Infinity Tumbling must be the first maneuver'],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 30294,
              civlid: 30294,
              name: 'Lukas Neu',
              link: 'https://civlcomps.org/pilot/30294/ranking?discipline_id=5',
              country: 'deu',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:30.512523',
              rank: 6
            },
            team: null,
            tricks: [
              {
                name: 'twisted right Tumbling',
                acronym: '/RT',
                technical_coefficient: 1.8,
                bonus: 3.5,
                bonus_types: ['twist'],
                base_trick: 'Tumbling',
                uniqueness: ['right']
              },
              {
                name: 'twisted right Misty to Helicopter',
                acronym: '/RMH',
                technical_coefficient: 1.75,
                bonus: 3,
                bonus_types: ['twist'],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Cowboy',
                acronym: '/LC',
                technical_coefficient: 1.9,
                bonus: 4,
                bonus_types: ['twist'],
                base_trick: 'Cowboy',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Joker reverse',
                acronym: '/RJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'twisted right Corkscrew reverse',
                acronym: '/RKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'left Twister',
                acronym: 'LHH',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Twister',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.833,
                choreography: 6.833,
                landing: 4.667,
                synchro: 0
              },
              technicity: 1.917,
              bonus_percentage: 28.5,
              technical: 5.239,
              choreography: 2.733,
              landing: 0.933,
              synchro: 0,
              bonus: 2.272,
              score: 11.178,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 78952,
              civlid: 78952,
              name: 'Axel Coste',
              link: 'https://civlcomps.org/pilot/78952/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:47:05.523243',
              rank: 19
            },
            team: null,
            tricks: [
              {
                name: 'twisted left Joker reverse',
                acronym: '/LJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'right Helicopter to SAT',
                acronym: 'RHS',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Tumbling',
                acronym: '/LT',
                technical_coefficient: 1.8,
                bonus: 3.5,
                bonus_types: ['twist'],
                base_trick: 'Tumbling',
                uniqueness: ['left']
              },
              {
                name: 'twisted left Mac Twist to Helicopter',
                acronym: '/LMCH',
                technical_coefficient: 1.85,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Corkscrew reverse',
                acronym: '/RKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'right Misty to Helicopter reverse',
                acronym: 'RMHR',
                technical_coefficient: 1.75,
                bonus: 3,
                bonus_types: ['reverse'],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['reverse', 'right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 7,
                choreography: 7.5,
                landing: 3.667,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 29,
              technical: 5.32,
              choreography: 3,
              landing: 0.733,
              synchro: 0,
              bonus: 2.413,
              score: 11.466,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 61812,
              civlid: 61812,
              name: 'Mael Jimenez',
              link: 'https://civlcomps.org/pilot/61812/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [
                {
                  name: 'instagram',
                  link: 'Http://instagram.com/mael_jmz'
                }
              ],
              sponsors: [
                {
                  name: 'AirG Products',
                  link: 'https://airg.family/',
                  img: 'https://civlcomps.org/images/no-image.png'
                },
                {
                  name: 'Phieres Products',
                  link: 'https://www.phieres.com/',
                  img: 'https://civlcomps.org/images/no-image.png'
                }
              ],
              photo:
                'https://civlcomps.org/uploads/images/profile/618/efa7614c82de1fe4ad303e8d631d409e/bc7886c5970ed4a3cf0cea8cd56e4c55.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:47:51.618893',
              rank: 9
            },
            team: null,
            tricks: [
              {
                name: 'Flat Stall to Infinity Tumbling',
                acronym: 'FSI',
                technical_coefficient: 2.1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Flat Stall to Infinity Tumbling',
                uniqueness: []
              },
              {
                name: 'twisted right Misty to SAT',
                acronym: '/RMS',
                technical_coefficient: 1.7,
                bonus: 3,
                bonus_types: ['twist'],
                base_trick: 'Misty to SAT',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Corkscrew reverse',
                acronym: '/LKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'right Helicopter to SAT reverse',
                acronym: 'RHSR',
                technical_coefficient: 1.85,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'twisted right Joker',
                acronym: '/RJ',
                technical_coefficient: 1.95,
                bonus: 5,
                bonus_types: ['twist'],
                base_trick: 'Joker',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Misty Flip twisted exit',
                acronym: '/LM/',
                technical_coefficient: 1.65,
                bonus: 7,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Mac Twist to Helicopter reverse',
                acronym: '/RMCHR',
                technical_coefficient: 1.85,
                bonus: 8,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['reverse', 'right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 7.667,
                choreography: 7.333,
                landing: 1.167,
                synchro: 0
              },
              technicity: 1.983,
              bonus_percentage: 35.5,
              technical: 6.082,
              choreography: 2.933,
              landing: 0.233,
              synchro: 0,
              bonus: 3.201,
              score: 12.449,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 67619,
              civlid: 67619,
              name: 'Luke de Weert',
              link: 'https://civlcomps.org/pilot/67619/ranking?discipline_id=5',
              country: 'nld',
              about:
                '"I am an athlete who believes that dedication is the core of the thing that keeps me pushing and motivating me to achieve all my goals, and even set new goals where I never thought it was possible."',
              links: [
                {
                  name: 'facebook',
                  link: 'https://www.facebook.com/deweert.luke'
                },
                {
                  name: 'instagram',
                  link: 'https://www.instagram.com/luke_deweert/'
                },
                {
                  name: 'twitter',
                  link: 'https://twitter.com/luke_deweert'
                },
                {
                  name: 'youtube',
                  link: 'https://www.youtube.com/lukedeweert'
                },
                {
                  name: 'Website',
                  link: 'https://lukedeweert.nl'
                },
                {
                  name: 'Tiktok',
                  link: 'https://www.tiktok.com/@lukedeweert'
                }
              ],
              sponsors: [
                {
                  name: 'Sky Paragliders',
                  link: 'https://sky-cz.com/en',
                  img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/4cbe1ebac175a9cde7a4c9d8769ba0c4/509e4e83c097d02828403b5a67e8c0b5.png'
                },
                {
                  name: 'Sinner',
                  link: 'https://www.sinner.eu/nl/',
                  img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/dddccfa819ee01d9b2410ba49fa432fc/eeff42d05ffefb8ef945dc83485007ea.png'
                },
                {
                  name: 'Wanbound',
                  link: 'https://www.wanbound.com/',
                  img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/aa675f347b7d7933332df96f08b21199/4ff22ae0404446f203ba682751e1e7b8.png'
                },
                {
                  name: 'KNVvL',
                  link: 'https://www.knvvl.nl/',
                  img: 'https://civlcomps.org/uploads/images/ems_event_sponsor_logo/1/53ee05f2c2172541b7f1dd99e67a59f9/0f68789e476c0494019a750a6da9c6aa.png'
                }
              ],
              photo:
                'https://civlcomps.org/uploads/images/profile/676/7bdecbee5d2246b1ebc14248dc1af935/8bfbe7e62a481a19145c55c9dc97e6ab.jpeg',
              background_picture:
                'https://civlcomps.org/uploads/images/pilot_header/9/c017697641aa9ef817c4c17728e9e6d6/08788da048eea61f93be8591e97f6a0c.jpg',
              last_update: '2022-07-06T22:47:20.705999',
              rank: 2
            },
            team: null,
            tricks: [
              {
                name: 'twisted left Corkscrew reverse',
                acronym: '/LKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted right Misty Flip twisted exit',
                acronym: '/RM/',
                technical_coefficient: 1.65,
                bonus: 7,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Tumbling twisted exit',
                acronym: '/LT/',
                technical_coefficient: 1.8,
                bonus: 9.5,
                bonus_types: ['twist'],
                base_trick: 'Tumbling',
                uniqueness: ['left']
              },
              {
                name: 'twisted Misty to Misty twisted exit',
                acronym: '/MM/',
                technical_coefficient: 1.75,
                bonus: 9,
                bonus_types: ['twist'],
                base_trick: 'Misty to Misty',
                uniqueness: []
              },
              {
                name: 'twisted left Joker',
                acronym: '/LJ',
                technical_coefficient: 1.95,
                bonus: 5,
                bonus_types: ['twist'],
                base_trick: 'Joker',
                uniqueness: ['left']
              },
              {
                name: 'left Helicopter to SAT reverse',
                acronym: 'LHSR',
                technical_coefficient: 1.85,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'right Mac Twist to Helicopter reverse',
                acronym: 'RMCHR',
                technical_coefficient: 1.85,
                bonus: 3.5,
                bonus_types: ['reverse'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'Super Stall',
                acronym: 'SS',
                technical_coefficient: 1.6,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Super Stall',
                uniqueness: []
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 8.667,
                choreography: 7.667,
                landing: 3,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 46.5,
              technical: 6.587,
              choreography: 3.067,
              landing: 0.6,
              synchro: 0,
              bonus: 4.489,
              score: 14.742,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 46598,
              civlid: 46598,
              name: 'Bicho Carrera',
              link: 'https://civlcomps.org/pilot/46598/ranking?discipline_id=5',
              country: 'cze',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/465/dc992024787dbe0c471be1dc9a7973d5/aeaf24da98cfc57ee3c8d3021d0a665c.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:46:49.568258',
              rank: 3
            },
            team: null,
            tricks: [
              {
                name: 'twisted right Joker',
                acronym: '/RJ',
                technical_coefficient: 1.95,
                bonus: 5,
                bonus_types: ['twist'],
                base_trick: 'Joker',
                uniqueness: ['right']
              },
              {
                name: 'left Misty to SAT devil twist',
                acronym: 'LMSX',
                technical_coefficient: 1.7,
                bonus: 6,
                bonus_types: ['twist'],
                base_trick: 'Misty to SAT',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Corkscrew reverse',
                acronym: '/RKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'left Helicopter to SAT reverse',
                acronym: 'LHSR',
                technical_coefficient: 1.85,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted Misty to Misty twisted exit',
                acronym: '/MM/',
                technical_coefficient: 1.75,
                bonus: 9,
                bonus_types: ['twist'],
                base_trick: 'Misty to Misty',
                uniqueness: []
              },
              {
                name: 'twisted left Joker',
                acronym: '/LJ',
                technical_coefficient: 1.95,
                bonus: 5,
                bonus_types: ['twist'],
                base_trick: 'Joker',
                uniqueness: ['left']
              },
              {
                name: 'Super Stall flip',
                acronym: 'SSF',
                technical_coefficient: 1.6,
                bonus: 4.5,
                bonus_types: ['flip'],
                base_trick: 'Super Stall',
                uniqueness: []
              },
              {
                name: 'right Mac Twist to Helicopter reverse',
                acronym: 'RMCHR',
                technical_coefficient: 1.85,
                bonus: 3.5,
                bonus_types: ['reverse'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'left Misty to Helicopter reverse',
                acronym: 'LMHR',
                technical_coefficient: 1.75,
                bonus: 3,
                bonus_types: ['reverse'],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted left Cowboy',
                acronym: '/LC',
                technical_coefficient: 1.9,
                bonus: 4,
                bonus_types: ['twist'],
                base_trick: 'Cowboy',
                uniqueness: ['left']
              },
              {
                name: 'right Cowboy',
                acronym: 'RC',
                technical_coefficient: 1.9,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Cowboy',
                uniqueness: ['right']
              },
              {
                name: 'right Misty to Helicopter',
                acronym: 'RMH',
                technical_coefficient: 1.75,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['right']
              },
              {
                name: 'Wingovers',
                acronym: 'W',
                technical_coefficient: 1.35,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Wingovers',
                uniqueness: []
              },
              {
                name: 'left X-Chopper',
                acronym: 'LX',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'X-Chopper',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 8.167,
                choreography: 8.667,
                landing: 4.167,
                synchro: 0
              },
              technicity: 1.933,
              bonus_percentage: 45.5,
              technical: 6.316,
              choreography: 3.467,
              landing: 0.833,
              synchro: 0,
              bonus: 4.451,
              score: 15.066,
              warnings: [],
              malus: 0,
              notes: [
                'trick number #9 (left Misty to Helicopter reverse) has been ignored because more than 3 reverse tricks have been flown',
                'trick number #10 (twisted left Cowboy) has been ignored because more than 5 twist tricks have been flown'
              ]
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 26069,
              civlid: 26069,
              name: 'Théo De Blic',
              link: 'https://civlcomps.org/pilot/26069/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/260/7fcd2025c420c2d6c459ee70dcb0b0da/695688d2f89e9f0b7983e0d94e5f2958.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:47:13.813370',
              rank: 1
            },
            team: null,
            tricks: [
              {
                name: 'twisted right Mac Twist to Helicopter reverse',
                acronym: '/RMCHR',
                technical_coefficient: 1.85,
                bonus: 8,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'right Misty to SAT devil twist',
                acronym: 'RMSX',
                technical_coefficient: 1.7,
                bonus: 6,
                bonus_types: ['twist'],
                base_trick: 'Misty to SAT',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Tumbling twisted exit',
                acronym: '/LT/',
                technical_coefficient: 1.8,
                bonus: 9.5,
                bonus_types: ['twist'],
                base_trick: 'Tumbling',
                uniqueness: ['left']
              },
              {
                name: 'twisted left Misty Flip twisted exit',
                acronym: '/LM/',
                technical_coefficient: 1.65,
                bonus: 7,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Joker reverse',
                acronym: '/RJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'left Corkscrew reverse',
                acronym: 'LKR',
                technical_coefficient: 1.9,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'right Mac Twist',
                acronym: 'RMC',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist',
                uniqueness: ['right']
              },
              {
                name: 'Super Stall',
                acronym: 'SS',
                technical_coefficient: 1.6,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Super Stall',
                uniqueness: []
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 9.167,
                choreography: 9,
                landing: 2.167,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 44,
              technical: 6.967,
              choreography: 3.6,
              landing: 0.433,
              synchro: 0,
              bonus: 4.649,
              score: 15.649,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          }
        ]
      },
      {
        final: false,
        type: 'solo',
        results: [
          {
            pilot: {
              _id: 23654,
              civlid: 23654,
              name: 'Cesar Arevalo Urrego',
              link: 'https://civlcomps.org/pilot/23654/ranking?discipline_id=5',
              country: 'col',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/236/66458ac5a311c78bf3be4e9ffe87507a/b2fc26ebca72c35fcc91164354efef26.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:46:04.094115',
              rank: 7
            },
            team: null,
            tricks: [
              {
                name: 'Super Stall to Infinity Tumbling',
                acronym: 'SSI',
                technical_coefficient: 2.05,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Super Stall to Infinity Tumbling',
                uniqueness: []
              },
              {
                name: 'right Twister',
                acronym: 'RHH',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Twister',
                uniqueness: ['right']
              },
              {
                name: 'left Helicopter to SAT',
                acronym: 'LHS',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Joker',
                acronym: '/RJ',
                technical_coefficient: 1.95,
                bonus: 5,
                bonus_types: ['twist'],
                base_trick: 'Joker',
                uniqueness: ['right']
              },
              {
                name: 'twisted right Helicopter to SAT',
                acronym: '/RHS',
                technical_coefficient: 1.85,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['right']
              },
              {
                name: 'twisted right Mac Twist to Helicopter reverse',
                acronym: '/RMCHR',
                technical_coefficient: 1.85,
                bonus: 8,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'twisted right Corkscrew',
                acronym: '/RK',
                technical_coefficient: 1.9,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Corkscrew',
                uniqueness: ['right']
              },
              {
                name: 'left Misty to Helicopter reverse',
                acronym: 'LMHR',
                technical_coefficient: 1.75,
                bonus: 3,
                bonus_types: ['reverse'],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['reverse', 'left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 5.667,
                choreography: 6.333,
                landing: 1,
                synchro: 0
              },
              technicity: 1.967,
              bonus_percentage: 25,
              technical: 4.458,
              choreography: 2.533,
              landing: 0.2,
              synchro: 0,
              bonus: 1.748,
              score: 8.939,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 68308,
              civlid: 68308,
              name: 'Marco Papa',
              link: 'https://civlcomps.org/pilot/68308/ranking?discipline_id=5',
              country: 'ita',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/683/22a05ab0f67326a3bddc1dc194093720/bb1c51953e149f8c7d538d487fb77d79.jpg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:37.147479',
              rank: 10
            },
            team: null,
            tricks: [
              {
                name: 'twisted right Mac Twist to Helicopter reverse',
                acronym: '/RMCHR',
                technical_coefficient: 1.85,
                bonus: 8,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'twisted left Corkscrew reverse',
                acronym: '/LKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted right Joker',
                acronym: '/RJ',
                technical_coefficient: 1.95,
                bonus: 5,
                bonus_types: ['twist'],
                base_trick: 'Joker',
                uniqueness: ['right']
              },
              {
                name: 'Misty to Misty',
                acronym: 'MM',
                technical_coefficient: 1.75,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty to Misty',
                uniqueness: []
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.833,
                choreography: 5.833,
                landing: 7.5,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 8.5,
              technical: 5.193,
              choreography: 2.333,
              landing: 1.5,
              synchro: 0,
              bonus: 0.64,
              score: 9.666,
              warnings: [],
              malus: 13,
              notes: [
                'trick number #2 (twisted left Corkscrew reverse) has already been performed in a previous run. Adding a 13.0% malus.'
              ]
            },
            published: false,
            warnings: []
          }
        ]
      }
    ]
  }
}

export default CompetitionsPage
