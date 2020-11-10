import * as configActions from './Config';
import * as serverMonitorActions from './ServerMonitor';
import * as startServerActions from './StartServer';
import * as updaterActions from '../../../../shared/actions/Updater';

export default {
  ...configActions,
  ...serverMonitorActions,
  ...startServerActions,
  ...updaterActions,
};
