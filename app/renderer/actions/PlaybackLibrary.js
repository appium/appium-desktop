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
    }
    dispatch({type: TEST_ACTION_UPDATED, actions});
  };
}

function updateActionStatus (actionIndex, state, err = null) {
  return (dispatch, getState) => {
    let actions = getState().playbackLibrary.actionsStatus;
    const action = actions[actionIndex];
    const newAction = {...action, state, err};
    console.log(`splicing into index ${actionIndex}`);
    console.log(newAction);
    actions.splice(actionIndex, 1, newAction);
    dispatch({type: TEST_ACTION_UPDATED, actions});
  };
}

export function runTest (serverType, caps, actions) {
  return (dispatch, getState) => {
    console.log('running a test');
    console.log(serverType);
    console.log(caps);
    console.log(actions);
    const updateState = (index, state) => {
      updateActionStatus(index, state)(dispatch, getState);
    };

    // say that we're running a test
    dispatch({type: TEST_RUNNING});

    // set up initial action states
    initActionsStatus(actions)(dispatch);

    // new session requested
    updateState(0, ACTION_STATE_IN_PROGRESS);
    startSession(caps, serverType, getState().session.server);

    // If it failed, show an alert saying it failed
    ipcRenderer.once('appium-new-session-failed', (evt, e) => {
      updateState(0, ACTION_STATE_ERRORED, e);
    });

    ipcRenderer.once('appium-new-session-ready', async () => {
      updateState(0, ACTION_STATE_COMPLETE);

      // now loop through all the actual test actions
      let actionIndex = 1; // start at 1 since the first action was new session
      for (let action of actions) {
        console.log("About to execute action");
        console.log(action);
        try {
          updateState(actionIndex, ACTION_STATE_IN_PROGRESS);
          // unwrap the 'action' format into what callClientMethod expects
          await callClientMethod({
            methodName: action.action,
            args: action.params,
            skipScreenshotAndSource: true,
          });
          updateState(actionIndex, ACTION_STATE_COMPLETE);
          actionIndex++;
        } catch (e) {
          console.log(e);
          updateState(actionIndex, ACTION_STATE_ERRORED, e);
          break;
        }
      }
      dispatch({type: TEST_COMPLETE});
    });
  };
}
