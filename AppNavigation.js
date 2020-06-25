import List from './views/list';
import Home from './views/home';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const Routes = createAppContainer(
  createStackNavigator({
    List: List,
    Home: Home,
  })
);

export default Routes;