import { ipcRenderer } from 'electron';
import settings from '../../settings';
import { callClientMethod } from './shared';
import { CHANGE_SERVER_TYPE, SET_SERVER_PARAM, setLocalServerParamsOnly,
  startSession, showError } from './Session';
import { SET_SAVED_TESTS } from './Inspector';

export const NEW_PLAYBACK_SESSION_REQUESTED = 'NEW_PLAYBACK_REQUESTED';
export const NEW_PLAYBACK_SESSION_BEGAN = 'NEW_PLAYBACK_BEGAN';
export const NEW_PLAYBACK_SESSION_DONE = 'NEW_PLAYBACK_DONE';
export const CHANGE_TEST = 'CHANGE_TEST';
export const GET_SAVED_TESTS_REQUESTED = 'GET_SAVED_TESTS_REQUESTED';
export const GET_SAVED_TESTS_DONE = 'GET_SAVED_TESTS_DONE';
export const DELETE_SAVED_TEST_REQUESTED = 'DELETE_SAVED_TEST_REQUESTED';
export const DELETE_SAVED_TEST_DONE = 'DELETE_SAVED_TEST_DONE';
export const PLAYBACK_LOADING = 'PLAYBACK_LOADING';
export const PLAYBACK_LOADING_DONE = 'PLAYBACK_LOADING_DONE';
export const SHOW_CAPS_MODAL = 'SHOW_CAPS_MODAL';
export const HIDE_CAPS_MODAL = 'HIDE_CAPS_MODAL';

export const TEST_RUN_REQUESTED = 'TEST_RUN_REQUESTED';
export const TEST_RUNNING = 'TEST_RUNNING';
export const HIDE_TESTRUN_MODAL = 'HIDE_TESTRUN_MODAL';
export const STOP_TEST = 'STOP_TEST';
export const TEST_ACTION_UPDATED = 'TEST_ACTION_UPDATED';
export const TEST_COMPLETE = 'TEST_COMPLETE';

export const ACTION_STATE_PENDING = 'pending';
export const ACTION_STATE_IN_PROGRESS = 'running';
export const ACTION_STATE_COMPLETE = 'complete';
export const ACTION_STATE_ERRORED = 'errored';
export const ACTION_STATE_CANCELED = 'canceled';

export const SAVED_TESTS = 'SAVED_TESTS';

export function changeServerType (serverType) {
  return (dispatch) => {
    dispatch({type: CHANGE_SERVER_TYPE, serverType});
  };
}

export function setLocalServerParams () {
  return async (dispatch, getState) => {
    if (!await setLocalServerParamsOnly(dispatch) &&
        getState().playbackLibrary.serverType === 'local') {
      changeServerType('remote')(dispatch);
    }
  };
}

export function setServerParam (name, value) {
  return (dispatch, getState) => {
    dispatch({type: SET_SERVER_PARAM, serverType: getState().playbackLibrary.serverType, name, value});
  };
}

export function deleteSavedTest (name) {
  return async (dispatch) => {
    dispatch({type: DELETE_SAVED_TEST_REQUESTED, name});
    const tests = await settings.get(SAVED_TESTS);
    const newTests = tests.filter((t) => t.name !== name);
    await settings.set(SAVED_TESTS, newTests);
    dispatch({type: SET_SAVED_TESTS, tests: newTests});
    dispatch({type: DELETE_SAVED_TEST_DONE});
  };
}

