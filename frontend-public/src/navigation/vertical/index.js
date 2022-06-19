// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import Account from 'mdi-material-ui/Account'
import AccountCowboyHat from 'mdi-material-ui/AccountCowboyHat'
import AccountGroup from 'mdi-material-ui/AccountGroup'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/account-settings'
    },
    {
      sectionTitle: 'User Interface'
    },
    {
      title: 'Competitions',
      icon: Account,
      path: '/competitions'
    },
    {
      title: 'Pilots',
      icon: Account,
      path: '/pilots'
    },

    {
      title: 'Pilots',
      icon: Account,
      path: '/pilots2'
    },
    {
      title: 'Teams',
      icon: AccountGroup,
      path: '/teams'
    },
    {
      title: 'Judges',
      icon: AccountCowboyHat,
      path: '/judges'
    },
    {
      title: 'Tricks',
      icon: FormatLetterCase,
      path: '/tricks'
    },
  ]
}

export default navigation
