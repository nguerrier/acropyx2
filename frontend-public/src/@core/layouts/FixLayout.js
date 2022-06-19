// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

import Header from './components/fix/Header'

// ** Navigation Imports
import FixNavItems from 'src/navigation/fix'

// Styled component for Blank Layout component
const BlankLayoutWrapper = styled(Box)(({ theme }) => ({
  height: '100vh',

  // For V1 Blank layout pages
  '& .content-center': {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5)
  },

  // For V2 Blank layout pages
  '& .content-right': {
    display: 'flex',
    minHeight: '100vh',
    overflowX: 'hidden',
    position: 'relative'
  }
}))

const sections = [
  { title: 'Technology', url: '#' },
  { title: 'Design', url: '#' },
  { title: 'Culture', url: '#' },
  { title: 'Business', url: '#' },
  { title: 'Politics', url: '#' },
  { title: 'Opinion', url: '#' },
  { title: 'Science', url: '#' },
  { title: 'Health', url: '#' },
  { title: 'Style', url: '#' },
  { title: 'Travel', url: '#' },
];

const BlankLayout = ({ children }) => {
  return (
    <Container maxWidth='lg'>
      <BlankLayoutWrapper className='layout-wrapper'>
        <Header title="Acropyx" sections={FixNavItems()} />
        <Box className='app-content' sx={{ minHeight: '100vh', overflowX: 'hidden', position: 'relative', padding: '10px' }}>
          {children}
        </Box>
      </BlankLayoutWrapper>
    </Container>
  )
}

export default BlankLayout
