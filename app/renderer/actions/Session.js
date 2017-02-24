import { ipcRenderer } from 'electron';
import settings from 'electron-settings';
import { v4 as UUID } from 'uuid';
import { push } from 'react-router-redux';
import { notification } from 'antd';

export const NEW_SESSION_REQUESTED = 'NEW_SESSION_REQUESTED';
export const NEW_SESSION_BEGAN = 'NEW_SESSION_BEGAN';
export const NEW_SESSION_DONE = 'NEW_SESSION_DONE';
export const CHANGE_CAPABILITY = 'CHANGE_CAPABILITY';
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
export const SESSION_LOADING = 'SESSION_LOADING';
export const SESSION_LOADING_DONE = 'SESSION_LOADING_DONE';

const SAVED_SESSIONS = 'SAVED_SESSIONS';
const SESSION_SERVER_PARAMS = 'SESSION_SERVER_PARAMS';
const SESSION_SERVER_TYPE = 'SESSION_SERVER_TYPE';

export const ServerTypes = {
  local: 'local',
  remote: 'remote',
  sauce: 'sauce',
};

const JSON_TYPES = ['json_object', 'number', 'boolean'];

export function getCapsObject (caps) {
  return Object.assign({}, ...(caps.map((cap) => {
    if (JSON_TYPES.indexOf(cap.type) !== -1) {
      try {
        let obj = JSON.parse(cap.value);
        return {[cap.name]: obj};
      } catch (ign) {}
    }
    return {[cap.name]: cap.value};
  })));
}

export function showError (e, secs = 5) {
  let errMessage;
  if (e.data) {
    try {
      e.data = JSON.parse(e.data);
    } catch (ign) {}
    if (e.data.value && e.data.value.message) {
      errMessage = e.data.value.message;
    } else {
      errMessage = e.data;
    }
  } else if (e.message) {
    errMessage = e.message;
  } else if (e.code) {
    errMessage = e.code;
  } else {
    errMessage = 'Could not start session';
  }
  if (errMessage === "ECONNREFUSED") {
    errMessage = "Could not connect to server; are you sure it's running?";
  }
  notification.error({
    message: "Error",
    description: errMessage,
    duration: secs
  });
}

/**
 * Change the caps object and then go back to the new session tab
 */
export function setCaps (caps, uuid) {
  return (dispatch) => {
    dispatch({type: SET_CAPS, caps, uuid});
  };
}

/**
 * Change a single desired capability
 */
export function changeCapability (key, value) {
  return (dispatch) => {
    dispatch({type: CHANGE_CAPABILITY, key, value});
  };
}

/**
 * Push a capability to the list
 */
export function addCapability () {
  return (dispatch) => {
    dispatch({type: ADD_CAPABILITY});
  };
}

/**
 * Update value of a capability parameter
 */
export function setCapabilityParam (index, name, value) {
  return (dispatch) => {
    dispatch({type: SET_CAPABILITY_PARAM, index, name, value});
  };
}

/**
 * Delete a capability from the list
 */
export function removeCapability (index) {
  return (dispatch) => {
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
      case ServerTypes.local:
        host = session.server.local.hostname;
        if (host === "0.0.0.0") {
          // if we're on windows, we won't be able to connect directly to '0.0.0.0'
          // so just connect to localhost; if we're listening on all interfaces,
          // that will of course include 127.0.0.1 on all platforms
          host = "localhost";
        }
        port = session.server.local.port;
        break;
      case ServerTypes.remote:
        host = session.server.remote.hostname;
        port = session.server.remote.port;
        break;
      case ServerTypes.sauce:
        host = 'ondemand.saucelabs.com';
        port = 80;
        username = session.server.sauce.username;
        accessKey = session.server.sauce.accessKey;
        if (!username || !accessKey) {
          notification.error({
            message: "Error",
            description: "Sauce username and access key are required!",
            duration: 4
          });
          return;
        }
        https = false;
        break;
      default:
        break;
    }

    // Start the session
    ipcRenderer.send('appium-create-new-session', {desiredCapabilities, host, port, username, accessKey, https});

    dispatch({type: SESSION_LOADING});

    // If it failed, show an alert saying it failed
    ipcRenderer.once('appium-new-session-failed', (evt, e) => {
      dispatch({type: SESSION_LOADING_DONE});
      showError(e, 0);
    });

    ipcRenderer.once('appium-new-session-ready', () => {
      dispatch({type: SESSION_LOADING_DONE});
      dispatch(push('/inspector'));
    });

    // Save the current server settings
    await settings.set(SESSION_SERVER_PARAMS, session.server);
    await settings.set(SESSION_SERVER_TYPE, session.serverType);
  };
}


