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
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import GavelIcon from '@mui/icons-material/Gavel';

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
  const [value, setValue] = useState('results')

  const handleChange = (event, newValue) => {
    setValue(newValue)
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
              { <TabPilots pilots={data.pilots} /> }
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='judges'>
              { <TabJudges judges={data.judges} /> }
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='results'>
              {<TabResults results={data.results} />}
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
  return { paths, fallback: false }
}

// This gets called on every request
export async function getStaticProps({ params }) {
  let data = await get(`public/competitions/${params.cid}`)

  //let data = mockData;

  // Pass data to the page via props
  return { props: { data }, revalidate: 10 }
}

const mockData = {
  _id: '62c21b2bb8249f3bf0370a2e',
  name: 'Championnats de france 2022',
  code: 'fr2022',
  start_date: '2022-07-04',
  end_date: '2022-07-06',
  location: 'Lery-Poses',
  published: true,
  type: 'solo',
  pilots: [
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
      _id: 78953,
      civlid: 78953,
      name: 'Maud Perrin',
      link: 'https://civlcomps.org/pilot/78953/ranking?discipline_id=5',
      country: 'fra',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo:
        'https://civlcomps.org/uploads/images/profile/789/a5e5a6dd4232aae03d20f765877a2d22/aa2ae98574e1b3ad32a6f1e995a0d740.jpeg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:48:44.538600',
      rank: 52
    },
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
      _id: 83156,
      civlid: 83156,
      name: 'Vincent Tornare',
      link: 'https://civlcomps.org/pilot/83156/ranking?discipline_id=5',
      country: 'che',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo:
        'https://civlcomps.org/uploads/images/profile/831/46247a1226cb65e1a96b8320ed0309c8/d2cfb59af8b1821edfd84b67541f7d45.jpeg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:49:01.165355',
      rank: 9999
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
      _id: 52908,
      civlid: 52908,
      name: 'Jose Luis Zuluaga Garcia',
      link: 'https://civlcomps.org/pilot/52908/ranking?discipline_id=5',
      country: 'col',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo:
        'https://civlcomps.org/uploads/images/profile/529/7c62e9eefb27c00b6b0ac302479f66a1/de19fabbf66737fd8c62a272e28d2762.jpg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:49:17.246300',
      rank: 53
    },
    {
      _id: 26928,
      civlid: 26928,
      name: 'Paul Nodet',
      link: 'https://civlcomps.org/pilot/26928',
      country: 'fra',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo: 'https://civlcomps.org/images/default-images/user/man.svg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-05T06:27:15.374597',
      rank: 59
    },
    {
      _id: 64202,
      civlid: 64202,
      name: 'Juliette Liso-y-Claret',
      link: 'https://civlcomps.org/pilot/64202/ranking?discipline_id=5',
      country: 'fra',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo: 'https://civlcomps.org/images/default-images/user/woman.svg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:48:22.638086',
      rank: 49
    },
    {
      _id: 83594,
      civlid: 83594,
      name: 'Julien Marcer',
      link: 'https://civlcomps.org/pilot/83594',
      country: 'fra',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo: 'https://civlcomps.org/images/default-images/user/man.svg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-03T22:46:01.855560',
      rank: 9999
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
      _id: 68629,
      civlid: 68629,
      name: 'Florian Landreau',
      link: 'https://civlcomps.org/pilot/68629/ranking?discipline_id=5',
      country: 'fra',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo: 'https://civlcomps.org/images/default-images/user/man.svg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-07T10:19:30.954059',
      rank: 61
    },
    {
      _id: 83575,
      civlid: 83575,
      name: 'marien lang',
      link: 'https://civlcomps.org/pilot/83575',
      country: 'fra',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo: 'https://civlcomps.org/images/default-images/user/man.svg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-03T22:45:20.032052',
      rank: 9999
    },
    {
      _id: 61707,
      civlid: 61707,
      name: 'leconte carole',
      link: 'https://civlcomps.org/pilot/61707/ranking?discipline_id=5',
      country: 'fra',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo: 'https://civlcomps.org/images/default-images/user/woman.svg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:48:14.019649',
      rank: 9999
    },
    {
      _id: 83729,
      civlid: 83729,
      name: 'Yannick Garel',
      link: 'https://civlcomps.org/pilot/83729/ranking?discipline_id=5',
      country: 'fra',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo: 'https://civlcomps.org/images/default-images/user/man.svg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:47:38.868054',
      rank: 9999
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
      _id: 43845,
      civlid: 43845,
      name: 'Maxime Casamayou',
      link: 'https://civlcomps.org/pilot/43845/ranking?discipline_id=5',
      country: 'fra',
      about: 'There is no public information at this time. Please, check back later.',
      links: [],
      sponsors: [],
      photo:
        'https://civlcomps.org/uploads/images/profile/438/cb5f1a08d1ec4f9436cba33c6d916b27/6834be2b3c5dcd325849967f466ec6dc.jpg',
      background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
      last_update: '2022-07-06T22:46:56.163746',
      rank: 58
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
    }
  ],
  teams: [],
  judges: [
    {
      _id: '62c21f1fb8249f3bf0370a30',
      name: 'Didier Rokotavao',
      country: 'fra',
      level: 'trainee',
      civlid: null,
      deleted: null
    },
    {
      _id: '629d5ebd91f562bf6c1c5135',
      name: 'Julien Grosse',
      country: 'fra',
      level: 'certified',
      civlid: 79290,
      deleted: null
    },
    {
      _id: '629cfff354e27dc8592dd69c',
      name: 'Jerome Loyet',
      country: 'fra',
      level: 'senior',
      civlid: 33732,
      deleted: null
    },
    {
      _id: '62b97685e27b127bd177a8d8',
      name: 'Nicolas Guerrier',
      country: 'fra',
      level: 'trainee',
      civlid: null,
      deleted: null
    }
  ],
  state: 'closed',
  results: {
    final: true,
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
        result_per_run: [
          {
            rank: 1,
            score: 15.191
          },
          {
            rank: 1,
            score: 16.694
          },
          {
            rank: 1,
            score: 16.123
          }
        ],
        score: 48.007999999999996
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
        result_per_run: [
          {
            rank: 2,
            score: 14.497
          },
          {
            rank: 4,
            score: 13.873
          },
          {
            rank: 2,
            score: 14.583
          }
        ],
        score: 42.952999999999996
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
        result_per_run: [
          {
            rank: 3,
            score: 13.317
          },
          {
            rank: 2,
            score: 14.123
          },
          {
            rank: 3,
            score: 13.818
          }
        ],
        score: 41.257999999999996
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
        result_per_run: [
          {
            rank: 4,
            score: 13.011
          },
          {
            rank: 3,
            score: 13.905
          },
          {
            rank: 4,
            score: 13.266
          }
        ],
        score: 40.181999999999995
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
        result_per_run: [
          {
            rank: 5,
            score: 11.533
          },
          {
            rank: 5,
            score: 13.198
          },
          {
            rank: 5,
            score: 12.144
          }
        ],
        score: 36.875
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
        result_per_run: [
          {
            rank: 8,
            score: 10.477
          },
          {
            rank: 6,
            score: 10.896
          },
          {
            rank: 6,
            score: 11.03
          }
        ],
        score: 32.403
      },
      {
        pilot: {
          _id: 43845,
          civlid: 43845,
          name: 'Maxime Casamayou',
          link: 'https://civlcomps.org/pilot/43845/ranking?discipline_id=5',
          country: 'fra',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo:
            'https://civlcomps.org/uploads/images/profile/438/cb5f1a08d1ec4f9436cba33c6d916b27/6834be2b3c5dcd325849967f466ec6dc.jpg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:46:56.163746',
          rank: 58
        },
        result_per_run: [
          {
            rank: 11,
            score: 9.219
          },
          {
            rank: 9,
            score: 9.143
          },
          {
            rank: 7,
            score: 10.038
          }
        ],
        score: 28.400000000000002
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
        result_per_run: [
          {
            rank: 6,
            score: 11.287
          },
          {
            rank: 7,
            score: 9.853
          },
          {
            rank: 12,
            score: 5.621
          }
        ],
        score: 26.761000000000003
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
        result_per_run: [
          {
            rank: 9,
            score: 9.846
          },
          {
            rank: 14,
            score: 6.054
          },
          {
            rank: 8,
            score: 9.7
          }
        ],
        score: 25.6
      },
      {
        pilot: {
          _id: 78953,
          civlid: 78953,
          name: 'Maud Perrin',
          link: 'https://civlcomps.org/pilot/78953/ranking?discipline_id=5',
          country: 'fra',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo:
            'https://civlcomps.org/uploads/images/profile/789/a5e5a6dd4232aae03d20f765877a2d22/aa2ae98574e1b3ad32a6f1e995a0d740.jpeg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:48:44.538600',
          rank: 52
        },
        result_per_run: [
          {
            rank: 12,
            score: 9.05
          },
          {
            rank: 10,
            score: 8.738
          },
          {
            rank: 10,
            score: 7.739
          }
        ],
        score: 25.527
      },
      {
        pilot: {
          _id: 83156,
          civlid: 83156,
          name: 'Vincent Tornare',
          link: 'https://civlcomps.org/pilot/83156/ranking?discipline_id=5',
          country: 'che',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo:
            'https://civlcomps.org/uploads/images/profile/831/46247a1226cb65e1a96b8320ed0309c8/d2cfb59af8b1821edfd84b67541f7d45.jpeg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:49:01.165355',
          rank: 9999
        },
        result_per_run: [
          {
            rank: 14,
            score: 7.253
          },
          {
            rank: 12,
            score: 6.884
          },
          {
            rank: 9,
            score: 9.44
          }
        ],
        score: 23.576999999999998
      },
      {
        pilot: {
          _id: 52908,
          civlid: 52908,
          name: 'Jose Luis Zuluaga Garcia',
          link: 'https://civlcomps.org/pilot/52908/ranking?discipline_id=5',
          country: 'col',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo:
            'https://civlcomps.org/uploads/images/profile/529/7c62e9eefb27c00b6b0ac302479f66a1/de19fabbf66737fd8c62a272e28d2762.jpg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:49:17.246300',
          rank: 53
        },
        result_per_run: [
          {
            rank: 13,
            score: 8.494
          },
          {
            rank: 11,
            score: 6.938
          },
          {
            rank: 11,
            score: 6.527
          }
        ],
        score: 21.959
      },
      {
        pilot: {
          _id: 68629,
          civlid: 68629,
          name: 'Florian Landreau',
          link: 'https://civlcomps.org/pilot/68629/ranking?discipline_id=5',
          country: 'fra',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo: 'https://civlcomps.org/images/default-images/user/man.svg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-07T10:19:30.954059',
          rank: 61
        },
        result_per_run: [
          {
            rank: 10,
            score: 9.533
          },
          {
            rank: 8,
            score: 9.274
          },
          {
            rank: 17,
            score: 2.742
          }
        ],
        score: 21.549
      },
      {
        pilot: {
          _id: 64202,
          civlid: 64202,
          name: 'Juliette Liso-y-Claret',
          link: 'https://civlcomps.org/pilot/64202/ranking?discipline_id=5',
          country: 'fra',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo: 'https://civlcomps.org/images/default-images/user/woman.svg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:48:22.638086',
          rank: 49
        },
        result_per_run: [
          {
            rank: 15,
            score: 6.003
          },
          {
            rank: 13,
            score: 6.134
          },
          {
            rank: 14,
            score: 4.251
          }
        ],
        score: 16.388
      },
      {
        pilot: {
          _id: 26928,
          civlid: 26928,
          name: 'Paul Nodet',
          link: 'https://civlcomps.org/pilot/26928',
          country: 'fra',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo: 'https://civlcomps.org/images/default-images/user/man.svg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-05T06:27:15.374597',
          rank: 59
        },
        result_per_run: [
          {
            rank: 16,
            score: 5.553
          },
          {
            rank: 15,
            score: 4.581
          },
          {
            rank: 13,
            score: 4.592
          }
        ],
        score: 14.725999999999999
      },
      {
        pilot: {
          _id: 83729,
          civlid: 83729,
          name: 'Yannick Garel',
          link: 'https://civlcomps.org/pilot/83729/ranking?discipline_id=5',
          country: 'fra',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo: 'https://civlcomps.org/images/default-images/user/man.svg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:47:38.868054',
          rank: 9999
        },
        result_per_run: [
          {
            rank: 18,
            score: 4.623
          },
          {
            rank: 16,
            score: 3.579
          },
          {
            rank: 16,
            score: 2.914
          }
        ],
        score: 11.116
      },
      {
        pilot: {
          _id: 61707,
          civlid: 61707,
          name: 'leconte carole',
          link: 'https://civlcomps.org/pilot/61707/ranking?discipline_id=5',
          country: 'fra',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo: 'https://civlcomps.org/images/default-images/user/woman.svg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-06T22:48:14.019649',
          rank: 9999
        },
        result_per_run: [
          {
            rank: 17,
            score: 4.769
          },
          {
            rank: 18,
            score: 2.291
          },
          {
            rank: 15,
            score: 3.76
          }
        ],
        score: 10.82
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
        result_per_run: [
          {
            rank: 7,
            score: 10.706
          },
          {
            rank: 19,
            score: 0
          },
          {
            rank: 20,
            score: 0
          }
        ],
        score: 10.706
      },
      {
        pilot: {
          _id: 83575,
          civlid: 83575,
          name: 'marien lang',
          link: 'https://civlcomps.org/pilot/83575',
          country: 'fra',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo: 'https://civlcomps.org/images/default-images/user/man.svg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-03T22:45:20.032052',
          rank: 9999
        },
        result_per_run: [
          {
            rank: 20,
            score: 2.433
          },
          {
            rank: 17,
            score: 3.283
          },
          {
            rank: 19,
            score: 2.157
          }
        ],
        score: 7.872999999999999
      },
      {
        pilot: {
          _id: 83594,
          civlid: 83594,
          name: 'Julien Marcer',
          link: 'https://civlcomps.org/pilot/83594',
          country: 'fra',
          about: 'There is no public information at this time. Please, check back later.',
          links: [],
          sponsors: [],
          photo: 'https://civlcomps.org/images/default-images/user/man.svg',
          background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
          last_update: '2022-07-03T22:46:01.855560',
          rank: 9999
        },
        result_per_run: [
          {
            rank: 19,
            score: 3.86
          },
          {
            rank: 20,
            score: 0
          },
          {
            rank: 18,
            score: 2.698
          }
        ],
        score: 6.558
      }
    ],
    runs_results: [
      {
        final: true,
        type: 'solo',
        results: [
          {
            pilot: {
              _id: 83575,
              civlid: 83575,
              name: 'marien lang',
              link: 'https://civlcomps.org/pilot/83575',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-03T22:45:20.032052',
              rank: 9999
            },
            tricks: [
              {
                name: 'right Helicopter',
                acronym: 'RH',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Helicopter',
                uniqueness: ['right']
              },
              {
                name: 'right Helicopter',
                acronym: 'RH',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Helicopter',
                uniqueness: ['right']
              },
              {
                name: 'left Tumbling',
                acronym: 'LT',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Tumbling',
                uniqueness: ['left']
              },
              {
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'right Mac Twist',
                acronym: 'RMC',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 2.083,
                choreography: 2.375,
                landing: 1.75,
                synchro: 0
              },
              technicity: 1.733,
              bonus_percentage: -13,
              technical: 1.444,
              choreography: 0.95,
              landing: 0.35,
              synchro: 0,
              bonus: -0.311,
              score: 2.433,
              warnings: [],
              malus: 13,
              notes: [
                'trick number #2 (right Helicopter) has already been performed in this run. Adding a 13.0% malus.'
              ]
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 83594,
              civlid: 83594,
              name: 'Julien Marcer',
              link: 'https://civlcomps.org/pilot/83594',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-03T22:46:01.855560',
              rank: 9999
            },
            tricks: [
              {
                name: 'right Helicopter',
                acronym: 'RH',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Helicopter',
                uniqueness: ['right']
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
                name: 'left Anti-Rythmic SAT',
                acronym: 'LA',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Anti-Rythmic SAT',
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
                name: 'right Mac Twist',
                acronym: 'RMC',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 3.542,
                choreography: 3.042,
                landing: 0.583,
                synchro: 0
              },
              technicity: 1.783,
              bonus_percentage: 0,
              technical: 2.526,
              choreography: 1.217,
              landing: 0.117,
              synchro: 0,
              bonus: 0,
              score: 3.86,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 83729,
              civlid: 83729,
              name: 'Yannick Garel',
              link: 'https://civlcomps.org/pilot/83729/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:47:38.868054',
              rank: 9999
            },
            tricks: [
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
                name: 'right Looping',
                acronym: 'RL',
                technical_coefficient: 1.5,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Looping',
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
                technical: 4.042,
                choreography: 2.5,
                landing: 4.375,
                synchro: 0
              },
              technicity: 1.7,
              bonus_percentage: 0,
              technical: 2.748,
              choreography: 1,
              landing: 0.875,
              synchro: 0,
              bonus: 0,
              score: 4.623,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 61707,
              civlid: 61707,
              name: 'leconte carole',
              link: 'https://civlcomps.org/pilot/61707/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/woman.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:14.019649',
              rank: 9999
            },
            tricks: [
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
                name: 'right Rythmic SAT',
                acronym: 'RR',
                technical_coefficient: 1.95,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Rythmic SAT',
                uniqueness: ['right']
              },
              {
                name: 'right Helicopter',
                acronym: 'RH',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Helicopter',
                uniqueness: ['right']
              },
              {
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'right Mac Twist',
                acronym: 'RMC',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 4.458,
                choreography: 3.75,
                landing: 0,
                synchro: 0
              },
              technicity: 1.833,
              bonus_percentage: 0,
              technical: 3.269,
              choreography: 1.5,
              landing: 0,
              synchro: 0,
              bonus: 0,
              score: 4.769,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 26928,
              civlid: 26928,
              name: 'Paul Nodet',
              link: 'https://civlcomps.org/pilot/26928',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-05T06:27:15.374597',
              rank: 59
            },
            tricks: [
              {
                name: 'left Esfera',
                acronym: 'LE',
                technical_coefficient: 1.95,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Esfera',
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
                name: 'right Corkscrew',
                acronym: 'RK',
                technical_coefficient: 1.9,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Corkscrew',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 4.167,
                choreography: 4.5,
                landing: 2.542,
                synchro: 0
              },
              technicity: 1.817,
              bonus_percentage: 4.5,
              technical: 3.028,
              choreography: 1.8,
              landing: 0.508,
              synchro: 0,
              bonus: 0.217,
              score: 5.553,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 64202,
              civlid: 64202,
              name: 'Juliette Liso-y-Claret',
              link: 'https://civlcomps.org/pilot/64202/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/woman.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:22.638086',
              rank: 49
            },
            tricks: [
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
                name: 'right Rythmic SAT',
                acronym: 'RR',
                technical_coefficient: 1.95,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Rythmic SAT',
                uniqueness: ['right']
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
                name: 'left Misty Flip',
                acronym: 'LM',
                technical_coefficient: 1.65,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty Flip',
                uniqueness: ['left']
              },
              {
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'left Mac Twist to Helicopter',
                acronym: 'LMCH',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 5,
                choreography: 4.667,
                landing: 0.583,
                synchro: 0
              },
              technicity: 1.883,
              bonus_percentage: 4.5,
              technical: 3.767,
              choreography: 1.867,
              landing: 0.117,
              synchro: 0,
              bonus: 0.254,
              score: 6.003,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 83156,
              civlid: 83156,
              name: 'Vincent Tornare',
              link: 'https://civlcomps.org/pilot/83156/ranking?discipline_id=5',
              country: 'che',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/831/46247a1226cb65e1a96b8320ed0309c8/d2cfb59af8b1821edfd84b67541f7d45.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:49:01.165355',
              rank: 9999
            },
            tricks: [
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
                name: 'right Helicopter to SAT',
                acronym: 'RHS',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['right']
              },
              {
                name: 'left Joker reverse',
                acronym: 'LJR',
                technical_coefficient: 1.95,
                bonus: 4.5,
                bonus_types: ['reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'left']
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
                technical: 5.5,
                choreography: 5.667,
                landing: 0,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 12.5,
              technical: 4.18,
              choreography: 2.267,
              landing: 0,
              synchro: 0,
              bonus: 0.806,
              score: 7.253,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 52908,
              civlid: 52908,
              name: 'Jose Luis Zuluaga Garcia',
              link: 'https://civlcomps.org/pilot/52908/ranking?discipline_id=5',
              country: 'col',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/529/7c62e9eefb27c00b6b0ac302479f66a1/de19fabbf66737fd8c62a272e28d2762.jpg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:49:17.246300',
              rank: 53
            },
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
                name: 'right Helicopter to SAT',
                acronym: 'RHS',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['right']
              },
              {
                name: 'right SAT to Helicopter',
                acronym: 'RSH',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'SAT to Helicopter',
                uniqueness: ['right']
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
                name: 'right Corkscrew',
                acronym: 'RK',
                technical_coefficient: 1.9,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Corkscrew',
                uniqueness: ['right']
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
                name: 'Super Stall',
                acronym: 'SS',
                technical_coefficient: 1.6,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Super Stall',
                uniqueness: []
              },
              {
                name: 'left Misty Flip',
                acronym: 'LM',
                technical_coefficient: 1.65,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty Flip',
                uniqueness: ['left']
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
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'right Helicopter',
                acronym: 'RH',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Helicopter',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6,
                choreography: 6.583,
                landing: 3.625,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 8,
              technical: 4.56,
              choreography: 2.633,
              landing: 0.725,
              synchro: 0,
              bonus: 0.575,
              score: 8.494,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 78953,
              civlid: 78953,
              name: 'Maud Perrin',
              link: 'https://civlcomps.org/pilot/78953/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/789/a5e5a6dd4232aae03d20f765877a2d22/aa2ae98574e1b3ad32a6f1e995a0d740.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:44.538600',
              rank: 52
            },
            tricks: [
              {
                name: 'right Corkscrew reverse',
                acronym: 'RKR',
                technical_coefficient: 1.9,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'right']
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
                name: 'right Joker reverse',
                acronym: 'RJR',
                technical_coefficient: 1.95,
                bonus: 4.5,
                bonus_types: ['reverse'],
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
                name: 'left Mac Twist',
                acronym: 'LMC',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist',
                uniqueness: ['left']
              },
              {
                name: 'left Misty Flip',
                acronym: 'LM',
                technical_coefficient: 1.65,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty Flip',
                uniqueness: ['left']
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
                technical: 5.958,
                choreography: 6.833,
                landing: 4.583,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 12,
              technical: 4.528,
              choreography: 2.733,
              landing: 0.917,
              synchro: 0,
              bonus: 0.871,
              score: 9.05,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 43845,
              civlid: 43845,
              name: 'Maxime Casamayou',
              link: 'https://civlcomps.org/pilot/43845/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/438/cb5f1a08d1ec4f9436cba33c6d916b27/6834be2b3c5dcd325849967f466ec6dc.jpg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:46:56.163746',
              rank: 58
            },
            tricks: [
              {
                name: 'twisted right Infinity Tumbling',
                acronym: '/RI',
                technical_coefficient: 1.85,
                bonus: 3.5,
                bonus_types: ['twist'],
                base_trick: 'Infinity Tumbling',
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
                name: 'left Misty to Helicopter reverse',
                acronym: 'LMHR',
                technical_coefficient: 1.75,
                bonus: 3,
                bonus_types: ['reverse'],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'twisted right Mac Twist',
                acronym: '/RMC',
                technical_coefficient: 1.7,
                bonus: 3.5,
                bonus_types: ['twist'],
                base_trick: 'Mac Twist',
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
                technical: 5.917,
                choreography: 6.417,
                landing: 2.167,
                synchro: 0
              },
              technicity: 1.85,
              bonus_percentage: 26.5,
              technical: 4.378,
              choreography: 2.567,
              landing: 0.433,
              synchro: 0,
              bonus: 1.84,
              score: 9.219,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 68629,
              civlid: 68629,
              name: 'Florian Landreau',
              link: 'https://civlcomps.org/pilot/68629/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-07T10:19:30.954059',
              rank: 61
            },
            tricks: [
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
                name: 'left Corkscrew',
                acronym: 'LK',
                technical_coefficient: 1.9,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Corkscrew',
                uniqueness: ['left']
              },
              {
                name: 'twisted right Misty Flip',
                acronym: '/RM',
                technical_coefficient: 1.65,
                bonus: 2.5,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
                uniqueness: ['right']
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
                name: 'right Misty to Helicopter reverse',
                acronym: 'RMHR',
                technical_coefficient: 1.75,
                bonus: 3,
                bonus_types: ['reverse'],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'right Mac Twist',
                acronym: 'RMC',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6,
                choreography: 6.167,
                landing: 4.625,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 22.5,
              technical: 4.56,
              choreography: 2.467,
              landing: 0.925,
              synchro: 0,
              bonus: 1.581,
              score: 9.533,
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
                name: 'twisted right Corkscrew',
                acronym: '/RK',
                technical_coefficient: 1.9,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Corkscrew',
                uniqueness: ['right']
              },
              {
                name: 'right Twister',
                acronym: 'RHH',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Twister',
                uniqueness: []
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
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.708,
                choreography: 6.708,
                landing: 1.292,
                synchro: 0
              },
              technicity: 1.917,
              bonus_percentage: 22.5,
              technical: 5.143,
              choreography: 2.683,
              landing: 0.258,
              synchro: 0,
              bonus: 1.761,
              score: 9.846,
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
                name: 'twisted left Mac Twist to Helicopter',
                acronym: '/LMCH',
                technical_coefficient: 1.85,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Mac Twist to Helicopter',
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
              },
              {
                name: 'twisted right Mac Twist to Helicopter',
                acronym: '/RMCH',
                technical_coefficient: 1.85,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.75,
                choreography: 7.625,
                landing: 0,
                synchro: 0
              },
              technicity: 1.95,
              bonus_percentage: 26,
              technical: 5.265,
              choreography: 3.05,
              landing: 0,
              synchro: 0,
              bonus: 2.162,
              score: 10.477,
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
                name: 'right Mac Twist',
                acronym: 'RMC',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist',
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
              },
              {
                name: 'right Misty Flip',
                acronym: 'RM',
                technical_coefficient: 1.65,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty Flip',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.75,
                choreography: 8.417,
                landing: 3.25,
                synchro: 0
              },
              technicity: 1.95,
              bonus_percentage: 16.5,
              technical: 5.265,
              choreography: 3.367,
              landing: 0.65,
              synchro: 0,
              bonus: 1.424,
              score: 10.706,
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
                name: 'twisted right Tumbling twisted exit',
                acronym: '/RT/',
                technical_coefficient: 1.8,
                bonus: 9.5,
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
                name: 'left Mac Twist to Helicopter reverse',
                acronym: 'LMCHR',
                technical_coefficient: 1.85,
                bonus: 3.5,
                bonus_types: ['reverse'],
                base_trick: 'Mac Twist to Helicopter',
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
                technical: 6.792,
                choreography: 6.875,
                landing: 2.417,
                synchro: 0
              },
              technicity: 1.967,
              bonus_percentage: 33.5,
              technical: 5.343,
              choreography: 2.75,
              landing: 0.483,
              synchro: 0,
              bonus: 2.711,
              score: 11.287,
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
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 7.25,
                choreography: 8.417,
                landing: 0,
                synchro: 0
              },
              technicity: 2.033,
              bonus_percentage: 24.5,
              technical: 5.897,
              choreography: 3.367,
              landing: 0,
              synchro: 0,
              bonus: 2.27,
              score: 11.533,
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
                name: 'twisted right Corkscrew reverse',
                acronym: '/RKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'right']
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
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 7.75,
                choreography: 8.292,
                landing: 1.875,
                synchro: 0
              },
              technicity: 1.983,
              bonus_percentage: 33.5,
              technical: 6.148,
              choreography: 3.317,
              landing: 0.375,
              synchro: 0,
              bonus: 3.171,
              score: 13.011,
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
                technical: 7.583,
                choreography: 8.292,
                landing: 4.625,
                synchro: 0
              },
              technicity: 1.967,
              bonus_percentage: 33.5,
              technical: 5.966,
              choreography: 3.317,
              landing: 0.925,
              synchro: 0,
              bonus: 3.11,
              score: 13.317,
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
                name: 'twisted left Mac Twist to Helicopter',
                acronym: '/LMCH',
                technical_coefficient: 1.85,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 8.667,
                choreography: 9.167,
                landing: 2.5,
                synchro: 0
              },
              technicity: 1.967,
              bonus_percentage: 33.5,
              technical: 6.818,
              choreography: 3.667,
              landing: 0.5,
              synchro: 0,
              bonus: 3.512,
              score: 14.497,
              warnings: [],
              malus: 0,
              notes: []
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
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 8.75,
                choreography: 8.75,
                landing: 2.875,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 44,
              technical: 6.65,
              choreography: 3.5,
              landing: 0.575,
              synchro: 0,
              bonus: 4.466,
              score: 15.191,
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
              _id: 83594,
              civlid: 83594,
              name: 'Julien Marcer',
              link: 'https://civlcomps.org/pilot/83594',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-03T22:46:01.855560',
              rank: 9999
            },
            tricks: [],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 0,
                choreography: 0,
                landing: 0,
                synchro: 0
              },
              technicity: 0,
              bonus_percentage: 0,
              technical: 0,
              choreography: 0,
              landing: 0,
              synchro: 0,
              bonus: 0,
              score: 0,
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
            tricks: [],
            marks: [],
            did_not_start: true,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 0,
                choreography: 0,
                landing: 0,
                synchro: 0
              },
              technicity: 0,
              bonus_percentage: 0,
              technical: 0,
              choreography: 0,
              landing: 0,
              synchro: 0,
              bonus: 0,
              score: 0,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 61707,
              civlid: 61707,
              name: 'leconte carole',
              link: 'https://civlcomps.org/pilot/61707/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/woman.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:14.019649',
              rank: 9999
            },
            tricks: [
              {
                name: 'left Rythmic SAT',
                acronym: 'LR',
                technical_coefficient: 1.95,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Rythmic SAT',
                uniqueness: ['left']
              },
              {
                name: 'right Corkscrew',
                acronym: 'RK',
                technical_coefficient: 1.9,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Corkscrew',
                uniqueness: ['right']
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
                technical: 2.125,
                choreography: 2.292,
                landing: 0,
                synchro: 0
              },
              technicity: 1.617,
              bonus_percentage: 0,
              technical: 1.374,
              choreography: 0.917,
              landing: 0,
              synchro: 0,
              bonus: 0,
              score: 2.291,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 83575,
              civlid: 83575,
              name: 'marien lang',
              link: 'https://civlcomps.org/pilot/83575',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-03T22:45:20.032052',
              rank: 9999
            },
            tricks: [
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
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'left Mac Twist',
                acronym: 'LMC',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist',
                uniqueness: ['left']
              },
              {
                name: 'Misty to Misty',
                acronym: 'MM',
                technical_coefficient: 1.75,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty to Misty',
                uniqueness: []
              },
              {
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
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
                technical: 3.083,
                choreography: 2.208,
                landing: 1,
                synchro: 0
              },
              technicity: 1.783,
              bonus_percentage: 0,
              technical: 2.199,
              choreography: 0.883,
              landing: 0.2,
              synchro: 0,
              bonus: 0,
              score: 3.283,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 83729,
              civlid: 83729,
              name: 'Yannick Garel',
              link: 'https://civlcomps.org/pilot/83729/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:47:38.868054',
              rank: 9999
            },
            tricks: [
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
                name: 'right Misty Flip',
                acronym: 'RM',
                technical_coefficient: 1.65,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty Flip',
                uniqueness: ['right']
              },
              {
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'left Misty to SAT',
                acronym: 'LMS',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty to SAT',
                uniqueness: ['left']
              },
              {
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'right Helicopter',
                acronym: 'RH',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Helicopter',
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
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 3.042,
                choreography: 2.125,
                landing: 3,
                synchro: 0
              },
              technicity: 1.75,
              bonus_percentage: 0,
              technical: 2.129,
              choreography: 0.85,
              landing: 0.6,
              synchro: 0,
              bonus: 0,
              score: 3.579,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 26928,
              civlid: 26928,
              name: 'Paul Nodet',
              link: 'https://civlcomps.org/pilot/26928',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-05T06:27:15.374597',
              rank: 59
            },
            tricks: [
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
                name: 'right Anti-Rythmic SAT',
                acronym: 'RA',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Anti-Rythmic SAT',
                uniqueness: ['right']
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
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 3.958,
                choreography: 3.333,
                landing: 2.25,
                synchro: 0
              },
              technicity: 1.767,
              bonus_percentage: 0,
              technical: 2.797,
              choreography: 1.333,
              landing: 0.45,
              synchro: 0,
              bonus: 0,
              score: 4.581,
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
            tricks: [
              {
                name: 'twisted right Infinity Tumbling',
                acronym: '/RI',
                technical_coefficient: 1.85,
                bonus: 3.5,
                bonus_types: ['twist'],
                base_trick: 'Infinity Tumbling',
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
                technical: 4.708,
                choreography: 5.167,
                landing: 2,
                synchro: 0
              },
              technicity: 1.583,
              bonus_percentage: 12,
              technical: 2.982,
              choreography: 2.067,
              landing: 0.4,
              synchro: 0,
              bonus: 0.606,
              score: 6.054,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 64202,
              civlid: 64202,
              name: 'Juliette Liso-y-Claret',
              link: 'https://civlcomps.org/pilot/64202/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/woman.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:22.638086',
              rank: 49
            },
            tricks: [
              {
                name: 'right Infinity Tumbling',
                acronym: 'RI',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Infinity Tumbling',
                uniqueness: ['right']
              },
              {
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'right Misty to SAT',
                acronym: 'RMS',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty to SAT',
                uniqueness: ['right']
              },
              {
                name: 'right SAT to Helicopter',
                acronym: 'RSH',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'SAT to Helicopter',
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
              },
              {
                name: 'left Mac Twist',
                acronym: 'LMC',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist',
                uniqueness: ['left']
              },
              {
                name: 'left Looping',
                acronym: 'LL',
                technical_coefficient: 1.5,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Looping',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 4.542,
                choreography: 5.625,
                landing: 2.917,
                synchro: 0
              },
              technicity: 1.817,
              bonus_percentage: 0,
              technical: 3.3,
              choreography: 2.25,
              landing: 0.583,
              synchro: 0,
              bonus: 0,
              score: 6.134,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 83156,
              civlid: 83156,
              name: 'Vincent Tornare',
              link: 'https://civlcomps.org/pilot/83156/ranking?discipline_id=5',
              country: 'che',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/831/46247a1226cb65e1a96b8320ed0309c8/d2cfb59af8b1821edfd84b67541f7d45.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:49:01.165355',
              rank: 9999
            },
            tricks: [
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
                name: 'left Helicopter to SAT',
                acronym: 'LHS',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['left']
              },
              {
                name: 'left Rythmic SAT',
                acronym: 'LR',
                technical_coefficient: 1.95,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Rythmic SAT',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.458,
                choreography: 4.417,
                landing: 2.042,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 4.5,
              technical: 4.908,
              choreography: 1.767,
              landing: 0.408,
              synchro: 0,
              bonus: 0.3,
              score: 6.884,
              warnings: ['Rythmic as last maneuver'],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: ['Rythmic as last maneuver']
          },
          {
            pilot: {
              _id: 52908,
              civlid: 52908,
              name: 'Jose Luis Zuluaga Garcia',
              link: 'https://civlcomps.org/pilot/52908/ranking?discipline_id=5',
              country: 'col',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/529/7c62e9eefb27c00b6b0ac302479f66a1/de19fabbf66737fd8c62a272e28d2762.jpg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:49:17.246300',
              rank: 53
            },
            tricks: [
              {
                name: 'twisted right Infinity Tumbling',
                acronym: '/RI',
                technical_coefficient: 1.85,
                bonus: 3.5,
                bonus_types: ['twist'],
                base_trick: 'Infinity Tumbling',
                uniqueness: ['right']
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
                name: 'right Twister',
                acronym: 'RHH',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Twister',
                uniqueness: ['right']
              },
              {
                name: 'right Joker reverse',
                acronym: 'RJR',
                technical_coefficient: 1.95,
                bonus: 4.5,
                bonus_types: ['reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 5.708,
                choreography: 4.667,
                landing: 0,
                synchro: 0
              },
              technicity: 1.883,
              bonus_percentage: 12.5,
              technical: 4.3,
              choreography: 1.867,
              landing: 0,
              synchro: 0,
              bonus: 0.771,
              score: 6.938,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 78953,
              civlid: 78953,
              name: 'Maud Perrin',
              link: 'https://civlcomps.org/pilot/78953/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/789/a5e5a6dd4232aae03d20f765877a2d22/aa2ae98574e1b3ad32a6f1e995a0d740.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:44.538600',
              rank: 52
            },
            tricks: [
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
                name: 'right Helicopter to SAT',
                acronym: 'RHS',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['right']
              },
              {
                name: 'left Joker reverse',
                acronym: 'LJR',
                technical_coefficient: 1.95,
                bonus: 4.5,
                bonus_types: ['reverse'],
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
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.667,
                choreography: 6.583,
                landing: 1.917,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 8.5,
              technical: 5.067,
              choreography: 2.633,
              landing: 0.383,
              synchro: 0,
              bonus: 0.654,
              score: 8.738,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 43845,
              civlid: 43845,
              name: 'Maxime Casamayou',
              link: 'https://civlcomps.org/pilot/43845/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/438/cb5f1a08d1ec4f9436cba33c6d916b27/6834be2b3c5dcd325849967f466ec6dc.jpg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:46:56.163746',
              rank: 58
            },
            tricks: [
              {
                name: 'right Joker reverse',
                acronym: 'RJR',
                technical_coefficient: 1.95,
                bonus: 4.5,
                bonus_types: ['reverse'],
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
                name: 'twisted right Corkscrew',
                acronym: '/RK',
                technical_coefficient: 1.9,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Corkscrew',
                uniqueness: ['right']
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
                name: 'left Mac Twist to Helicopter reverse',
                acronym: 'LMCHR',
                technical_coefficient: 1.85,
                bonus: 3.5,
                bonus_types: ['reverse'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['reverse', 'left']
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
                technical: 6.458,
                choreography: 5.875,
                landing: 2.167,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 20,
              technical: 4.908,
              choreography: 2.35,
              landing: 0.433,
              synchro: 0,
              bonus: 1.452,
              score: 9.143,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 68629,
              civlid: 68629,
              name: 'Florian Landreau',
              link: 'https://civlcomps.org/pilot/68629/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-07T10:19:30.954059',
              rank: 61
            },
            tricks: [
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
                name: 'left Helicopter to SAT',
                acronym: 'LHS',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['left']
              },
              {
                name: 'left Rythmic SAT',
                acronym: 'LR',
                technical_coefficient: 1.95,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Rythmic SAT',
                uniqueness: ['left']
              },
              {
                name: 'twisted left Misty to SAT',
                acronym: '/LMS',
                technical_coefficient: 1.7,
                bonus: 3,
                bonus_types: ['twist'],
                base_trick: 'Misty to SAT',
                uniqueness: ['left']
              },
              {
                name: 'right Corkscrew reverse',
                acronym: 'RKR',
                technical_coefficient: 1.9,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.708,
                choreography: 6.292,
                landing: 3.917,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 11.5,
              technical: 5.098,
              choreography: 2.517,
              landing: 0.783,
              synchro: 0,
              bonus: 0.876,
              score: 9.274,
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
                name: 'twisted right Joker reverse',
                acronym: '/RJR',
                technical_coefficient: 1.95,
                bonus: 9.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'right']
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
                name: 'twisted right Corkscrew',
                acronym: '/RK',
                technical_coefficient: 1.9,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Corkscrew',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 7.458,
                choreography: 6.5,
                landing: 1,
                synchro: 0
              },
              technicity: 1.967,
              bonus_percentage: 14,
              technical: 5.867,
              choreography: 2.6,
              landing: 0.2,
              synchro: 0,
              bonus: 1.185,
              score: 9.853,
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
            tricks: [
              {
                name: 'Super Stall to Infinity Tumbling full twisted',
                acronym: 'SSI\\',
                technical_coefficient: 2.05,
                bonus: 8.5,
                bonus_types: ['twist'],
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
                name: 'right Helicopter to SAT reverse',
                acronym: 'RHSR',
                technical_coefficient: 1.85,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'twisted left Mac Twist',
                acronym: '/LMC',
                technical_coefficient: 1.7,
                bonus: 3.5,
                bonus_types: ['twist'],
                base_trick: 'Mac Twist',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.25,
                choreography: 7.333,
                landing: 2.75,
                synchro: 0
              },
              technicity: 1.95,
              bonus_percentage: 32.5,
              technical: 4.875,
              choreography: 2.933,
              landing: 0.55,
              synchro: 0,
              bonus: 2.538,
              score: 10.896,
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
                name: 'twisted left Tumbling twisted exit',
                acronym: '/LT/',
                technical_coefficient: 1.8,
                bonus: 9.5,
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
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 7.917,
                choreography: 8.25,
                landing: 4.5,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 32,
              technical: 6.017,
              choreography: 3.3,
              landing: 0.9,
              synchro: 0,
              bonus: 2.981,
              score: 13.198,
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
                technical: 8.5,
                choreography: 8.458,
                landing: 2.083,
                synchro: 0
              },
              technicity: 1.883,
              bonus_percentage: 37.5,
              technical: 6.403,
              choreography: 3.383,
              landing: 0.417,
              synchro: 0,
              bonus: 3.67,
              score: 13.873,
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
                name: 'Super Stall to Infinity Tumbling',
                acronym: 'SSI',
                technical_coefficient: 2.05,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Super Stall to Infinity Tumbling',
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
                name: 'twisted right Helicopter to SAT reverse',
                acronym: '/RHSR',
                technical_coefficient: 1.85,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'twisted left Misty Flip twisted exit',
                acronym: '/LM/',
                technical_coefficient: 1.65,
                bonus: 7,
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
                technical: 8.5,
                choreography: 8.542,
                landing: 2.083,
                synchro: 0
              },
              technicity: 1.967,
              bonus_percentage: 33.5,
              technical: 6.687,
              choreography: 3.417,
              landing: 0.417,
              synchro: 0,
              bonus: 3.385,
              score: 13.905,
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
                name: 'twisted left Misty Flip twisted exit',
                acronym: '/LM/',
                technical_coefficient: 1.65,
                bonus: 7,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
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
                name: 'twisted left Corkscrew reverse',
                acronym: '/LKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
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
                technical: 9,
                choreography: 8.167,
                landing: 3.75,
                synchro: 0
              },
              technicity: 1.983,
              bonus_percentage: 28.5,
              technical: 7.14,
              choreography: 3.267,
              landing: 0.75,
              synchro: 0,
              bonus: 2.966,
              score: 14.123,
              warnings: [],
              malus: 0,
              notes: []
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
                technical: 9.417,
                choreography: 9.542,
                landing: 7.167,
                synchro: 0
              },
              technicity: 1.933,
              bonus_percentage: 37.5,
              technical: 7.282,
              choreography: 3.817,
              landing: 1.433,
              synchro: 0,
              bonus: 4.162,
              score: 16.694,
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
            tricks: [],
            marks: [],
            did_not_start: true,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 0,
                choreography: 0,
                landing: 0,
                synchro: 0
              },
              technicity: 0,
              bonus_percentage: 0,
              technical: 0,
              choreography: 0,
              landing: 0,
              synchro: 0,
              bonus: 0,
              score: 0,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 83575,
              civlid: 83575,
              name: 'marien lang',
              link: 'https://civlcomps.org/pilot/83575',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-03T22:45:20.032052',
              rank: 9999
            },
            tricks: [
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
                name: 'right Misty to SAT',
                acronym: 'RMS',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty to SAT',
                uniqueness: ['right']
              },
              {
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'left Misty to SAT',
                acronym: 'LMS',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty to SAT',
                uniqueness: ['left']
              },
              {
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'right Mac Twist',
                acronym: 'RMC',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 1.333,
                choreography: 1.875,
                landing: 3.5,
                synchro: 0
              },
              technicity: 1.733,
              bonus_percentage: -13,
              technical: 0.924,
              choreography: 0.75,
              landing: 0.7,
              synchro: 0,
              bonus: -0.218,
              score: 2.157,
              warnings: [],
              malus: 13,
              notes: [
                'trick number #6 (right Mac Twist) has already been performed in a previous run. Adding a 13.0% malus.'
              ]
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 83594,
              civlid: 83594,
              name: 'Julien Marcer',
              link: 'https://civlcomps.org/pilot/83594',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-03T22:46:01.855560',
              rank: 9999
            },
            tricks: [
              {
                name: 'right Misty to SAT',
                acronym: 'RMS',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty to SAT',
                uniqueness: ['right']
              },
              {
                name: 'right Rythmic SAT',
                acronym: 'RR',
                technical_coefficient: 1.95,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Rythmic SAT',
                uniqueness: ['right']
              },
              {
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'left Mac Twist',
                acronym: 'LMC',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist',
                uniqueness: ['left']
              },
              {
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'left Misty Flip',
                acronym: 'LM',
                technical_coefficient: 1.65,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty Flip',
                uniqueness: ['left']
              },
              {
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'left Asymetric SAT',
                acronym: 'LAS',
                technical_coefficient: 1.55,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Asymetric SAT',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 2.333,
                choreography: 2.083,
                landing: 1,
                synchro: 0
              },
              technicity: 1.783,
              bonus_percentage: 0,
              technical: 1.664,
              choreography: 0.833,
              landing: 0.2,
              synchro: 0,
              bonus: 0,
              score: 2.698,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 68629,
              civlid: 68629,
              name: 'Florian Landreau',
              link: 'https://civlcomps.org/pilot/68629/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-07T10:19:30.954059',
              rank: 61
            },
            tricks: [
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
                name: 'right Rythmic SAT',
                acronym: 'RR',
                technical_coefficient: 1.95,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Rythmic SAT',
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
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 3,
                choreography: 1.5,
                landing: 1.125,
                synchro: 0
              },
              technicity: 1.85,
              bonus_percentage: 7,
              technical: 2.22,
              choreography: 0.6,
              landing: 0.225,
              synchro: 0,
              bonus: 0.197,
              score: 2.742,
              warnings: ['no 2 maneuvers after Rythmic SAT'],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 83729,
              civlid: 83729,
              name: 'Yannick Garel',
              link: 'https://civlcomps.org/pilot/83729/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:47:38.868054',
              rank: 9999
            },
            tricks: [
              {
                name: 'left Tumbling',
                acronym: 'LT',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Tumbling',
                uniqueness: ['left']
              },
              {
                name: 'right Mac Twist to Helicopter',
                acronym: 'RMCH',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['right']
              },
              {
                name: 'right Misty to SAT',
                acronym: 'RMS',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty to SAT',
                uniqueness: ['right']
              },
              {
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
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
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
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
                technical: 2.542,
                choreography: 1.333,
                landing: 2.583,
                synchro: 0
              },
              technicity: 1.833,
              bonus_percentage: 0,
              technical: 1.864,
              choreography: 0.533,
              landing: 0.517,
              synchro: 0,
              bonus: 0,
              score: 2.914,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 61707,
              civlid: 61707,
              name: 'leconte carole',
              link: 'https://civlcomps.org/pilot/61707/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/woman.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:14.019649',
              rank: 9999
            },
            tricks: [
              {
                name: 'right Infinity Tumbling',
                acronym: 'RI',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Infinity Tumbling',
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
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'right Mac Twist to Helicopter',
                acronym: 'RMCH',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['right']
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
                technical: 4,
                choreography: 2.667,
                landing: 0,
                synchro: 0
              },
              technicity: 1.683,
              bonus_percentage: 0,
              technical: 2.693,
              choreography: 1.067,
              landing: 0,
              synchro: 0,
              bonus: 0,
              score: 3.76,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 64202,
              civlid: 64202,
              name: 'Juliette Liso-y-Claret',
              link: 'https://civlcomps.org/pilot/64202/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/woman.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:22.638086',
              rank: 49
            },
            tricks: [
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
                name: 'Full Stall',
                acronym: 'FS',
                technical_coefficient: 1,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'left Misty to SAT',
                acronym: 'LMS',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty to SAT',
                uniqueness: ['left']
              },
              {
                name: 'left SAT to Helicopter',
                acronym: 'LSH',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'SAT to Helicopter',
                uniqueness: ['left']
              },
              {
                name: 'right Misty Flip',
                acronym: 'RM',
                technical_coefficient: 1.65,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty Flip',
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
                name: 'right Mac Twist',
                acronym: 'RMC',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Mac Twist',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 3.542,
                choreography: 3.125,
                landing: 2.375,
                synchro: 0
              },
              technicity: 1.783,
              bonus_percentage: 0,
              technical: 2.526,
              choreography: 1.25,
              landing: 0.475,
              synchro: 0,
              bonus: 0,
              score: 4.251,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 26928,
              civlid: 26928,
              name: 'Paul Nodet',
              link: 'https://civlcomps.org/pilot/26928',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo: 'https://civlcomps.org/images/default-images/user/man.svg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-05T06:27:15.374597',
              rank: 59
            },
            tricks: [
              {
                name: 'left Anti-Rythmic SAT',
                acronym: 'LA',
                technical_coefficient: 1.8,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Anti-Rythmic SAT',
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
                name: 'twisted right Misty Flip',
                acronym: '/RM',
                technical_coefficient: 1.65,
                bonus: 2.5,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
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
                name: 'left Mac Twist to Helicopter reverse',
                acronym: 'LMCHR',
                technical_coefficient: 1.85,
                bonus: 3.5,
                bonus_types: ['reverse'],
                base_trick: 'Mac Twist to Helicopter',
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
                name: 'left Helicopter to SAT',
                acronym: 'LHS',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 3.333,
                choreography: 3.458,
                landing: 2.958,
                synchro: 0
              },
              technicity: 1.833,
              bonus_percentage: 4.5,
              technical: 2.444,
              choreography: 1.383,
              landing: 0.592,
              synchro: 0,
              bonus: 0.172,
              score: 4.592,
              warnings: [],
              malus: 13,
              notes: [
                'trick number #4 (twisted right Misty Flip twisted exit) has already been performed in this run. Adding a 13.0% malus.'
              ]
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
            tricks: [
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
                name: 'twisted right Infinity Tumbling twisted exit',
                acronym: '/RI/',
                technical_coefficient: 1.85,
                bonus: 9.5,
                bonus_types: ['twist'],
                base_trick: 'Infinity Tumbling',
                uniqueness: ['right']
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
                technical: 4,
                choreography: 3.958,
                landing: 1.458,
                synchro: 0
              },
              technicity: 1.833,
              bonus_percentage: 18,
              technical: 2.933,
              choreography: 1.583,
              landing: 0.292,
              synchro: 0,
              bonus: 0.813,
              score: 5.621,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 52908,
              civlid: 52908,
              name: 'Jose Luis Zuluaga Garcia',
              link: 'https://civlcomps.org/pilot/52908/ranking?discipline_id=5',
              country: 'col',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/529/7c62e9eefb27c00b6b0ac302479f66a1/de19fabbf66737fd8c62a272e28d2762.jpg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:49:17.246300',
              rank: 53
            },
            tricks: [
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
                name: 'twisted left Corkscrew reverse',
                acronym: '/LKR',
                technical_coefficient: 1.9,
                bonus: 8.5,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Corkscrew',
                uniqueness: ['reverse', 'left']
              },
              {
                name: 'left Corkscrew',
                acronym: 'LK',
                technical_coefficient: 1.9,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Corkscrew',
                uniqueness: ['left']
              },
              {
                name: 'right Joker reverse',
                acronym: 'RJR',
                technical_coefficient: 1.95,
                bonus: 4.5,
                bonus_types: ['reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'right']
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
                name: 'twisted Full Stall',
                acronym: '/FS',
                technical_coefficient: 1,
                bonus: 1.5,
                bonus_types: ['twist'],
                base_trick: 'Full Stall',
                uniqueness: []
              },
              {
                name: 'left Misty to SAT',
                acronym: 'LMS',
                technical_coefficient: 1.7,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty to SAT',
                uniqueness: ['left']
              },
              {
                name: 'right Misty Flip',
                acronym: 'RM',
                technical_coefficient: 1.65,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Misty Flip',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 5.083,
                choreography: 4.167,
                landing: 1.708,
                synchro: 0
              },
              technicity: 1.933,
              bonus_percentage: 10.5,
              technical: 3.931,
              choreography: 1.667,
              landing: 0.342,
              synchro: 0,
              bonus: 0.588,
              score: 6.527,
              warnings: [],
              malus: 13,
              notes: [
                'trick number #4 (right Joker reverse) has already been performed in a previous run. Adding a 13.0% malus.'
              ]
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 78953,
              civlid: 78953,
              name: 'Maud Perrin',
              link: 'https://civlcomps.org/pilot/78953/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/789/a5e5a6dd4232aae03d20f765877a2d22/aa2ae98574e1b3ad32a6f1e995a0d740.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:48:44.538600',
              rank: 52
            },
            tricks: [
              {
                name: 'right Joker',
                acronym: 'RJ',
                technical_coefficient: 1.95,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Joker',
                uniqueness: ['right']
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
                name: 'right Infinity Tumbling',
                acronym: 'RI',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Infinity Tumbling',
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
                name: 'left Joker',
                acronym: 'LJ',
                technical_coefficient: 1.95,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Joker',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.042,
                choreography: 6.417,
                landing: 0,
                synchro: 0
              },
              technicity: 1.917,
              bonus_percentage: 7.5,
              technical: 4.632,
              choreography: 2.567,
              landing: 0,
              synchro: 0,
              bonus: 0.54,
              score: 7.739,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 83156,
              civlid: 83156,
              name: 'Vincent Tornare',
              link: 'https://civlcomps.org/pilot/83156/ranking?discipline_id=5',
              country: 'che',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/831/46247a1226cb65e1a96b8320ed0309c8/d2cfb59af8b1821edfd84b67541f7d45.jpeg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:49:01.165355',
              rank: 9999
            },
            tricks: [
              {
                name: 'right Joker reverse',
                acronym: 'RJR',
                technical_coefficient: 1.95,
                bonus: 4.5,
                bonus_types: ['reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'right Infinity Tumbling',
                acronym: 'RI',
                technical_coefficient: 1.85,
                bonus: 0,
                bonus_types: [],
                base_trick: 'Infinity Tumbling',
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
                name: 'twisted left Mac Twist',
                acronym: '/LMC',
                technical_coefficient: 1.7,
                bonus: 3.5,
                bonus_types: ['twist'],
                base_trick: 'Mac Twist',
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
                technical: 6.292,
                choreography: 6.292,
                landing: 3.458,
                synchro: 0
              },
              technicity: 1.85,
              bonus_percentage: 15,
              technical: 4.656,
              choreography: 2.517,
              landing: 0.692,
              synchro: 0,
              bonus: 1.076,
              score: 9.44,
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
                name: 'right Joker reverse',
                acronym: 'RJR',
                technical_coefficient: 1.95,
                bonus: 4.5,
                bonus_types: ['reverse'],
                base_trick: 'Joker',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'twisted right X-Chopper',
                acronym: '/RX',
                technical_coefficient: 1.7,
                bonus: 3.5,
                bonus_types: ['twist'],
                base_trick: 'X-Chopper',
                uniqueness: ['right']
              },
              {
                name: 'twisted right Misty Flip',
                acronym: '/RM',
                technical_coefficient: 1.65,
                bonus: 2.5,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 6.208,
                choreography: 6.208,
                landing: 4.208,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 23,
              technical: 4.718,
              choreography: 2.483,
              landing: 0.842,
              synchro: 0,
              bonus: 1.656,
              score: 9.7,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          },
          {
            pilot: {
              _id: 43845,
              civlid: 43845,
              name: 'Maxime Casamayou',
              link: 'https://civlcomps.org/pilot/43845/ranking?discipline_id=5',
              country: 'fra',
              about: 'There is no public information at this time. Please, check back later.',
              links: [],
              sponsors: [],
              photo:
                'https://civlcomps.org/uploads/images/profile/438/cb5f1a08d1ec4f9436cba33c6d916b27/6834be2b3c5dcd325849967f466ec6dc.jpg',
              background_picture: 'https://civlcomps.org/images/pilot-header.jpg',
              last_update: '2022-07-06T22:46:56.163746',
              rank: 58
            },
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
                name: 'twisted right Mac Twist to Helicopter reverse',
                acronym: '/RMCHR',
                technical_coefficient: 1.85,
                bonus: 8,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Mac Twist to Helicopter',
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
                name: 'twisted left Corkscrew',
                acronym: '/LK',
                technical_coefficient: 1.9,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Corkscrew',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 7,
                choreography: 6.5,
                landing: 0,
                synchro: 0
              },
              technicity: 1.917,
              bonus_percentage: 26,
              technical: 5.367,
              choreography: 2.6,
              landing: 0,
              synchro: 0,
              bonus: 2.071,
              score: 10.038,
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
                name: 'twisted right Helicopter to SAT',
                acronym: '/RHS',
                technical_coefficient: 1.85,
                bonus: 4.5,
                bonus_types: ['twist'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['right']
              },
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
                name: 'twisted right Joker',
                acronym: '/RJ',
                technical_coefficient: 1.95,
                bonus: 5,
                bonus_types: ['twist'],
                base_trick: 'Joker',
                uniqueness: ['right']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 7.208,
                choreography: 5.917,
                landing: 5.417,
                synchro: 0
              },
              technicity: 1.95,
              bonus_percentage: 24.5,
              technical: 5.622,
              choreography: 2.367,
              landing: 1.083,
              synchro: 0,
              bonus: 1.957,
              score: 11.03,
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
                name: 'twisted right Misty Flip twisted exit',
                acronym: '/RM/',
                technical_coefficient: 1.65,
                bonus: 7,
                bonus_types: ['twist'],
                base_trick: 'Misty Flip',
                uniqueness: ['right']
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
                name: 'twisted left Joker',
                acronym: '/LJ',
                technical_coefficient: 1.95,
                bonus: 5,
                bonus_types: ['twist'],
                base_trick: 'Joker',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 7.5,
                choreography: 7.958,
                landing: 0.542,
                synchro: 0
              },
              technicity: 1.967,
              bonus_percentage: 32.5,
              technical: 5.9,
              choreography: 3.183,
              landing: 0.108,
              synchro: 0,
              bonus: 2.952,
              score: 12.144,
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
            tricks: [
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
                name: 'twisted left Helicopter to SAT',
                acronym: '/LHS',
                technical_coefficient: 1.85,
                bonus: 4.5,
                bonus_types: ['twist'],
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
                name: 'right Misty to SAT devil twist',
                acronym: 'RMSX',
                technical_coefficient: 1.7,
                bonus: 6,
                bonus_types: ['twist'],
                base_trick: 'Misty to SAT',
                uniqueness: ['right']
              },
              {
                name: 'twisted left Mac Twist to Helicopter reverse',
                acronym: '/LMCHR',
                technical_coefficient: 1.85,
                bonus: 8,
                bonus_types: ['twist', 'reverse'],
                base_trick: 'Mac Twist to Helicopter',
                uniqueness: ['reverse', 'left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 8.417,
                choreography: 7.958,
                landing: 4.417,
                synchro: 0
              },
              technicity: 1.917,
              bonus_percentage: 28.5,
              technical: 6.453,
              choreography: 3.183,
              landing: 0.883,
              synchro: 0,
              bonus: 2.746,
              score: 13.266,
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
            tricks: [
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
                name: 'right Helicopter to SAT reverse',
                acronym: 'RHSR',
                technical_coefficient: 1.85,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'right']
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
                name: 'twisted Misty to Misty twisted exit',
                acronym: '/MM/',
                technical_coefficient: 1.75,
                bonus: 9,
                bonus_types: ['twist'],
                base_trick: 'Misty to Misty',
                uniqueness: []
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
                name: 'twisted right X-Chopper',
                acronym: '/RX',
                technical_coefficient: 1.7,
                bonus: 3.5,
                bonus_types: ['twist'],
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
                technical: 8.208,
                choreography: 7.917,
                landing: 3.958,
                synchro: 0
              },
              technicity: 1.9,
              bonus_percentage: 38.5,
              technical: 6.238,
              choreography: 3.167,
              landing: 0.792,
              synchro: 0,
              bonus: 3.621,
              score: 13.818,
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
                name: 'left Misty to SAT devil twist',
                acronym: 'LMSX',
                technical_coefficient: 1.7,
                bonus: 6,
                bonus_types: ['twist'],
                base_trick: 'Misty to SAT',
                uniqueness: ['left']
              },
              {
                name: 'right Tumbling devil twist twisted exit',
                acronym: 'RTX/',
                technical_coefficient: 1.8,
                bonus: 11,
                bonus_types: ['twist'],
                base_trick: 'Tumbling',
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
                name: 'twisted left Joker',
                acronym: '/LJ',
                technical_coefficient: 1.95,
                bonus: 5,
                bonus_types: ['twist'],
                base_trick: 'Joker',
                uniqueness: ['left']
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
                technical: 8.917,
                choreography: 8.917,
                landing: 4,
                synchro: 0
              },
              technicity: 1.95,
              bonus_percentage: 31,
              technical: 6.955,
              choreography: 3.567,
              landing: 0.8,
              synchro: 0,
              bonus: 3.262,
              score: 14.583,
              warnings: [],
              malus: 0,
              notes: []
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
            tricks: [
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
                name: 'right Helicopter to SAT reverse',
                acronym: 'RHSR',
                technical_coefficient: 1.85,
                bonus: 4,
                bonus_types: ['reverse'],
                base_trick: 'Helicopter to SAT',
                uniqueness: ['reverse', 'right']
              },
              {
                name: 'twisted right Tumbling twisted exit',
                acronym: '/RT/',
                technical_coefficient: 1.8,
                bonus: 9.5,
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
                name: 'twisted left Misty to Helicopter',
                acronym: '/LMH',
                technical_coefficient: 1.75,
                bonus: 3,
                bonus_types: ['twist'],
                base_trick: 'Misty to Helicopter',
                uniqueness: ['left']
              }
            ],
            marks: [],
            did_not_start: false,
            final_marks: {
              judges_mark: {
                judge: null,
                technical: 9.458,
                choreography: 9,
                landing: 5,
                synchro: 0
              },
              technicity: 1.883,
              bonus_percentage: 41,
              technical: 7.125,
              choreography: 3.6,
              landing: 1,
              synchro: 0,
              bonus: 4.397,
              score: 16.123,
              warnings: [],
              malus: 0,
              notes: []
            },
            published: true,
            warnings: []
          }
        ]
      }
    ]
  }
}

export default CompetitionsPage
