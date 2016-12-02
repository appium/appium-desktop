import { ipcRenderer } from 'electron';
import settings from 'electron-settings';

export const NEW_SESSION_REQUESTED = 'NEW_SESSION_REQUESTED';
export const NEW_SESSION_BEGAN = 'NEW_SESSION_BEGAN';
export const NEW_SESSION_DONE = 'NEW_SESSION_DONE';
export const GET_DEFAULT_CAPS_REQUESTED = 'GET_DEFAULT_CAPS_REQUESTED';
export const GET_DEFAULT_CAPS_DONE = 'GET_DEFAULT_CAPS_DONE';
export const CHANGE_CAPABILITY = 'CHANGE_CAPABILITY';
export const GET_RECENT_SESSIONS_REQUESTED = 'GET_RECENT_SESSIONS_REQUESTED';
export const GET_RECENT_SESSIONS_DONE = 'GET_RECENT_SESSIONS_DONE';
export const SET_DESIRED_CAPABILITIES = 'SET_DESIRED_CAPABILITIES';
export const SAVE_SESSION_REQUESTED = 'SAVE_SESSION_REQUESTED';
export const SAVE_SESSION_DONE = 'SAVE_SESSION_DONE';
export const GET_SAVED_SESSIONS_REQUESTED = 'GET_SAVED_SESSIONS_REQUESTED';
export const GET_SAVED_SESSIONS_DONE = 'GET_SAVED_SESSIONS_DONE';

const MOST_RECENT_DESIRED_CAPABILITIES = 'MOST_RECENT_DESIRED_CAPABILITIES';
const RECENT_SESSIONS = 'RECENT_SESSIONS';
const SAVED_SESSIONS = 'SAVED_SESSIONS';

const SAVED_CAPS_LIMIT = 30;

function getDefaultDesiredCapabilities (desiredCapabilityConstraints) {
  let desiredCapabilities = {};

  // Set default values for capabilities
  Object.keys(desiredCapabilityConstraints).map((key) => {
    let cap = desiredCapabilityConstraints[key];

    // If it's a select, choose the first by default
    if (cap.inclusionCaseInsensitive || cap.inclusion) {
      desiredCapabilities[key] = (cap.inclusionCaseInsensitive || cap.inclusion)[0];
    } else if (cap.isBoolean) {
      desiredCapabilities[key] = false;
    } else if (cap.isNumber) {
      desiredCapabilities[key] = null;
    } else {
      desiredCapabilities[key] = '';
    }
  });

  return desiredCapabilities;
}

export function getDefaultCaps (desiredCapabilityConstraints) {
  return async (dispatch) => {
    dispatch({type: GET_DEFAULT_CAPS_REQUESTED, desiredCapabilityConstraints});

    // Get the most recently saved capabilities
    let desiredCapabilities = await settings.get(MOST_RECENT_DESIRED_CAPABILITIES);
    let defaultDesiredCapabilities = getDefaultDesiredCapabilities(desiredCapabilityConstraints);

    desiredCapabilities = {
      ...defaultDesiredCapabilities,
      ...desiredCapabilities,
    };

    dispatch({type: GET_DEFAULT_CAPS_DONE, desiredCapabilities});
  };
}

export function setCaps (desiredCapabilities) {
  return async (dispatch) => {
    dispatch({type: SET_DESIRED_CAPABILITIES, desiredCapabilities});
  };
}

export function changeCapability (key, value) {
  return async (dispatch) => {
    dispatch({type: CHANGE_CAPABILITY, key, value});
  };
}

export function newSession (desiredCapabilities) {
  return async (dispatch) => {
    dispatch({type: NEW_SESSION_REQUESTED, desiredCapabilities});

    // Save these caps as the most recently used caps
    await settings.set(MOST_RECENT_DESIRED_CAPABILITIES, desiredCapabilities);

    // Save these to an array of recent sessions
    let recentSessions = await settings.get(RECENT_SESSIONS) || [];
    if (recentSessions.length > SAVED_CAPS_LIMIT) {
      recentSessions.splice(0, 1);
    }
    recentSessions.push({
      date: +(new Date()),
      desiredCapabilities,
    });
    await settings.set(RECENT_SESSIONS, recentSessions);
    getRecentSessions()(dispatch);

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

export function getRecentSessions () {
  return async (dispatch) => {
    dispatch({type: GET_RECENT_SESSIONS_REQUESTED});
    let recentSessions = await settings.get(RECENT_SESSIONS) || [];
    dispatch({type: GET_RECENT_SESSIONS_DONE, recentSessions});
  };
}

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

export function getSavedSessions () {
  return async (dispatch) => {
    dispatch({type: GET_SAVED_SESSIONS_REQUESTED});
    let savedSessions = await settings.get(SAVED_SESSIONS) || [];
    dispatch({type: GET_SAVED_SESSIONS_DONE, savedSessions});
  };
}