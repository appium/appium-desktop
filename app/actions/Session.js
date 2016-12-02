import { ipcRenderer } from 'electron';
import settings from 'electron-settings';

export const NEW_SESSION_REQUESTED = 'NEW_SESSION_REQUESTED';
export const NEW_SESSION_BEGAN = 'NEW_SESSION_BEGAN';
export const NEW_SESSION_DONE = 'NEW_SESSION_DONE';
export const CHANGE_CAPABILITY = 'CHANGE_CAPABILITY';
export const SET_DESIRED_CAPABILITIES = 'SET_DESIRED_CAPABILITIES';
export const SAVE_SESSION_REQUESTED = 'SAVE_SESSION_REQUESTED';
export const SAVE_SESSION_DONE = 'SAVE_SESSION_DONE';
export const GET_SAVED_SESSIONS_REQUESTED = 'GET_SAVED_SESSIONS_REQUESTED';
export const GET_SAVED_SESSIONS_DONE = 'GET_SAVED_SESSIONS_DONE';
export const SET_CAPABILITY_PARAM = 'SET_CAPABILITY_PARAM';
export const ADD_CAPABILITY = 'ADD_CAPABILITY';
export const REMOVE_CAPABILITY = 'REMOVE_CAPABILITY';

const SAVED_SESSIONS = 'SAVED_SESSIONS';

/**
 * Change the desired capabilities object
 */
export function setCaps (desiredCapabilities) {
  return async (dispatch) => {
    dispatch({type: SET_DESIRED_CAPABILITIES, desiredCapabilities});
  };
}

/**
 * Change a single desired capability
 */
export function changeCapability (key, value) {
  return async (dispatch) => {
    dispatch({type: CHANGE_CAPABILITY, key, value});
  };
}

export function addCapability () {
  return async (dispatch) => {
    dispatch({type: ADD_CAPABILITY});
  };
}

export function setCapabilityParam (index, name, value) {
  return async (dispatch) => {
    dispatch({type: SET_CAPABILITY_PARAM, index, name, value});
  };
}

export function removeCapability (index) {
  return async (dispatch) => {
    dispatch({type: REMOVE_CAPABILITY, index});
  };
}

/**
 * Start a new appium session with the given caps 
 */
export function newSession (desiredCapabilities) {
  return async (dispatch) => {
    dispatch({type: NEW_SESSION_REQUESTED, desiredCapabilities});

    // Start the session
    ipcRenderer.send('appium-create-new-session', desiredCapabilities);

    ipcRenderer.once('appium-new-session-failed', (event, message) => {
      alert('Error starting session');
    });

    ipcRenderer.once('appium-new-session-done', () => {
      dispatch({type: NEW_SESSION_DONE});
    });

    dispatch({type: NEW_SESSION_BEGAN});
  };
}


/**
 * Saves the caps
 */
export function saveSession (desiredCapabilities) {
  return async (dispatch) => {
    dispatch({type: SAVE_SESSION_REQUESTED});
    let savedSessions = await settings.get(SAVED_SESSIONS) || [];
    savedSessions.push({
      date: +(new Date()),
      desiredCapabilities
    });
    await settings.set(SAVED_SESSIONS, savedSessions);
    dispatch({type: SAVE_SESSION_DONE});
    getSavedSessions()(dispatch);
  };
}

/**
 * Get the sessions saved by the user
 */
export function getSavedSessions () {
  return async (dispatch) => {
    dispatch({type: GET_SAVED_SESSIONS_REQUESTED});
    let savedSessions = await settings.get(SAVED_SESSIONS) || [];
    dispatch({type: GET_SAVED_SESSIONS_DONE, savedSessions});
  };
}