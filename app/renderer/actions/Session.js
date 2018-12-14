import { ipcRenderer } from 'electron';
import settings from '../../shared/settings';
import { v4 as UUID } from 'uuid';
import { push } from 'connected-react-router';
import { notification } from 'antd';
import { debounce, toPairs } from 'lodash';
import { setSessionDetails } from './Inspector';

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

export const SAVED_SESSIONS = 'SAVED_SESSIONS';
export const SESSION_SERVER_PARAMS = 'SESSION_SERVER_PARAMS';
export const SESSION_SERVER_TYPE = 'SESSION_SERVER_TYPE';
export const SERVER_ARGS = 'SERVER_ARGS';

export const SET_ATTACH_SESS_ID = 'SET_ATTACH_SESS_ID';

export const GET_SESSIONS_REQUESTED = 'GET_SESSIONS_REQUESTED';
export const GET_SESSIONS_DONE = 'GET_SESSIONS_DONE';


export const ENABLE_DESIRED_CAPS_EDITOR = 'ENABLE_DESIRED_CAPS_EDITOR';
export const ABORT_DESIRED_CAPS_EDITOR = 'ABORT_DESIRED_CAPS_EDITOR';
export const SAVE_RAW_DESIRED_CAPS = 'SAVE_RAW_DESIRED_CAPS';
export const SET_RAW_DESIRED_CAPS = 'SET_RAW_DESIRED_CAPS';
export const SHOW_DESIRED_CAPS_JSON_ERROR = 'SHOW_DESIRED_CAPS_JSON_ERROR';

export const ServerTypes = {
  local: 'local',
  remote: 'remote',
  sauce: 'sauce',
  testobject: 'testobject',
  headspin: 'headspin',
  browserstack: 'browserstack',
  bitbar: 'bitbar',
  kobiton: 'kobiton'
};

const JSON_TYPES = ['object', 'number', 'boolean'];

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

