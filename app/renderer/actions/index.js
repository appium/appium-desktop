import * as configActions from './Config';
import * as serverMonitorActions from './ServerMonitor';
import * as startServerActions from './StartServer';
import * as updaterActions from '../../../gui-common/actions/Updater';

export default {
  ...configActions,
  ...serverMonitorActions,
  ...startServerActions,
  ...updaterActions,
};
