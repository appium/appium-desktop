import { ipcRenderer } from 'electron';
import settings from '../../settings';
import { v4 as UUID } from 'uuid';
import { push } from 'react-router-redux';
import { notification } from 'antd';
import { isNil, cloneDeep, isPlainObject, debounce, toPairs } from 'lodash';
import { callClientMethod, bindClient, unbindClient } from './shared';
import { setSessionDetails, SAVED_TESTS, SET_SAVED_TESTS } from './Inspector';

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

export const CHANGE_SESSION_MODE = 'CHANGE_SESSION_MODE';

export const CHANGE_TEST = 'CHANGE_TEST';
export const DELETE_SAVED_TEST_REQUESTED = 'DELETE_SAVED_TEST_REQUESTED';
export const DELETE_SAVED_TEST_DONE = 'DELETE_SAVED_TEST_DONE';
export const SHOW_CAPS_MODAL = 'SHOW_CAPS_MODAL';
export const HIDE_CAPS_MODAL = 'HIDE_CAPS_MODAL';

export const TEST_SELECTED = 'TEST_SELECTED';
export const TEST_RUN_REQUESTED = 'TEST_RUN_REQUESTED';
export const TEST_RUNNING = 'TEST_RUNNING';
export const HIDE_TESTRUN_MODAL = 'HIDE_TESTRUN_MODAL';
export const TEST_ACTION_UPDATED = 'TEST_ACTION_UPDATED';
export const TEST_COMPLETE = 'TEST_COMPLETE';

export const ACTION_STATE_PENDING = 'pending';
export const ACTION_STATE_IN_PROGRESS = 'running';
export const ACTION_STATE_COMPLETE = 'complete';
export const ACTION_STATE_ERRORED = 'errored';
export const ACTION_STATE_CANCELED = 'canceled';

export const TEST_RESULTS = 'TEST_RESULTS';
export const SET_TEST_RESULTS = 'SET_TEST_RESULTS';
export const SHOW_RESULT = 'SHOW_RESULT';

export const ServerTypes = {
  local: 'local',
  remote: 'remote',
  sauce: 'sauce',
  testobject: 'testobject',
  headspin: 'headspin',
  browserstack: 'browserstack',
};

export const SessionModes = {
  inspect: 'inspect',
  playback: 'playback',
  view: 'view',
};

const JSON_TYPES = ['object', 'number', 'boolean'];

export function getCapsObject (caps) {

  // if we already have a plain object, assume it's caps
  if (isPlainObject(caps)) {
    return caps;
  }

  // otherwise it's our array of caps
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

export function startSession (caps, serverType, serverParams, attachSessId = null) {
  let desiredCapabilities = caps ? getCapsObject(caps) : null;

  let host, port, username, accessKey, https, path;
  switch (serverType) {
    case ServerTypes.local:
      host = serverParams.local.hostname;
      if (host === "0.0.0.0") {
        // if we're on windows, we won't be able to connect directly to '0.0.0.0'
        // so just connect to localhost; if we're listening on all interfaces,
        // that will of course include 127.0.0.1 on all platforms
        host = "localhost";
      }
      port = serverParams.local.port;
      break;
    case ServerTypes.remote:
      host = serverParams.remote.hostname;
      port = serverParams.remote.port;
      path = serverParams.remote.path;
      https = serverParams.remote.ssl;
      break;
    case ServerTypes.sauce:
      host = 'ondemand.saucelabs.com';
      port = 80;
      if (serverParams.sauce.useSCProxy) {
        host = serverParams.sauce.scHost || "localhost";
        port = parseInt(serverParams.sauce.scPort, 10) || 4445;
      }
      username = serverParams.sauce.username || process.env.SAUCE_USERNAME;
      accessKey = serverParams.sauce.accessKey || process.env.SAUCE_ACCESS_KEY;
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
      host = process.env.TESTOBJECT_HOST || `${serverParams.testobject.dataCenter || 'us1'}.appium.testobject.com`;
      port = 443;
      https = true;
      if (caps) {
        desiredCapabilities.testobject_api_key = serverParams.testobject.apiKey || process.env.TESTOBJECT_API_KEY;
      }
      break;
    case ServerTypes.headspin:
      host = serverParams.headspin.hostname;
      port = serverParams.headspin.port;
      path = `/v0/${serverParams.headspin.apiKey}/wd/hub`;
      https = true;
      break;
    case ServerTypes.browserstack:
      host = process.env.BROWSERSTACK_HOST || "hub-cloud.browserstack.com";
      port = 443;
      path = "/wd/hub";
      username = serverParams.browserstack.username || process.env.BROWSERSTACK_USERNAME;
      desiredCapabilities["browserstack.source"] = "appiumdesktop";
      accessKey = serverParams.browserstack.accessKey || process.env.BROWSERSTACK_ACCESS_KEY;
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
    default:
      break;
  }

  let rejectUnauthorized = !serverParams.advanced.allowUnauthorized;
  let proxy;
  if (serverParams.advanced.useProxy && serverParams.advanced.proxy) {
    proxy = serverParams.advanced.proxy;
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

  return {desiredCapabilities, host, port, username, accessKey, https, path,
    rejectUnauthorized, proxy};
}

/**
 * Start a new appium session with the given caps
 */
export function newSession (caps, attachSessId = null) {
  return async (dispatch, getState) => {

    dispatch({type: NEW_SESSION_REQUESTED, caps});

    const session = getState().session;

    const {desiredCapabilities, host, port, username, accessKey, https,
      path} = startSession(caps, session.serverType, session.server, attachSessId);

    dispatch({type: SESSION_LOADING});

    // If it failed, show an alert saying it failed
    ipcRenderer.once('appium-new-session-failed', (evt, e) => {
      dispatch({type: SESSION_LOADING_DONE});
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

export async function setLocalServerParamsOnly (dispatch) {
  let serverArgs = await settings.get(SERVER_ARGS);
  // Get saved server args from settings and set local server settings to it. If there are no saved args, set local
  // host and port to undefined
  if (serverArgs) {
    dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'port', value: serverArgs.port});
    dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'hostname', value: 'localhost'});

    // return true to say that we have a local server
    return true;
  }

  dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'port', value: undefined});
  dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'hostname', value: undefined});

  // return false to say we don't have a local server
  return false;
}