export function showError (e, methodName, secs = 5) {
  let errMessage;
  if (e['jsonwire-error'] && e['jsonwire-error'].status === 7) {
    errMessage = `Failed to find element for '${methodName}'. Please refresh page and try again.`;
  } else if (e.data) {
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
export function newSession (caps, attachSessId = null) {
  return async (dispatch, getState) => {

    dispatch({type: NEW_SESSION_REQUESTED, caps});

    let desiredCapabilities = caps ? getCapsObject(caps) : null;
    let session = getState().session;

    let host, port, username, accessKey, https, path;
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
        host = session.server.remote.hostname || '127.0.0.1';
        port = session.server.remote.port || 4723;
        path = session.server.remote.path;
        https = session.server.remote.ssl;
        break;
      case ServerTypes.sauce:
        host = 'ondemand.saucelabs.com';
        port = 80;
        if (session.server.sauce.useSCProxy) {
          host = session.server.sauce.scHost || "localhost";
          port = parseInt(session.server.sauce.scPort, 10) || 4445;
        }
        username = session.server.sauce.username || process.env.SAUCE_USERNAME;
        accessKey = session.server.sauce.accessKey || process.env.SAUCE_ACCESS_KEY;
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
      case ServerTypes.testobject:
        host = process.env.TESTOBJECT_HOST || `${session.server.testobject.dataCenter || 'us1'}.appium.testobject.com`;
        port = 443;
        https = true;
        if (caps) {
          desiredCapabilities.testobject_api_key = session.server.testobject.apiKey || process.env.TESTOBJECT_API_KEY;
        }
        break;
      case ServerTypes.headspin:
        host = session.server.headspin.hostname;
        port = session.server.headspin.port;
        path = `/v0/${session.server.headspin.apiKey}/wd/hub`;
        https = true;
        break;
      case ServerTypes.browserstack:
        host = process.env.BROWSERSTACK_HOST || "hub-cloud.browserstack.com";
        port = 443;
        path = "/wd/hub";
        username = session.server.browserstack.username || process.env.BROWSERSTACK_USERNAME;
        desiredCapabilities["browserstack.source"] = "appiumdesktop";
        accessKey = session.server.browserstack.accessKey || process.env.BROWSERSTACK_ACCESS_KEY;
        if (!username || !accessKey) {
          notification.error({
            message: "Error",
            description: "Browserstack username and access key are required!",
            duration: 4
          });
          return;
        }
        https = true;
        break;
      case ServerTypes.bitbar:
        host = process.env.BITBAR_HOST || "appium.bitbar.com";
        port = 443;
        path = "/wd/hub";
        accessKey = session.server.bitbar.apiKey || process.env.BITBAR_API_KEY;
        if (!accessKey) {
          notification.error({
            message: "Error",
            description: "Bitbar API key required!",
            duration: 4
          });
          return;
        }
        desiredCapabilities.testdroid_source = "appiumdesktop";
        desiredCapabilities.testdroid_apiKey = accessKey;
        https = true;
        break;
      case ServerTypes.kobiton:
        host = process.env.KOBITON_HOST || "api.kobiton.com";
        port = 443;
        path = "/wd/hub";
        username = session.server.kobiton.username || process.env.KOBITON_USERNAME;
        desiredCapabilities["kobiton.source"] = "appiumdesktop";
        accessKey = session.server.kobiton.accessKey || process.env.KOBITON_ACCESS_KEY;
        if (!username || !accessKey) {
          notification.error({
            message: "Error",
            description: "KOBITON username and api key are required!",
            duration: 4
          });
          return;
        }
        https = true;
        break;
      default:
        break;
    }

    let rejectUnauthorized = !session.server.advanced.allowUnauthorized;
    let proxy;
    if (session.server.advanced.useProxy && session.server.advanced.proxy) {
      proxy = session.server.advanced.proxy;
    }

    // Start the session
    ipcRenderer.send('appium-create-new-session', {
      desiredCapabilities,
      attachSessId,
      host,
      port,
      path,
      username,
      accessKey,
      https,
      rejectUnauthorized,
      proxy,
    });

    dispatch({type: SESSION_LOADING});

    // If it failed, show an alert saying it failed
    ipcRenderer.once('appium-new-session-failed', (evt, e) => {
      dispatch({type: SESSION_LOADING_DONE});
      removeNewSessionListeners();
      showError(e, 0);
    });

    ipcRenderer.once('appium-new-session-ready', () => {
      dispatch({type: SESSION_LOADING_DONE});
      // pass some state to the inspector that it needs to build recorder
      // code boilerplate
      setSessionDetails({
        desiredCapabilities,
        host,
        port,
        path,
        username,
        accessKey,
        https,
      })(dispatch);
      removeNewSessionListeners();
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
    let savedSessions = await settings.get(SAVED_SESSIONS);
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
    let savedSessions = await settings.get(SAVED_SESSIONS);
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
    let savedSessions = await settings.get(SAVED_SESSIONS);
    let newSessions = savedSessions.filter((session) => session.uuid !== uuid);
    await settings.set(SAVED_SESSIONS, newSessions);
    dispatch({type: DELETE_SAVED_SESSION_DONE});
    dispatch({type: GET_SAVED_SESSIONS_DONE, savedSessions: newSessions});
  };
}

/**
 * Set the session id to attach to
 */
export function setAttachSessId (attachSessId) {
  return (dispatch) => {
    dispatch({type: SET_ATTACH_SESS_ID, attachSessId});
  };
}

/**
 * Change the server type
 */
export function changeServerType (serverType) {
  return (dispatch, getState) => {
    dispatch({type: CHANGE_SERVER_TYPE, serverType});
    getRunningSessions()(dispatch, getState);
  };
}

/**
 * Set a server parameter (host, port, etc...)
 */
export function setServerParam (name, value, serverType) {
  const debounceGetRunningSessions = debounce(getRunningSessions(), 5000);
  return (dispatch, getState) => {
    serverType = serverType || getState().session.serverType;
    dispatch({type: SET_SERVER_PARAM, serverType, name, value});
    debounceGetRunningSessions(dispatch, getState);
  };
}

/**
 * Set the local server hostname and port to whatever was saved in 'actions/StartServer.js' so that it
 * defaults to what the currently running appium server is
 */
export function setLocalServerParams () {
  return async (dispatch, getState) => {
    let serverArgs = await settings.get(SERVER_ARGS);
    // Get saved server args from settings and set local server settings to it. If there are no saved args, set local
    // host and port to undefined
    if (serverArgs) {
      dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'port', value: serverArgs.port});
      dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'hostname', value: 'localhost'});
    } else {
      dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'port', value: undefined});
      dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'hostname', value: undefined});
      if (getState().session.serverType === 'local') {
        changeServerType('remote')(dispatch, getState);
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

export function getRunningSessions () {
  return (dispatch, getState) => {
    // Get currently running sessions for this server
    const state = getState().session;
    const {server, serverType} = state;
    const serverInfo = server[serverType];

    dispatch({type: GET_SESSIONS_REQUESTED});
    if (serverType !== 'sauce' && serverType !== 'testobject') {
      ipcRenderer.send('appium-client-get-sessions', {host: serverInfo.hostname, port: serverInfo.port});
      ipcRenderer.once('appium-client-get-sessions-response', (evt, e) => {
        const res = JSON.parse(e.res);
        dispatch({type: GET_SESSIONS_DONE, sessions: res.value});
        removeRunningSessionsListeners();
      });
      ipcRenderer.once('appium-client-get-sessions-fail', () => {
        dispatch({type: GET_SESSIONS_DONE});
        removeRunningSessionsListeners();
      });
    } else {
      dispatch({type: GET_SESSIONS_DONE});
    }
  };
}

export function startDesiredCapsEditor () {
  return (dispatch) => {
    dispatch({type: ENABLE_DESIRED_CAPS_EDITOR});
  };
}

export function abortDesiredCapsEditor () {
  return (dispatch) => {
    dispatch({type: ABORT_DESIRED_CAPS_EDITOR});
  };
}

export function saveRawDesiredCaps () {
  return (dispatch, getState) => {
    const state = getState().session;
    const {rawDesiredCaps, caps: capsArray} = state;
    try {
      const newCaps = JSON.parse(rawDesiredCaps);

      // Transform the current caps array to an object
      let caps = {};
      for (let {type, name, value} of capsArray) {
        caps[name] = {type, value};
      }

      // Translate the caps JSON to array format
      let newCapsArray = toPairs(newCaps).map(([name, value]) => ({
        type: (() => {
          let type = typeof value;

          // If we already have this cap and it's file type, keep the type the same
          if (caps[name] && caps[name].type === 'file' && type === 'string') {
            return 'file';
          } else if (type === 'string') {
            return 'text';
          } else {
            return type;
          }
        })(),
        name,
        value,
      }));
      dispatch({type: SAVE_RAW_DESIRED_CAPS, caps: newCapsArray});
    } catch (e) {
      dispatch({type: SHOW_DESIRED_CAPS_JSON_ERROR, message: e.message});
    }
  };
}

export function setRawDesiredCaps (rawDesiredCaps) {
  return (dispatch, getState) => {
    const state = getState().session;
    let isValidCapsJson = true;
    let invalidCapsJsonReason;
    if (state.isValidatingCapsJson) {
      try {
        JSON.parse(rawDesiredCaps);
      } catch (e) {
        isValidCapsJson = false;
        invalidCapsJsonReason = e.message;
      }
    }
    dispatch({type: SET_RAW_DESIRED_CAPS, rawDesiredCaps, isValidCapsJson, invalidCapsJsonReason});
  };
}

function removeNewSessionListeners () {
  ipcRenderer.removeAllListeners('appium-new-session-failed');
  ipcRenderer.removeAllListeners('appium-new-session-ready');
}

function removeRunningSessionsListeners () {
  ipcRenderer.removeAllListeners('appium-client-get-sessions-fail');
  ipcRenderer.removeAllListeners('appium-client-get-sessions-response');
}