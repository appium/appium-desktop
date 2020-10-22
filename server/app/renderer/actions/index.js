import * as configActions from './Config';
import * as inspectorActions from './Inspector';
import * as serverMonitorActions from './ServerMonitor';
import * as sessionActions from './Session';
import * as startServerActions from './StartServer';
import * as updaterActions from './Updater';

export default {
  ...configActions,
  ...inspectorActions,
  ...serverMonitorActions,
  ...sessionActions,
  ...startServerActions,
  ...updaterActions,
};
