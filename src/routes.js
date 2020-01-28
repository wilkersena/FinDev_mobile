import { createAppContainer } from 'react-navigation';
import { createStackNavigator, HeaderTitle } from 'react-navigation-stack';

import Main from './pages/Main'
import Profile from './pages/Profile'

const Routes = createAppContainer(
  createStackNavigator({
    Main:{
      screen: Main,
      navigationOptions: {
            title: "FinDev"
      },
    },
    Profile:{
       screen: Profile,
       navigationOptions:{
          title: "Perfil do Github"
       },
    },
  },{
     defaultNavigationOptions: {
        headerTintColor: '#FFF',
        headerTitleAlign:'center',
        headerBackTitleVisible: false,
        headerStyle:{
           backgroundColor: '#eb4034',           
        },
     },
  })
);

export default Routes;