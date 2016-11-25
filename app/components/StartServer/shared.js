import { PropTypes } from 'react';
import { DEFAULT_ARGS } from '../../reducers/StartServer';

export const propTypes = {
  serverArgs: PropTypes.object.isRequired,
  serverStarting: PropTypes.bool.isRequired,
  startServer: PropTypes.func.isRequired,
  updateArgs: PropTypes.func.isRequired,
  savePreset: PropTypes.func.isRequired,
  presetSaving: PropTypes.bool.isRequired,
};

export function updateArg (evt) {
  const {updateArgs} = this.props;
  let argName = evt.target.name;
  let newVal;
  switch (evt.target.type) {
    case "checkbox":
      newVal = evt.target.checked;
      break;
    default:
      newVal = evt.target.value;
      // if we have a string type, sometimes Appium's default value is actually
      // null, but our users can only make it an empty string, so conver it
      if (newVal === "" && DEFAULT_ARGS[argName] === null) {
        newVal = null;
      }
      break;
  }
  updateArgs({[argName]: newVal});
}