/**
 * Saves the caps
 */
export function saveSession (caps, params) {
  return async (dispatch) => {
    let {name, uuid} = params;
    dispatch({type: SAVE_SESSION_REQUESTED});
    let savedSessions = await settings.get(SAVED_SESSIONS) || [];
    if (!uuid) {

      // If it's a new session, add it to the list
      uuid = UUID();
      let newSavedSession = {
        date: +(new Date()),
        name,
        uuid,
        caps,
      };
      savedSessions.push(newSavedSession);
    } else {

      // If it's an existing session, overwrite it
      for (let session of savedSessions) {
        if (session.uuid === uuid) {
          session.caps = caps;
        }
      }
    }
    await settings.set(SAVED_SESSIONS, savedSessions);
    await getSavedSessions()(dispatch);
    dispatch({type: SET_CAPS, caps, uuid});
    dispatch({type: SAVE_SESSION_DONE});
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
  return (dispatch) => {
    dispatch({type: SWITCHED_TABS, key});
  };
}

/**
 * Open a 'Save As' modal
 */
export function requestSaveAsModal () {
  return (dispatch) => {
    dispatch({type: SAVE_AS_MODAL_REQUESTED});
  };
}

/**
 * Hide the 'Save As' modal
 */
export function hideSaveAsModal () {
  return (dispatch) => {
    dispatch({type: HIDE_SAVE_AS_MODAL_REQUESTED});
  };
}

/**
 * Set the text to save capabilities as
 */
export function setSaveAsText (saveAsText) {
  return (dispatch) => {
    dispatch({type: SET_SAVE_AS_TEXT, saveAsText});
  };
}

/**
 * Delete a saved session
 */
export function deleteSavedSession (uuid) {
  return async (dispatch) => {
    dispatch({type: DELETE_SAVED_SESSION_REQUESTED, uuid});
    let savedSessions = await settings.get(SAVED_SESSIONS) || [];
    let newSessions = savedSessions.filter((session) => session.uuid !== uuid);
    await settings.set(SAVED_SESSIONS, newSessions);
    dispatch({type: DELETE_SAVED_SESSION_DONE});
    dispatch({type: GET_SAVED_SESSIONS_DONE, savedSessions: newSessions});
  };
}

/**
 * Change the server type
 */
export function changeServerType (serverType) {
  return (dispatch) => {
    dispatch({type: CHANGE_SERVER_TYPE, serverType});
  };
}

/**
 * Set a server parameter (host, port, etc...)
 */
export function setServerParam (name, value) {
  return (dispatch, getState) => {
    dispatch({type: SET_SERVER_PARAM, serverType: getState().session.serverType, name, value});
  };
}

/**
 * Set the local server hostname and port to whatever was saved in 'actions/StartServer.js' so that it
 * defaults to what the currently running appium server is
 */
export function setLocalServerParams () {
  return async (dispatch, getState) => {
    let serverArgs = await settings.get('SERVER_ARGS');

    // Get saved server args from settings and set local server settings to it. If there are no saved args, set local
    // host and port to undefined
    if (serverArgs) {
      dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'port', value: serverArgs.port});
      dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'hostname', value: 'localhost'});
    } else {

      dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'port', value: undefined});
      dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'hostname', value: undefined});
      if (getState().session.serverType === 'local') {
        changeServerType('remote')(dispatch);
      }
    }
  };
}

/**
 * Set the server parameters to whatever they were last saved as.
 * Params are saved whenever there's a new session
 */
export function setSavedServerParams () {
  return async (dispatch) => {
    let server = await settings.get(SESSION_SERVER_PARAMS);
    let serverType = await settings.get(SESSION_SERVER_TYPE);
    if (server) {
      dispatch({type: SET_SERVER, server, serverType});
    }
  };
}