export function showCapsModal (name) {
  return (dispatch) => {
    dispatch({type: SHOW_CAPS_MODAL, name});
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

export function requestTestRun (name) {
  return (dispatch, getState) => {
    dispatch({type: TEST_RUN_REQUESTED, name});
    const {savedTests, serverType} = getState().playbackLibrary;
    const test = savedTests.filter((t) => t.name === name)[0];
    runTest(serverType, test.caps, test.actions)(dispatch, getState);
  };
}

function initActionsStatus (testActions) {
  return (dispatch) => {
    const newSessionAction = {action: "startSession", params: []};
    const quitSessionAction = {action: "quit", params: []};
    let actions = [newSessionAction, ...testActions, quitSessionAction];

    // every action starts out pending
    for (let a of actions) {
      a.state = ACTION_STATE_PENDING;
      a.err = null;

      // if we have a findAndAssign, rewrite to something we understand
      if (a.action === "findAndAssign") {
        if (a.params[3]) {
          a.action = "findElements";
        } else {
          a.action = "findElement";
        }
      } else if (a.action === "click" || a.action === "sendKeys") {
        // when click and sendKeys come in via actions, they have two
        // extraneous params at the front, the element id and `null`. these
        // will confuse the callClientMethod procedure, so remove them
        a.params = a.params.slice(2);
      }
    }
    dispatch({type: TEST_ACTION_UPDATED, actions});
  };
}

function updateActionStatus (actionIndex, state, {err = null, elapsedMs = null}) {
  return (dispatch, getState) => {
    let actions = getState().playbackLibrary.actionsStatus;
    const action = actions[actionIndex];
    const newAction = {...action, state, err, elapsedMs};
    actions.splice(actionIndex, 1, newAction);
    dispatch({type: TEST_ACTION_UPDATED, actions});
  };
}

export function runTest (serverType, caps, actions) {
  return (dispatch, getState) => {
    const updateState = (index, state, err = null, startTime = null) => {
      // unwrap error
      if (err) {
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

        err = new Error(message);
      }

      let elapsedMs = null;
      if (startTime) {
        elapsedMs = Date.now() - startTime;
      }
      updateActionStatus(index, state, {err, elapsedMs})(dispatch, getState);
      return Date.now();
    };

    // say that we're running a test
    dispatch({type: TEST_RUNNING});

    // set up initial action states
    initActionsStatus(actions)(dispatch);

    // new session requested
    let startTime = updateState(0, ACTION_STATE_IN_PROGRESS);
    startSession(caps, serverType, getState().session.server);

    // If it failed, show an alert saying it failed
    ipcRenderer.once('appium-new-session-failed', (evt, e) => {
      updateState(0, ACTION_STATE_ERRORED, e, startTime);
      completeTest()(dispatch, getState);
    });

    ipcRenderer.once('appium-new-session-ready', async () => {
      updateState(0, ACTION_STATE_COMPLETE, null, startTime);

      // now loop through all the actual test actions
      let actionIndex = 1; // start at 1 since the first action was new session
      let lastFoundElId = null;
      for (let action of actions) {
        try {
          startTime = updateState(actionIndex, ACTION_STATE_IN_PROGRESS);
          // unwrap the 'action' format into what callClientMethod expects
          if (action.action.indexOf("findElement") === 0) {
            const [strategy, selector] = action.params;
            const el = await callClientMethod({
              strategy,
              selector,
              skipScreenshotAndSource: true
            });
            lastFoundElId = el.id;
          } else {
            await callClientMethod({
              methodName: action.action,
              args: action.params,
              skipScreenshotAndSource: true,
              elementId: lastFoundElId,
            });
            lastFoundElId = null;
          }
          updateState(actionIndex, ACTION_STATE_COMPLETE, null, startTime);
          actionIndex++;
        } catch (e) {
          updateState(actionIndex, ACTION_STATE_ERRORED, e, startTime);
          break;
        }
      }
      const lastActionIndex = actions.length + 1;
      startTime = updateState(lastActionIndex, ACTION_STATE_IN_PROGRESS);
      try {
        await callClientMethod({
          methodName: 'quit'
        });
        updateState(lastActionIndex, ACTION_STATE_COMPLETE, null, startTime);
      } catch (e) {
        updateState(lastActionIndex, ACTION_STATE_ERRORED, e, startTime);
      }

      completeTest()(dispatch, getState);
    });
  };
}

function completeTest () {
  return (dispatch, getState) => {
    const serverType = getState().playbackLibrary.serverType;
    const actions = getState().playbackLibrary.actionsStatus;
    const date = new Date();
    const name = getState().playbackLibrary.testToRun;
    const result = {name, date, actions, serverType};
    dispatch({type: TEST_COMPLETE, result});
  };
}
