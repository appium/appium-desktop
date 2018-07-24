import { ipcRenderer } from 'electron';

export const SET_ENVIRONMENT_VARIABLE = 'SET_ENVIRONMENT_VARIABLE';
export const SET_ENVIRONMENT_VARIABLES = 'SET_ENVIRONMENT_VARIABLES';
export const GET_ENVIRONMENT_VARIABLES = 'GET_ENVIRONMENT_VARIABLES';
export const SAVE_ENVIRONMENT_VARIABLES = 'SAVE_ENVIRONMENT_VARIABLES';

export function setEnvironmentVariable (name, value) {
  return (dispatch) => {
    dispatch({type: SET_ENVIRONMENT_VARIABLE, name, value});
  };
}

export function getEnvironmentVariables () {
  return (dispatch) => {
    dispatch({type: GET_ENVIRONMENT_VARIABLES});
    ipcRenderer.send('appium-get-env');
    ipcRenderer.once('appium-env', (evt, env) => {
      const {defaultEnvironmentVariables, savedEnvironmentVariables} = env;
      dispatch({type: SET_ENVIRONMENT_VARIABLES, defaultEnvironmentVariables, savedEnvironmentVariables});
    });
  };
}

export function saveEnvironmentVariables () {
  return (dispatch, getState) => {
    const {environmentVariables:env} = getState();
    //ipcRenderer.send('appium-set-env', env);
  };
}