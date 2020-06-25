import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import Home from './pages/home';
import List from './pages/list';
import Monitoring from './pages/monitoring';

const Routes = createAppContainer(
    createSwitchNavigator({
        Home,
        List,
        Monitoring,
    })
);

export default Routes;