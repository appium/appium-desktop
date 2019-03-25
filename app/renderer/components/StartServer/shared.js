import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import { DEFAULT_ARGS } from '../../reducers/StartServer';

export const propTypes = {
  serverArgs: PropTypes.object.isRequired,
  serverStarting: PropTypes.bool.isRequired,
  startServer: PropTypes.func.isRequired,
  updateArgs: PropTypes.func.isRequired,
  savePreset: PropTypes.func.isRequired,
  presetSaving: PropTypes.bool.isRequired,
  deletePreset: PropTypes.func.isRequired,
  presetDeleting: PropTypes.bool.isRequired,
};

export function updateArg (evt) {
  const {updateArgs} = this.props;
  let argName = evt.target.name;

  // Backdoor for testing purposes only. This forces an error to occur so
  // that we can test errors on sentry
  if (evt.target.value) {
    if (evt.target.value.toLowerCase() === 'force_browser_error') {
      throw new Error(`Browser error intentionally thrown`);
    } else if (evt.target.value && evt.target.value.toLowerCase() === 'force_nodejs_error') {
      ipcRenderer.send('appium-force-nodejs-error');
    }
  }

  let newVal;
  switch (evt.target.type) {
    case 'checkbox':
      newVal = evt.target.checked;
      break;
    default:
      newVal = evt.target.value;
      // if we have a string type, sometimes Appium's default value is actually
      // null, but our users can only make it an empty string, so convert it
      if (newVal === '' && DEFAULT_ARGS[argName] === null) {
        newVal = null;
      }
      // likewise if we have a string type, but Appium's defult value is
      // actually a number, convert it. For now assume that will be an integer
      // since Appium currently doesn't accept any non-integer numeric
      // arguments.
      if (typeof newVal === 'string' &&
          typeof DEFAULT_ARGS[argName] === 'number') {
        newVal = parseInt(newVal, 10);
      }
      break;
  }
  updateArgs({[argName]: newVal});
}
