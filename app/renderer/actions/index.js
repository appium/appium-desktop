import * as configActions from '../actions/Config';
import * as inspectorActions from '../actions/Inspector';
import * as serverMonitorActions from '../actions/ServerMonitor';
import * as sessionActions from '../actions/Session';
import * as startServerActions from '../actions/StartServer';
import * as updaterActions from '../actions/Updater';

export default {
  ...configActions,
  ...inspectorActions,
  ...serverMonitorActions,
  ...sessionActions,
  ...startServerActions,
  ...updaterActions,
};