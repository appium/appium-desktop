import { ipcRenderer } from 'electron';
import settings from 'electron-settings';
import { v4 as uuid } from 'uuid';

export const NEW_SESSION_REQUESTED = 'NEW_SESSION_REQUESTED';
export const NEW_SESSION_BEGAN = 'NEW_SESSION_BEGAN';
export const NEW_SESSION_DONE = 'NEW_SESSION_DONE';
export const CHANGE_CAPABILITY = 'CHANGE_CAPABILITY'
export const SAVE_SESSION_REQUESTED = 'SAVE_SESSION_REQUESTED';
export const SAVE_SESSION_DONE = 'SAVE_SESSION_DONE';
export const GET_SAVED_SESSIONS_REQUESTED = 'GET_SAVED_SESSIONS_REQUESTED';
export const GET_SAVED_SESSIONS_DONE = 'GET_SAVED_SESSIONS_DONE';
export const SET_CAPABILITY_PARAM = 'SET_CAPABILITY_PARAM';
export const ADD_CAPABILITY = 'ADD_CAPABILITY';
export const REMOVE_CAPABILITY = 'REMOVE_CAPABILITY';
export const SWITCHED_TABS = 'SWITCHED_TABS';
export const SET_CAPS = 'SET_CAPS';
export const SAVE_AS_MODAL_REQUESTED = 'SAVE_AS_MODAL_REQUESTED';
export const HIDE_SAVE_AS_MODAL_REQUESTED = 'HIDE_SAVE_AS_MODAL_REQUESTED';
export const SET_SAVE_AS_TEXT = 'SET_SAVE_AS_TEXT';
export const DELETE_SAVED_SESSION_REQUESTED = 'DELETE_SAVED_SESSION_REQUESTED';
export const DELETE_SAVED_SESSION_DONE = 'DELETE_SAVED_SESSION_DONE';
export const CHANGE_SERVER_TYPE = 'CHANGE_SERVER_TYPE';
export const SET_SERVER_PARAM = 'SET_SERVER_PARAM';
export const SET_SERVER = 'SET_SERVER';

const SAVED_SESSIONS = 'SAVED_SESSIONS';
const SESSION_SERVER_PARAMS = 'SESSION_SERVER_PARAMS';
const SESSION_SERVER_TYPE = 'SESSION_SERVER_TYPE';

function getCapsObject (caps) {
  let capsObject = {};
  caps.forEach((cap) => capsObject[cap.name] = cap.value);
  return capsObject;
}

/**
 * Change the caps object and then go back to the new session tab
 */
export function setCaps (caps, uuid) {
  return async (dispatch) => {
    dispatch({type: SET_CAPS, caps, uuid});
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
export function newSession (caps) {
  return async (dispatch, getState) => {
    dispatch({type: NEW_SESSION_REQUESTED, caps});

    let desiredCapabilities = getCapsObject(caps);
    let session = getState().session;

    let host, port, username, accessKey, https;
    switch (session.serverType) {
      case 'local':
        host = session.server.local.hostname;
        port = session.server.local.port;
        break;
      case 'remote':
        host = session.server.remote.hostname;
        port = session.server.remote.port;
        break;
      case 'sauce':
        host = `ondemand.saucelabs.com`;
        port = 443;
        username = session.server.sauce.username;
        accessKey = session.server.sauce.accessKey;
        https = true;
        break;
      default: 
        break;
    }

    // Start the session
    ipcRenderer.send('appium-create-new-session', {desiredCapabilities, host, port, username, accessKey, https});

    ipcRenderer.once('appium-new-session-failed', () => {
      alert('Error starting session');
    });

    ipcRenderer.once('appium-new-session-done', () => {
      dispatch({type: NEW_SESSION_DONE});
    });

    dispatch({type: NEW_SESSION_BEGAN});

    // Save the current server settings
    await settings.set(SESSION_SERVER_PARAMS, session.server);
    await settings.set(SESSION_SERVER_TYPE, session.serverType);
  };
}


/**
 * Saves the caps
 */
export function saveSession (name, caps) {
  return async (dispatch) => {
    dispatch({type: SAVE_SESSION_REQUESTED});
    let savedSessions = await settings.get(SAVED_SESSIONS) || [];
    let newSavedSession = {
      date: +(new Date()),
      name,
      uuid: uuid(),
      caps,
    };
    savedSessions.push(newSavedSession);
    await settings.set(SAVED_SESSIONS, savedSessions);
    dispatch({type: SET_CAPS, caps, uuid: newSavedSession.uuid});
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

/**
 * Switch to a different tab
 */
export function switchTabs (key) {
  return async (dispatch) => {
    dispatch({type: SWITCHED_TABS, key});
  };
}

export function requestSaveAsModal () {
  return async (dispatch) => {
    dispatch({type: SAVE_AS_MODAL_REQUESTED});
  };
}

export function hideSaveAsModal () {
  return async (dispatch) => {
    dispatch({type: HIDE_SAVE_AS_MODAL_REQUESTED});
  };
}

export function setSaveAsText (saveAsText) {
  return async (dispatch) => {
    dispatch({type: SET_SAVE_AS_TEXT, saveAsText});
  };
}

export function deleteSavedSession (index) {
  return async (dispatch) => {
    dispatch({type: DELETE_SAVED_SESSION_REQUESTED, index});
    let savedSessions = await settings.get(SAVED_SESSIONS) || [];
    savedSessions.splice(index, 1);
    await settings.set(SAVED_SESSIONS, savedSessions);
    dispatch({type: GET_SAVED_SESSIONS_DONE, savedSessions});
  };
}

export function changeServerType (serverType) {
  return async (dispatch) => {
    dispatch({type: CHANGE_SERVER_TYPE, serverType});
  };
}

export function setServerParam (name, value) {
  return async (dispatch, getState) => {
    dispatch({type: SET_SERVER_PARAM, serverType: getState().session.serverType, name, value});
  };
}

export function setLocalServerParams () {
  return async (dispatch) => {
    let port = await settings.get('SERVER_PORT');
    let host = await settings.get('SERVER_HOST');
    dispatch({type: SET_SERVER_PARAM, serverType: 'local', name: 'port', value: port});
    dispatch({type: SET_SERVER_PARAM, serverType: 'local', name: 'hostname', value: host});
  };
}

export function setSavedServerParams () {
  return async (dispatch) => {
    let server = await settings.get(SESSION_SERVER_PARAMS);
    let serverType = await settings.get(SESSION_SERVER_TYPE);
    if (server) {
      dispatch({type: SET_SERVER, server, serverType});
    }   
  };
}