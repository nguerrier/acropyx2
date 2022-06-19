// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'


// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

const Dashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>
          <Typography variant='h6' gutterBottom>
            Page d'accueil
          </Typography>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