/**
 * Set the local server hostname and port to whatever was saved in 'actions/StartServer.js' so that it
 * defaults to what the currently running appium server is
 */
export function setLocalServerParams () {
  return async (dispatch, getState) => {
    if (!await setLocalServerParamsOnly(dispatch) &&
        getState().session.serverType === 'local') {
      changeServerType('remote')(dispatch);
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
    const server = state.server;
    const serverType = state.serverType;
    const serverInfo = server[serverType];

    dispatch({type: GET_SESSIONS_REQUESTED});
    if (serverType !== 'sauce' && serverType !== 'testobject') {
      ipcRenderer.send('appium-client-get-sessions', {host: serverInfo.hostname, port: serverInfo.port});
      ipcRenderer.once('appium-client-get-sessions-response', (evt, e) => {
        const res = JSON.parse(e.res);
        dispatch({type: GET_SESSIONS_DONE, sessions: res.value});
      });
      ipcRenderer.once('appium-client-get-sessions-fail', () => {
        dispatch({type: GET_SESSIONS_DONE});
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

function getCapsArrayFromRaw (rawDesiredCaps, capsArray) {
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

  return newCapsArray;
}

export function saveRawDesiredCaps () {
  return (dispatch, getState) => {
    const state = getState().session;
    const {rawDesiredCaps, caps: capsArray} = state;
    try {
      const newCapsArray = getCapsArrayFromRaw(rawDesiredCaps, capsArray);
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

export function changeSessionMode (mode) {
  return (dispatch) => {
    dispatch({type: CHANGE_SESSION_MODE, mode});
  };
}

export function deleteSavedTest (id) {
  return async (dispatch) => {
    dispatch({type: DELETE_SAVED_TEST_REQUESTED, id});
    const tests = await settings.get(SAVED_TESTS);
    const newTests = tests.filter((t) => t.testId !== id);
    await settings.set(SAVED_TESTS, newTests);
    dispatch({type: SET_SAVED_TESTS, tests: newTests});
    dispatch({type: DELETE_SAVED_TEST_DONE});
  };
}

export function showCapsModal (id) {
  return (dispatch) => {
    dispatch({type: SHOW_CAPS_MODAL, id});
  };
}

export function hideCapsModal () {
  return (dispatch) => {
    dispatch({type: HIDE_CAPS_MODAL});
  };
}

export function hideTestRunModal () {
  return (dispatch) => {
    dispatch({type: HIDE_TESTRUN_MODAL});
  };
}

export function selectTestToRun (id) {
  return (dispatch) => {
    dispatch({type: TEST_SELECTED, id});
  };
}

export function requestTestRun () {
  return (dispatch, getState) => {
    const {testToRun, savedTests, serverType, caps} = getState().session;
    dispatch({type: TEST_RUN_REQUESTED});
    const test = getTest(testToRun, savedTests);
    runTest(serverType, getCapsObject(caps), test.actions)(dispatch, getState);
  };
}

function initActionsStatus (dispatch, testActions) {
  const newSessionAction = {action: "startSession", params: []};
  const quitSessionAction = {action: "quit", params: []};
  const clonedActions = testActions.map(cloneDeep);
  let actions = [newSessionAction, ...clonedActions, quitSessionAction];

  // every action starts out pending
  for (let a of actions) {
    a.state = ACTION_STATE_PENDING;
    a.err = null;
    a.isElCmd = false;
    a.elListIndex = null;

    // if we have a findAndAssign, rewrite to something we understand
    if (a.action === "findAndAssign") {
      if (a.params[3]) {
        // if the 4th index contains a truthy value, that means we are
        // finding multiple elements
        a.action = "findElements";
      } else {
        a.action = "findElement";
      }
    } else if (a.action !== "startSession" && a.action !== "quit") {
      // when other commands come in via actions, they have two params at the
      // front. the first is the name of the variable they will be acting on,
      // which we don't care about. the second is either null, or an integer
      // denoting the index of the element from the last multiple-element
      // find. this is relevant information, but we don't want it on the
      // params list because it won't be included in the actual arguments
      // sent to the wd command. so strip it out after saving the relevant
      // info as separate action fields outside the params.
      if (!isNil(a.params[0])) {
        a.isElCmd = true;
      }
      if (!isNil(a.params[1])) {
        a.elListIndex = a.params[1];
      }
      a.params = a.params.slice(2);
    }
  }
  dispatch({type: TEST_ACTION_UPDATED, actions});
  return actions;
}

function updateActionStatus (dispatch, getState, actionIndex, state,
    {err = null, elapsedMs = null, sessionId = null}) {
  let actions = cloneDeep(getState().session.actionsStatus);
  const action = actions[actionIndex];
  let newAction = {...action, state, err, elapsedMs};
  if (sessionId) {
    newAction.sessionId = sessionId;
  }
  actions.splice(actionIndex, 1, newAction);
  dispatch({type: TEST_ACTION_UPDATED, actions});
}

// convert an error encountered during test playback into a known quantity
function convertError (err) {
  let message = null;
  if (err.code) {
    message = err.code;
    if (err.code === "ECONNREFUSED") {
      message = "Could not connect to the server; are you sure it's running?";
    }
  } else if (err.data) {
    message = err.data;
    try {
      message = JSON.parse(err.data).value.message;
    } catch (ign) {}
  } else if (err.message) {
    message = err.message;
  } else if (typeof err === "string") {
    message = err;
  }

  if (!message) {
    message = "An unknown error occurred";
  }

  return new Error(message);
}

export function runTest (serverType, caps, actions) {
  return (dispatch, getState) => {

    // create a little convenience method for updating the action status
    const updateState = (index, state, err = null, startTime = null, sessionId = null) => {
      if (err) {
        err = convertError(err);
      }

      let elapsedMs = null;
      if (startTime) {
        elapsedMs = Date.now() - startTime;
      }
      updateActionStatus(dispatch, getState, index, state, {err, elapsedMs, sessionId});
      return Date.now();
    };

    // right at the outset, say that we're running a test
    dispatch({type: TEST_RUNNING});

    // set up initial action states
    actions = initActionsStatus(dispatch, actions);

    // new session requested, update the first action in the list (0-index)
    let startTime = updateState(0, ACTION_STATE_IN_PROGRESS);
    startSession(caps, serverType, getState().session.server);

    // If it failed, show an alert saying it failed, and update state
    ipcRenderer.once('appium-new-session-failed', async (evt, e) => {
      updateState(0, ACTION_STATE_ERRORED, e, startTime);
      await completeTest(caps, dispatch, getState);
    });

    // otherwise, if it's ready, update the new session action state and go on
    ipcRenderer.once('appium-new-session-ready', async (evt, sessionId) => {
      updateState(0, ACTION_STATE_COMPLETE, null, startTime, sessionId);

      // first, bind the renderer to the client so we can receive commands
      bindClient();

      // now loop through all the actual test actions
      let actionIndex; // we will start at 1 since the first action was new session
      let lastFoundElId = null;
      let lastFoundElIds = [];
      const lastActionIndex = actions.length - 1;
      for (actionIndex = 1; actionIndex < lastActionIndex; actionIndex++) {
        const action = actions[actionIndex];
        try {
          startTime = updateState(actionIndex, ACTION_STATE_IN_PROGRESS);

          if (action.action.indexOf("findElement") === 0) {
            // if we're finding an element or elements, unwrap the 'action'
            // format into what callClientMethod expects
            const [strategy, selector] = action.params;
            const fetchArray = action.action === "findElements";
            const res = await callClientMethod({
              strategy,
              selector,
              fetchArray,
              skipScreenshotAndSource: true // during playback we don't waste time with these
            });
            if (fetchArray) {
              lastFoundElIds = res.elements.map((el) => el.id);
            } else {
              // here we were looking for a single element. it could be we
              // didn't find any. if we didn't, that's an error!
              if (!res.id) {
                throw new Error("Could not find requested element");
              }
              lastFoundElId = res.id;
            }
          } else {
            // otherwise, we're performing an action, so perform the action
            // either on the last found element or the index of the list of
            // last found elements (depending on whether the last find was
            // a single or multiple find)
            let elementId = null;
            if (action.isElCmd) {
              if (action.elListIndex !== null) {
                elementId = lastFoundElIds[action.elListIndex];
              } else {
                elementId = lastFoundElId;
              }
            }
            await callClientMethod({
              methodName: action.action,
              args: action.params,
              skipScreenshotAndSource: true,
              elementId,
            });
          }
          updateState(actionIndex, ACTION_STATE_COMPLETE, null, startTime);
        } catch (e) {
          updateState(actionIndex, ACTION_STATE_ERRORED, e, startTime);
          break;
        }
      }

      // now that we're done with all the actual recorded commands, we have one
      // more command to run, namely the quit session. so handle that along
      // with updating its state along the way
      startTime = updateState(lastActionIndex, ACTION_STATE_IN_PROGRESS);
      try {
        await callClientMethod({
          methodName: 'quit'
        });
        updateState(lastActionIndex, ACTION_STATE_COMPLETE, null, startTime);
      } catch (e) {
        updateState(lastActionIndex, ACTION_STATE_ERRORED, e, startTime);
      }

      // unbind our client so we no longer listen for commands
      unbindClient();

      // finally, gather the result to save and dispatch the completed actions
      await completeTest(caps, dispatch, getState);
    });
  };
}

async function completeTest (caps, dispatch, getState) {
  const state = getState().session;
  const serverType = state.serverType;
  const actions = state.actionsStatus;
  const date = Date.now();
  const testId = state.testToRun;
  const test = getTest(testId, state.savedTests);
  const {name} = test;
  const resultId = UUID();
  const result = {name, testId, date, actions, serverType, caps, resultId};

  const results = await settings.get(TEST_RESULTS);
  const newResults = [result, ...results];
  await settings.set(TEST_RESULTS, newResults);
  dispatch({type: TEST_COMPLETE});
  dispatch({type: SET_TEST_RESULTS, results: newResults});
}

export function getTestResults () {
  return async (dispatch) => {
    const results = await settings.get(TEST_RESULTS);
    dispatch({type: SET_TEST_RESULTS, results});
  };
}

export function deleteTestResult (id) {
  return async (dispatch) => {
    const results = await settings.get(TEST_RESULTS);
    const newResults = results.filter((r) => r.resultId !== id);
    await settings.set(TEST_RESULTS, newResults);
    dispatch({type: SET_TEST_RESULTS, results: newResults});
  };
}

export function showTestResult (id) {
  return (dispatch) => {
    dispatch({type: SHOW_RESULT, id});
  };
}

export function getTestResult (id, testResults) {
  return testResults.filter((r) => r.resultId === id)[0];
}

export function getTest (id, savedTests) {
  return savedTests.filter((r) => r.testId === id)[0];
}

export function setCapsFromTest (id) {
  return (dispatch, getState) => {
    const savedTests = getState().session.savedTests;
    const test = getTest(id, savedTests);
    const caps = getCapsArrayFromRaw(JSON.stringify(test.caps), []);
    dispatch({
      type: SAVE_RAW_DESIRED_CAPS,
      caps
    });
  };
}
